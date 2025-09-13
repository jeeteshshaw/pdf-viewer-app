import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Linking, ActivityIndicator, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

const CURRENT_VERSION = DeviceInfo.getVersion() // Your app's current version
const UPDATE_INFO_URL = 'https://raw.githubusercontent.com/jeeteshshaw/audio-book-data/refs/heads/main/pdf_viewer-version.json';

export default function UpdateChecker() {
    const [updateInfo, setUpdateInfo] = useState<{ versionCode: string, mandatory: boolean, storeUrl: string } | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkUpdate() {
            try {
                const response = await fetch(UPDATE_INFO_URL);
                const data = await response.json();
                const version = Platform.select({
                    ios: { versionCode: data?.version.ios.versionCode, mandatory: data?.version.ios.mandatory, storeUrl: data?.version.ios.storeUrl },
                    android: { versionCode: data?.version.android.versionCode, mandatory: data?.version.android.mandatory, storeUrl: data?.version.android.storeUrl },
                });
                if (isVersionNewer(version?.versionCode, CURRENT_VERSION)) {
                    version && setUpdateInfo(version);
                    setModalVisible(true);
                }
            } catch (error) {
                console.warn('Update check failed:', error);
            } finally {
                setLoading(false);
            }
        }

        checkUpdate();
    }, []);

    const onUpdatePress = () => {
        console.log('Update URL:', updateInfo);
        if (updateInfo?.storeUrl) {
            Linking.openURL(updateInfo.storeUrl);
        }
        setModalVisible(false);
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <Modal transparent visible={modalVisible} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.popup}>
                    <Text style={styles.title}>Update Available</Text>
                    <Text style={styles.message}>
                        A new version ({updateInfo?.versionCode}) is available. Please update to continue using the app.
                    </Text>

                    <View style={styles.buttons}>
                        <TouchableOpacity style={styles.buttonCancel} onPress={() => setModalVisible(false)}>
                            <Text style={styles.buttonText}>Later</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonUpdate} onPress={onUpdatePress}>
                            <Text style={styles.buttonText}>Update</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

function isVersionNewer(latest, current) {
    const latestParts = latest.split('.').map(Number);
    const currentParts = current.split('.').map(Number);

    for (let i = 0; i < latestParts.length; i++) {
        if (latestParts[i] > (currentParts[i] || 0)) return true;
        if (latestParts[i] < (currentParts[i] || 0)) return false;
    }
    return false;
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    popup: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        elevation: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 15,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        marginBottom: 25,
        textAlign: 'center',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    buttonCancel: {
        backgroundColor: '#aaa',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
    },
    buttonUpdate: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
    },
});
