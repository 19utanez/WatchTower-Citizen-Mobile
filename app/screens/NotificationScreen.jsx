import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
  Modal,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReportCard from '../components/ReportCard';

export default function NotificationScreen() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImages, setCurrentImages] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const loggedInUser = await AsyncStorage.getItem('loggedInUser');
        if (loggedInUser) {
          const { username } = JSON.parse(loggedInUser);

          // Fetch citizen data
          const response = await fetch(
            `https://watchtower-citizen-mobile.onrender.com/api/auth/citizens`
          );
          if (!response.ok) {
            throw new Error('Failed to fetch citizen data');
          }

          const citizens = await response.json();
          const loggedInCitizen = citizens.find(
            (citizen) => citizen.username === username
          );

          if (loggedInCitizen && loggedInCitizen.reports.length > 0) {
            const reportPromises = loggedInCitizen.reports.map((id) =>
              fetch(`https://watchtower-citizen-mobile.onrender.com/api/reports/${id}`).then(
                (res) => res.json()
              )
            );
            const reportsData = await Promise.all(reportPromises);
            setReports(reportsData);
          } else {
            console.error('No reports found for this citizen');
          }
        } else {
          console.error('No logged-in user found');
        }
      } catch (error) {
        console.error('Error fetching reports:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const openImageModal = (images, index) => {
    const imageUrls = images.map(
      (id) =>
        `https://watchtower-citizen-mobile.onrender.com/api/reports/image/${id}`
    );
    setCurrentImages(imageUrls);
    setCurrentImageIndex(index);
    setModalVisible(true);
  };

  const handleNextImage = () => {
    if (currentImageIndex < currentImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePreviousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
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
      <Text style={styles.title}>Notifications</Text>

      {reports.length > 0 ? (
        <ScrollView style={styles.reportsContainer}>
          <Text style={styles.reportsTitle}>Active Reports</Text>
          {reports.map((report, index) => (
            <View key={index} style={styles.reportCard}>
              <ReportCard
                category={report.disasterCategory}
                description={report.disasterInfo}
                images={report.disasterImages}
                status={report.disasterStatus}
                rescuedBy={report.rescuedBy}
                onImagePress={(images, imageIndex) => openImageModal(images, imageIndex)}
              />
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.noReportsText}>No reports available.</Text>
      )}

      <Modal visible={modalVisible} transparent>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.closeText}>X</Text>
          </TouchableOpacity>
          {currentImages[currentImageIndex] && (
            <Image
              source={{ uri: currentImages[currentImageIndex] }}
              style={styles.enlargedImage}
              onError={(error) => console.error('Error loading image:', error.nativeEvent.error)}
            />
          )}
          <View style={styles.modalNavigation}>
            <TouchableOpacity
              onPress={handlePreviousImage}
              disabled={currentImageIndex === 0}
              style={styles.navButton}
            >
              <Text style={styles.navText}>{'<'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleNextImage}
              disabled={currentImageIndex === currentImages.length - 1}
              style={styles.navButton}
            >
              <Text style={styles.navText}>{'>'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  // Styles remain unchanged
  container: {
    flex: 1,
    backgroundColor: '#071025',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  reportsContainer: {
    marginTop: 20,
    width: '90%',
    alignSelf: 'center',
  },
  reportsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  reportCard: {
    marginBottom: 20,
    backgroundColor: '#1A1F2A',
    padding: 10,
    borderRadius: 10,
  },
  noReportsText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  closeText: {
    fontSize: 24,
    color: '#fff',
  },
  enlargedImage: {
    width: '90%',
    height: '70%',
    borderRadius: 10,
  },
  modalNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 20,
  },
  navButton: {
    padding: 10,
  },
  navText: {
    fontSize: 24,
    color: '#fff',
  },
});
