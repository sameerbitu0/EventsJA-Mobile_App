import React, {useEffect, useCallback, useState} from 'react';
import {
  SafeAreaView,
  View,
  ImageBackground,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  Dimensions,
  ScrollView,
  Modal,
  ActivityIndicator,
  Alert,
  BackHandler,
  Platform,KeyboardAvoidingView,TouchableWithoutFeedback,Keyboard
} from 'react-native';
import {TextInput} from 'react-native-paper';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import URL_CONFIG from './Components/global-config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login_Screen = () => {
  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  // Function to handle the hardware back button press for Android
  const handleAndroidBackButton = () => {
    BackHandler.exitApp(); // Exit the app when the back button is pressed
    return true; // Return true to prevent the default behavior (app exit)
  };

  // Hook for Android back button press event
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'android') {
        BackHandler.addEventListener(
          'hardwareBackPress',
          handleAndroidBackButton,
        );
      }
      return () => {
        if (Platform.OS === 'android') {
          BackHandler.removeEventListener(
            'hardwareBackPress',
            handleAndroidBackButton,
          );
        }
      };
    }, []),
  );

  const Submit = async () => {
    if (!username) {
      Alert.alert('Please Enter Valid Username.');
    } else if (!password) {
      Alert.alert('Please Enter Valid Password.');
    } else {
      setLoading(true);
      try {
        const response = await fetch(
          URL_CONFIG.Url +
            'en/api/login?username=' +
            username +
            '&password=' +
            password,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({username: username, password: password}),
          },
        );

        const data = await response.json();
        setLoading(false);
        if (data.type == 'success') {
          var userData = {
            scannerName: data.scannerName,
            username: data.username,
            organizerName: data.organizerName,
            organizerLogo: data.organizerLogo,
          };
          await AsyncStorage.setItem('apiKey', data.apiKey);
          await AsyncStorage.setItem('username', username);
          await AsyncStorage.setItem('password', password);
          await AsyncStorage.setItem('userData', JSON.stringify(userData));
          await AsyncStorage.setItem(
            'eventsData',
            JSON.stringify(data.eventDatesArray),
          );
          navigation.navigate('Root', {screen: 'Event Screen'});
        } else if (data.type == 'error') {
          Alert.alert(data.message);
        }
      } catch (error) {
        setLoading(false);
        Alert.alert(
          'Error',
          'An error occurred while processing your request.',
          [{text: 'OK', onPress: () => ''}],
        );
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1,}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.MainContainer}>
        <ImageBackground
          source={require('./assets/bg.jpg')}
          style={styles.backgroundImage}>
          <ScrollView contentContainerStyle={styles.container}>
            <Image
              source={require('./assets/logoApp.png')}
              style={styles.logoImage}
            />
            <Text style={styles.logoText}>
              Sign UP with a scanner account to {'\n'} Check attendees in
            </Text>

            <View style={styles.formContainer}>
              <TextInput
                label="Username"
                value={username}
                onChangeText={username => setUsername(username)}
                style={styles.input}
              />
              <TextInput
                label="Password"
                value={password}
                autoCapitalize='none'
                secureTextEntry={true}
                onChangeText={password => setPassword(password)}
                style={styles.input}
              />

              <TouchableOpacity style={styles.button} onPress={() => Submit()}>
                <Image
                  source={require('./assets/login_button_icon.png')}
                  style={styles.inputIconLogin}
                />
                <Text style={styles.buttonText}>SIGN IN</Text>
              </TouchableOpacity>
              {/* Language Switcher */}
              {/* <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginHorizontal: 20,
                }}
              >
                <Text style={styles.languageSwitcherText}>
                  Change Language
                </Text>
                <Text style={styles.languageSwitcherText}>English</Text>
              </View> */}
            </View>
          </ScrollView>
        </ImageBackground>
        <Modal animationType="fade" transparent={true} visible={loading}>
          <View
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                backgroundColor: '#fff',
                borderWidth: 0.5,
                borderColor: 'gray',
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                paddingHorizontal: 30,
                paddingVertical: 20,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'DMSans-Bold',
                  color: '#000000',
                  textAlign: 'center',
                  paddingHorizontal: 15,
                }}>
                Loading...
              </Text>
              <ActivityIndicator size={30} color="#5eb2d6" />
            </View>
          </View>
        </Modal>
      </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>    
  );
};

const deviceWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    height: '100%',
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoImage: {
    width: 50,
    height: 50,
  },
  logoTextContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  logoText: {
    fontFamily: 'DMSans-Medium',
    fontSize: 15,
    color: '#19aaeb',
    textAlign: 'center',
    paddingVertical: 30,
  },
  formContainer: {
    padding: 20,
    borderRadius: 10,
    width: deviceWidth * 0.9,
  },
  input: {
    backgroundColor: '#fff',
    marginVertical: 20,
    fontFamily: 'DMSans-Medium',
  },
  button: {
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#041d26',
    borderRadius: 5,
    alignItems: 'center',
    paddingVertical: 12,
  },
  buttonText: {
    fontFamily: 'DMSans-Bold',
    color: '#ffffff',
    fontSize: 15,
  },
  inputIconLogin: {
    tintColor: 'white',
    width: 18,
    height: 18,
    marginRight: 10,
  },
  languageSwitcherText: {
    color: '#041d26',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 30,
  },
});

export default Login_Screen;
