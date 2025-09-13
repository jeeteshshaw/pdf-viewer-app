
import React, { useEffect } from 'react';
import { Linking, Platform, PermissionsAndroid } from 'react-native';
import { createNavigationContainerRef, NavigationContainer, StackActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SelectPdfScreen from './src/screens/temp/SelectPdfScreen';
import ViewPdfScreen from './src/screens/temp/ViewPdfScreen';
import Splash from './src/screens/temp/Splash';
import RNFS from 'react-native-fs';
import WebView from './src/screens/temp/WebView';
import EditorScreen from './src/screens/temp/EditorScreen';
import MergePdfScreen from './src/screens/temp/MergePDF';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import PDFGenerator from './src/screens/temp/PDFGenerator';
import SuccessScreen from './src/screens/temp/SuccessScreen';
import MenuGridScreen from './src/screens/temp/MenuGridScreen';
import SettingsScreen from './src/screens/temp/SettingsScreen';
import UpdateChecker from './src/screens/temp/Update';

const Stack = createNativeStackNavigator();
export const navigationRef = createNavigationContainerRef();

export const ScreenList = {
  MenuGridScreen: "MenuGridScreen",
  SettingsScreen: "SettingsScreen",
  PDFMerge: "PDFMerge",
  PDFGenerator: "PDFGenerator",
  SuccessScreen: "SuccessScreen",
  SelectPdf: "SelectPdf",
  ViewPdf: "ViewPdf",
  PdfEditor: "PdfEditor",
}

const App = () => {
  const requestStoragePermission = async () => {
    if (Platform.OS === 'android' && Platform.Version < 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission Required',
          message: 'App needs access to your storage to read PDFs',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  useEffect(() => {
    requestStoragePermission();

    const subscription = Linking.addEventListener('url', (event) => {
      console.log('[Linking] Received event:', event);
      handleOpenURL(event.url);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleInitialURL = async () => {
    const url = await Linking.getInitialURL();
    if (url) {
      console.log('[Linking] Initial URL:', url);
      handleOpenURL(url);
    }
  };

  const handleOpenURL = async (uri) => {
    if (!uri) return;

    try {

      console.log('[Linking] Opening URI:', uri);

      const name = Date.now().toString() + '.pdf';
      const destPath = `${RNFS.CachesDirectoryPath}/${name}`;

      await RNFS.copyFile(uri, destPath);
      console.log('File copied to cache:', destPath);

      navigationRef.current?.dispatch(StackActions.push('ViewPdf', {
        uri: `file://${destPath}`,
        name,
        saveToRecent: false,
      }));
      // const localUri = copyResult.localUri;

      // console.log('Local URI after copy:', localUri);

      // if (!localUri) throw new Error('Failed to copy file locally');

      // const pdfItem = { uri: localUri, name };
      // console.log('Navigating to ViewPdf with:', pdfItem);

      // navigationRef.current?.dispatch(StackActions.push('ViewPdf', {
      //   uri: localUri,
      //   name,
      //   saveToRecent: false,
      // }));
    } catch (error) {
      console.error('Error handling opened URL:', error);
    }
  };

  return (
    <GestureHandlerRootView>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          handleInitialURL();
        }}
      >
        <Stack.Navigator initialRouteName="MenuGridScreen">

          <Stack.Screen name={ScreenList.MenuGridScreen} component={MenuGridScreen} options={{
            title: "Home",
            headerTitleAlign: 'center',
          }} />
          <Stack.Screen name={ScreenList.SettingsScreen} component={SettingsScreen} options={{
            title: "Settings",
            headerTitleAlign: 'center',
          }} />
          <Stack.Screen name={ScreenList.PDFMerge} component={MergePdfScreen} options={{
            title: "Merge PDF",
            headerTitleAlign: 'center',
          }} />
          <Stack.Screen name={ScreenList.PDFGenerator} component={PDFGenerator} options={{
            title: "Image to PDF Generator",
            headerTitleAlign: 'center',
          }} />
          <Stack.Screen name={ScreenList.SuccessScreen} component={SuccessScreen} options={{
            title: "Success",
            headerTitleAlign: 'center',
          }} />
          <Stack.Screen name={ScreenList.SelectPdf} component={SelectPdfScreen} options={{
            title: "Welcome to PDF Viewer",
            headerTitleAlign: 'center',
          }} />
          <Stack.Screen name={ScreenList.ViewPdf} component={ViewPdfScreen} options={{
            title: "View PDF",
            headerTitleAlign: 'center',
          }} />
          <Stack.Screen name={ScreenList.PdfEditor} component={EditorScreen} options={{
            title: "PDF Editor",
            headerTitleAlign: 'center',
          }} />
        </Stack.Navigator>
        <Splash />
        <UpdateChecker />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;


