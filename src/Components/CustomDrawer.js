import React, {useState, useEffect, useCallback} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {DrawerActions} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const CustomDrawer = () => {
  const navigation = useNavigation();

  const [scannerName, setScannerName] = useState();
  const [organizerName, setOrganizerName] = useState();
  const [organizerLogo, setOrganizerLogo] = React.useState();
  var url = organizerLogo;

  /**
   * userData Get from async storage
   */

  const getEventsData = async () => {
    try {
      var userData = await AsyncStorage.getItem('userData');
      userData = JSON.parse(userData);
      setScannerName(userData.scannerName);
      setOrganizerName(userData.organizerName);
      setOrganizerLogo(userData.organizerLogo);
    } catch (error) {
      console.warn(error);
    }
  };

  /**
   * Triggers when user navigation screen is focused
   */

  useEffect(() => {
    getEventsData();
  }, []);

  /**
   * Triggers when screen is focused
   */

  useFocusEffect(
    useCallback(() => {
      getEventsData();
    }, []),
  );

  /**
   * Logout function
   */

  const logout = async () => {
    AsyncStorage.clear();
    navigation.navigate('Login Screen');
  };
  return (
    <DrawerContentScrollView contentContainerStyle={{paddingTop: 0, margin: 0}}>
      <LinearGradient
        colors={['#193d4d', '#5eb2d6']}
        start={{x: 0, y: 0.3}}
        end={{x: 1, y: 0.3}}
        style={{paddingVertical: 20, paddingHorizontal: 10}}>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 0}}>
          {url == null ? (
            <></>
          ) : (
            <Image
              style={{
                justifyContent: 'center',
                alignSelf: 'center',
                width: 60,
                height: 60,
                resizeMode: 'contain',
              }}
              source={{
                uri: url,
              }}
              onError={() => console.log('Image load error')}
            />
          )}

          <View style={{paddingHorizontal: 20}}>
            <Text
              style={{
                fontFamily: 'DMSans-Bold',
                fontSize: 15,
                color: '#fff',
                paddingHorizontal: 15,
                paddingVertical: 5,
                width: 150,
              }}>
              {scannerName}
            </Text>
            <Text
              style={{
                fontFamily: 'DMSans-Medium',
                fontSize: 15,
                color: '#E6E3E0',
                paddingHorizontal: 15,
                paddingVertical: 5,
                width: 150,
              }}>
              {organizerName}
            </Text>
          </View>
        </View>
      </LinearGradient>
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Event Screen')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 10,
            marginHorizontal: 10,
          }}>
          <Image
            source={require('../assets/event.png')}
            style={{height: 25, width: 25, tintColor: '#5eb2d6'}}
          />
          <Text
            style={{
              fontFamily: 'DMSans-Medium',
              fontSize: 15,
              color: '#5eb2d6',
              marginHorizontal: 15,
            }}>
            Events
          </Text>
        </TouchableOpacity>
        <View style={{borderBottomWidth: 0.3, borderColor: '#cccccc'}}></View>
        <TouchableOpacity
          onPress={logout}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 10,
            marginHorizontal: 10,
          }}>
          <Image
            source={require('../assets/login_button_icon.png')}
            style={{height: 22, width: 22, tintColor: '#5eb2d6'}}
          />
          <Text
            style={{
              fontFamily: 'DMSans-Medium',
              fontSize: 15,
              color: '#5eb2d6',
              paddingHorizontal: 15,
            }}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

export default CustomDrawer;
