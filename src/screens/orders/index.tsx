import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Sample order data with store images
const orders = [
    {
        id: 'ORD12345',
        storeName: 'Speedy Auto Care',
        date: 'Aug 12, 2025, 10:30 AM',
        status: 'Pending',
        details: 'Basic Service Package',
        image:
            'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 'ORD12346',
        storeName: 'Reliable Garages',
        date: 'Aug 10, 2025, 2:00 PM',
        status: 'In Progress',
        details: 'Tyre Repair',
        image:
            'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 'ORD12347',
        storeName: 'Prime Auto Hub',
        date: 'Aug 9, 2025, 4:15 PM',
        status: 'Completed',
        details: 'Battery Replacement',
        image:
            'https://images.unsplash.com/photo-1519648023493-d82b5f8d7d76?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 'ORD12348',
        storeName: 'Prime Auto Hub',
        date: 'Aug 8, 2025, 9:00 AM',
        status: 'Cancelled',
        details: 'Engine Checkup',
        image:
            'https://images.unsplash.com/photo-1519648023493-d82b5f8d7d76?auto=format&fit=crop&w=800&q=80',
    },
];

// Status chip colors mapping
const statusColors = {
    Pending: '#FFA726', // orange
    'In Progress': '#29B6F6', // blue
    Completed: '#66BB6A', // green
    Cancelled: '#EF5350', // red
};

const OrderCard = ({ item }) => (
    <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.storeImage} />
        <View style={styles.detailsContainer}>
            <View style={styles.headerRow}>
                <Text style={styles.orderId}>{item.id}</Text>
                <View
                    style={[styles.statusChip, { backgroundColor: statusColors[item.status] || '#999' }]}
                >
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>
            </View>

            <Text style={styles.storeName}>{item.storeName}</Text>
            <Text style={styles.orderDate}>{item.date}</Text>
            <Text style={styles.orderDetails}>{item.details}</Text>
        </View>
    </View>
);

export default function Orders() {
    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={orders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <OrderCard item={item} />}
                contentContainerStyle={{ paddingBottom: 24 }}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const cardWidth = width - 40;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 16,
        marginBottom: 16,
        padding: 16,
        width: cardWidth,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    storeImage: {
        width: 100,
        height: 100,
        borderRadius: 14,
    },
    detailsContainer: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'space-between',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderId: {
        fontSize: 16,
        fontWeight: '700',
        color: '#222',
    },
    statusChip: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 20,
    },
    statusText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 12,
    },
    storeName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#222',
        marginTop: 6,
    },
    orderDate: {
        fontSize: 14,
        color: '#888',
        marginTop: 4,
    },
    orderDetails: {
        fontSize: 15,
        color: '#2979FF',
        fontWeight: '600',
        marginTop: 8,
    },
});
