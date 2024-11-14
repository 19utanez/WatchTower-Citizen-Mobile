// app/screens/HomeScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from 'react-native-vector-icons';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Welcome to the Home Screen</Text>

      {/* Profile Icon */}
      <TouchableOpacity
        style={styles.profileIcon}
        onPress={() => navigation.navigate('Profile')} // Navigate to ProfileScreen
      >
        <MaterialCommunityIcons name="account-circle" size={60} color="#000" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    position: 'absolute',
    top: 20,
    left: 10,
    zIndex: 1, // Ensure the icon is above other elements
  },
});
