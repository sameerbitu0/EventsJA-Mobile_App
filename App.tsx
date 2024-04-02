import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Event_Screen from './src/Event_Screen';
import Splash_Screen from './src/Splash_Screen';
import Login_Screen from './src/Login_Screen';
import CustomDrawer from './src/Components/CustomDrawer';
import Event_Date_Details_Screen from './src/Event_Date_Details_Screen';
import Attendees_Screen from './src/Attendees_Screen';
import Scan_Screen from './src/Scan_Screen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();



function DrawerComponent() {
  return (
    <Drawer.Navigator    
      drawerContent={props => <CustomDrawer/>}>
      <Drawer.Screen
        name="Event Screen"
        component={Event_Screen}
        options={{
          title: 'Events',
          headerTitleStyle: { fontFamily: 'DMSans-Bold' },
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#5eb2d6',
          },
          headerTintColor: 'white', // Set the header title color to white
          headerShown: true,
        }}
      />
      
    </Drawer.Navigator>
  );
}



function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Splash Screen"
          component={Splash_Screen}
          options={{
            headerShown: false,
          }}
        />
         <Stack.Screen
          name="Login Screen"
          component={Login_Screen}
          options={{
            headerShown: false,
          }}
        />
         <Stack.Screen
          name="Root"
          component={DrawerComponent}
          options={{headerShown: false}}
        />
          <Stack.Screen
          name="Event Details Screen"
          component={Event_Date_Details_Screen}
          options={{
            title: 'Event Details',
            headerShown: true,
            headerStyle: {
              backgroundColor: '#5eb2d6',
            },
            headerTintColor: 'white',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontFamily: 'DMSans-Bold', 
              fontSize: 20, 
            },
          }}
        />
        <Stack.Screen
          name="Scan Screen"
          component={Scan_Screen}
          options={{
            title: 'Scan The QR Code',
            headerShown: true,
            headerStyle: {
              backgroundColor: '#5eb2d6',
            },
            headerTintColor: 'white',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontFamily: 'DMSans-Bold', 
              fontSize: 20, 
            },
          }}
        />
        <Stack.Screen
          name="Attendees Screen"
          component={Attendees_Screen}
          options={{
            title: 'Attendees',
            headerShown: true,
            headerStyle: {
              backgroundColor: '#5eb2d6',
            },
            headerTintColor: 'white',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontFamily: 'DMSans-Bold', 
              fontSize: 20, 
            },
          }}
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;