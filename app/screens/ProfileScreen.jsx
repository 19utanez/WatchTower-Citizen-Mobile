import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen({ navigation }) {
    const [citizen, setCitizen] = useState(null);
    const [loading, setLoading] = useState(true);

    // Function to fetch citizen data based on the logged-in username
    const fetchCitizenData = async () => {
        try {
            // Get the username from AsyncStorage
            const loggedInUser = await AsyncStorage.getItem('loggedInUser');
            const { username } = loggedInUser ? JSON.parse(loggedInUser) : {};

            if (username) {
                // API call to fetch all citizens
                const response = await fetch('http://172.20.6.129:5000/api/auth/citizens');
                const data = await response.json();

                // Find the citizen matching the logged-in username
                const loggedInCitizen = data.find(citizen => citizen.username === username);

                if (loggedInCitizen) {
                    setCitizen(loggedInCitizen);
                } else {
                    console.error('Citizen not found');
                }
            } else {
                console.error('No username found in AsyncStorage');
            }
        } catch (error) {
            console.error('Error fetching citizen data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCitizenData();
    }, []);

    // Function to handle logout
    const handleLogout = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    // Function to display fetched data in an alert
    const showCitizenDetails = () => {
        if (citizen) {
            const { _id, firstName, lastName, username, email, mobileNumber, address } = citizen;
            const details = `
                ID: ${_id}
                Name: ${firstName} ${lastName}
                Username: ${username}
                Email: ${email}
                Mobile: ${mobileNumber}
                Address: ${address}
            `;
            Alert.alert('Citizen Details', details.trim());
        } else {
            Alert.alert('Error', 'No citizen data available.');
        }
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
            {/* Profile Title */}
            <Text style={styles.profileText}>Profile</Text>

            {/* Profile Image */}
            {citizen && citizen.profileImage ? (
                <Image
                    source={{ uri: citizen.profileImage }}
                    style={styles.profileImage}
                    resizeMode="cover"
                />
            ) : (
                <View style={styles.placeholder}>
                    <Text style={styles.placeholderText}>No Image</Text>
                </View>
            )}

            {/* Name Text */}
            <Text style={styles.nameText}>
                {citizen ? `${citizen.firstName} ${citizen.lastName}` : 'Name not available'}
            </Text>

            {/* Buttons */}
            <TouchableOpacity style={styles.button} onPress={showCitizenDetails}>
                <Text style={styles.buttonText}>Show Details</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Change Password</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Notification Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 50,
        backgroundColor: '#071025',
    },
    profileText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#FFF',
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 20,
    },
    placeholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#D9D9D9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    placeholderText: {
        color: '#FFF',
    },
    nameText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFF',
        marginBottom: 30,
    },
    button: {
        width: '90%',
        backgroundColor: '#0891b2',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
