import Svg, {Circle, Text} from 'react-native-svg';
import {View, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

export default function ProgressCircle1() {
  const [eventsDetailsData, setEventsDetailsData] = React.useState();
  const [progress, setProgress] = React.useState();

  const size = 110;
  const strokeWidth = 5;
  const fillColor = '#5eb2d6';
  const unfilledColor = 'lightgray';
  

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progressStrokeDashoffset =
    circumference - (progress / 100) * circumference;

  useEffect(() => {
    getEventsDetails();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getEventsDetails();
    }, []),
  );

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
      //First Circle
      var TotalSales = eventsDetailsData.totalSales;
      var TotalQuantity = eventsDetailsData.totalQuantity;
      var PercentageFormula = (TotalSales / TotalQuantity) * 100;
      var PercentageFormulaFix= PercentageFormula.toFixed();
      if(PercentageFormulaFix=='NaN'){
        setProgress(0);
      }else{
        setProgress(PercentageFormulaFix);
      }
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <View style={styles.circleContainer}>
      <Svg width={size} height={size}>
        {/* Unfilled Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={unfilledColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Filled Arc */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={fillColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={progressStrokeDashoffset}
        />
        {/* Progress Text */}
        <Text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          fontSize={20}
          fontWeight="bold"
          fill="black">
          {`${progress}%`}
        </Text>
        {/* Additional Text */}
        <Text      
          x={size / 2}
          y={size / 2 + 25}
          textAnchor="middle"
          fontSize={9}
          fill="black">
          {eventsDetailsData?`${eventsDetailsData.totalSales} / ${eventsDetailsData.totalQuantity}`:'loading..'}

        </Text>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  circleContainer: {
    marginVertical: 20,
  },
});