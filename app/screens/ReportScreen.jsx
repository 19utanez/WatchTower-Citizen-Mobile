import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ReportScreen({ route, navigation }) {
  const [selectedDisaster, setSelectedDisaster] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState('');

  useEffect(() => {
    if (route.params?.location) {
      setLocation(route.params.location);
    }
  }, [route.params?.location]);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Permission to access the media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImages((prevImages) => [...prevImages, result.assets[0].uri]);
    }
  };

  const deleteImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      const loggedInUser = await AsyncStorage.getItem('loggedInUser');
      const user = loggedInUser ? JSON.parse(loggedInUser) : {};
  
      const { username } = user;
  
      if (!username) {
        Alert.alert('Error', 'No logged-in user found!');
        return;
      }
  
      // Fetch citizens data from backend
      const response = await fetch('http://192.168.100.13:5000/api/auth/citizens');
      const citizens = await response.json();
  
      // Find the citizen that matches the username
      const citizen = citizens.find((citizen) => citizen.username === username);
  
      if (!citizen) {
        Alert.alert('Error', 'Citizen data not found!');
        return;
      }
  
      // Extract _id, firstName, and lastName
      const { _id, firstName = 'Unknown', lastName = 'User' } = citizen;
  
      // Create the report details
      const reportDetails = {
        reportedBy: `${firstName} ${lastName}`,
        location: location || 'No location provided',
        disasterCategory: selectedDisaster || 'Unspecified',
        disasterImages: images,
        disasterInfo: description || 'No description provided',
        disasterStatus: 'unverified',
        priority: 'no priority',
        rescuerId: 'no rescuer yet',
        rescuedBy: 'no rescuer yet',
      };
  
      const reportSummary = `
        ID: ${_id}
        Reporter: ${reportDetails.reportedBy}
        Disaster Category: ${reportDetails.disasterCategory}
        Description: ${reportDetails.disasterInfo}
        Location: ${reportDetails.location}
        Disaster Status: ${reportDetails.disasterStatus}
        Priority: ${reportDetails.priority}
        Rescuer ID: ${reportDetails.rescuerId}
        Rescued By: ${reportDetails.rescuedBy}
      `;
  
      Alert.alert('Report Submitted!', reportSummary.trim());
  
      // Optionally, you can send `reportDetails` to the backend here.
  
    } catch (error) {
      console.error('Error submitting report:', error);
      Alert.alert('Error', 'An error occurred while submitting the report.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Location</Text>
        <View style={styles.locationContainer}>
          <TextInput
            style={[styles.input, styles.nonEditableInput, { flex: 1 }]}
            value={location}
            editable={false}
          />
          <TouchableOpacity
            style={styles.mapButton}
            onPress={() => navigation.navigate('Map')}
          >
            <MaterialCommunityIcons name="map-marker" size={24} color="#D9D9D9" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Disaster Category</Text>
        <View style={styles.dropdown}>
          <Picker
            selectedValue={selectedDisaster}
            onValueChange={(itemValue) => setSelectedDisaster(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select a disaster type" value="" />
            <Picker.Item label="Typhoon" value="Typhoon" />
            <Picker.Item label="Fire" value="Fire" />
            <Picker.Item label="Flood" value="Flood" />
            <Picker.Item label="Others" value="Others" />
          </Picker>
        </View>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Attach Image</Text>
        <TouchableOpacity style={styles.cameraBox} onPress={pickImage}>
          <MaterialCommunityIcons name="camera" size={40} color="#D9D9D9" />
          <Text style={styles.label}>Click here to upload Images</Text>
        </TouchableOpacity>
        <ScrollView horizontal style={styles.imageContainer}>
          {images.map((image, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri: image }} style={styles.image} />
              <TouchableOpacity
                style={styles.deleteIcon}
                onPress={() => deleteImage(index)}
              >
                <MaterialCommunityIcons name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Enter a description..."
          placeholderTextColor="#CEC6C6"
          multiline
          value={description}
          onChangeText={setDescription}
        />
      </View>

      <View style={styles.submitButtonContainer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#071025' },
  scrollContent: { padding: 20 },
  fieldContainer: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  input: { flex: 1, backgroundColor: '#1E2A3A', color: '#fff', borderRadius: 8, padding: 10, fontSize: 16 },
  nonEditableInput: { backgroundColor: '#2A3B4C' },
  locationContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E2A3A', borderRadius: 8 },
  mapButton: { padding: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#2A3B4C' },
  dropdown: { backgroundColor: '#1E2A3A', borderRadius: 8, padding: 5 },
  picker: { color: '#fff' },
  cameraBox: { backgroundColor: '#1E2A3A', justifyContent: 'center', alignItems: 'center', height: 60, borderRadius: 8 },
  imageContainer: { marginTop: 10, flexDirection: 'row' },
  imageWrapper: { position: 'relative', marginRight: 10 },
  image: { width: 100, height: 100, borderRadius: 8 },
  deleteIcon: { position: 'absolute', top: 5, right: 5, backgroundColor: '#FF0000', borderRadius: 15, padding: 5 },
  descriptionInput: { height: 100, textAlignVertical: 'top', flexGrow: 1 },
  submitButtonContainer: { alignItems: 'center', marginTop: 20 },
  submitButton: { height: 50, backgroundColor: '#D2042D', justifyContent: 'center', alignItems: 'center', borderRadius: 25, width: '60%' },
  submitButtonText: { fontSize: 20, color: '#fff', fontWeight: 'bold' },
});
