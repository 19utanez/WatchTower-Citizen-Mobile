import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button, Alert, Image } from 'react-native';
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
      navigation.navigate('Home');
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
        value={username}
        onChangeText={setUsername}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      
      <Button style={styles.button} title={loading ? 'Logging in...' : 'Enter'} onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: -70
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
    borderRadius: 20
  },
  label: {
    alignSelf: 'flex-start',  // Align to the left of the screen
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 5,  // Space between label and input field
    marginLeft: 10,  // Left margin to give some space from the edge
  },

});
