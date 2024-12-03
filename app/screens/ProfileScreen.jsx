import React, { useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    Image, 
    ActivityIndicator, 
    Alert, 
    ScrollView 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { SERVER_URL } from '@env'; // Import the environment variable

export default function ProfileScreen({ navigation }) {
    const [citizen, setCitizen] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchCitizenData = async () => {
        try {
            const loggedInUser = await AsyncStorage.getItem('loggedInUser');
            if (loggedInUser) {
                const { username } = JSON.parse(loggedInUser);
                const response = await fetch(`http://192.168.1.11:5000/api/auth/citizens`);
                if (!response.ok) {
                    throw new Error('Failed to fetch citizen data');
                }
                const data = await response.json();
                const loggedInCitizen = data.find(citizen => citizen.username === username);
                if (loggedInCitizen) {
                    setCitizen(loggedInCitizen);
                } else {
                    console.error('Citizen not found in database');
                }
            } else {
                console.error('No logged-in user found');
            }
        } catch (error) {
            console.error('Error fetching citizen data:', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCitizenData();
    }, []);

    const handleImagePicker = () => {
        launchImageLibrary({ mediaType: 'photo', quality: 1 }, async (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorMessage) {
                console.error('ImagePicker Error:', response.errorMessage);
            } else if (response.assets && response.assets[0]) {
                const newImageUri = response.assets[0].uri;
                const base64Image = await uriToBase64(newImageUri);

                try {
                    const loggedInUser = await AsyncStorage.getItem('loggedInUser');
                    if (loggedInUser) {
                        const { username } = JSON.parse(loggedInUser);
                        const updateResponse = await fetch(
                            `${SERVER_URL}/api/auth/updateProfileImage`,
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ username, profileImage: base64Image }),
                            }
                        );

                        if (updateResponse.ok) {
                            const updatedCitizen = await updateResponse.json();
                            setCitizen(updatedCitizen);
                            Alert.alert('Success', 'Profile image updated successfully');
                        } else {
                            Alert.alert('Error', 'Failed to update profile image');
                        }
                    }
                } catch (error) {
                    console.error('Error updating profile image:', error.message);
                }
            }
        });
    };

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

    const handleLogout = () => {
        AsyncStorage.clear().then(() => {
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
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
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.profileText}>Profile</Text>

                <View style={styles.profileImageContainer}>
                    {citizen?.profileImage ? (
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
                        <Icon name="camera" size={30} color="#FFF" />
                        <Text style={styles.editButtonText}>Edit Photo</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.infoContainer}>
                    <View style={styles.infoHeader}>
                        <Text style={styles.infoTitle}>Personal Info</Text>
                        <TouchableOpacity style={styles.editInfoButton}>
                            <Icon name="create" size={20} color="#FFF" />
                            <Text style={styles.editButtonText}> Edit Info</Text>
                        </TouchableOpacity>
                    </View>

                    {renderInfoRow('person', 'First Name:', citizen?.firstName || 'N/A')}
                    {renderInfoRow('person', 'Last Name:', citizen?.lastName || 'N/A')}
                    {renderInfoRow('person-outline', 'Username:', citizen?.username || 'N/A')}
                    {renderInfoRow('mail', 'Email:', citizen?.email || 'N/A')}
                    {renderInfoRow('call', 'Mobile No:', citizen?.mobileNumber || 'N/A')}
                    {renderInfoRow('location', 'Address:', citizen?.address || 'N/A')}
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Change Password</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleLogout}>
                        <Text style={styles.buttonText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const renderInfoRow = (icon, label, value) => (
    <View style={styles.infoTextRow}>
        <View style={styles.iconLabelContainer}>
            <Icon name={icon} size={20} color="#FFF" />
            <Text style={styles.infoLabel}>{label}</Text>
        </View>
        <Text style={styles.infoText}>{value}</Text>
    </View>
);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#071025',
        paddingTop: 20,
    },
    profileText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#FFF',
    },
    profileImageContainer: {
        alignItems: 'center',
        marginBottom: 30,
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
        flexDirection: 'row', // Align items side by side
        alignItems: 'center', // Vertically center the items
        marginTop: 10,
        backgroundColor: '#0891b2',
        padding: 8,
        borderRadius: 20,
    },
    editButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        marginLeft: 8, // Adjust space between icon and text
    },
    infoContainer: {
        width: '90%',
        backgroundColor: '#1A202C',
        padding: 20,
        borderRadius: 10,
        marginBottom: 30,
    },
    infoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    infoTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    editInfoButton: {
        flexDirection: 'row', // Align items in a row (side by side)
        alignItems: 'center',  // Vertically center the items
        marginTop: 10,
        backgroundColor: '#0891b2',
        padding: 8,
        borderRadius: 20,
    },
    infoTextRow: {
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'center',
    },
    iconLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    infoLabel: {
        color: '#FFF',
        fontSize: 14,
        marginLeft: 10,
    },
    infoText: {
        color: '#FFF',
        textAlign: 'right',
        flex: 2,
    },
    buttonContainer: {
        width: '90%',
        marginTop: 20,
    },
    button: {
        backgroundColor: '#0891b2',
        padding: 12,
        marginBottom: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
});
