// SuccessScreen.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Linking, Platform } from "react-native";
import RNFS from "react-native-fs";
import LinearGradient from "react-native-linear-gradient";
import { navigationRef } from "../../../App";
import { StackActions } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SuccessScreenProps {
    route: {
        params: {
            filePath: string;
        };
    };
    navigation: any;
}

export default function SuccessScreen({ route, navigation }: any) {
    const { filePath = "" } = route?.params ?? {};

    const openPdf = async () => {
        try {
            if (!filePath) {
                Alert.alert("Error", "File path is missing");
                return;
            }
            const uri = Platform.OS === "android" ? `file://${filePath}` : filePath;
            const exists = await RNFS.exists(filePath);
            if (!exists) {
                Alert.alert("Error", "File does not exist");
                return;
            }
            navigationRef.dispatch(StackActions.replace("ViewPdf", { uri: uri, name: "ViewPdf" }))
            // await Linking.openURL(uri);
        } catch (e) {
            console.error(e);
            Alert.alert("Error", "Unable to open PDF");
        }
    };

    return (
        <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
            <LinearGradient colors={["#4facfe", "#00f2fe"]} style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.checkMark}>✓</Text>
                    <Text style={styles.title}>PDF Created Successfully!</Text>
                    <Text style={styles.path}>{filePath ?? ""}</Text>

                    <TouchableOpacity style={styles.btn} onPress={openPdf}>
                        <Text style={styles.btnText}>Open PDF</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.btn, { backgroundColor: "#888" }]}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.btnText}>Back</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    card: {
        width: "90%",

        padding: 30,
        borderRadius: 20,
        backgroundColor: "#fff",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    checkMark: {
        fontSize: 70,
        color: "#4caf50",
        fontWeight: "bold",
        marginBottom: 20,
    },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
    path: { fontSize: 14, color: "#555", marginBottom: 30, textAlign: "center" },
    btn: {
        padding: 15,
        backgroundColor: "#4287f5",
        borderRadius: 12,
        width: "70%",
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    btnText: { color: "#fff", textAlign: "center", fontWeight: "600" },
});
