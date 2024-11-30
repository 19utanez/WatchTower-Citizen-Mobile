// app/components/ReportCard.jsx
import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

export default function ReportCard({ category, description, images, status, rescuedBy }) {
  return (
    <View style={styles.card}>
      {/* Category at the top */}
      <Text style={styles.category}>{category}</Text>

      {/* Images below the category */}
      <ScrollView horizontal style={styles.imageContainer}>
        {images.map((image, index) => (
          <Image key={index} source={{ uri: image }} style={styles.image} />
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
