import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ImageBackground,
} from 'react-native';
import React,{useEffect,useCallback} from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const Splash_Screen = () => {

    const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
        navigation.navigate('Login Screen');
    }, 3000);
  }, []);

  /**
   * Triggers when screen is focused
   */

  useFocusEffect(
    useCallback(() => {
        setTimeout(() => {
            navigation.navigate('Login Screen');
        }, 3000);  
    }, []),
  );
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.MainContainer}>
        <View
          style={styles.MainContainer}>
          <Image
            style={styles.ImageLogo}
            source={require('./assets/logoApp.png')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Splash_Screen;

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  ImageLogo: {
    alignSelf: 'center',
    width: 400,
    height: 400,
    resizeMode: 'contain',
  },
});
