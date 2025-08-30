import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const paymentMethods = [
    {
        id: 'upi',
        name: 'UPI Payment',
        description: 'Google Pay, PhonePe, Paytm and more',
        icon: 'bank-transfer',
    },
    {
        id: 'card',
        name: 'Credit / Debit Card',
        description: 'Visa, Mastercard, Amex',
        icon: 'credit-card-outline',
    },
    {
        id: 'wallet',
        name: 'Digital Wallet',
        description: 'Paytm Wallet, Amazon Pay, Mobikwik',
        icon: 'wallet',
    },
    {
        id: 'netbanking',
        name: 'Net Banking',
        description: 'Bank account based payments',
        icon: 'bank-outline',
    },
    {
        id: 'cod',
        name: 'Cash on Delivery',
        description: 'Pay with cash when your service is done',
        icon: 'cash',
    },
];

const PaymentScreen = () => {
    const [selectedPayment, setSelectedPayment] = useState(null);
    const navigation = useNavigation();
    const handleSelect = (id) => {
        setSelectedPayment(id);
    };

    const handleProceed = () => {
        if (!selectedPayment) {
            alert('Please select a payment method');
            return;
        }
        navigation.navigate('PaymentStatus')
        // alert(`Proceeding with payment method: ${selectedPayment}`);
        // Integrate payment flow here
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Select Payment Method</Text>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {paymentMethods.map((method) => {
                    const isSelected = selectedPayment === method.id;
                    return (
                        <TouchableOpacity
                            key={method.id}
                            style={[styles.card, isSelected && styles.cardSelected]}
                            onPress={() => handleSelect(method.id)}
                            activeOpacity={0.8}
                        >
                            <MaterialCommunityIcons
                                name={method.icon}
                                size={36}
                                color={isSelected ? '#2979FF' : '#666'}
                                style={styles.icon}
                            />
                            <View style={styles.textContainer}>
                                <Text style={[styles.methodName, isSelected && styles.methodNameSelected]}>
                                    {method.name}
                                </Text>
                                <Text style={styles.methodDesc}>{method.description}</Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}

            </ScrollView>
            <TouchableOpacity
                style={[styles.proceedButton, !selectedPayment && styles.proceedButtonDisabled]}
                onPress={handleProceed}
                disabled={!selectedPayment}
            >
                <Text style={styles.proceedButtonText}>Proceed to Pay</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default PaymentScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFB',
    },
    header: {
        fontSize: 24,
        fontWeight: '700',
        color: '#222',
        paddingVertical: 16,
        paddingHorizontal: 20,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 14,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#DDD',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
    },
    cardSelected: {
        borderColor: '#2979FF',
        backgroundColor: '#E3F2FD',
        shadowOpacity: 0.3,
        elevation: 6,
    },
    icon: {
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    methodName: {
        fontSize: 18,
        color: '#444',
        fontWeight: '600',
    },
    methodNameSelected: {
        color: '#2979FF',
        fontWeight: '700',
    },
    methodDesc: {
        fontSize: 13,
        color: '#888',
        marginTop: 4,
    },
    proceedButton: {
        backgroundColor: '#2979FF',
        marginHorizontal: 20,
        marginBottom: 30,
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    proceedButtonDisabled: {
        backgroundColor: '#99BADD',
    },
    proceedButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
    },
});
