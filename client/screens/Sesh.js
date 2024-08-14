import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import FooterMenu from '../components/Menus/FooterMenu';
import { AuthContext } from '../context/authContext';
import axios from 'axios';

const Sesh = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [update, setUpdate] = useState("");
  const [link, setLink] = useState("");
  const [color, setColor] = useState('#23CAFF'); // Default color
  const [loading, setLoading] = useState(false);

  // Accessing the AuthContext
  const [state] = useContext(AuthContext); 
  const { token } = state; 

  const handlePost = async () => {
    try {
      setLoading(true);

      if (!title || !description || !update) {
        Alert.alert("Validation Error", "Please fill out all fields");
        setLoading(false);  // Ensure to stop loading state when validation fails
        return;
      }

      // Send POST request
      const { data } = await axios.post("/post/create-post", {
        title,
        description,
        update,
        link,
        color,  // Send the selected color
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLoading(false);

      Alert.alert("Post Created", `Title: ${title}\nDescription: ${description}\nUpdate: ${update}\nLink: ${link}`);
      navigation.navigate("Home");
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", error.response?.data?.message || error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safearea}>
      <ScrollView contentContainerStyle={styles.container}>
        <TextInput
          style={[styles.input, styles.textInput, { height: 50 }]}
          placeholder="Title:"
          placeholderTextColor="white"
          value={title}
          onChangeText={(text) => setTitle(text)}
        />
        <TextInput
          style={[styles.input, styles.textInput, { height: 100 }]}
          placeholder="Description:"
          placeholderTextColor="white"
          multiline={true}
          value={description}
          onChangeText={(text) => setDescription(text)}
        />
        <TextInput
          style={[styles.input, styles.textInput, { height: 150 }]}
          placeholder="Update:"
          placeholderTextColor="white"
          multiline={true}
          value={update}
          onChangeText={(text) => setUpdate(text)}
        />
        <TextInput
          style={[styles.input, styles.textInput, { height: 50 }]}
          placeholder="Link:"
          placeholderTextColor="white"
          multiline={false}
          value={link}  // Corrected value prop to be link instead of update
          onChangeText={(text) => setLink(text)}
        />
        <Text style={styles.colorLabel}>Color:</Text>
        <View style={styles.colorOptions}>
          <TouchableOpacity
            style={[styles.colorOption, { backgroundColor: '#23CAFF' }, color === '#23CAFF' && styles.selectedColor]}
            onPress={() => setColor('#23CAFF')}
          />
          <TouchableOpacity
            style={[styles.colorOption, { backgroundColor: '#FF69B4' }, color === '#FF69B4' && styles.selectedColor]}
            onPress={() => setColor('#FF69B4')}
          />
          <TouchableOpacity
            style={[styles.colorOption, { backgroundColor: '#FFFF00' }, color === '#FFFF00' && styles.selectedColor]}
            onPress={() => setColor('#FFFF00')}
          />
          <TouchableOpacity
            style={[styles.colorOption, { backgroundColor: '#32CD32' }, color === '#32CD32' && styles.selectedColor]}
            onPress={() => setColor('#32CD32')}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, { backgroundColor: color }]} onPress={handlePost} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? "Posting..." : "Make Sesh"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    flexGrow: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
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
    color: "white",
  },
  colorOptions: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 5,
    marginRight: 10,
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  button: {
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
