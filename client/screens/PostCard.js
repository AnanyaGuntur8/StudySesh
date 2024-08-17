import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, Linking, Modal } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { AuthContext } from '../context/authContext';
import { PostContext } from '../context/postContext';
import EditModal from '../components/EditModal';

const PostCard = ({ route }) => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); // State for Edit Modal visibility
  const [state] = useContext(AuthContext);
  const [posts, setPosts] = useContext(PostContext);
  const { token } = state;
  const navigation = useNavigation();

  // Destructure post and isMyGroup from route params
  const { post, isMyGroup } = route.params;

  // Check if post is not found
  useEffect(() => {
    if (!post) {
      Alert.alert("Error", "Post not found");
      navigation.goBack();
    }
  }, [post, navigation]);

  // Get the current post from context
  const currentPost = posts.find(p => p._id === post._id);
  const color = currentPost?.color || '#FFFFFF'; // Fallback color

  const handleNotesPress = () => {
    const driveLink = currentPost?.link;
    if (driveLink) {
      Linking.openURL(driveLink)
        .catch((err) => console.error("An error occurred while opening the link", err));
    } else {
      Alert.alert("No link provided");
    }
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleDeletePost = async (id) => {
    try {
      setLoading(true);
      const { data } = await axios.delete(`/post/delete-post/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLoading(false);
      navigation.navigate("Home");
      Alert.alert('Post deleted successfully');
      setPosts((prevPosts) => prevPosts.filter((p) => p._id !== id));
    } catch (error) {
      setLoading(false);
      alert(error.response ? error.response.data.message : error.message);
    }
  };

  if (!currentPost) return null; // Safeguard if post is still undefined for any reason

  return (
    <SafeAreaView style={[styles.safearea, { backgroundColor: color }]}>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.titleAndIcon}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Entypo name='chevron-with-circle-left' style={styles.iconStyle} />
            </TouchableOpacity>
            <Text style={styles.title}>{currentPost.title}</Text>
            {isMyGroup && (
              <TouchableOpacity onPress={toggleModal} style={styles.dotsContainer}>
                <Entypo name='dots-three-vertical' style={styles.iconStyle2} />
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.contentDescription}>Description</Text>
          <Text style={styles.description}>{currentPost.description}</Text>

          <View style={styles.usernameAndJoinContainer}>
            <TouchableOpacity>
              <Text style={styles.username}>@{post.postedBy?.username}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.joinGroup}>
              <Text style={styles.joinButtonText}>Join Group</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.contentDescription}>Introduction</Text>
          <Text style={styles.update}>{currentPost.update}</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.notes} onPress={handleNotesPress}>
              <Text style={styles.notesText}>Notes</Text>
              <Ionicons name='folder' style={styles.iconStyle}></Ionicons>
            </TouchableOpacity>
            <TouchableOpacity style={styles.notes}>
              <Text style={styles.notesText}>Community</Text>
              <Ionicons name='people-sharp' style={styles.iconStyle}></Ionicons>
            </TouchableOpacity>
          </View>

          <Modal
            transparent={true}
            visible={isModalVisible}
            animationType="none"
            onRequestClose={toggleModal}>
            <TouchableOpacity style={styles.modalOverlay} onPress={toggleModal}>
              <View style={styles.modalContent}>
                <TouchableOpacity onPress={() => {
                  toggleModal();
                  setIsEditModalVisible(true); // Show Edit Modal when Edit is selected
                }}>
                  <Text style={styles.modalText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  toggleModal();
                  Alert.alert(
                    "Confirm Deletion",
                    "Are you sure you want to delete this post?",
                    [
                      { text: "Cancel", style: "cancel" },
                      { text: "Delete", onPress: () => handleDeletePost(currentPost._id) },
                    ]
                  );
                }}>
                  <Text style={styles.modalText2}>Delete</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>

          {isMyGroup && isEditModalVisible && (
            <EditModal 
              visible={isEditModalVisible} 
              onClose={() => setIsEditModalVisible(false)} 
              post={currentPost} 
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    padding: 20,
  },
  titleAndIcon: {
    flexDirection: 'row',
    alignItems: 'center',  
    marginBottom: 50,
  },
  iconStyle: {
    fontSize: 40,
    marginRight: 10,
  },
  iconStyle2: {
    fontSize: 30,
    color: 'black',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    flexShrink: 1,
    maxWidth: '80%',
  },
  dotsContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 10,
  },
  usernameAndJoinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  description: {
    borderRadius: 30,
    fontSize: 16,
    paddingBottom: 10,
  },
  contentDescription: {
    fontSize: 16,
    fontWeight: 'bold',
    borderWidth: 2,
    borderRadius: 15,
    height: 40,
    width: 120,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginVertical: 10,
  },
  joinGroup: {
    fontSize: 16,
    height: 40,
    borderWidth: 1,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: 'black',
    borderRadius: 30,
    marginLeft: 10,
  },
  joinButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  update: {
    fontSize: 16,
    paddingBottom: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 2,
  },
  notes: {
    borderWidth: 2,
    borderRadius: 15,
    height: 150,
    width: 150,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginVertical: 10,
  },
  notesText: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderRadius: 50,
  },
  modalText: {
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 20,
    fontSize: 18,
    paddingVertical: 10,
    paddingHorizontal: 20,
    color: 'black',
    textAlign: 'left',
    width: '100%',
    marginBottom: 20,
  },
  modalText2: {
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 20,
    fontSize: 18,
    paddingVertical: 10,
    paddingHorizontal: 20,
    color: 'black',
    textAlign: 'left',
    width: '100%',
    marginTop: 10,
    marginBottom: 50,
  },
});

export default PostCard;
