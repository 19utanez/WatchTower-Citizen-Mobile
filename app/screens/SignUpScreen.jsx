import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';

export default function SignUpScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const requestBody = {
        firstName: firstName || "no data yet",
        lastName: lastName || "no data yet",
        username: username || "no data yet",
        password: password || "no data yet",
        mobileNumber: mobileNumber || "no data yet",
        email:mobileNumber , // Static value
        address: "no data yet", // Static value
        profileImage: "no data yet", // Static value
      };
  
      const response = await axios.post(
        "http://192.168.100.13:5000/api/auth/citizens",
        requestBody
      );
  
      console.log("Registration successful:", response.data);
      Alert.alert("Success", "Account created successfully!");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Registration failed:", error.response?.data?.message || error.message);
      Alert.alert("Error", `An error occurred: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        placeholderTextColor="#CEC6C6"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        placeholderTextColor="#CEC6C6"
        value={lastName}
        onChangeText={setLastName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#CEC6C6"
        value={email}
        onChangeText={setEmail}
      />  
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

      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        placeholderTextColor="#CEC6C6"
        value={mobileNumber}
        onChangeText={setMobileNumber}
        keyboardType="numeric"
      />


      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.backToLoginText}>Back to Login</Text>
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
    color: '#fff',
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
  backToLoginText: {
    marginTop: 40,
    fontSize: 16,
    color: '#fff',
    textDecorationLine: 'underline',
  },

});
