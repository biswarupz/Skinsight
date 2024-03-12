import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './screens/Home';
import Login from './screens/Login';
import Signup from './screens/Signup';
import Testform from './screens/Testform';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    try {
      const isLoggedInData = await AsyncStorage.getItem('isLoggedIn');
      const email = await AsyncStorage.getItem('email');
      setIsLoggedIn(isLoggedInData ? JSON.parse(isLoggedInData) : !!email);
    } catch (error) {
      console.error('Error reading login status:', error);
    }
  };
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isLoggedIn ? 'Home' : 'Login'}
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login">
          {props => <Login {...props} onLogin={() => setIsLoggedIn(true)} />}
        </Stack.Screen>
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Testform" component={Testform} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
