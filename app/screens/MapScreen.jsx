import React, { useState } from 'react';
import { StyleSheet, View, Button, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { TextInput } from 'react-native-paper'; // Importing from react-native-paper
import axios from 'axios';

export default function MapScreen({ navigation }) {
  const initialCenter = {
    latitude: 14.601972841610728,
    longitude: 121.03527772039602,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const [region, setRegion] = useState(initialCenter);
  const [marker, setMarker] = useState(initialCenter);
  const [searchQuery, setSearchQuery] = useState('');

  // Function to get place name from latitude and longitude
  const getPlaceName = async (latitude, longitude) => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
    
    try {
      const response = await axios.get(url);
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
  
    const placeName = await getPlaceName(latitude, longitude);
    Alert.alert(
      "Marker Moved",
      `You placed the marker at:\n${placeName}`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Report Now",
          onPress: () => {
            navigation.navigate('Reports', { location: placeName });
          },
        },
      ]
    );
  };

  // Function to search for a location and update the map region
  const handleSearch = async () => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${searchQuery}&key=${apiKey}`;
    
    try {
      const response = await axios.get(url);
      const result = response.data.results[0];
      if (result) {
        const { lat, lng } = result.geometry.location;
        const placeName = result.formatted_address;
        setRegion({
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        setMarker({ latitude: lat, longitude: lng });
        
        // Show the dialog with options after a successful search
        Alert.alert(
          "Location Found",
          `You searched for: ${placeName}`,
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            {
              text: "Report Now",
              onPress: () => {
                // Navigate to the Report screen with the location data
                navigation.navigate('Reports', { location: placeName });
              },
            },
          ]
        );
      } else {
        Alert.alert("Location Not Found", "Please try again with a different query.");
      }
    } catch (error) {
      console.error('Error searching location:', error);
      Alert.alert('Search Error', 'Could not search for the location.');
    }
  };

  const zoomIn = () => {
    setRegion((prevRegion) => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta / 2,
      longitudeDelta: prevRegion.longitudeDelta / 2,
    }));
  };

  const zoomOut = () => {
    setRegion((prevRegion) => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta * 2,
      longitudeDelta: prevRegion.longitudeDelta * 2,
    }));
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TextInput
        label="Search for a location"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
        style={styles.searchBar}
        onSubmitEditing={handleSearch} // Trigger search when hitting Enter
      />

      <MapView
        style={styles.map}
        region={region}
        onPress={handleMapPress}
      >
        <Marker coordinate={marker} />
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
  searchBar: {
    marginTop: 10,
    marginHorizontal: 20,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
});
