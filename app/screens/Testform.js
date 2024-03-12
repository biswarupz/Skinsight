import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {cloneElement, useState} from 'react';
import tw from 'twrnc';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';
import {NavigationContainer} from '@react-navigation/native';

const Testform = ({navigation, route}) => {
  const maxDesLen = 600;
  const email = route.params.useremail;
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState('');
  const openPhotos = async () => {
    const options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        const data = new FormData();

        if (images.length < 5) {
          let n = 4 - images.length;
          Alert.alert(`add more ${n} images`);
          setImages(images => [...images, response]);
          data.append('fileData', {
            uri: response.assets[0].uri,
            type: response.assets[0].type,
            name: response.assets[0].fileName,
          });
          const config = {
            method: 'POST',
            headers: {
              email,
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data',
            },
            body: data,
          };
          fetch('http://localhost:3001/upload', config)
            .then(res => {
              console.log(res.status);
              if (res.status == 201) {
                navigation.navigate('Home');

                return Alert.alert('your previous test is pending');
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          Alert.alert('you cant add more images');
        }
      }
    });
  };

  async function submitDes() {
    if (images.length == 5) {
      const data = {description, email};

      const res = await axios.post('http://localhost:3001/des', data);
      console.log(res.data.status);
      if (res.data.status == 201) {
        navigation.navigate('Home');

        return Alert.alert('your previous test is pending');
      }
      if (res.data.status == 200) {
        navigation.navigate('Home');
      }
    } else {
      Alert.alert('please select 5 images first');
    }
  }

  return (
    <View style={tw`h-full w-full bg-white flex justify-between items-center`}>
      <View
        style={tw`w-full h-20 flex items-center justify-center shadow-md bg-indigo-50 rounded-b-full`}>
        <Text style={tw`text-3xl font-light text-indigo-800`}>skinsight</Text>
      </View>

      <TouchableOpacity
        onPress={openPhotos}
        style={tw`flex justify-center items-center w-32 py-5  rounded-full bg-indigo-900 border border-gray-500`}>
        <Image
          source={require('../public/camera.png')}
          style={tw`h-16 w-16 rounded-full`}
        />
        <Text style={tw`text-gray-200 text-sm`}>select image</Text>
      </TouchableOpacity>
      {images ? (
        <Text style={tw`text-gray-600 text-base`}>
          Images selected - {images.length}{' '}
        </Text>
      ) : (
        <Text>no img </Text>
      )}

      <View style={tw`w-full p-10 flex gap-16  items-center`}>
        <TextInput
          placeholder="Write description about your disease"
          autoCapitalize="none"
          multiline
          numberOfLines={8}
          onChangeText={Text => setDescription(Text)}
          maxLength={maxDesLen}
          style={tw`p-4 h-48 w-full bg-white border border-indigo-200 shadow-md  rounded-xl `}
        />

        <TouchableOpacity
          onPress={submitDes}
          style={tw`px-5 h-12 bg-white rounded-full bg-indigo-500 flex justify-center items-center`}>
          <Text style={tw`text-center px-10 text-xl font-light  text-white`}>
            Submit
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Testform;
