import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  FlatList,
  BackHandler,
  Platform,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Event_Screen = () => {
  const navigation = useNavigation();

  const [eventsData, setEventsData] = React.useState();
  const [length, setLength] = React.useState();

  // Function to handle the hardware back button press for Android
  const handleAndroidBackButton = () => {
    BackHandler.exitApp(); // Exit the app when the back button is pressed
    return true; // Return true to prevent the default behavior (app exit)
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

  

  /**
   * userData Get from async storage
   */

  const getEventsData = async () => {
    try {
      var eventsData = await AsyncStorage.getItem('eventsData');
      eventsData = JSON.parse(eventsData);
      setEventsData(eventsData);
      setLength(eventsData.length);
    } catch (error) {
      console.warn(error);
    }
  };

  /**
   * userData Get from async storage
   */

  const setEventDetailData = async item => {
    try {
      AsyncStorage.setItem('eventDetailData', JSON.stringify(item));
      navigation.navigate('Event Details Screen');
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#F5F5F5'}}>
      <View style={styles.EventCountContainer}>
        <Text style={styles.EventCountText}>{length} events found</Text>
      </View>
      <FlatList
        data={eventsData}
        keyExtractor={(item, index) => index}
        renderItem={({item}) => (
          <>
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.6}
              onPress={() => setEventDetailData(item)}>
              <Image
                style={styles.backgroundImage}
                source={{
                  uri: item.eventImage,
                }}
              />
              <View style={styles.overlay}>
                <Text style={styles.title}>{item.eventName}</Text>
                <Text style={styles.date}>{item.eventDate}</Text>
              </View>
              <View style={styles.footer}>
                <Text style={styles.footerText}>{item.eventVenue}</Text>
              </View>
            </TouchableOpacity>
          </>
        )}
      />
    </SafeAreaView>
  );
};

export default Event_Screen;

const styles = StyleSheet.create({
  EventCountContainer: {
    backgroundColor: 'black',
    padding: 10,
  },
  EventCountText: {
    fontFamily: 'DMSans-Bold',
    fontSize: 15,
    color:'#fff',paddingHorizontal:10
  },
  card: {
    borderRadius: 10,
    overflow: 'hidden',
    margin: 12,
  },
  backgroundImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: 'DMSans-Bold',
    marginBottom: 8,
    color: 'white',
  },
  date: {
    fontSize: 16,
    fontFamily: 'DMSans-Medium',
    color: 'white',
  },
  footer: {
    backgroundColor: '#5eb2d6',
    padding: 8,
  },
  footerText: {
    color: 'white',
    fontFamily:'DMSans-Medium',
    textAlign: 'center',
  },
});
