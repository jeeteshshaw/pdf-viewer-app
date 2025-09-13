import { Alert, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import NativeWebView from 'react-native-webview'
import { SafeAreaView } from 'react-native-safe-area-context'
import RNFS from 'react-native-fs'
const url = "https://jeeteshshaw.github.io/pdf-editor-web/"
// const url = "http://192.168.1.2:5501/ "

const WebView = () => {
  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>

      <NativeWebView source={{ uri: url }} useWebView2 incognito style={{ flex: 1 }} allowFileAccess
        javaScriptEnabled
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
          Alert.alert("Error", nativeEvent.description)
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView HTTP error: ', nativeEvent);
          Alert.alert("HTTP Error", `Status code: ${nativeEvent.statusCode}`)
        }}
        onMessage={(event) => {
          const base64Pdf = event.nativeEvent.data; // "data:application/pdf;base64,..."

          // Remove prefix and save with react-native-fs
          const base64Data = base64Pdf.replace(/^data:application\/pdf;base64,/, "");
          const path = `${RNFS.DownloadDirectoryPath}/${Date.now()}.pdf`;

          RNFS.writeFile(path, base64Data, "base64")
            .then(() => Alert.alert("PDF saved at", path))
            .catch(err => console.error(err));
        }} />;
    </SafeAreaView>
  )
}

export default WebView

const styles = StyleSheet.create({})