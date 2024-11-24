import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';

export default function ProfileScreen({ navigation }) {
    const [citizen, setCitizen] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch citizen data
    const fetchCitizenData = async () => {
        try {
            const loggedInUser = await AsyncStorage.getItem('loggedInUser');
            const { username } = loggedInUser ? JSON.parse(loggedInUser) : {};
            if (username) {
                const response = await fetch('http://192.168.100.13:5000/api/auth/citizens');
                const data = await response.json();
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

    // Handle image picker
    const handleImagePicker = () => {
        launchImageLibrary({ mediaType: 'photo', quality: 1 }, async (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorMessage) {
                console.error('ImagePicker Error:', response.errorMessage);
            } else {
                const newImageUri = response.assets[0].uri;
                const base64Image = await uriToBase64(newImageUri);
                const loggedInUser = await AsyncStorage.getItem('loggedInUser');
                const { username } = loggedInUser ? JSON.parse(loggedInUser) : {};

                if (username) {
                    const updateResponse = await fetch('http://192.168.100.13:5000/api/auth/updateProfileImage', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ username, profileImage: base64Image }),
                    });

                    if (updateResponse.ok) {
                        const updatedCitizen = await updateResponse.json();
                        setCitizen(updatedCitizen); // Update local state with new profile image
                        Alert.alert('Success', 'Profile image updated successfully');
                    } else {
                        Alert.alert('Error', 'Failed to update profile image');
                    }
                }
            }
        });
    };

    // Convert image URI to base64
    const uriToBase64 = (uri) => {
        return new Promise((resolve, reject) => {
            fetch(uri)
                .then(response => response.blob())
                .then(blob => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result.split(',')[1]);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                })
                .catch(reject);
        });
    };

    // Function to show details in an alert
    const showDetails = () => {
        if (citizen) {
            Alert.alert(
                'Details',
                `Name: ${citizen.firstName} ${citizen.lastName}\nUsername: ${citizen.username}\nEmail: ${citizen.email}\nMobile: ${citizen.mobileNumber}\nAddress: ${citizen.address}`
            );
        } else {
            Alert.alert('Error', 'No details available to show.');
        }
    };

    // Function to handle logout
    const handleLogout = () => {
        AsyncStorage.clear(); // Clear AsyncStorage on logout
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
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
            <Text style={styles.profileText}>Profile</Text>

            <View style={styles.profileImageContainer}>
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
                <TouchableOpacity style={styles.editButton} onPress={handleImagePicker}>
                    <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.nameText}>
                {citizen ? `${citizen.firstName} ${citizen.lastName}` : 'Name not available'}
            </Text>

            <TouchableOpacity style={styles.button} onPress={showDetails}>
                <Text style={styles.buttonText}>Show Details</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('EditProfileForm', { citizen })}
            >
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
    profileImageContainer: {
        position: 'relative',
        marginBottom: 20,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    placeholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#D9D9D9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: '#FFF',
    },
    editButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#0891b2',
        borderRadius: 50,
        padding: 10,
    },
    editButtonText: {
        color: '#fff',
        fontWeight: 'bold',
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
