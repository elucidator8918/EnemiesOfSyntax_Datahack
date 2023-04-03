import { HStack, View, Text, TextInput, Input, Platform, StyleSheet, Box, Alert, TouchableOpacity, Image, ImageBackground, TextArea, ScrollView, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import { IconButton, MD3Colors, Button } from 'react-native-paper'
import ImagePicker from 'react-native-image-crop-picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

export default function AddVehicle({ route, navigation }) {
  const [brand, setBrand] = useState("");
  const [transmissionType, setTransmissionType] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [color, setColor] = useState("");
  const [price, setPrice] = useState("");
  const [photo, setPhoto] = useState("");
  const [open, setOpen] = useState(false)

  const takePhotoFromCamera = async () => {
    const options = {
      saveToPhotos: true,
      mediaType: 'photo',
      includeBase64: true,
      presentationStyle: 'popover',
      quality: 1
    }
    launchCamera(options, (res) => {
      if (res.didCancel) {
        console.log('User Cancled');
      } else if (res.errorCode) {
        console.log(res.errorMessage);
      } else {
        const data = res.assets[0];
        console.log(data);
        setPhoto(data);
      }
    });
  }

  const takePhotoFromGallery = async () => {
    const options = {
      saveToPhotos: true,
      mediaType: 'photo'
    }
    const result = await launchImageLibrary(options);
    console.log(result.assets[0].uri);
    setPhoto(result.assets[0]);
  }

  const createFormData = (photo, body) => {
    const data = new FormData();

    data.append('photo', {
      name: photo.fileName,
      type: photo.type,
      uri:
          Platform.OS === 'android' ? photo.uri : photo.uri.replace('file://', ''),
  });

    Object.keys(body).forEach((key) => {
      data.append(key, body[key]);
    });

    console.log(data);

    return data;
  };

  const uploadImage = async () => {

    if (brand != "" && transmissionType != "" && fuelType != "" && color != "" && price != "") {
      fetch('http://192.168.8.109:8000/cars/save', {
        method: 'POST',
        body: JSON.stringify({
          brand: brand,
          transmissionType: transmissionType,
          fuelType: fuelType,
          color: color,
          price: price
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then((response) => response.json())
        .then((json) => {
          if (json.status === "500") {
            Alert.alert(json.message)
          } else {
            Alert.alert(json.message)
            clearTextFields();
          }
        })
        .catch((err) => Alert.alert(err.message));
    } else {
      Alert.alert("Please fill all the fields and try again.")
    }
  }


  const clearTextFields = () => {
    setPhoto("");
    setBrand("");
    setTransmissionType("");
    setFuelType("");
    setColor("");
    setPrice("");
  }

  return (
    <SafeAreaView style={{ flex: 1 ,backgroundColor:'black'}}>
      <ScrollView contentContainerStyle={{ height: 650 }}>
        {/* <ScrollView> */}
        <View style={styles.container}>
          <Text style={{ fontSize: 20, justifyContent: 'center', color: "white", fontWeight: 'bold', top: 10, left: 10, fontFamily: 'notoserif',alignContent:'center',alignSelf:'center' }}>Add the used Car details</Text>

          <Image style={styles.uploadImageContainer} source={{ uri: photo.uri }} />


          <TouchableOpacity style={styles.button}>
            <Image
              source={require('../assets/icon/upload1.png')}
              style={{ width: 25, height: 25, left: -80, top: 10 }}
            />
            <Text style={{ color: '#ffff', fontSize: 20, left: 10, top: -15 }}
              mode="contained-tonal"
              onPress={() => { takePhotoFromGallery(); console.log("Upload button Pressed"); }}
            >Upload Image</Text>
          </TouchableOpacity>


          <TextInput style={styles.input1} placeholder='Year' value={brand} onChangeText={(e) => { setBrand(e) }} />
          <TextInput style={styles.input2} placeholder='Km Driven' value={transmissionType} onChangeText={(e) => { setTransmissionType(e) }} />
          <TextInput style={styles.input2} placeholder='Model car' value={fuelType} onChangeText={(e) => { setFuelType(e) }} />
          <TextInput style={styles.input2} placeholder='Engine Size' value={color} onChangeText={(e) => { setColor(e) }} />
          {/* <TextInput style={styles.input2} placeholder='Year' value={price} onChangeText={(e) => { setPrice(e) }} /> */}


          <TouchableOpacity
            style={styles.btn}
            onPress={() => { uploadImage() }}>
            <Text style={{ color: '#ffff', fontSize: 20 }}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btn2}
            onPress={clearTextFields} 
            >
            <Text style={{ color: '#ffff', fontSize: 20}}>Cancel</Text>
          </TouchableOpacity>


        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  input1: {
    marginTop: '15%',
    borderWidth: 1,
    padding: 10,
    width: '80%',
    borderRadius: 10,
    fontFamily: 'normal',
    backgroundColor: 'white',

  },
  input2: {
    marginTop: '3%',
    borderWidth: 1,
    padding: 10,
    width: '80%',
    borderRadius: 10,
    fontFamily: 'normal',
    backgroundColor: 'white',

  },
  btn: {
    width: '40%',
    padding: 5,
    backgroundColor: "#055BC7",
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    // top: -35,
    // left: -85,
    marginTop: '2%',
    left: -85,
    borderRadius: 15
  },
  btn2: {
    width: '40%',
    padding: 5,
    backgroundColor: "red",
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    // top: -85,
    // top: 45,
    marginTop: '-12%',
    left: 85,
    borderRadius: 15
  },
  button: {
    width: '80%',
    padding: 5,
    backgroundColor: "#23B671",
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    top: 40,
    // marginTop: '3%',
    borderRadius: 15,
    borderColor: "white"
  },
  // MainContainer: {
  //   flex: 1,
  //   paddingTop: (Platform.OS) === 'ios' ? 20 : 0,
  //   justifyContent: 'center',
  //   margin: 30,
  //   width: 290,
  //   top: -10

  // },

  TextInputStyleClass: {

    textAlign: 'center',
    height: 50,
    borderWidth: 1,
    borderColor: '#2A272A',
    borderRadius: 10,
    // backgroundColor: "#FFFFFF",
    height: 120

  },
  uploadImageContainer: {
    borderColor: 'white',
    borderWidth: 1,
    width: '50%',
    height: '25%',
    // marginTop: '-15%',
    top: 30,
    alignSelf: 'center',
    resizeMode: 'cover'

  },
  captureBtn: {
    marginTop: '4%'
  },
});