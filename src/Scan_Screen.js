// import React, {useRef, useState, useEffect, useCallback} from 'react';
// import {
//   SafeAreaView,
//   View,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   Linking,
//   Button,
//   Alert,
// } from 'react-native';
// import QRCodeScanner from 'react-native-qrcode-scanner';
// import {RNCamera} from 'react-native-camera';
// import {
//   useFocusEffect,
//   useNavigation,
//   useRoute,
// } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// import URL_CONFIG from './Components/global-config';

// const Scan_Screen = () => {
//   const route = useRoute();
//   const {eventDateReference} = route.params ?? {};

//   const [apiKey, setApiKey] = useState();
//   const [eventDateReferenceData, setEventDateReferenceData] = useState();
//   const [qrCodeData, setQrCodeData] = useState();
//   const [torchOn, setTorchOn] = useState(false);
//   const scannerRef = useRef(null);

//   useEffect(() => {
//     getEventsData();
//     setEventDateReferenceData(eventDateReference);
//   }, []);

//   /**
//    * Triggers when screen is focused
//    */

//   useFocusEffect(
//     useCallback(() => {
//       getEventsData();
//       setEventDateReferenceData(eventDateReference);
//     }, []),
//   );

//   /**
//    * userData Get from async storage
//    */

//   const getEventsData = async () => {
//     try {
//       var apiKey = await AsyncStorage.getItem('apiKey');
//       setApiKey(apiKey);
//     } catch (error) {
//       console.warn(error);
//     }
//   };

//   async function onSuccess(e) {
//     // Linking.openURL(e.data).catch(err => console.error('An error occurred', err));
//     setQrCodeData(e.data);
//     setTimeout(() => {
//       var options = {
//         method: 'GET',
//         headers: {
//           'content-type': 'application/json',
//           accept: 'application/json',
//           'X-AUTH-TOKEN': `${apiKey}`,
//         },
//       };
//       fetch(
//         URL_CONFIG.Url +
//           `en/api/scanner/event-date/${eventDateReferenceData}/grant-access/${e.data}?username=me.scanner1&password=azer1234`,
//         options,
//       )
//         .then(response => response.json())
//         .then(responseJson => {
//           const newData = responseJson;
//           if (newData.type == 'success') {
//             console.log(newData);
//             Alert.alert('Access granted', newData.message, [
//               {text: 'Next', onPress: () => ''},
//             ]);
//           } else if (newData.type == 'error') {
//             Alert.alert('Access not granted', newData.message, [
//               {text: 'Next', onPress: () => ''},
//             ]);
//           }
//         })
//         .catch(error => {
//           console.warn(error);
//         });
//     }, 100);
//   }

//   const toggleTorch = () => {
//     setTorchOn(prevState => !prevState);
//   };

//   return (
//     <SafeAreaView style={{flex: 1}}>
//       <QRCodeScanner
//         ref={scannerRef}
//         onRead={onSuccess}
//         flashMode={
//           torchOn
//             ? RNCamera.Constants.FlashMode.torch
//             : RNCamera.Constants.FlashMode.off
//         }
//         topContent={
//           //   <Text style={styles.centerText}>
//           //     Go to{' '}
//           //     <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on your computer and scan the QR code.
//           //   </Text>
//           <></>
//         }
//         bottomContent={
//           //   <TouchableOpacity style={styles.buttonTouchable}>
//           //     <Text style={styles.buttonText}>OK. Got it!</Text>
//           //   </TouchableOpacity>
//           <></>
//         }
//       />
//       <Button
//         title={torchOn ? 'Turn Off Torch' : 'Turn On Torch'}
//         onPress={toggleTorch}
//       />
//     </SafeAreaView>
//   );
// };

// export default Scan_Screen;

// const styles = StyleSheet.create({
//   centerText: {
//     flex: 1,
//     fontSize: 18,
//     padding: 32,
//     color: '#777',
//   },
//   textBold: {
//     fontWeight: '500',
//     color: '#000',
//   },
//   buttonText: {
//     fontSize: 21,
//     color: 'rgb(0,122,255)',
//   },
//   buttonTouchable: {
//     padding: 16,
//   },
// });

import React, {useRef, useState, useEffect, useCallback} from 'react';
import {
  Vibration,
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import PropTypes from 'prop-types';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import URL_CONFIG from './Components/global-config';

const Scan_Screen = () => {
  const route = useRoute();
  const {eventDateReference} = route.params ?? {};

  const [apiKey, setApiKey] = useState();
  const [eventDateReferenceData, setEventDateReferenceData] = useState();

  const [isTorchOn, setIsTorchOn] = useState(false);
  const [cameraType, setCameraType] = useState(RNCamera.Constants.Type.back);
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    getEventsData();
    setEventDateReferenceData(eventDateReference);
  }, []);

  /**
   * Triggers when screen is focused
   */

  useFocusEffect(
    useCallback(() => {
      getEventsData();
      setEventDateReferenceData(eventDateReference);
    }, []),
  );

  /**
   * userData Get from async storage
   */

  const getEventsData = async () => {
    try {
      var apiKey = await AsyncStorage.getItem('apiKey');
      setApiKey(apiKey);
    } catch (error) {
      console.warn(error);
    }
  };

  const cameraRef = useRef(null);

  const toggleTorch = () => {
    setIsTorchOn(prev => !prev);
  };

  const toggleCameraType = () => {
    setCameraType(prev =>
      prev === RNCamera.Constants.Type.back
        ? RNCamera.Constants.Type.front
        : RNCamera.Constants.Type.back,
    );
  };

  async function handleBarcodeScanned(event) {
    const apiKey = await AsyncStorage.getItem('apiKey');
    const password = await AsyncStorage.getItem('password');
    const username = await AsyncStorage.getItem('username');
    if (isScanning) {
      console.log('Scanned Data:', event.data);
      Vibration.vibrate(200); // Vibrate the device for 200ms when a QR code is scanned
      setIsScanning(false);
      setTimeout(() => setIsScanning(true), 2000);
      if (event.data) {
        var options = {
          method: 'GET',
          headers: {
            'content-type': 'application/json',
            accept: 'application/json',
            'X-AUTH-TOKEN': `${apiKey}`,
          },
        };
        fetch(
          URL_CONFIG.Url +
            `en/api/scanner/event-date/${eventDateReferenceData}/grant-access/${event.data}?username=${username}&password=${password}`,
          options,
        )
          .then(response => response.json())
          .then(responseJson => {
            const newData = responseJson;
            if (newData.type == 'success') {
              console.log(newData);
              Alert.alert('Access granted', newData.message, [
                {text: 'Next', onPress: () => ''},
              ]);
            } else if (newData.type == 'error') {
              Alert.alert('Access not granted', newData.message, [
                {text: 'Next', onPress: () => ''},
              ]);
            }
          })
          .catch(error => {
            console.warn(error);
          });
      }
    }
  }

  useEffect(() => {
    setIsScanning(true);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={styles.camera}
        type={cameraType}
        flashMode={
          isTorchOn
            ? RNCamera.Constants.FlashMode.torch
            : RNCamera.Constants.FlashMode.off
        }
        captureAudio={false}
        onBarCodeRead={handleBarcodeScanned}>
        <View style={styles.overlay}>
          {isScanning && <View style={styles.scanLine} />}
        </View>

        <View style={styles.bottomContainer}>
          <TouchableOpacity onPress={toggleTorch} style={styles.button}>
            {isTorchOn ? (
              <Image
                source={require('./assets/torch.png')}
                style={{width: 30, height: 30, tintColor: '#fff'}}
              />
            ) : (
              <Image
                source={require('./assets/torch.png')}
                style={{width: 30, height: 30, tintColor: '#fff'}}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleCameraType} style={styles.button}>
            {cameraType === RNCamera.Constants.Type.back ? (
              <Image
                source={require('./assets/camera.png')}
                style={{width: 30, height: 30, tintColor: '#fff'}}
              />
            ) : (
              <Image
                source={require('./assets/camera.png')}
                style={{width: 30, height: 30, tintColor: '#fff'}}
              />
            )}
          </TouchableOpacity>
        </View>
      </RNCamera>
    </SafeAreaView>
  );
};

Scan_Screen.propTypes = {
  // Define your propTypes here (if you have any)
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  scanLine: {
    width: '80%',
    height: 2,
    backgroundColor: 'red',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  button: {
    padding: 16,
    backgroundColor: '#5eb2d6',
    borderRadius: 50,
  },
  buttonText: {
    color: 'white',
  },
});

export default Scan_Screen;
