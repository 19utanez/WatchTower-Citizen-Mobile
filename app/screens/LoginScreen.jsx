import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Alert, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { SERVER_URL } from '@env'; // Import the environment variable
import logo from '../../assets/logo.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      // API call for login
      const response = await axios.post(`http://192.168.100.13:5000/api/auth/login`, {
        username,
        password,
      });

      const { token } = response.data;
      console.log('Login successful:', token);

      // Save credentials in AsyncStorage
      await AsyncStorage.setItem('loggedInUser', JSON.stringify({ username, password }));
      

      // Navigate to the Main screen
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
      <Image source={logo} style={styles.logo} />
      <Text style={styles.title}>WatchTower</Text>

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

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>
          {loading ? 'Logging in...' : 'Enter'}
        </Text>
      </TouchableOpacity>

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
    color: '#fff',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 70,
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
    color: '#fff',
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    marginLeft: 10,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#D2042D',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  createAccountText: {
    marginTop: 40,
    fontSize: 16,
    color: '#fff',
    textDecorationLine: 'underline',
  },
});
