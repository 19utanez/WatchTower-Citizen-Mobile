import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import * as ImagePicker from 'expo-image-picker'; // Make sure you install `expo-image-picker`

export default function ReportScreen({ navigation }) {
  const [selectedDisaster, setSelectedDisaster] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]); // State to hold uploaded images

  // Function to pick an image
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert('Permission to access the media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImages((prevImages) => [...prevImages, result.assets[0].uri]);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
  


      {/* Location (Non-editable text field with button) */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Location</Text>
        <View style={styles.locationContainer}>
          <TextInput
            style={[styles.input, styles.nonEditableInput]}
            value="Current Location" // Replace with dynamic location value if available
            editable={false} // Non-editable
          />
          <TouchableOpacity
            style={styles.mapButton}
            onPress={() => navigation.navigate('Map')} // Navigate to the "Map" tab
          >
            <MaterialCommunityIcons name="map-marker" size={24} color="#D9D9D9" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Dropdown for Disaster Type */}
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

      {/* Camera Section */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Attach Image</Text>
        <TouchableOpacity style={styles.cameraBox} onPress={pickImage}>
          <MaterialCommunityIcons name="camera" size={50} color="#D9D9D9" />
        </TouchableOpacity>
        {/* Display Images */}
        <ScrollView horizontal style={styles.imageContainer}>
          {images.map((image, index) => (
            <Image key={index} source={{ uri: image }} style={styles.image} />
          ))}
        </ScrollView>
      </View>

      {/* Description */}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#071025',
  },
  scrollContent: {
    padding: 20,
  },
  profileIcon: {
    position: 'absolute',
    top: 5,
    left: 5,
    zIndex: 1, // Ensure the icon is above other elements
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#1E2A3A',
    color: '#fff',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    flex: 1, // Allow TextInput to grow and fill space
  },
  nonEditableInput: {
    backgroundColor: '#2A3B4C',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E2A3A',
    borderRadius: 8,
    overflow: 'hidden',
  },
  mapButton: {
    padding: 10,
    backgroundColor: '#2A3B4C',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  dropdown: {
    backgroundColor: '#1E2A3A',
    borderRadius: 8,
    padding: 5,
  },
  picker: {
    color: '#fff',
  },
  cameraBox: {
    backgroundColor: '#1E2A3A',
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
    borderRadius: 8,
  },
  imageContainer: {
    marginTop: 10,
    flexDirection: 'row',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top', // Ensures text starts at the top
  },
});
