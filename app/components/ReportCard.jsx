  import React, { useState, useEffect } from 'react';
  import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

  export default function ReportCard({ category, description, images, status, rescuedBy }) {
    const [imageUris, setImageUris] = useState([]);

    useEffect(() => {
      const fetchImages = () => {
        try {
          const imageUrls = images.map((imageId) => `http://172.20.23.3:5000/api/reports/image/${imageId}`);
          setImageUris(imageUrls);
        } catch (error) {
          console.error('Error fetching images:', error);
        }
      };

      if (images && images.length > 0) {
        fetchImages(); // Only fetch images if the images array is not empty
      }
    }, [images]);

    return (
      <View style={styles.card}>
        <Text style={styles.category}>{category}</Text>

        {/* Scrollable Image Container */}
        <ScrollView horizontal style={styles.imageContainer}>
          {imageUris.map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.image} />
          ))}
        </ScrollView>

        <Text style={styles.description}>{description}</Text>

        <View style={styles.statusContainer}>
          <Text style={styles.status}>Status: {status}</Text>
          {rescuedBy && <Text style={styles.rescuedBy}>Rescued By: {rescuedBy}</Text>}
        </View>
      </View>
    );
  }

  const styles = StyleSheet.create({
    card: {
      backgroundColor: '#1E2A38',
      borderRadius: 10,
      marginVertical: 10,
      padding: 15,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
    category: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#B0C4DE',
      marginBottom: 10,
      textAlign: 'center',
    },
    imageContainer: {
      flexDirection: 'row',
      marginBottom: 10,
    },
    image: {
      width: 150,
      height: 150,
      borderRadius: 8,
      marginRight: 10,
    },
    description: {
      fontSize: 14,
      color: '#fff',
      marginBottom: 10,
    },
    statusContainer: {
      flexDirection: 'column', // Changed to column layout
      alignItems: 'flex-start', // Aligns content to the start
      marginTop: 10,
    },
    status: {
      fontSize: 14,
      color: '#FF6347',
      marginBottom: 5, // Adds spacing below the status text
    },
    rescuedBy: {
      fontSize: 14,
      color: '#90EE90',
    },
  });
