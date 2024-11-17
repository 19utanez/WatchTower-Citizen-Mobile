import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet'; // Import the bottom sheet library
import { MaterialCommunityIcons } from 'react-native-vector-icons';

const BottomDrawer = ({ navigation }) => {
  const bottomSheetRef = useRef(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Handle opening and closing the drawer
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
    if (drawerOpen) {
      bottomSheetRef.current.close();
    } else {
      bottomSheetRef.current.expand();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleDrawer} style={styles.button}>
        <MaterialCommunityIcons name="chevron-up" size={30} color="#000" />
      </TouchableOpacity>

      {/* BottomSheet component */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}  // Initially closed
        snapPoints={['25%', '50%', '90%']}  // Adjust the size of the bottom drawer
        enablePanDownToClose
        onClose={() => setDrawerOpen(false)}
      >
        <View style={styles.drawerContent}>
          <Text style={styles.drawerHeader}>Drawer Content</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Text style={styles.link}>Go to Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('OtherScreen')}>
            <Text style={styles.link}>Go to Other Screen</Text>
          </TouchableOpacity>
          {/* You can add more navigation links or content here */}
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end', // Align at the bottom of the screen
  },
  button: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    zIndex: 10,
  },
  drawerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  drawerHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  link: {
    fontSize: 16,
    color: '#007bff',
    marginVertical: 10,
  },
});

export default BottomDrawer;
