import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import tw from 'twrnc';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Login = ({navigation, onLogin}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const retrieveIsLoggedIn = async () => {
      try {
        const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
        const email = await AsyncStorage.getItem('email');

        if (isLoggedIn && email) {
          onLogin();
          navigation.navigate('Home');
        }
      } catch (error) {
        console.error('Error retrieving login status:', error);
      }
    };

    retrieveIsLoggedIn();
  }, []);

  async function login() {
    try {
      const data = {email, password};
      const response = await axios.post('http://localhost:3001/login', data);
      if (response.data.status == 200) {
        const email = response.data.data;
        console.log(email);
        await AsyncStorage.setItem('email', email);
        await AsyncStorage.setItem('isLoggedIn', JSON.stringify(true));
        onLogin();
        navigation.navigate('Home');
        Alert.alert('login successful!');
      } else {
        Alert.alert('email or password is incorrect!');
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <View style={tw`h-full bg-white`}>
      <View
        style={tw`w-full h-[35%] shadow-lg flex items-center rounded-b-full bg-indigo-100 justify-center`}>
        <Image
          source={require('../public/skk.png')}
          style={tw` w-52 h-52 shadow-xl rounded-full`}
        />
      </View>
      <View style={tw` p-10 h-[60%] flex justify-evenly items-center`}>
        <View>
          <Text style={tw`text-[3rem] text-indigo-900 font-thin`}>
            skinsight
          </Text>
        </View>
        <View style={tw`w-full py-10 flex gap-4  items-center`}>
          <TextInput
            placeholder="email"
            onChangeText={text => setEmail(text)}
            autoCapitalize="none"
            style={tw`px-4 h-12 w-full bg-white border border-indigo-200  rounded-full `}
          />
          <TextInput
            placeholder="password"
            onChangeText={text => setPassword(text)}
            autoCapitalize="none"
            style={tw`px-4 h-12 w-full bg-white border border-indigo-200  rounded-full `}
          />
          <TouchableOpacity
            onPress={login}
            style={tw`px-5 h-12 bg-white w-[50%] rounded-full bg-indigo-500 flex justify-center items-center`}>
            <Text style={tw`text-center text-xl font-semibold  text-white`}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Signup');
        }}>
        <Text style={tw`underline text-blue-700 text-center bottom-0`}>
          create an account
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
