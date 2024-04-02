import React, {useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TextInput,
  ActivityIndicator,
  FlatList,
  Modal,
  Alert,
  TouchableOpacity,KeyboardAvoidingView,TouchableWithoutFeedback,Keyboard
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import URL_CONFIG from './Components/global-config';

const Attendees_Screen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [attendeesData, setAttendeesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [loading, setLoading] = useState();

  const [eventsDate, setEventsDate] = useState('');

  useEffect(() => {
    getEventsData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getEventsData();
    }, []),
  );

  const getEventsData = async () => {
    try {
      const apiKey = await AsyncStorage.getItem('apiKey');
      const password = await AsyncStorage.getItem('password');
      const username = await AsyncStorage.getItem('username');
      const eventDateReference = await AsyncStorage.getItem('eventDetailData');
      const parsedEventDateReference = JSON.parse(eventDateReference);
      setEventsDate(parsedEventDateReference.eventDateReference);
      setLoading(true);
      const options = {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
          'X-AUTH-TOKEN': apiKey,
        },
      };
      fetch(
        URL_CONFIG.Url +
          `en/api/scanner/get-event-date-attendees/${parsedEventDateReference.eventDateReference}?username=${username}&password=${password}`,
        options,
      )
        .then(response => response.json())
        .then(responseJson => {
          setLoading(false);
          setAttendeesData(responseJson);
        })
        .catch(error => {
          console.warn(error);
          setLoading(false);
        });
    } catch (error) {
      console.warn(error);
      setLoading(false);
    }   
      setLoading(false);
  };

  async function ticketEventCheck(item) {
    const apiKey = await AsyncStorage.getItem('apiKey');
    const password = await AsyncStorage.getItem('password');
    const username = await AsyncStorage.getItem('username');

    ticketReference = item.ticketReference;
    var options = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
        'X-AUTH-TOKEN': `${apiKey}`,
      },
    };
    setLoading(true);
    fetch(
      URL_CONFIG.Url +
        `en/api/scanner/event-date/${eventsDate}/grant-access/${ticketReference}?username=${username}&password=${password}`,
      options,
    )
      .then(response => response.json())
      .then(responseJson => {
        setLoading(false);
        const newData = responseJson;
        if (newData.type == 'success') {
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

  const handleCheckboxPress = ticketReference => {
    setAttendeesData(prevAttendeesData =>
      prevAttendeesData.map(attendee =>
        attendee.ticketReference === ticketReference
          ? {...attendee, isTicketScanned: true}
          : attendee,
      ),
    );
  };

  const handleSearch = text => {
    setSearchQuery(text);
    const filtered = attendeesData.filter(item => {
      // You can modify the search criteria here according to your requirement
      return (
        item.ticketReference.toLowerCase().includes(text.toLowerCase()) ||
        item.attendeeName.toLowerCase().includes(text.toLowerCase())
      );
    });
    setFilteredData(filtered);
  };

  return (
    
      <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1,}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={styles.SearchBarMainContainer}>
        <View style={styles.SearchBarContainer}>
          <Image
            source={require('./assets/search.png')}
            style={{width: 30, height: 30, tintColor: '#333333'}}
          />
          <TextInput
            placeholder="Search"
            placeholderTextColor={'#b3b3b3'}
            style={styles.SearchBar}
            value={searchQuery}
            onChangeText={text => handleSearch(text)}
          />
        </View>
      </View>
      <View style={styles.checkboxesContainer}>
        {attendeesData ? (
          attendeesData.length > 0 ? (
            <FlatList
              data={filteredData.length > 0 ? filteredData : attendeesData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() =>
                    item.isTicketScanned == true
                      ? ''
                      : ticketEventCheck(item) +
                        handleCheckboxPress(item.ticketReference)
                  }
                  style={[
                    styles.checkboxRow,
                    item.isTicketScanned && {
                      borderColor: '#cccccc', // Set border color to red when checkbox is true
                    },
                  ]}>
                  <View>
                    <Text
                      style={[
                        styles.checkboxText,
                        item.isTicketScanned && {
                          color: '#cccccc', // Set text color to red when checkbox is true
                        },
                      ]}>
                      {item.attendeeName}
                    </Text>
                    <Text
                      style={[
                        styles.checkboxSubText,
                        item.isTicketScanned && {
                          color: '#cccccc', // Set text color to red when checkbox is true
                        },
                      ]}>
                      {item.ticketReference}
                    </Text>
                  </View>
                  <CheckBox
                    value={item.isTicketScanned}
                    onValueChange={() =>
                      item.isTicketScanned == true
                        ? ''
                        : ticketEventCheck(item) +
                          handleCheckboxPress(item.ticketReference)
                    }
                    tintColors={{true: '#5eb2d6', false: '#808080'}}
                  />
                </TouchableOpacity>
              )}
            />
          ) : (
            <></>
          )
        ) : (
          <></>
        )}
      </View>
      {loading == true ? (
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
      ) : (
        <></>
      )}
    </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Attendees_Screen;

const styles = StyleSheet.create({
  SearchBarMainContainer: {
    padding: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 10,
  },
  SearchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 3,
    backgroundColor: '#fff',
    shadowColor: '#000',
    paddingHorizontal: 20,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 10,
  },
  SearchBar: {
    fontFamily: 'DMSans-Medium',
    fontSize: 15,
    color: '#000000',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    width: '90%',
    height: '100%',
  },
  checkboxesContainer: {
    marginTop: 3,
  },
  checkboxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 0.5,
    borderColor: '#666666',
  },
  checkboxText: {
    fontSize: 14,
    color: '#333333',
    fontFamily: 'DMSans-Medium',
  },
  checkboxSubText: {
    fontSize: 13,
    color: '#333333',
    fontFamily: 'DMSans-Regular',
    paddingTop: 5,
  },
});
