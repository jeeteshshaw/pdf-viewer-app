
import React, { useEffect } from 'react';
import { Linking, Platform, PermissionsAndroid } from 'react-native';
import { createNavigationContainerRef, NavigationContainer, StackActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SelectPdfScreen from './src/screens/temp/SelectPdfScreen';
import ViewPdfScreen from './src/screens/temp/ViewPdfScreen';
import Splash from './src/screens/temp/Splash';
import RNFS from 'react-native-fs';

const Stack = createNativeStackNavigator();
export const navigationRef = createNavigationContainerRef();

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
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        handleInitialURL();
      }}
    >
      <Stack.Navigator initialRouteName="SelectPdf">
        <Stack.Screen name="SelectPdf" component={SelectPdfScreen} options={{
          title: "Welcome to PDF Viewer",
          headerTitleAlign: 'center',
        }} />
        <Stack.Screen name="ViewPdf" component={ViewPdfScreen} options={{
          title: "View PDF",
          headerTitleAlign: 'center',
        }} />
      </Stack.Navigator>
      <Splash />
    </NavigationContainer>
  );
};

export default App;


