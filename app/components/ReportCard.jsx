// app/components/ReportCard.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

export default function ReportCard({ category, description, images, status, rescuedBy }) {
  const [imageUris, setImageUris] = useState([]);

  // Fetch images when the component is mounted
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const imageUrls = await Promise.all(
          images.map(async (imageId) => {
            const response = await fetch(`http://192.168.100.13:5000/api/image/${imageId}`);
            if (!response.ok) {
              throw new Error('Failed to fetch image');
            }
            const blob = await response.blob();
            return URL.createObjectURL(blob); // Convert blob to a URL
          })
        );
        setImageUris(imageUrls); // Set the URIs for the images
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    if (images.length > 0) {
      fetchImages(); // Only fetch images if the images array is not empty
    }
  }, [images]); // Dependency array ensures it re-fetches if images change

  return (
    <View style={styles.card}>
      {/* Category at the top */}
      <Text style={styles.category}>{category}</Text>

      {/* Images below the category */}
      <ScrollView horizontal style={styles.imageContainer}>
        {imageUris.map((uri, index) => (
          <Image key={index} source={{ uri }} style={styles.image} />
        ))}
      </ScrollView>

      {/* Description below the images */}
      <Text style={styles.description}>{description}</Text>

      {/* Status and Rescued By at the bottom */}
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
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },
  description: {
    fontSize: 14,
    color: '#B0C4DE',
    marginBottom: 10,
    textAlign: 'left',
  },
  statusContainer: {
    marginTop: 10,
  },
  status: {
    fontSize: 14,
    color: '#FFD700',
    marginBottom: 5,
  },
  rescuedBy: {
    fontSize: 14,
    color: '#32CD32',
  },
});
