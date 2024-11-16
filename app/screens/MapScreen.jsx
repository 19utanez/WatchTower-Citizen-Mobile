import React, { useState } from 'react';
import { StyleSheet, View, Button, TouchableOpacity  } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MaterialCommunityIcons } from 'react-native-vector-icons';

export default function MapScreen() {
  const initialCenter = {
    latitude: 14.601972841610728,
    longitude: 121.03527772039602,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const [region, setRegion] = useState({
    ...initialCenter,
    latitudeDelta: 0.05, // Initial zoom level (adjust for your needs)
    longitudeDelta: 0.05,
  });

  const [marker, setMarker] = useState(initialCenter);

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarker({ latitude, longitude });
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

  {/* Profile Icon */}
  <TouchableOpacity
        style={styles.profileIcon}
        onPress={() => navigation.navigate('Profile')} // Navigate to ProfileScreen
      >
        <MaterialCommunityIcons name="account-circle" size={60}  color="#D9D9D9" />
      </TouchableOpacity>

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
  profileIcon: {
    position: 'absolute',
    top: 5,
    left: 5,
    zIndex: 1, // Ensure the icon is above other elements
  },
});
