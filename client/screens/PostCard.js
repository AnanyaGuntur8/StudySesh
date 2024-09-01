import React, { useState, useContext, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, Linking, Modal } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../context/authContext';
import { PostContext } from '../context/postContext';
import EditModal from '../components/EditModal';
import axios from 'axios';

const PostCard = ({ route }) => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [color, setColor] = useState('#FFFFFF');
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentPost, setCurrentPost] = useState(route.params.post);

  const [posts, setPosts, followPost, unfollowPost] = useContext(PostContext);
  const [state] = useContext(AuthContext);
  const { token, user } = state;
  const navigation = useNavigation();
  const { isMyGroup } = route.params;

  // Check if the post exists
  useEffect(() => {
    if (!currentPost) {
      // Alert.alert("Error", "Post not found");
      navigation.goBack();
    }
  }, [currentPost, navigation]);

  // Update post on focus and posts change
  const updatePost = useCallback(() => {
    if (currentPost) {
      const updatedPost = posts.find(p => p._id === currentPost._id);
      if (updatedPost) {
        setCurrentPost(updatedPost);
        setColor(updatedPost.color || '#FFFFFF');
        const followedBy = updatedPost.followedBy || [];
        const userIdStr = user?._id?.toString();
        setIsFollowing(followedBy.some(id => id.toString() === userIdStr));
      }
    }
  }, [currentPost, posts, user?._id]);

  useFocusEffect(updatePost);

  useEffect(() => {
    updatePost();
  }, [posts, currentPost, user?._id, updatePost]);

  // Function to handle notes press
  const handleNotesPress = () => {
    const isMaker = currentPost?.postedBy?.username === user?.username;
    if (isMaker || isFollowing) {
      const driveLink = currentPost?.link;
      if (driveLink) {
        Linking.openURL(driveLink)
          .catch((err) => console.error("An error occurred while opening the link", err));
      } else {
        Alert.alert("No link provided");
      }
    } else {
      Alert.alert("Join the session to access the notes");
    }
  };

  // Function to handle community press
  const handleCommunityPress = () => {
    const isMaker = currentPost?.postedBy?.username === user?.username;
    if (isMaker || isFollowing) {
      navigation.navigate("Community", { post: currentPost, color });
    } else {
      Alert.alert("Join the session to access the community");
    }
  };

  // Function to toggle modal visibility
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  // Function to delete post
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
      setPosts(prevPosts => prevPosts.filter(p => p._id !== id));
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', error.response ? error.response.data.message : error.message);
    }
  };

  // Function to follow post
  const handleFollowPost = async () => {
    if (!user?.username) {
      Alert.alert("Error", "Username is required");
      return;
    }
    
    try {
      await followPost(currentPost._id);
      setIsFollowing(true); // Update state to indicate the post is followed
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // Function to unfollow post
  const handleUnfollowPost = async () => {
    if (!user?.username) {
      Alert.alert("Error", "Username is required");
      return;
    }

    try {
      await unfollowPost(currentPost._id);
      setIsFollowing(false); // Update state to indicate the post is unfollowed
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // Callback function to update post details after editing
  const handlePostUpdate = (updatedPost) => {
    setCurrentPost(updatedPost);
    setPosts(posts.map(p => p._id === updatedPost._id ? updatedPost : p));
  };

  return (
    <SafeAreaView style={[styles.safearea, { backgroundColor: color }]}>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.titleAndIcon}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Entypo name='chevron-with-circle-left' style={styles.iconStyle} />
            </TouchableOpacity>
            <Text style={styles.title}>{currentPost?.title}</Text>
            {isMyGroup && (
              <TouchableOpacity onPress={toggleModal} style={styles.iconContainer}>
                <Entypo name='dots-three-vertical' style={styles.iconStyle2} />
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.contentDescription}>Description</Text>
          <Text style={styles.description}>{currentPost?.description}</Text>

          <View style={styles.usernameAndJoinContainer}>
            <TouchableOpacity>
              <Text style={styles.username}>@{currentPost.postedBy?.username}</Text>
            </TouchableOpacity>
            {currentPost?.postedBy?._id !== user?._id && !isMyGroup && (
              <TouchableOpacity 
                style={styles.joinGroup}
                onPress={isFollowing ? handleUnfollowPost : handleFollowPost}
              >
                <Text style={styles.joinButtonText}>
                  {isFollowing ? 'Unjoin Sesh' : 'Join Sesh'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.contentDescription}>Introduction</Text>
          <Text style={styles.update}>{currentPost?.update}</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.notes} onPress={handleNotesPress}>
              <Text style={styles.notesText}>Notes</Text>
              <Ionicons name='folder' style={styles.iconStyle}></Ionicons>
            </TouchableOpacity>
            <TouchableOpacity style={styles.notes} onPress={handleCommunityPress}>
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
                  setIsEditModalVisible(true);
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
              onPostUpdate={handlePostUpdate} // Pass the update function to the EditModal
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
    position: 'relative', // Allow child elements to be positioned absolutely
  },
  iconStyle: {
    fontSize: 30,
    color: 'black',
    marginRight: 10,
  },
  iconStyle2: {
    fontSize: 30,
    color: 'black',
  },
  iconContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingLeft: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flexShrink: 1, // Allow title to shrink and wrap
  },
  contentDescription: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 30,
  },
  usernameAndJoinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  joinGroup: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'black',
    borderRadius: 30,
    marginLeft: 'auto',
  },
  joinButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  update: {
    fontSize: 16,
    marginBottom: 30,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  notesText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalText: {
    fontSize: 18,
    paddingVertical: 10,
  },
  modalText2: {
    fontSize: 18,
    paddingVertical: 10,
    color: 'red',
  },
});

export default PostCard;
