// app/screens/HomeScreen.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MapsScreen() {
  return (
    <View style={styles.container}>
      <Text>Maps Screen dito</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
