import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ReportScreen({ route, navigation }) {
  const [selectedDisaster, setSelectedDisaster] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]); // State to hold uploaded images
  const [location, setLocation] = useState(''); // State to hold location

  // Extract the location parameter passed from MapScreen
  useEffect(() => {
    if (route.params?.location) {
      setLocation(route.params.location); // Set location if passed
    }
  }, [route.params?.location]);

  // Function to pick an image
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (!permissionResult.granted) {
      alert('Permission to access the media library is required!');
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1, // Use maximum quality for the image
    });
  
    if (!result.canceled) {
      setImages((prevImages) => [...prevImages, result.assets[0].uri]);
    }
  };

  // Function to delete an image
  const deleteImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
        // Get the logged-in user's credentials from AsyncStorage
        const loggedInUser = await AsyncStorage.getItem('loggedInUser');
        const { username, firstName, lastName, _id } = loggedInUser ? JSON.parse(loggedInUser) : {};

        if (!_id) {
            alert('Error: User ID not found!');
            return;
        }

        if (!username) {
            alert('No logged-in user found!');
            return;
        }

        // Prepare the report data
        const reportDetails = {
            reporterId: _id, // Use the user's ID from the credentials
            reportedBy: `${firstName} ${lastName}`, // Combine first and last name
            location: location, // Location from the location text input
            disasterCategory: selectedDisaster, // Disaster category from the dropdown
            disasterImages: [], // Leave as empty for now
            disasterInfo: description, // Description from the description input
            disasterStatus: 'unverified', // Static value for disaster status
            priority: 'no priority', // Static value for priority
            rescuerId: 'no rescuer yet', // Static value for rescuer ID
            rescuedBy: 'no rescuer yet', // Static value for rescued by
        };

        // Display the report summary in the alert
        const reportSummary = `
            Reporter: ${reportDetails.reportedBy}
            Reporter ID: ${reportDetails.reporterId} // Include _id here
            Disaster Category: ${reportDetails.disasterCategory}
            Description: ${reportDetails.disasterInfo}
            Location: ${reportDetails.location}
            Disaster Status: ${reportDetails.disasterStatus}
            Priority: ${reportDetails.priority}
            Rescuer ID: ${reportDetails.rescuerId}
            Rescued By: ${reportDetails.rescuedBy}
        `;

        alert(`Report submitted!\n\n${reportSummary.trim()}`);

        // You can later send this reportDetails object to your backend or API for saving.

    } catch (error) {
        console.error('Error submitting report:', error);
    }
};
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Location */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Location</Text>
        <View style={styles.locationContainer}>
          <TextInput
            style={[styles.input, styles.nonEditableInput, {flex: 1}]} // Add flex: 1 to make it expandable
            value={location} // Use the location from the map
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
          <MaterialCommunityIcons name="camera" size={40} color="#D9D9D9" />
          <Text style={styles.label}>Click here to upload Images</Text>
        </TouchableOpacity>
        {/* Display Images with Delete Button */}
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

      {/* Submit Button */}
      <View style={styles.submitButtonContainer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
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
    flex: 1, // Take up remaining space
    backgroundColor: '#1E2A3A',
    color: '#fff',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2A3B4C',
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
    height: 60,
    borderRadius: 8,
  },
  imageContainer: {
    marginTop: 10,
    flexDirection: 'row',
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  deleteIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#FF0000',
    borderRadius: 15,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  descriptionInput: {
    height: 100, // Set initial height for multiline text input
    textAlignVertical: 'top', // Ensures text starts at the top
    flexGrow: 1, // Allow the input to grow when text overflows
  },
  submitButtonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  submitButton: {
    height: 50,    // Adjust height
    backgroundColor: '#D2042D', // Green background for the button
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25, // Rounded corners
    marginTop: 20,   // Space above the button
    width: '60%', // Full width of the container
  },
  submitButtonText: {
    fontSize: 20,  // Font size for the button text
    color: '#fff', // White text color
    fontWeight: 'bold',
  },

});
