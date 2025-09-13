// MergePdfScreen.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, FlatList } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as DocumentPicker from "@react-native-documents/picker";
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";
import { PDFDocument } from "pdf-lib";
import RNFS from "react-native-fs";
import { Buffer } from "buffer";
import { navigationRef } from "../../../App";
import { IMAGE_SIZE, NUM_COLUMNS } from "./PDFGenerator";
import { SafeAreaView } from "react-native-safe-area-context";

interface PdfItem {
    uri: string;
    name: string;
    key: string;
}

export default function MergePdfScreen() {
    const [pdfs, setPdfs] = useState<PdfItem[]>([]);

    // Pick PDFs using @react-native-documents/picker
    const pickPdfs = async () => {
        try {
            const results = await DocumentPicker.pick({
                allowMultiSelection: true,
                type: [DocumentPicker.types.pdf],
            });

            const mapped = await Promise.all(
                results.map(async (res, i) => {
                    // Copy file to app document directory
                    const filename = `${Date.now()}_${i}.pdf`;
                    const destPath = `${RNFS.DocumentDirectoryPath}/${filename}`;
                    await RNFS.copyFile(res.uri, destPath);

                    return {
                        uri: destPath,
                        name: res.name || filename,
                        key: destPath,
                    };
                })
            );

            setPdfs((prev) => [...prev, ...mapped]);
        } catch (err: any) {
            Alert.alert("Error", err.message);
        }
    };

    // Merge PDFs using pdf-lib
    const mergePdfsData = async () => {
        if (pdfs.length < 2) {
            Alert.alert("Select at least 2 PDFs to merge");
            return;
        }

        try {
            const mergedPdf = await PDFDocument.create();

            for (const pdf of pdfs) {
                const fileBase64 = await RNFS.readFile(pdf.uri, "base64");
                const pdfBytes = Uint8Array.from(
                    Buffer.from(fileBase64, "base64").toString("binary"),
                    (c) => c.charCodeAt(0)
                );

                const loadedPdf = await PDFDocument.load(pdfBytes);
                const copiedPages = await mergedPdf.copyPages(
                    loadedPdf,
                    loadedPdf.getPageIndices()
                );
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }

            const mergedBytes = await mergedPdf.save();
            const outPath = `${RNFS.DownloadDirectoryPath}/pdf_viewer_${Date.now()}_image_merge.pdf`;

            await RNFS.writeFile(
                outPath,
                Buffer.from(mergedBytes).toString("base64"),
                "base64"
            );

            // Alert.alert("Success", `Merged PDF saved at:\n${outPath}`);
            navigationRef.current?.navigate("SuccessScreen", { filePath: outPath });
        } catch (e: any) {
            console.error(e);
            Alert.alert("Merge failed", String(e));
        }
    };

    const removePdf = (key: string) => {
        setPdfs((prev) => prev.filter((pdf) => pdf.key !== key));
    };

    const renderItem = ({ item }: { item: PdfItem }) => (
        <View style={styles.pdfWrapper}>
            <MaterialIcons name="picture-as-pdf" size={60} color="#d32f2f" />
            <Text style={styles.pdfName} numberOfLines={2}>{item.name}</Text>
            <TouchableOpacity style={styles.crossBtn} onPress={() => removePdf(item.key)}>
                <Text style={{ color: "white", fontWeight: "bold" }}>×</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView edges={['bottom']} style={styles.container}>
            <TouchableOpacity style={styles.btn} onPress={pickPdfs}>
                <Text style={styles.btnText}>Pick PDFs</Text>
            </TouchableOpacity>

            <FlatList
                data={pdfs}
                keyExtractor={(item, index) => `${index}-${item.uri}`}
                renderItem={renderItem}
                // horizontal
                contentContainerStyle={{ paddingTop: 10 }}
                numColumns={NUM_COLUMNS}
                columnWrapperStyle={{ justifyContent: "space-around", marginBottom: 10 }}
            />

            <TouchableOpacity style={styles.mergeBtn} onPress={mergePdfsData}>
                <Text style={styles.btnText}>Merge PDFs</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    btn: { padding: 15, backgroundColor: "#4287f5", borderRadius: 8, marginBottom: 15 },
    mergeBtn: { padding: 15, backgroundColor: "green", borderRadius: 8, marginTop: 20 },
    btnText: { color: "#fff", textAlign: "center", fontWeight: "600" },
    pdfWrapper: {
        width: IMAGE_SIZE * 0.9,
        height: IMAGE_SIZE * 0.9,
        marginBottom: 10,
        backgroundColor: "#fff",
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    pdfName: {
        fontSize: 12,
        fontWeight: "500",
        textAlign: "center",
        marginTop: 8,
        color: "#333"
    },
    crossBtn: {
        position: "absolute",
        top: -5,
        right: -5,
        zIndex: 100,
        backgroundColor: "red",
        width: 22,
        height: 22,
        borderRadius: 11,
        alignItems: "center",
        justifyContent: "center",
    },
});
