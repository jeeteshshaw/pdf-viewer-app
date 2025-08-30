import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {

    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const StoreSelect = ({ }) => {
    const navigation = useNavigation();
    const onSelectGarage = () => {
        navigation.navigate('Search');
        // navigate to nearby garage search screen or perform your action
        alert('Search Nearby Garage clicked');
    };

    const onSelectStore = () => {
        // navigate to nearby store selection screen or perform your action
        alert('Select Nearby Store clicked');
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Choose an Option</Text>
            <View style={styles.optionsContainer}>
                <TouchableOpacity
                    style={styles.optionCard}
                    activeOpacity={0.8}
                    onPress={onSelectGarage}
                >
                    <MaterialIcons name="garage" size={64} color="#2979FF" />
                    <Text style={styles.optionText}>Search Nearby Garage</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.optionCard}
                    activeOpacity={0.8}
                    onPress={onSelectStore}
                >
                    <MaterialIcons name="store" size={64} color="#2979FF" />
                    <Text style={styles.optionText}>Select Nearby Store</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default StoreSelect;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFB',
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 40,
        color: '#222',
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    optionCard: {
        backgroundColor: '#fff',
        width: '42%',
        borderRadius: 16,
        paddingVertical: 30,
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
    },
    optionText: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: '600',
        color: '#2979FF',
        textAlign: 'center',
    },
});
