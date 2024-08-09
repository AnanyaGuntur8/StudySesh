import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import FooterMenu from '../components/Menus/FooterMenu';

const Sesh = () => {
  return (
    <SafeAreaView style={styles.safearea}>
      <View style={styles.container}>
        {/* <Text style={styles.header}>Sesh</Text> */}
        <TextInput 
          style={[styles.input, 
            styles.textInput, 
          {height:50}]}  
          placeholder="Title:" 
          placeholderTextColor="white" 
          />
        <TextInput
          style={[styles.input, 
            styles.textInput, 
            { height: 100 }]}
          placeholder="Description:"
          placeholderTextColor="white"
          multiline={true}
        />
        <TextInput
          style={
            [styles.input,
            styles.textInput, 
            { height: 150 }]}
          placeholder="Update:"
          placeholderTextColor="white"
          multiline={true}
        />
        <Text style={styles.colorLabel}>Color:</Text>
        <View style={styles.colorOptions}>
          <TouchableOpacity style={[styles.colorOption, { backgroundColor: '#00FFFF' }]} />
          <TouchableOpacity style={[styles.colorOption, { backgroundColor: '#FF69B4' }]} />
          <TouchableOpacity style={[styles.colorOption, { backgroundColor: '#FFFF00' }]} />
          <TouchableOpacity style={[styles.colorOption, { backgroundColor: '#32CD32' }]} />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Preview</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Make Sesh</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FooterMenu />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: '#050315',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    // borderColor: '#23CAFF',
    borderRadius: 15,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#1A1637',
  },
  textInput: {
    color: '#FFFFFF',
  }, 

  colorLabel: {
    fontSize: 16,
    marginBottom: 10,
    color: "white"
  },
  colorOptions: {
    flexDirection: 'row',
    marginBottom: 20,
    marginleft:20,
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 5,
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  button: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
  },
});

export default Sesh;
