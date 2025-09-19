// ImagesToPdfScreen.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, FlatList, Dimensions } from "react-native";
import * as DocumentPicker from "@react-native-documents/picker";
import { PDFDocument } from "pdf-lib";
import RNFS from "react-native-fs";
import { SafeAreaView } from "react-native-safe-area-context";
import { navigationRef } from "../../../App";
import { logEvent } from "../../utils/logger";

interface ImageItem {
    uri: string;
    name: string;
    key: string;
}

// A4 dimensions in points
const A4_WIDTH = 595;
const A4_HEIGHT = 842;

// Page margin in points
export const PAGE_MARGIN = 40;

// Number of columns in grid
export const NUM_COLUMNS = 2;
export const SCREEN_WIDTH = Dimensions.get("window").width;
export const IMAGE_SIZE = (SCREEN_WIDTH - 40 - (NUM_COLUMNS - 1) * 10) / NUM_COLUMNS; // 40 = container padding, 10 = gap

export default function ImagesToPdfScreen() {
    const [images, setImages] = useState<ImageItem[]>([]);

    const pickImages = async () => {
        logEvent("home_images_to_pdf_tapped", { screen: "ImagesToPdf", action: "pick_images" });

        try {
            const results = await DocumentPicker.pick({
                allowMultiSelection: true,
                type: [DocumentPicker.types.images],
            });

            const mapped = await Promise.all(
                results.map(async (res, i) => {
                    const ext = res.name?.split(".").pop() || "jpg";
                    const filename = `${Date.now()}_${i}.${ext}`;
                    const destPath = `${RNFS.DocumentDirectoryPath}/${filename}`;
                    await RNFS.copyFile(res.uri, destPath);
                    return { uri: destPath, name: res.name || filename, key: destPath, originalUri: res.uri };
                })
            );

            setImages((prev) => [...prev, ...mapped]);
        } catch (err: any) {
            logEvent("home_images_to_pdf_tapped_error", { screen: "ImagesToPdf", action: "pick_images", error: err?.message?.toString() ?? "error" });

            Alert.alert("Error", err.message);
        }
    };

    const removeImage = (key: string) => {
        setImages((prev) => prev.filter((img) => img.key !== key));
    };

    const mergeImagesToPdf = async () => {
        if (images.length === 0) {
            logEvent("home_images_to_pdf_tapped_error", { screen: "ImagesToPdf", action: "pick_images", error: "Pick at least one image" });

            Alert.alert("Pick at least one image");

            return;
        }

        try {
            const pdfDoc = await PDFDocument.create();

            for (const item of images) {
                const imgBase64 = await RNFS.readFile(item.uri, "base64");

                let image;
                if (item.uri.toLowerCase().endsWith(".jpg") || item.uri.toLowerCase().endsWith(".jpeg")) {
                    image = await pdfDoc.embedJpg(imgBase64);
                } else if (item.uri.toLowerCase().endsWith(".png")) {
                    image = await pdfDoc.embedPng(imgBase64);
                } else continue;

                const availableWidth = A4_WIDTH - PAGE_MARGIN * 2;
                const availableHeight = A4_HEIGHT - PAGE_MARGIN * 2;

                const scale = Math.min(availableWidth / image.width, availableHeight / image.height);
                const imgWidth = image.width * scale;
                const imgHeight = image.height * scale;
                const x = PAGE_MARGIN + (availableWidth - imgWidth) / 2;
                const y = PAGE_MARGIN + (availableHeight - imgHeight) / 2;

                const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
                page.drawImage(image, { x, y, width: imgWidth, height: imgHeight });
            }

            const pdfBase64 = await pdfDoc.saveAsBase64();
            const outPath = `${RNFS.DownloadDirectoryPath}/pdf_viewer_${Date.now()}_image_merge.pdf`;
            await RNFS.writeFile(outPath, pdfBase64, "base64");

            // Alert.alert("Success", `PDF created at:\n${outPath}`);
            navigationRef.current?.navigate("SuccessScreen", { filePath: outPath });
            console.log("PDF created at:", outPath);
        } catch (e) {
            logEvent("home_images_to_pdf_tapped_error", { screen: "ImagesToPdf", action: "pick_images", error: e?.toString() ?? "error" });

            console.error("mergeImagesToPdf error:", e);
            Alert.alert("Error", "Failed to create PDF");
        }
    };

    const renderItem = ({ item }: { item: ImageItem }) => (
        <View style={styles.imageWrapper}>
            <Image source={{ uri: `file://${item.uri}` }}
                // style={{ width: 100, height: 100 }}
                style={styles.image}
            />
            <TouchableOpacity style={styles.crossBtn} onPress={() => removeImage(item.key)}>
                <Text style={{ color: "white", fontWeight: "bold" }}>×</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView edges={['bottom']} style={styles.container}>
            <TouchableOpacity style={styles.btn} onPress={pickImages}>
                <Text style={styles.btnText}>Pick Images</Text>
            </TouchableOpacity>

            <FlatList
                data={images}
                keyExtractor={(item) => item.key}
                renderItem={renderItem}
                // horizontal
                contentContainerStyle={{ paddingTop: 10 }}
                numColumns={NUM_COLUMNS}
                columnWrapperStyle={{ justifyContent: "space-around", marginBottom: 10 }}
            />

            <TouchableOpacity style={styles.mergeBtn} onPress={mergeImagesToPdf}>
                <Text style={styles.btnText}>Create PDF</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    btn: { padding: 15, backgroundColor: "#4287f5", borderRadius: 8, marginBottom: 15 },
    mergeBtn: { padding: 15, backgroundColor: "green", borderRadius: 8, marginTop: 20 },
    btnText: { color: "#fff", textAlign: "center", fontWeight: "600" },
    imageWrapper: { width: IMAGE_SIZE, height: IMAGE_SIZE, marginBottom: 10 },
    image: { width: 150, aspectRatio: 1, borderRadius: 8 },
    crossBtn: {
        position: "absolute",
        top: -5,
        right: 20,
        backgroundColor: "red",
        width: 22,
        height: 22,
        borderRadius: 11,
        alignItems: "center",
        justifyContent: "center",
    },
});
