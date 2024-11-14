import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button, Alert } from 'react-native';
import axios from 'axios';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      // API request to check user credentials
      const response = await axios.post('http://192.168.100.13:5000/api/auth/login', {
        username,
        password,
      });

      // If login is successful, navigate to Home screen
      const { token } = response.data;
      console.log('Login successful:', token);
      navigation.navigate('Home');
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      
      // Check if username exists and password is correct
      if (error.response?.data?.message === 'User does not exist') {
        Alert.alert('Error', 'Username not found, please check your credentials.');
      } else if (error.response?.data?.message === 'Invalid password') {
        Alert.alert('Error', 'Incorrect password, please try again.');
      } else {
        Alert.alert('Error', 'An error occurred, please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
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
      <Button title={loading ? 'Logging in...' : 'Enter'} onPress={handleLogin} />
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
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
});
