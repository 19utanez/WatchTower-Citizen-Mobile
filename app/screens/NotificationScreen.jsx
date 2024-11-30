// app/screens/NotificationScreen.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NotificationScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <View style={styles.notificationBox}>
        <Text style={styles.boxTitle}>You have no reports created as of now</Text>
      </View>
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
    fontSize: 16,
    fontWeight: '500',
    color: '#B0C4DE',
    textAlign: 'left',
  },
});
