import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    FlatList,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
    horizontalScale,
    verticalScale,
    moderateScale,
    fontScale,
    spacing,
    borderRadius
} from '../../utils/metrics';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

// Sample data
const offers = [
    {
        id: '1',
        storeName: 'Speedy Auto Care',
        location: 'Andheri West, Mumbai',
        distance: '2.3 km',
        rating: 4.5,
        price: '₹2,499',
        image:
            'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80',
        offerTitle: '20% off on brake service',
    },
    {
        id: '2',
        storeName: 'Reliable Garages',
        location: 'Bandra East, Mumbai',
        distance: '4.1 km',
        rating: 4.0,
        price: '₹1,999',
        image:
            'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=800&q=80',
        offerTitle: 'Free tyre rotation with oil change',
    },
    {
        id: '3',
        storeName: 'Prime Auto Hub',
        location: 'Kurla, Mumbai',
        distance: '3.7 km',
        rating: 4.8,
        price: '₹3,499',
        image:
            'https://images.unsplash.com/photo-1519648023493-d82b5f8d7d76?auto=format&fit=crop&w=800&q=80',
        offerTitle: '10% off on battery replacement',
    },
];

// Helper component to show rating stars
const Stars = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
        <View style={{ flexDirection: 'row' }}>
            {[...Array(fullStars)].map((_, i) => (
                <MaterialIcons key={`full-${i}`} name="star" size={16} color="#FFD700" />
            ))}
            {halfStar && (
                <MaterialIcons name="star-half" size={16} color="#FFD700" />
            )}
            {[...Array(emptyStars)].map((_, i) => (
                <MaterialIcons key={`empty-${i}`} name="star-outline" size={16} color="#FFD700" />
            ))}
        </View>
    );
};

const CountdownTimer = () => {
    const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes in seconds

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 0) {
                    clearInterval(timer);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <View style={styles.timerContainer}>
            <MaterialIcons name="timer" size={24} color="#2979FF" />
            <Text style={styles.timerText}>
                {`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}
            </Text>
        </View>
    );
};

const OfferCard = ({ item }) => {
    const navigation = useNavigation();
    const handlePress = () => {
        // Handle card press, e.g., navigate to offer details
        // alert(`Selected offer: ${item.offerTitle}`);
        navigation.navigate('PaymentScreen', { offer: item });
    };
    return (
        <TouchableOpacity onPress={handlePress} style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.storeImage} />

            <View style={styles.detailsContainer}>
                <Text style={styles.storeName}>{item.storeName}</Text>
                <Text style={styles.location}>{item.location}</Text>

                <View style={styles.bottomRow}>
                    <Text style={styles.distance}>{item.distance}</Text>
                    <Stars rating={item.rating} />
                </View>

                <View style={styles.priceRow}>
                    <Text style={styles.price}>{item.price}</Text>
                </View>
                <View style={styles.priceRow}>
                    <Text style={styles.offerTitle}>{item.offerTitle}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default function OffersList() {
    return (
        <SafeAreaView style={styles.container}>
            <CountdownTimer />
            <FlatList
                data={offers}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <OfferCard item={item} />}
                contentContainerStyle={{ paddingBottom: 24 }}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const cardWidth = width - horizontalScale(40);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        paddingHorizontal: spacing.m,
        paddingTop: spacing.m,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: borderRadius.l,
        marginBottom: spacing.m,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: verticalScale(3) },
        shadowOpacity: 0.1,
        shadowRadius: horizontalScale(6),
        elevation: 5,
        width: cardWidth,
        overflow: 'hidden',
    },
    storeImage: {
        width: horizontalScale(120),
        height: verticalScale(120),
    },
    detailsContainer: {
        flex: 1,
        padding: spacing.s,
        justifyContent: 'space-between',
    },
    storeName: {
        fontSize: fontScale(18),
        fontWeight: '700',
        color: '#222',
        marginBottom: spacing.xs,
    },
    location: {
        fontSize: fontScale(14),
        color: '#888',
        marginBottom: spacing.xs,
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.xs,
        alignItems: 'center',
    },
    distance: {
        fontSize: fontScale(13),
        color: '#444',
        fontWeight: '600',
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: fontScale(16),
        fontWeight: '700',
        color: '#2E7D32',
    },
    offerTitle: {
        fontSize: fontScale(14),
        color: '#2979FF',
        fontWeight: '600',
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E3F2FD',
        padding: spacing.s,
        borderRadius: borderRadius.m,
        marginBottom: spacing.m,
    },
    timerText: {
        fontSize: fontScale(16),
        fontWeight: '600',
        color: '#2979FF',
        marginLeft: spacing.xs,
    },
});
