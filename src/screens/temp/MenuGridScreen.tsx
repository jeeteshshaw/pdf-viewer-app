// MenuGridScreen.tsx
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { ScreenList } from "../../../App";
import { SafeAreaView } from "react-native-safe-area-context";
import { logEvent } from "../../utils/logger";

interface MenuItem {
    key: string;
    title: string;
    iconName: string;
    onPress: () => void;
}

const SCREEN_WIDTH = Dimensions.get("window").width;
const NUM_COLUMNS = 2;
const ITEM_SIZE = (SCREEN_WIDTH - 60) / NUM_COLUMNS; // 20 padding + 20 gap between

export default function MenuGridScreen() {
    const navigation = useNavigation();
    const menuItems: MenuItem[] = [
        { key: "1", title: "View PDF", iconName: "menu-book", onPress: () => navigation.navigate(ScreenList.SelectPdf as never) },
        { key: "2", title: "Merge PDFs", iconName: "picture-as-pdf", onPress: () => navigation.navigate(ScreenList.PDFMerge as never) },
        { key: "3", title: "Images to PDF", iconName: "image", onPress: () => navigation.navigate(ScreenList.PDFGenerator as never) },
        { key: "4", title: "PDF Editor(Beta)", iconName: "edit-document", onPress: () => navigation.navigate(ScreenList.PdfEditor as never) },
        { key: "5", title: "Watermark (Beta)", iconName: "branding-watermark", onPress: () => navigation.navigate(ScreenList.WatermarkScreen as never) },
        { key: "6", title: "Settings", iconName: "settings", onPress: () => navigation.navigate(ScreenList.SettingsScreen as never) },
    ];
    const renderItem = ({ item }: { item: MenuItem }) => (
        <TouchableOpacity style={styles.item} onPress={() => {
            logEvent("home_menu_item_tapped", { screen: "MenuGrid", itemKey: item.title });
            item.onPress()
        }} activeOpacity={0.7}>
            <MaterialIcons name={item.iconName} size={50} color="#4287f5" />
            <Text style={styles.title}>{item.title}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView edges={['bottom']} style={styles.container}>
            <FlatList
                data={menuItems}
                keyExtractor={(item) => item.key}
                renderItem={renderItem}
                numColumns={NUM_COLUMNS}
                columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 20 }}
                contentContainerStyle={{ padding: 20 }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f5f5f5" },
    item: {
        width: ITEM_SIZE,
        height: ITEM_SIZE,
        backgroundColor: "#fff",
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        padding: 10,
    },
    title: { fontSize: 16, fontWeight: "600", textAlign: "center", marginTop: 10 },
});
