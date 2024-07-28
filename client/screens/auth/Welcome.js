import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';

const Welcome = ({navigation}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.pageTitle}>@StudySesh</Text>
        
        {/* Buttons container */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={[styles.button, styles.rightButton]}
          onPress={() => navigation.navigate("Register")}>
            <Text style={styles.buttonText}
                onPress={() => navigation.navigate("Register")}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.leftButton]}
          onPress={() => navigation.navigate("Login")}>
            <Text style={styles.buttonText} 
                onPress={() => navigation.navigate("Login")} >Login</Text>
          </TouchableOpacity>
        </View>
        
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '050315',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
    backgroundColor: '050315',
  },
  pageTitle: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#23CAFF',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Align buttons at both ends of the container
    width: '100%', // Ensure buttons take full width of the parent
    marginTop: 20,
  },
  button: {
    backgroundColor: '#23CAFF',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '35%', // Adjust width as needed
    marginHorizontal: 25,
  },
  rightButton: {
    alignSelf: 'flex-end', // Align button to the right
  },
  leftButton: {
    alignSelf: 'flex-start', // Align button to the left
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Welcome;
