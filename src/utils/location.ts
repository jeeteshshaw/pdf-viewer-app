import Geolocation from '@react-native-community/geolocation';

interface LocationData {
    city: string;
    principalSubdivision: string;
    countryName: string;
    latitude: number;
    longitude: number;
}

export const getCurrentLocation = (): Promise<LocationData> => {
    return new Promise((resolve, reject) => {
        Geolocation.requestAuthorization();

        Geolocation.getCurrentPosition(
            async position => {
                try {
                    const { latitude, longitude } = position.coords;
                    const response = await fetch(
                        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
                    );
                    const data = await response.json();
                    console.log('Location data:', data);
                    resolve({
                        city: data.city,
                        principalSubdivision: data.principalSubdivision,
                        countryName: data.countryName,
                        latitude,
                        longitude
                    });
                } catch (error) {
                    reject(error);
                }
            },
            error => reject(error),
            { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
        );
    });
};