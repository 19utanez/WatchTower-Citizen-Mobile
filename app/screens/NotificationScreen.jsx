import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVER_URL } from '@env'; // Import the environment variable

export default function NotificationScreen() {
  const [citizen, setCitizen] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCitizenData = async () => {
    try {
      const loggedInUser = await AsyncStorage.getItem('loggedInUser');
      if (loggedInUser) {
        const { username } = JSON.parse(loggedInUser);
        const response = await fetch(`${SERVER_URL}/api/auth/citizens`);
        if (!response.ok) {
          throw new Error('Failed to fetch citizen data');
        }
        const data = await response.json();
        const loggedInCitizen = data.find(citizen => citizen.username === username);
        if (loggedInCitizen) {
          setCitizen(loggedInCitizen);
        } else {
          console.error('Citizen not found in database');
        }
      } else {
        console.error('No logged-in user found');
      }
    } catch (error) {
      console.error('Error fetching citizen data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShowDetails = () => {
    fetchCitizenData();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0891b2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>

      <TouchableOpacity style={styles.showDetailsButton} onPress={handleShowDetails}>
        <Text style={styles.buttonText}>Show Details</Text>
      </TouchableOpacity>

      {citizen ? (
        <View style={styles.notificationBox}>
          <Text style={styles.boxTitle}>Citizen Details</Text>
          <Text style={styles.boxText}>First Name: {citizen.firstName}</Text>
          <Text style={styles.boxText}>Last Name: {citizen.lastName}</Text>
          <Text style={styles.boxText}>Email: {citizen.email}</Text>
          <Text style={styles.boxText}>Mobile Number: {citizen.mobileNumber}</Text>
        </View>
      ) : (
        <View style={styles.notificationBox}>
          <Text style={styles.boxTitle}>You have no reports created as of now</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#071025',
    paddingHorizontal: 16,
    paddingTop: 40, // Space for a header if needed
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20, // Space below the main title
  },
  showDetailsButton: {
    backgroundColor: '#0891b2',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  notificationBox: {
    backgroundColor: '#1E2A38',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, // For Android shadow
  },
  boxTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#B0C4DE',
    textAlign: 'left',
    marginBottom: 10,
  },
  boxText: {
    fontSize: 14,
    color: '#B0C4DE',
    textAlign: 'left',
  },
});
