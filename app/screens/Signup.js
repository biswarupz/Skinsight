import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import tw from 'twrnc';
import axios from 'axios';
const Signup = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  async function signup() {
    if (name.length == 0) {
      Alert.alert('enter a valid name');
      return;
    }
    if (email.length == 0) {
      Alert.alert('enter a valid email');
      return;
    }
    if (age.length == 0) {
      Alert.alert('enter a valid age');
      return;
    }
    if (gender.length == 0) {
      Alert.alert('enter a valid gender');
      return;
    }
    if (password.length < 6) {
      Alert.alert('enter a valid password');
      return;
    }
    const data = {name, email, gender, age, password};
    const response = await axios.post('http://localhost:3001/signup', data);

    if (response.data.status == 400) {
      Alert.alert('invalid inputs');
      return;
    }
    if (response.data.status == 403) {
      Alert.alert('email already exists');
    }
    if (response.data.data == 409) {
      Alert.alert('network error');
    }
    if (response.data.status == 200) {
      Alert.alert('Signup successful, please login now');
      navigation.navigate('Login');
    }
  }

  return (
    <View style={tw`h-full bg-white`}>
      <View
        style={tw`w-full h-[15%] flex justify-center bg-indigo-100 shadow-lg rounded-b-full`}>
        <Text style={tw` text-center text-[50px] font-light text-indigo-800 `}>
          skinsight
        </Text>
      </View>

      <View style={tw`h-85% p-5 flex justify-between items-center`}>
        <View style={tw`w-full flex items-center justify-evenly h-[90%]`}>
          <Text style={tw` text-center text-lg font-light text-indigo-900`}>
            Your skin health at your finger step, get AI based medical help with
            doctors advice
          </Text>
          <View style={tw`flex gap-4 p-4 w-full`}>
            <TextInput
              placeholder="name"
              onChangeText={text => setName(text)}
              autoCapitalize="none"
              style={tw`px-4 h-12 w-full bg-white border border-indigo-200 rounded-full `}
            />
            <TextInput
              placeholder="email"
              onChangeText={text => setEmail(text)}
              autoCapitalize="none"
              style={tw`px-4 h-12 w-full bg-white  border border-indigo-200 rounded-full `}
            />
            <View style={tw`flex-row gap-2 justify-between w-full`}>
              <TextInput
                placeholder="age"
                onChangeText={text => setAge(text)}
                autoCapitalize="none"
                style={tw`px-4 h-12 flex-1 bg-white border border-indigo-200 rounded-full `}
              />
              <TextInput
                placeholder="gender"
                onChangeText={text => setGender(text)}
                autoCapitalize="none"
                style={tw`px-4 h-12 flex-1 bg-white border border-indigo-200  rounded-full `}
              />
            </View>

            <TextInput
              placeholder="password"
              onChangeText={text => setPassword(text)}
              autoCapitalize="none"
              style={tw`px-4 h-12 w-full border bg-white border-indigo-200  rounded-full `}
            />
          </View>
          <TouchableOpacity
            onPress={signup}
            style={tw`px-5 h-12 bg-white w-[50%] rounded-full bg-indigo-500 flex justify-center items-center`}>
            <Text style={tw`text-center text-xl font-semibold  text-white`}>
              Signup
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Login');
          }}>
          <Text style={tw`underline text-blue-700 text-center bottom-0`}>
            already have an account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Signup;
