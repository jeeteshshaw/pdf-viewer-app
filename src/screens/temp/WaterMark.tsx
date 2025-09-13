// WatermarkScreen.tsx
import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Alert,
} from "react-native";
import * as DocumentPicker from "react-native-document-picker";
import RNFS from "react-native-fs";
import { PDFDocument, rgb } from "pdf-lib";

const chips = ["CONFIDENTIAL", "DRAFT", "TOP SECRET", "PRIVATE"];

export default function WatermarkScreen() {
    const [pdfFile, setPdfFile] = useState<{ uri: string; name: string } | null>(
        null
    );
    const [watermarkText, setWatermarkText] = useState("");
    const [styleType, setStyleType] = useState<"diagonal" | "repeat" | null>(
        null
    );

    // pick PDF
    const pickFile = async () => {
        try {
            const result = await DocumentPicker.pickSingle({
                type: [DocumentPicker.types.pdf],
            });
            setPdfFile({ uri: result.uri, name: result.name || "file.pdf" });
        } catch (err: any) {
            if (!DocumentPicker.isCancel(err)) {
                Alert.alert("Error", err.message);
            }
        }
    };

    // create PDF with watermark
    const applyWatermark = async () => {
        if (!pdfFile || !watermarkText || !styleType) {
            Alert.alert("Error", "Please select file, enter text and choose style");
            return;
        }

        try {
            const existingPdfBytes = await RNFS.readFile(pdfFile.uri, "base64");
            const pdfDoc = await PDFDocument.load(
                Uint8Array.from(atob(existingPdfBytes), (c) => c.charCodeAt(0))
            );

            const pages = pdfDoc.getPages();
            for (const page of pages) {
                const { width, height } = page.getSize();

                if (styleType === "diagonal") {
                    page.drawText(watermarkText, {
                        x: width / 4,
                        y: height / 2,
                        size: 50,
                        color: rgb(0.75, 0.75, 0.75),
                        opacity: 0.3,
                        rotate: { type: "degrees", angle: 45 },
                    });
                } else if (styleType === "repeat") {
                    for (let x = 50; x < width; x += 200) {
                        for (let y = 50; y < height; y += 150) {
                            page.drawText(watermarkText, {
                                x,
                                y,
                                size: 20,
                                color: rgb(0.8, 0.8, 0.8),
                                opacity: 0.2,
                            });
                        }
                    }
                }
            }

            const pdfBytes = await pdfDoc.save();
            const outPath = `${RNFS.DownloadDirectoryPath}/watermarked.pdf`;
            await RNFS.writeFile(outPath, Buffer.from(pdfBytes).toString("base64"), "base64");

            Alert.alert("Success", `Watermarked PDF saved:\n${outPath}`);
        } catch (err) {
            console.log(err);
            Alert.alert("Error", "Failed to apply watermark");
        }
    };

    return (
        <View style={styles.container}>
            {/* Step 1 - Pick PDF */}
            <TouchableOpacity style={styles.btn} onPress={pickFile}>
                <Text style={styles.btnText}>
                    {pdfFile ? pdfFile.name : "Select PDF"}
                </Text>
            </TouchableOpacity>

            {/* Step 2 - Enter Text */}
            <TextInput
                style={styles.input}
                placeholder="Enter watermark text"
                value={watermarkText}
                onChangeText={setWatermarkText}
            />

            {/* Step 2a - Chips */}
            <View style={styles.chipRow}>
                {chips.map((chip) => (
                    <TouchableOpacity
                        key={chip}
                        style={[
                            styles.chip,
                            watermarkText === chip && styles.chipActive,
                        ]}
                        onPress={() => setWatermarkText(chip)}
                    >
                        <Text>{chip}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Step 3 - Style Options */}
            <Text style={styles.heading}>Choose Style</Text>
            <View style={styles.cardRow}>
                <TouchableOpacity
                    style={[styles.card, styleType === "diagonal" && styles.active]}
                    onPress={() => setStyleType("diagonal")}
                >
                    <Text>Diagonal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.card, styleType === "repeat" && styles.active]}
                    onPress={() => setStyleType("repeat")}
                >
                    <Text>Full Page</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.card, styles.disabled]}>
                    <Text>Custom (Soon)</Text>
                </TouchableOpacity>
            </View>

            {/* Step 4 - Confirm */}
            <TouchableOpacity style={styles.previewBtn} onPress={applyWatermark}>
                <Text style={styles.btnText}>Apply Watermark</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
    btn: {
        padding: 15,
        backgroundColor: "#4287f5",
        borderRadius: 8,
        marginBottom: 20,
    },
    btnText: { color: "#fff", textAlign: "center", fontWeight: "600" },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        backgroundColor: "#fff",
    },
    chipRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 20,
    },
    chip: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 14,
        margin: 5,
        backgroundColor: "#fff",
    },
    chipActive: { backgroundColor: "#d0e2ff", borderColor: "#4287f5" },
    heading: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
    cardRow: { flexDirection: "row", justifyContent: "space-around" },
    card: {
        padding: 15,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        backgroundColor: "#fff",
        width: "30%",
        alignItems: "center",
    },
    active: { borderColor: "#4287f5", backgroundColor: "#d0e2ff" },
    disabled: { opacity: 0.5 },
    previewBtn: {
        marginTop: 30,
        padding: 15,
        backgroundColor: "green",
        borderRadius: 8,
    },
});
