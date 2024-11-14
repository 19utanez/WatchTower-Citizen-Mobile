import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Alert, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';

import logo from '../../assets/logo.png';  // Adjust the path if necessary

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://192.168.100.13:5000/api/auth/login', {
        username,
        password,
      });

      const { token } = response.data;
      console.log('Login successful:', token);
      navigation.navigate('Main');
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      Alert.alert('Error', 'An error occurred, please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo Image */}
      <Image source={logo} style={styles.logo} />
      <Text style={styles.title}>WatchTower</Text>

      {/* "Login" label */}
      <Text style={styles.label}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#CEC6C6" 
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#CEC6C6" 
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Custom Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>
          {loading ? 'Logging in...' : 'Enter'}
        </Text>
      </TouchableOpacity>

      {/* "Create an Account" text */}
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.createAccountText}>Create an Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#071025',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: -70,
    color: '#fff'
  },
  logo: {
    width: 150, // Adjust the width as needed
    height: 150, // Adjust the height as needed
    marginBottom: 70, // Space between logo and inputs
  },
  input: {
    width: '100%',
    height: 54,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    fontSize: 20,
    borderRadius: 20,
    color: '#fff'
   
  },
  label: {
    alignSelf: 'flex-start',  // Align to the left of the screen
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,  // Space between label and input field
    marginLeft: 10,  // Left margin to give some space from the edge
  },
  button: {
    width: '100%', // Full width of the container
    height: 50,    // Adjust height
    backgroundColor: '#D2042D', // Green background for the button
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25, // Rounded corners
    marginTop: 20,   // Space above the button
  },
  buttonText: {
    fontSize: 20,  // Font size for the button text
    color: '#fff', // White text color
    fontWeight: 'bold',
  },
  createAccountText: {
    marginTop: 15,
    fontSize: 16,
    color: '#fff', // Blue color for the text
    textAlign: 'left',  // Left align
    textDecorationLine:'underline'
  },
});
