import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialCommunityIcons } from 'react-native-vector-icons';

export default function ReportScreen({ navigation }) {
  const [selectedDisaster, setSelectedDisaster] = useState('');
  const [description, setDescription] = useState('');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Profile Icon */}
      <TouchableOpacity
        style={styles.profileIcon}
        onPress={() => navigation.navigate('Profile')} // Navigate to ProfileScreen
      >
        <MaterialCommunityIcons name="account-circle" size={60} color="#D9D9D9" />
      </TouchableOpacity>

      {/* Location (Non-editable text field) */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Location</Text>
        <TextInput
          style={[styles.input, styles.nonEditableInput]}
          value="Current Location" // Replace with dynamic location value if available
          editable={false} // Non-editable
        />
      </View>

      {/* Dropdown for Disaster Type */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Disaster Type</Text>
        <View style={styles.dropdown}>
          <Picker
            selectedValue={selectedDisaster}
            onValueChange={(itemValue) => setSelectedDisaster(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select a disaster type" value="" />
            <Picker.Item label="Disaster A" value="Disaster A" />
            <Picker.Item label="Disaster B" value="Disaster B" />
          </Picker>
        </View>
      </View>

      {/* Camera Box */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Attach Image</Text>
        <TouchableOpacity style={styles.cameraBox}>
          <MaterialCommunityIcons name="camera" size={50} color="#D9D9D9" />
        </TouchableOpacity>
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
  },
  nonEditableInput: {
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
    height: 150,
    borderRadius: 8,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top', // Ensures text starts at the top
  },
});
