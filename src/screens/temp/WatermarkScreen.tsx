// WatermarkScreen.tsx
import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Switch,
    Image,
    Alert,
    Platform,
} from "react-native";
import * as DocumentPicker from "@react-native-documents/picker";
import RNFS from "react-native-fs";
import { degrees, PDFDocument, popGraphicsState, pushGraphicsState, rgb, rotateDegrees, StandardFonts, translate } from "pdf-lib";
import Slider from "@react-native-community/slider";
import { Buffer } from "buffer";
import { navigationRef } from "../../../App";

type ColorKey = "red" | "blue" | "black" | "gray";

const presetTexts = ["CONFIDENTIAL", "DRAFT", "TOP SECRET"];

export default function WatermarkScreen() {
    // common
    const [pdfPath, setPdfPath] = useState<string | null>(null);

    // watermark type: Text or Image (clip-to-select)
    const [watermarkType, setWatermarkType] = useState<"text" | "image">("text");

    // text state
    const [watermarkText, setWatermarkText] = useState<string>("CONFIDENTIAL");
    const [color, setColor] = useState<ColorKey>("blue");
    const [fontSize, setFontSize] = useState<number>(50);
    const [bold, setBold] = useState<boolean>(false);

    // image state
    const [imagePath, setImagePath] = useState<string | null>(null);
    // imageScale is fraction of page width (0.1..0.9)
    const [imageScale, setImageScale] = useState<number>(0.4);
    const [imageOpacity, setImageOpacity] = useState<number>(0.35);

    // style options
    const [styleType, setStyleType] = useState<"diagonal" | "repeat">("diagonal");
    const [repeatOrientation, setRepeatOrientation] = useState<"diagonal" | "normal">("diagonal");

    // pick PDF
    const pickPdf = async () => {
        try {
            const [res] = await DocumentPicker.pick({ type: [DocumentPicker.types.pdf] });
            setPdfPath(res.uri);
        } catch (err: any) {
            // if (!DocumentPicker.isCancel(err))
            Alert.alert("Error", err.message);
        }
    };

    // pick image for watermark (copy to app dir then use)
    const pickImage = async () => {
        try {
            const [res] = await DocumentPicker.pick({ type: [DocumentPicker.types.images] });
            const ext = res.name?.split(".").pop() || "jpg";
            const dest = `${RNFS.DocumentDirectoryPath}/wm_${Date.now()}.${ext}`;
            await RNFS.copyFile(res.uri, dest);
            setImagePath(dest);
        } catch (err: any) {
            // if (!DocumentPicker.isCancel(err)) 
            Alert.alert("Error", err.message);
        }
    };

    const colorToRgb = (c: ColorKey) =>
        c === "red" ? rgb(1, 0, 0) : c === "blue" ? rgb(0, 0, 1) : c === "gray" ? rgb(0.5, 0.5, 0.5) : rgb(0, 0, 0);

    // Apply watermark (text or image)
    const applyWatermark = async () => {
        if (!pdfPath) {
            Alert.alert("Select a PDF first");
            return;
        }
        if (watermarkType === "text" && !watermarkText.trim()) {
            Alert.alert("Enter watermark text or pick a preset");
            return;
        }
        if (watermarkType === "image" && !imagePath) {
            Alert.alert("Pick an image for watermark");
            return;
        }

        try {
            const existingPdfBase64 = await RNFS.readFile(pdfPath, "base64");
            const pdfDoc = await PDFDocument.load(Buffer.from(existingPdfBase64, "base64"));

            // embed font for text watermarks
            const font = bold
                ? await pdfDoc.embedFont(StandardFonts.HelveticaBold)
                : await pdfDoc.embedFont(StandardFonts.Helvetica);

            const rgbColor = colorToRgb(color);
            const angleDeg = 45;
            const angleRad = (angleDeg * Math.PI) / 180;

            const pages = pdfDoc.getPages();

            if (watermarkType === "text") {
                for (const page of pages) {
                    const { width, height } = page.getSize();

                    if (styleType === "diagonal") {
                        const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);
                        const textHeight = font.heightAtSize(fontSize);

                        const cx = width / 2;
                        const cy = height / 2;

                        // Save state
                        page.pushOperators(pushGraphicsState());

                        // Move origin to center, rotate, then shift by half text
                        page.pushOperators(
                            translate(cx, cy),
                            rotateDegrees(angleDeg),
                            translate(-textWidth / 2, -textHeight / 2)
                        );

                        // Draw text at (0,0) relative to transformed origin
                        page.drawText(watermarkText, {
                            x: 0,
                            y: 0,
                            size: fontSize,
                            font,
                            color: rgbColor,
                            opacity: 0.28,
                        });

                        // Restore state
                        page.pushOperators(popGraphicsState());
                    }

                    else {
                        // repeat tiled text
                        const stepX = Math.max(160, Math.floor(fontSize * 3));
                        const stepY = Math.max(120, Math.floor(fontSize * 2));

                        for (let x = -stepX; x < width + stepX; x += stepX) {
                            for (let y = -stepY; y < height + stepY; y += stepY) {
                                page.drawText(watermarkText, {
                                    x,
                                    y,
                                    size: Math.max(18, Math.floor(fontSize * 0.6)),
                                    font,
                                    color: rgbColor,
                                    opacity: 0.12,
                                    rotate:
                                        repeatOrientation === "diagonal"
                                            ? degrees(angleDeg)
                                            : undefined,
                                });
                            }
                        }
                    }
                }
            } else {
                // Image watermark branch: embed image
                const imgBase64 = await RNFS.readFile(imagePath!, "base64");
                const lower = (imagePath || "").toLowerCase();
                let embeddedImage: any;
                if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
                    embeddedImage = await pdfDoc.embedJpg(imgBase64);
                } else {
                    embeddedImage = await pdfDoc.embedPng(imgBase64);
                }

                const naturalW = embeddedImage.width;
                const naturalH = embeddedImage.height;

                for (const page of pages) {
                    const { width, height } = page.getSize();

                    if (styleType === "diagonal") {
                        const fractionOfPage = imageScale; // 0.1..0.9
                        const pageMargin = Math.max(20, Math.floor(width * 0.03));
                        const maxW = width * fractionOfPage;
                        const maxH = height - pageMargin * 2;

                        const scaleFactor = Math.min(maxW / naturalW, maxH / naturalH, 1);
                        const imgW = naturalW * scaleFactor;
                        const imgH = naturalH * scaleFactor;

                        // center of page
                        const cx = width / 2;
                        const cy = height / 2;

                        // push graphics state
                        page.pushOperators(pushGraphicsState());

                        // translate to center, rotate, then back half image size
                        page.pushOperators(
                            translate(cx, cy),
                            rotateDegrees(angleDeg),
                            translate(-imgW / 2, -imgH / 2)
                        );

                        // draw image at 0,0 (since origin moved)
                        page.drawImage(embeddedImage, {
                            x: 0,
                            y: 0,
                            width: imgW,
                            height: imgH,
                            opacity: imageOpacity,
                        });

                        // restore graphics state
                        page.pushOperators(popGraphicsState());
                    } else {
                        // REPEAT tiled image watermark - contain each tile
                        const tileFraction = Math.max(0.08, imageScale * 0.35);
                        const tileMaxW = width * tileFraction;
                        const tileMaxH = height * 0.18;

                        const tileScale = Math.min(tileMaxW / naturalW, tileMaxH / naturalH, 1);
                        const tileW = naturalW * tileScale;
                        const tileH = naturalH * tileScale;

                        const stepX = Math.floor(tileW + 40);
                        const stepY = Math.floor(tileH + 40);

                        const angleForTile = repeatOrientation === "diagonal" ? angleDeg : 0;

                        for (let x = -stepX; x < width + stepX; x += stepX) {
                            for (let y = -stepY; y < height + stepY; y += stepY) {
                                page.drawImage(embeddedImage, {
                                    x,
                                    y,
                                    width: tileW,
                                    height: tileH,
                                    rotate: angleForTile ? { type: "degrees", angle: angleForTile } : undefined,
                                    opacity: imageOpacity * 0.9,
                                });
                            }
                        }
                    }
                }
            }

            // Save as base64 and write (React Native safe)
            const pdfBase64 = await pdfDoc.saveAsBase64();
            const outPath = `${RNFS.DownloadDirectoryPath}/watermarked.pdf`;
            await RNFS.writeFile(outPath, pdfBase64, "base64");

            navigationRef.current?.navigate("ViewPdf", { uri: outPath, name: "Watermarked PDF" });
            // Alert.alert("Success", `Watermarked PDF saved:\n${outPath}`);
        } catch (e: any) {
            console.error("applyWatermark error:", e);
            Alert.alert("Error", "Failed to apply watermark");
        }
    };

    // Utility to show file:// for Android if needed
    const displayLocalUri = (p: string | null) =>
        p ? (Platform.OS === "android" && !p.startsWith("file://") ? `file://${p}` : p) : null;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Add Watermark</Text>

            {/* clip to select: Text or Image */}
            <View style={styles.row}>
                <TouchableOpacity
                    style={[styles.typeBtn, watermarkType === "text" && styles.typeBtnActive]}
                    onPress={() => setWatermarkType("text")}
                >
                    <Text style={{ color: watermarkType === "text" ? "#fff" : "#000" }}>Text</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.typeBtn, watermarkType === "image" && styles.typeBtnActive]}
                    onPress={() => setWatermarkType("image")}
                >
                    <Text style={{ color: watermarkType === "image" ? "#fff" : "#000" }}>Image</Text>
                </TouchableOpacity>
            </View>

            {/* PDF picker */}
            <TouchableOpacity style={styles.button} onPress={pickPdf}>
                <Text style={styles.buttonText}>{pdfPath ? "Change PDF" : "Select PDF"}</Text>
            </TouchableOpacity>
            {pdfPath ? <Text style={styles.path}>Selected PDF: {pdfPath}</Text> : null}

            {/* TEXT options */}
            {watermarkType === "text" ? (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter watermark text"
                        value={watermarkText}
                        onChangeText={setWatermarkText}
                    />

                    <View style={styles.chipRow}>
                        {presetTexts.map((t) => (
                            <TouchableOpacity
                                key={t}
                                style={[styles.chip, watermarkText === t && styles.chipSelected]}
                                onPress={() => setWatermarkText(t)}
                            >
                                <Text style={{ color: watermarkText === t ? "#fff" : "#000" }}>{t}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.label}>Color</Text>
                    <View style={styles.colorRow}>
                        {(["red", "blue", "black", "gray"] as ColorKey[]).map((c) => (
                            <TouchableOpacity
                                key={c}
                                style={[
                                    styles.colorBox,
                                    { backgroundColor: c === "black" ? "#000" : c },
                                    color === c && styles.colorSelected,
                                ]}
                                onPress={() => setColor(c)}
                            />
                        ))}
                    </View>

                    <Text style={styles.label}>Font Size: {fontSize}</Text>
                    <Slider
                        style={{ width: "100%", height: 40 }}
                        minimumValue={20}
                        maximumValue={150}
                        step={2}
                        value={fontSize}
                        onValueChange={setFontSize}
                    />

                    <View style={styles.switchRow}>
                        <Text style={styles.label}>Bold</Text>
                        <Switch value={bold} onValueChange={setBold} />
                    </View>
                </>
            ) : (
                // IMAGE options
                <>
                    <TouchableOpacity style={styles.button} onPress={pickImage}>
                        <Text style={styles.buttonText}>{imagePath ? "Change Image" : "Pick Watermark Image"}</Text>
                    </TouchableOpacity>

                    {imagePath ? (
                        <View style={{ alignItems: "center", marginVertical: 8 }}>
                            <Image
                                source={{ uri: displayLocalUri(imagePath)! }}
                                style={{ width: 120, height: 120, resizeMode: "contain", borderRadius: 8 }}
                            />
                            <Text style={{ marginTop: 6, fontSize: 12 }}>{imagePath}</Text>
                        </View>
                    ) : null}

                    <Text style={styles.label}>Scale (% of page width): {Math.round(imageScale * 100)}%</Text>
                    <Slider
                        style={{ width: "100%", height: 40 }}
                        minimumValue={0.1}
                        maximumValue={0.9}
                        step={0.01}
                        value={imageScale}
                        onValueChange={setImageScale}
                    />

                    <Text style={styles.label}>Opacity: {Math.round(imageOpacity * 100)}%</Text>
                    <Slider
                        style={{ width: "100%", height: 40 }}
                        minimumValue={0.05}
                        maximumValue={1.0}
                        step={0.01}
                        value={imageOpacity}
                        onValueChange={setImageOpacity}
                    />
                </>
            )}

            {/* Style selection */}
            <Text style={[styles.label, { marginTop: 8 }]}>Style</Text>
            <View style={styles.chipRow}>
                {(["diagonal", "repeat"] as const).map((s) => (
                    <TouchableOpacity
                        key={s}
                        style={[styles.chip, styleType === s && styles.chipSelected]}
                        onPress={() => setStyleType(s)}
                    >
                        <Text style={{ color: styleType === s ? "#fff" : "#000" }}>{s.toUpperCase()}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Repeat orientation shown only when repeat selected */}
            {styleType === "repeat" && (
                <>
                    <Text style={[styles.label, { marginTop: 6 }]}>Repeat Orientation</Text>
                    <View style={styles.chipRow}>
                        <TouchableOpacity
                            style={[styles.chip, repeatOrientation === "diagonal" && styles.chipSelected]}
                            onPress={() => setRepeatOrientation("diagonal")}
                        >
                            <Text style={{ color: repeatOrientation === "diagonal" ? "#fff" : "#000" }}>DIAGONAL</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.chip, repeatOrientation === "normal" && styles.chipSelected]}
                            onPress={() => setRepeatOrientation("normal")}
                        >
                            <Text style={{ color: repeatOrientation === "normal" ? "#fff" : "#000" }}>NORMAL</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}

            <TouchableOpacity style={styles.applyBtn} onPress={applyWatermark}>
                <Text style={styles.applyText}>Apply Watermark</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: "#f8f8f8" },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
    row: { flexDirection: "row", marginBottom: 12 },
    typeBtn: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ccc",
        marginRight: 8,
        backgroundColor: "#fff",
    },
    typeBtnActive: { backgroundColor: "#007bff", borderColor: "#007bff" },
    button: {
        backgroundColor: "#007bff",
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        alignItems: "center",
    },
    buttonText: { color: "#fff", textAlign: "center", fontWeight: "600" },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 10,
        backgroundColor: "#fff",
        marginBottom: 10,
    },
    chipRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 10 },
    chip: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#ccc",
        margin: 4,
        backgroundColor: "#fff",
    },
    chipSelected: { backgroundColor: "#007bff", borderColor: "#007bff" },
    colorRow: { flexDirection: "row", marginBottom: 10, alignItems: "center" },
    colorBox: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 10,
    },
    colorSelected: { borderWidth: 2, borderColor: "#222" },
    switchRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    label: { fontWeight: "600", marginBottom: 6 },
    path: { fontSize: 12, marginBottom: 8, color: "#333" },
    applyBtn: {
        marginTop: 18,
        backgroundColor: "green",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    applyText: { color: "#fff", textAlign: "center", fontWeight: "600" },
});

