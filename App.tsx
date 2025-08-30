// // /**
// //  * Sample React Native App
// //  * https://github.com/facebook/react-native
// //  *
// //  * @format
// //  */

// // import React from 'react';
// // import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
// // import { NavigationContainer } from '@react-navigation/native';
// // import { createNativeStackNavigator } from '@react-navigation/native-stack';
// // import { SafeAreaProvider } from 'react-native-safe-area-context';
// // import Home from './src/screens/home';
// // import Appointment from './src/screens/appointment';
// // import IssueSelection from './src/screens/issueSelection';
// // import StoreSelect from './src/screens/storeSelect';
// // import Search from './src/screens/search';
// // import OffersList from './src/screens/offerList';
// // import PaymentScreen from './src/screens/paymentScreen';
// // import PaymentStatus from './src/screens/paymentStatus';
// // import Orders from './src/screens/orders';

// // const Stack = createNativeStackNavigator();

// // // Temporary placeholder screens
// // // const HomeScreen = () => null;
// // const ProfileScreen = () => null;

// // function App() {
// //   const isDarkMode = useColorScheme() === 'dark';

// //   return (
// //     <SafeAreaProvider>
// //       <NavigationContainer>
// //         <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
// //         <Stack.Navigator screenOptions={{ headerShown: false }}>
// //           <Stack.Screen name="Home" component={Home} />
// //           <Stack.Screen name="Appointment" component={Appointment} />
// //           <Stack.Screen name="StoreSelect" component={StoreSelect} />
// //           <Stack.Screen name="IssueSelection" component={IssueSelection} />
// //           <Stack.Screen name="Search" component={Search} />
// //           <Stack.Screen name="OfferList" component={OffersList} />
// //           <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
// //           <Stack.Screen name="PaymentStatus" component={PaymentStatus} />
// //           <Stack.Screen name="Orders" component={Orders} />
// //         </Stack.Navigator>
// //       </NavigationContainer>
// //     </SafeAreaProvider>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //   },
// // });

// // // export default App;


// // import { StyleSheet, Text, View } from 'react-native'
// // import React from 'react'
// // import { PermissionsAndroid, Platform } from 'react-native';

// // const App = () => {

// //   const requestStoragePermission = async () => {
// //     if (Platform.OS === 'android') {
// //       const granted = await PermissionsAndroid.request(
// //         PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
// //         {
// //           title: 'Storage Permission Required',
// //           message: 'App needs access to your storage to read PDFs',
// //           buttonNeutral: 'Ask Me Later',
// //           buttonNegative: 'Cancel',
// //           buttonPositive: 'OK',
// //         },
// //       );
// //       return granted === PermissionsAndroid.RESULTS.GRANTED;
// //     }
// //     return true;
// //   };

// //   return (
// //     <View>
// //       <Text>App</Text>
// //     </View>
// //   )
// // }

// // export default App

// // const styles = StyleSheet.create({})
import React, { useEffect } from 'react';
import { Linking, Platform, PermissionsAndroid } from 'react-native';
import { createNavigationContainerRef, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SelectPdfScreen from './src/screens/temp/SelectPdfScreen';
import ViewPdfScreen from './src/screens/temp/ViewPdfScreen';
import { keepLocalCopy } from '@react-native-documents/picker';

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
      const [copyResult] = await keepLocalCopy({
        files: [{ uri: uri, fileName: name }],
        destination: 'cachesDirectory',
      });

      const localUri = copyResult.localUri;

      if (!localUri) throw new Error('Failed to copy file locally');

      const pdfItem = { uri: localUri, name };

      navigationRef.current?.navigate('ViewPdf', {
        uri: localUri,
        name,
        saveToRecent: false,
      });
    } catch (error) {

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
        <Stack.Screen name="SelectPdf" component={SelectPdfScreen} />
        <Stack.Screen name="ViewPdf" component={ViewPdfScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
