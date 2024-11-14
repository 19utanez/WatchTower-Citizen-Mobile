// app/screens/HomeScreen.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ReportScreen () {
  return (
    <View style={styles.container}>
      <Text>Welcome to the Report Screen</Text>
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
