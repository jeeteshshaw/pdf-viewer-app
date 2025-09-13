
// SettingsScreen.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert, ScrollView } from "react-native";
import DeviceInfo from "react-native-device-info";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function SettingsScreen() {
    const appVersion = DeviceInfo.getVersion();
    const buildNumber = DeviceInfo.getBuildNumber();
    const privacyPolicyUrl = "https://sites.google.com/view/privacy-policy-pdf-viewer-app/home";
    // const termsUrl = "https://yourapp.com/terms";
    // const supportEmail = "mailto:support@yourapp.com";

    const openLink = async (url: string) => {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert("Error", "Cannot open link");
        }
    };

    const settingsItems = [
        { key: "1", title: "Privacy Policy", icon: "privacy-tip", onPress: () => openLink(privacyPolicyUrl) },
        // { key: "2", title: "Terms of Service", icon: "description", onPress: () => openLink(termsUrl) },
        // { key: "3", title: "Contact Support", icon: "support-agent", onPress: () => openLink(supportEmail) },
    ];

    return (
        <SafeAreaView edges={['bottom']} style={styles.container}>
            <ScrollView style={styles.container}>
                <View style={styles.headerCard}>
                    <MaterialIcons name="app-settings-alt" size={50} color="#4287f5" />
                    <Text style={styles.appName}>{DeviceInfo.getApplicationName()}</Text>
                    <Text style={styles.versionText}>Version {appVersion}.{buildNumber}</Text>
                </View>

                <View style={styles.cardContainer}>
                    {settingsItems.map((item) => (
                        <TouchableOpacity key={item.key} style={styles.itemCard} onPress={item.onPress} activeOpacity={0.7}>
                            <MaterialIcons name={item.icon} size={30} color="#4287f5" style={{ marginRight: 15 }} />
                            <Text style={styles.itemText}>{item.title}</Text>
                            <MaterialIcons name="chevron-right" size={25} color="#888" style={{ marginLeft: "auto" }} />
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f5f5f5" },
    headerCard: {
        backgroundColor: "#fff",
        margin: 20,
        borderRadius: 15,
        padding: 30,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    appName: { fontSize: 24, fontWeight: "700", marginTop: 10 },
    versionText: { fontSize: 16, color: "#555", marginTop: 5 },

    cardContainer: { marginHorizontal: 20 },
    itemCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 15,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    itemText: { fontSize: 18, fontWeight: "500" },
});
