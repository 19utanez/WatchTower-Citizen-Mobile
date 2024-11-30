// app/screens/HomeScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to WatchTower</Text>
      <View style={styles.reportsBox}>
        <Text style={styles.boxTitle}>Reports Created as of Today</Text>
      </View>
      <TouchableOpacity 
        style={styles.reportButton}
        onPress={() => navigation.navigate('ReportScreen')} // Example navigation, replace 'ReportScreen' with your target
      >
        <Text style={styles.buttonText}>Try Reporting Now</Text>
      </TouchableOpacity>
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
    textAlign: 'center',
  },
  reportsBox: {
    backgroundColor: '#1E2A38',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, // For Android shadow
    marginBottom: 20, // Space below the box
  },
  boxTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#B0C4DE',
    textAlign: 'left',
    height: 150,
  },
  reportButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
