// app/screens/ProfileScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function ProfileScreen({ navigation }) {
    // Function to handle logout
    const handleLogout = () => {
        // Navigate to the Login screen
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    return (
        <View style={styles.container}>
            {/* Profile Title */}
            <Text style={styles.profileText}>Profile</Text>

            {/* Large Photo Icon */}
            <FontAwesome name="user-circle" size={120}   color="#D9D9D9" style={styles.photoIcon} />

            {/* Name Text */}   
            <Text style={styles.nameText}>Gogeta SSJ4 GT</Text>

            {/* Buttons */}
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
    },
    photoIcon: {
        marginBottom: 20,
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
