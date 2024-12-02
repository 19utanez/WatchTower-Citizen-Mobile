// app/screens/NotificationScreen.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVER_URL } from '@env'; // Import the environment variable
import ReportCard from '../components/ReportCard';

export default function NotificationScreen() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const loggedInUser = await AsyncStorage.getItem('loggedInUser');
        if (loggedInUser) {
          const { username } = JSON.parse(loggedInUser);
          const response = await fetch(`http://192.168.1.6:5000/api/auth/citizens`);
          if (!response.ok) {
            throw new Error('Failed to fetch citizen data');
          }
          const data = await response.json();
          const loggedInCitizen = data.find(citizen => citizen.username === username);
          if (loggedInCitizen && loggedInCitizen.reports.length > 0) {
            const reportPromises = loggedInCitizen.reports.map(id =>
              fetch(`http://192.168.1.6:5000/api/reports/${id}`).then(response => response.json())
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
                status={report.disasterStatus}
                rescuedBy={report.rescuedBy}
              />
              {report.disasterImages && report.disasterImages.length > 0 && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.imageContainer}
                >
                  {report.disasterImages.map((imageId) => (
                    <Image
                      key={imageId}
                      source={{
                        uri: `http://192.168.1.6:5000/api/reports/image/${imageId}`,
                      }}
                      style={styles.image}
                    />
                  ))}
                </ScrollView>
              )}
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.noReportsText}>No reports available.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
  imageContainer: {
    marginTop: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginRight: 10,
  },
  noReportsText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
});
