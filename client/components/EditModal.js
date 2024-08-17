import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { AuthContext } from '../context/authContext';
import { PostContext } from '../context/postContext';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const EditModal = ({ visible, onClose, post }) => {
  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description);
  const [update, setUpdate] = useState(post.update);
  const [link, setLink] = useState(post.link);
  const [color, setColor] = useState(post.color);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [state] = useContext(AuthContext); 
  const { token } = state;
  const [posts, setPosts] = useContext(PostContext); 

  const handleUpdatePost = async () => {
    try {
      setLoading(true);

      if (!title || !description || !update) {
        alert("Please fill out all fields");
        setLoading(false);
        return;
      }

      const { data } = await axios.put(`/post/update-post/${post._id}`, {
        title,
        description,
        update,
        link,
        color,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

    //updating the posts 
      const updatedPosts = posts.map((p) =>
        p._id === post._id ? { ...p, ...data.post } : p
      );
      setPosts(updatedPosts);
      setLoading(false);
      alert('Post updated successfully');
      onClose();
    //   navigation.navigate("Home");
    } catch (error) {
      setLoading(false);
      alert(error.response?.data?.message || error.message);
    }
  };
//adding a mini version of sesh 
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView contentContainerStyle={styles.container}>
            <TextInput
              style={[styles.input, styles.textInput, { height: 40 }]}
              placeholder="Title:"
              placeholderTextColor="gray"
              value={title}
              onChangeText={(text) => setTitle(text)}
              maxLength={30}
            />
            <TextInput
              style={[styles.input, styles.textInput, { height: 80 }]}
              placeholder="Description:"
              placeholderTextColor="gray"
              multiline={true}
              value={description}
              onChangeText={(text) => setDescription(text)}
            />
            <TextInput
              style={[styles.input, styles.textInput, { height: 100 }]}
              placeholder="Introduction:"
              placeholderTextColor="gray"
              multiline={true}
              value={update}
              onChangeText={(text) => setUpdate(text)}
            />
            <TextInput
              style={[styles.input, styles.textInput, { height: 40 }]}
              placeholder="Link:"
              placeholderTextColor="gray"
              value={link}
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
              <TouchableOpacity style={[styles.button, { backgroundColor: color }]} onPress={handleUpdatePost} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? "Updating..." : "Update Post"}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#050315',
    width: '90%',
    borderRadius: 20,
    padding: 20,
  },
  container: {
    flexGrow: 1,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
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
  closeButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default EditModal;
