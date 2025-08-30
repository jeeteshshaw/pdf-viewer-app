import { StackActions, useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const PaymentStatus = ({ route }) => {
    const navigation = useNavigation();
    // Optional props from route params
    const { amount = '₹2,599', method = 'UPI Payment' } = route?.params || {};

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <MaterialIcons name="check-circle" size={120} color="#4CAF50" />
                <Text style={styles.title}>Payment Successful!</Text>
                <Text style={styles.message}>Thank you for your payment.</Text>

                <View style={styles.detailsCard}>
                    <Text style={styles.detailLabel}>Amount Paid:</Text>
                    <Text style={styles.detailValue}>{amount}</Text>

                    <Text style={styles.detailLabel}>Payment Method:</Text>
                    <Text style={styles.detailValue}>{method}</Text>
                </View>

                <TouchableOpacity
                    style={styles.homeButton}
                    activeOpacity={0.8}
                    onPress={() => navigation.dispatch(StackActions.popToTop())} // change as needed
                >
                    <Text style={styles.homeButtonText}>Back to Home</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default PaymentStatus;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E8F5E9',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    content: {
        alignItems: 'center',
        width: '100%',
        maxWidth: 360,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 30,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 20,
        elevation: 6,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginTop: 20,
        color: '#388E3C',
    },
    message: {
        fontSize: 16,
        color: '#4CAF50',
        marginVertical: 10,
    },
    detailsCard: {
        marginTop: 30,
        width: '100%',
        backgroundColor: '#F1F8E9',
        padding: 20,
        borderRadius: 12,
    },
    detailLabel: {
        fontSize: 14,
        color: '#558B2F',
        fontWeight: '600',
    },
    detailValue: {
        fontSize: 18,
        color: '#33691E',
        marginBottom: 15,
        fontWeight: '700',
    },
    homeButton: {
        marginTop: 40,
        backgroundColor: '#4CAF50',
        paddingVertical: 16,
        width: '100%',
        borderRadius: 12,
    },
    homeButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
    },
});
