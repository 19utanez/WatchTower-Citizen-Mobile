import React, { useState } from 'react';
import { StyleSheet, View, Button, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import axios from 'axios';

export default function MapScreen({ navigation }) {
  // Initial center location, similar to the center in the React code
  const initialCenter = {
    latitude: 14.601972841610728, // Adjust to desired latitude
    longitude: 121.03527772039602, // Adjust to desired longitude
    latitudeDelta: 0.0922,  // Initial zoom level
    longitudeDelta: 0.0421, // Initial zoom level
  };

  // State for map region and marker location
  const [region, setRegion] = useState(initialCenter);
  const [marker, setMarker] = useState(initialCenter);

  // Function to get place name from latitude and longitude
  const getPlaceName = async (latitude, longitude) => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY; // Your API key from .env file
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
    
    try {
      const response = await axios.get(url);
      console.log("Geocoding API response:", response.data); // Log the response to inspect it
      
      // Check if we have results and extract the formatted address
      const address = response.data.results && response.data.results[0]?.formatted_address;
      return address || 'No address found';
    } catch (error) {
      console.error('Error fetching place name:', error);
      return 'Error fetching address';
    }
  };

  // Handle map press to update marker and display alert with place name
  const handleMapPress = async (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarker({ latitude, longitude });
  
    // Get the place name based on the clicked coordinates
    const placeName = await getPlaceName(latitude, longitude);
  
    // Show notification with the place name and options
    Alert.alert(
      "Marker Moved",
      `You placed the marker at:\n${placeName}`,
      [
        {
          text: "Cancel", // Button to cancel
          onPress: () => console.log("Cancel Pressed"), // Function for cancel
          style: "cancel", // Style for cancel
        },
        {
          text: "Report Now", // Button to report now
          onPress: () => {
            // Navigate to the Report tab in the TabNavigator, passing location as a parameter
            navigation.navigate('Reports', { location: placeName });
          },
        },
      ]
    );
  };

  // Zoom in functionality
  const zoomIn = () => {
    setRegion((prevRegion) => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta / 2,
      longitudeDelta: prevRegion.longitudeDelta / 2,
    }));
  };

  // Zoom out functionality
  const zoomOut = () => {
    setRegion((prevRegion) => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta * 2,
      longitudeDelta: prevRegion.longitudeDelta * 2,
    }));
  };

  return (
    <View style={styles.container}>
      {/* Profile Icon */}
      <TouchableOpacity
        style={styles.profileIcon}
        onPress={() => navigation.navigate('Profile')} // Navigate to ProfileScreen
      >
        <MaterialCommunityIcons name="account-circle" size={60} color="#D9D9D9" />
      </TouchableOpacity>

      <MapView
        style={styles.map}
        region={region}  // Center map to region state
        onPress={handleMapPress}  // Handle map clicks
      >
        <Marker coordinate={marker} />  {/* Display marker at the selected location */}
      </MapView>

      <View style={styles.buttonContainer}>
        <Button title="Zoom Out" onPress={zoomOut} />
        <Button title="Zoom In" onPress={zoomIn} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#071025',
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  profileIcon: {
    position: 'absolute',
    top: 5,
    left: 5,
    zIndex: 1, // Ensure the icon is above other elements
  },
});
  