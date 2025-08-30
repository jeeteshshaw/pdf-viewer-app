import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import MapView, { PROVIDER_DEFAULT } from 'react-native-maps';
const Appointment = () => {
    // Location state
    const [useCurrentLocation, setUseCurrentLocation] = useState(false);
    const [manualAddress, setManualAddress] = useState('');
    const [currentLocation, setCurrentLocation] = useState<{ latitude: number, longitude: number } | null>(null);

    // Date/slot selection state
    const dates = [
        { label: 'Today', value: '21' },
        { label: 'Tomorrow', value: '22' },
        { label: 'Wed', value: '23' },
        { label: 'Thu', value: '24' },
    ];
    const [selectedDateIndex, setSelectedDateIndex] = useState(0);

    const slots = [
        { label: '8:00 - 8:30am', enabled: true },
        { label: '8:30 - 9:00am', enabled: false },
        { label: '9:00 - 9:30am', enabled: true },
        { label: '9:30 - 10:00am', enabled: true },
        { label: '10:00 - 10:30am', enabled: false },
        { label: '10:30 - 11:00am', enabled: true },
        { label: '11:00 - 11:30am', enabled: true },
        { label: '11:30 - 12:00pm', enabled: false },
        { label: '12:00 - 12:30pm', enabled: true },
        { label: '12:30 - 1:00pm', enabled: true },
        { label: '1:00 - 1:30pm', enabled: false },
        { label: '1:30 - 2:00pm', enabled: true },
        { label: '2:00 - 2:30pm', enabled: true },
        { label: '2:30 - 3:00pm', enabled: false },
        { label: '3:00 - 3:30pm', enabled: true },
        { label: '3:30 - 4:00pm', enabled: true },
        { label: '4:00 - 4:30pm', enabled: false },
        { label: '4:30 - 5:00pm', enabled: true },
        { label: '5:00 - 5:30pm', enabled: true },
        { label: '5:30 - 6:00pm', enabled: false },
        { label: '6:00 - 6:30pm', enabled: true },
        { label: '6:30 - 7:00pm', enabled: true },
        { label: '7:00 - 7:30pm', enabled: false },
        { label: '7:30 - 8:00pm', enabled: true },
        { label: '8:00 - 8:30pm', enabled: true },
        { label: '8:30 - 9:00pm', enabled: false }
    ];
    const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);

    const vehicleTypes = [
        { id: 'bike', label: 'Bike', icon: '🏍' },
        { id: 'scooter', label: 'Scooter', icon: '🛵' },
        { id: 'auto', label: 'Auto', icon: '🛺' },
        { id: 'sedan', label: 'Sedan', icon: '🚗' },
        { id: 'suv', label: 'SUV', icon: '🚙' },
        { id: 'tractor', label: 'Tractor', icon: '🚜' },
        { id: 'truck', label: 'Truck', icon: '🚛' },
        { id: 'tempo', label: 'Tempo', icon: '🚐' },
        { id: 'other', label: 'Other', icon: '🔧' },
    ];
    const [selectedVehicleType, setSelectedVehicleType] = useState<string | null>(null);

    // Add new state for other vehicle input
    const [otherVehicleDetails, setOtherVehicleDetails] = useState('');

    const navigation = useNavigation();

    // Simulated GPS location fetch function
    const handleUseLocation = () => {
        setUseCurrentLocation(true);
        setCurrentLocation({ latitude: 18.9712, longitude: 72.8331 }); // Mumbai example
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.screen}>
                <Text style={styles.title}>Checkout</Text>

                <View style={vehicleTypeStyles.vehicleSection}>
                    <Text style={styles.sectionLabel}>Select Vehicle Type</Text>
                    <View style={vehicleTypeStyles.vehicleGrid}>
                        {vehicleTypes.map((vehicle) => (
                            <TouchableOpacity
                                key={vehicle.id}
                                style={[
                                    vehicleTypeStyles.vehicleCard,
                                    selectedVehicleType === vehicle.id && vehicleTypeStyles.vehicleCardActive,
                                ]}
                                onPress={() => setSelectedVehicleType(vehicle.id)}
                            >
                                <Text style={vehicleTypeStyles.vehicleIcon}>{vehicle.icon}</Text>
                                <Text
                                    style={[
                                        vehicleTypeStyles.vehicleLabel,
                                        selectedVehicleType === vehicle.id && vehicleTypeStyles.vehicleLabelActive,
                                    ]}
                                >
                                    {vehicle.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    {selectedVehicleType === 'other' && (
                        <TextInput
                            style={[styles.input, { marginTop: 12 }]}
                            placeholder="Please specify your vehicle type"
                            value={otherVehicleDetails}
                            onChangeText={setOtherVehicleDetails}
                        />
                    )}
                </View>

                <View style={styles.addressSection}>
                    <Text style={styles.sectionLabel}>Pick-up Address</Text>
                    <View style={styles.locationRow}>
                        <TouchableOpacity
                            style={[
                                styles.locationButton,
                                !useCurrentLocation && styles.locationButtonActive,
                            ]}
                            onPress={() => setUseCurrentLocation(false)}
                        >
                            <Text style={!useCurrentLocation ? styles.locationActiveText : styles.locationText}>
                                Enter Address Manually
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        style={styles.input}
                        placeholder="Enter your address"
                        value={manualAddress}
                        multiline
                        onChangeText={setManualAddress}
                    />
                    {/* <TouchableOpacity
                        style={[
                            styles.locationButton,
                            useCurrentLocation && styles.locationButtonActive,
                        ]}
                        onPress={handleUseLocation}
                    >
                        <Text style={useCurrentLocation ? styles.locationActiveText : styles.locationText}>
                            Use Current Location
                        </Text>
                    </TouchableOpacity>

                    
                    <View style={{ height: 180, borderRadius: 12, overflow: 'hidden', marginTop: 14, marginBottom: 8 }}>
                        <View style={{ flex: 1, backgroundColor: '#E3F2FD', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#2979FF', fontWeight: 'bold', fontSize: 16 }}>
                                {useCurrentLocation && currentLocation
                                    ? `Lat: ${currentLocation.latitude}, Long: ${currentLocation.longitude}`
                                    : 'Map Preview'}
                            </Text>
                           
                            <Text style={{ color: '#555', fontSize: 13, marginTop: 4 }}>
                                {useCurrentLocation
                                    ? 'Current location selected'
                                    : manualAddress
                                        ? `Address: ${manualAddress}`
                                        : 'No address selected'}
                            </Text>
                        </View>
                    </View> */}
                </View>

                <Text style={styles.sectionLabel}>When do you want the service?</Text>
                <View style={styles.datesRow}>
                    {dates.map((date, idx) => (
                        <TouchableOpacity
                            key={date.value}
                            style={[
                                styles.dateCard,
                                selectedDateIndex === idx && styles.dateCardActive,
                            ]}
                            onPress={() => setSelectedDateIndex(idx)}
                        >
                            <Text style={selectedDateIndex === idx ? styles.dateTextActive : styles.dateText}>
                                {date.label} {'\n'}{date.value}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.sectionLabel}>Select Pick-up Time Slot</Text>
                <View style={styles.slotsGrid}>
                    {slots.map((slot, idx) => (
                        <TouchableOpacity
                            key={slot.label}
                            style={[
                                styles.slotCard,
                                selectedSlotIndex === idx && styles.slotCardActive,
                                !slot.enabled && styles.slotCardDisabled,
                            ]}
                            onPress={() => slot.enabled && setSelectedSlotIndex(idx)}
                            disabled={!slot.enabled}
                        >
                            <Text
                                style={[
                                    styles.slotText,
                                    selectedSlotIndex === idx && styles.slotTextActive,
                                    !slot.enabled && styles.slotTextDisabled,
                                ]}
                            >
                                {slot.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
            <View style={styles.bottomBar}>
                <View style={styles.serviceSummary}>
                    {/* <Text style={styles.serviceText}>Basic Service</Text>
                    <Text style={styles.priceText}>Rs. 2,599</Text> */}
                </View>
                <TouchableOpacity style={styles.proceedButton} onPress={() => navigation.navigate("StoreSelect")}>
                    <Text style={styles.proceedButtonText}>PROCEED</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

// --- Styles ---
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9F9F9' },
    screen: { padding: 18 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#222' },
    addressSection: { marginBottom: 22 },
    sectionLabel: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#222' },
    locationRow: { flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 10 },
    locationButton: {
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#2979FF',
        paddingVertical: 8,
        paddingHorizontal: 18,
        marginRight: 12,
        alignSelf: "center",
        marginTop: 16,
        backgroundColor: '#FFF',
    },
    locationButtonActive: {
        backgroundColor: '#2979FF',
    },
    locationText: { color: '#2979FF', fontWeight: '600' },
    locationActiveText: { color: '#FFF', fontWeight: '600' },
    input: {
        backgroundColor: '#FFF',
        borderColor: '#CCC',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        fontSize: 15,
        color: '#222',
    },
    locationDetails: { color: '#555', marginTop: 7 },
    datesRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 12 },
    dateCard: {
        backgroundColor: '#FFF',
        borderColor: '#DDD',
        borderWidth: 1,
        borderRadius: 11,
        padding: 13,
        alignItems: 'center',
        minWidth: 70,
    },
    dateCardActive: {
        borderColor: '#2979FF',
        backgroundColor: '#EDF5FF',
    },
    dateText: { fontSize: 15, color: '#222', textAlign: 'center' },
    dateTextActive: { fontSize: 15, color: '#2979FF', fontWeight: 'bold', textAlign: 'center' },
    slotsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 22,
    },
    slotCard: {
        backgroundColor: '#FFF',
        borderColor: '#DDD',
        borderWidth: 1,
        borderRadius: 10,
        padding: 12,
        minWidth: '45%',
        marginBottom: 12,
        alignItems: 'center',
    },
    slotCardActive: {
        borderColor: '#2979FF',
        backgroundColor: '#EDF5FF',
    },
    slotCardDisabled: {
        borderColor: '#EEE',
        backgroundColor: '#F2F2F2',
    },
    slotText: { color: '#222', fontSize: 15 },
    slotTextActive: { color: '#2979FF', fontWeight: 'bold' },
    slotTextDisabled: { color: '#AAA' },
    bottomBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#EEE',
        padding: 14,
        justifyContent: 'space-between',
    },
    serviceSummary: { flex: 1 },
    serviceText: { fontSize: 16, color: '#222', fontWeight: '500' },
    priceText: { fontSize: 17, color: '#2979FF', fontWeight: 'bold' },
    proceedButton: {
        backgroundColor: '#888',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 23,
        marginLeft: 14,
    },
    proceedButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});

const vehicleTypeStyles = StyleSheet.create({
    vehicleSection: {
        marginBottom: 22,
    },
    vehicleGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    vehicleCard: {
        backgroundColor: '#FFF',
        borderColor: '#DDD',
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        width: '31%',  // Change to smaller width to fit more items
        marginBottom: 12,
        alignItems: 'center',
    },
    vehicleCardActive: {
        borderColor: '#2979FF',
        backgroundColor: '#EDF5FF',
    },
    vehicleIcon: {
        fontSize: 24,
        marginBottom: 4,
    },
    vehicleLabel: {
        fontSize: 14,
        color: '#222',
    },
    vehicleLabelActive: {
        color: '#2979FF',
        fontWeight: 'bold',
    },
});

export default Appointment;
