import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import Pdf from 'react-native-pdf';

const ViewPdfScreen = ({ route }) => {
    const { uri } = route.params;
    const [password, setPassword] = useState('');
    const [needsPassword, setNeedsPassword] = useState(false);

    const onLoadComplete = (numberOfPages, filePath) => {
        // PDF loaded successfully
    };

    const onError = (error) => {
        if (error?.message?.includes('Password')) {
            setNeedsPassword(true);
        } else {
            Alert.alert('Error loading PDF', error.message);
        }
    };

    const onPasswordSubmit = () => {
        // Just update state to re-render Pdf component with password
        setNeedsPassword(false);
    };

    return (
        <View style={{ flex: 1 }}>
            {needsPassword ? (
                <View style={{ padding: 20 }}>
                    <TextInput
                        placeholder="Enter PDF Password"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
                    />
                    <Button title="Unlock PDF" onPress={onPasswordSubmit} />
                </View>
            ) : (
                <Pdf
                    source={{ uri }}
                    password={password}
                    onLoadComplete={onLoadComplete}
                    onError={onError}
                    style={{ flex: 1 }}
                />
            )}
        </View>
    );
};

export default ViewPdfScreen;
