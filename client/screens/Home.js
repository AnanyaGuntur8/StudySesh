import { View, Text, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/authContext';
import FooterMenu from '../components/Menus/FooterMenu';

const Home = () => {
  // global state
  const [state] = useContext(AuthContext);
  


  return (
    <SafeAreaView style={styles.safearea}>
      <View style={styles.container}>
        {/* <View style={styles.searchContainer}> */}
          
        {/* </View> */}
        <Text style={styles.text}>{JSON.stringify(state, null, 4)}</Text>
        <FooterMenu />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safearea: {
    flex: 1, // Ensure it fills the screen
    backgroundColor: '#050315', // Background color for the SafeAreaView
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    marginTop: 80,
    marginLeft: 10,
    
  },
  text: {
    color: 'white',
    paddingRight:10,
  },
  searchContainer:{
    justifyContent: 'flex-start'
  },
  searchBar: {
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#23CAFF',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    color: 'white',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    paddingRight: 10,
  },
});

export default Home;
