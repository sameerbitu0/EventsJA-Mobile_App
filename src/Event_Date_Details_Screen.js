import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressCircle1 from './Components/ProgressCircle1';
import ProgressCircle2 from './Components/ProgressCircle2';

const Event_Date_Details_Screen = () => {
  const navigation = useNavigation();

  const [eventsDetailsData, setEventsDetailsData] = React.useState();

  /**
   * userData Get from async storage
   */

  const getEventsDetails = async () => {
    try {
      var eventsDetailsData = await AsyncStorage.getItem('eventDetailData');
      eventsDetailsData = JSON.parse(eventsDetailsData);
      setEventsDetailsData({
        eventName: eventsDetailsData.eventName,
        eventDate: eventsDetailsData.eventDate,
        eventVenue: eventsDetailsData.eventVenue,
        eventImage: eventsDetailsData.eventImage,
        eventDateReference: eventsDetailsData.eventDateReference,
        totalSales: eventsDetailsData.totalSales,
        totalQuantity: eventsDetailsData.totalQuantity,
        totalCheckIns: eventsDetailsData.totalCheckIns,
        totalSalesPercentage: eventsDetailsData.totalSalesPercentage,
        totalCheckInPercentage: eventsDetailsData.totalCheckInPercentage,
      });
    } catch (error) {
      console.warn(error);
    }
  };

  /**
   * Triggers when user navigation screen is focused
   */

  useEffect(() => {
    getEventsDetails();
  }, []);

  /**
   * Triggers when screen is focused
   */

  useFocusEffect(
    useCallback(() => {
      getEventsDetails();
    }, []),
  );

  return (
    <SafeAreaView style={styles.mainContainer}>
      {eventsDetailsData ? (
        <ScrollView style={styles.scrollView}>
          <View style={styles.headImage}>
            <Image
              style={styles.image}
              source={{
                uri: eventsDetailsData.eventImage,
              }}
            />
          </View>
          <View style={styles.jungle}>
            <Text style={styles.jungleText}>{eventsDetailsData.eventName}</Text>
          </View>
          <View style={styles.textContainer}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 5,
              }}>
              <Image
                source={require('./assets/time.png')}
                style={{width: 20, height: 20, tintColor: 'black'}}
              />
              <Text style={styles.NewYorktxt}>
                {eventsDetailsData.eventDate}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 5,
              }}>
              <Image
                source={require('./assets/vanue.png')}
                style={{width: 20, height: 20, tintColor: 'black'}}
              />
              <Text style={styles.VanueDetail}>
                {eventsDetailsData.eventVenue}
              </Text>
            </View>
          </View>
          <View style={styles.circleContainer}>
           <Text style={styles.ProgressCircleTittleText}>Total ticket sales</Text>
            <ProgressCircle1 />
          </View>
          <View style={styles.circleContainer}>
          <Text style={styles.ProgressCircleTittleText}>Attendance</Text>
            <ProgressCircle2 />
          </View>

          <TouchableOpacity
            style={styles.scanButtonContainer}
            onPress={() =>
              navigation.navigate('Scan Screen', {
                eventDateReference: eventsDetailsData.eventDateReference,
              })
            }>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={require('./assets/scan.png')}
                style={{width: 20, height: 20, tintColor: '#fff'}}
              />
              <Text style={styles.scanTicketText}>SCAN TICKETS</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.scanButtonContainer}
            onPress={() => navigation.navigate('Attendees Screen')}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={require('./assets/list.png')}
                style={{width: 20, height: 20, tintColor: '#fff'}}
              />
              <Text style={styles.scanTicketText}>
                TAP TO CHECK ATTENDEES IN
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <></>
      )}
    </SafeAreaView>
  );
};

export default Event_Date_Details_Screen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  headImage: {
    width: '100%',
  },
  image: {
    width: '100%',
    height: 270,
    resizeMode:'stretch'
  },
  jungle: {
    padding: 20,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  jungleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'DMSans-Bold',
  },
  textContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderWidth: 0.3,
    borderColor: '#d9d9d9',
  },
  NewYorktxt: {
    padding: 5,
    color: 'black',
    fontSize: 15,
    fontFamily: 'DMSans-Bold',
  },
  VanueDetail: {
    padding: 5,
    color: 'black',
    fontSize: 15,
    fontFamily: 'DMSans-Medium',
  },
  circleContainer: {
    flex:1,
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderWidth: 0.3,
    borderColor: '#d9d9d9',
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButtonContainer: {
    backgroundColor: '#333333',
    marginVertical: 10,
    marginHorizontal: 15,
    borderRadius: 5,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  scanTicketText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'DMSans-Medium',
    paddingHorizontal: 10,
  },
  ProgressCircleTittleText:{
    color: 'black',
    textAlign:'center',
    fontSize: 15,
    fontFamily: 'DMSans-Bold',
  }

});




