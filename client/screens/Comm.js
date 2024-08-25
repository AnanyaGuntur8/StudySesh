import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { AuthContext } from '../context/authContext';
import FooterMenu from '../components/Menus/FooterMenu';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { PostContext } from '../context/postContext';

const Comm = () => {
  const [posts, setPosts] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('groups');
  const [state] = useContext(AuthContext);
  const [, , followPost, unfollowPost] = useContext(PostContext);
  const { token, user } = state;
  const navigation = useNavigation();

  const getUserPosts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/post/get-user-posts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(data?.allPosts || []);
      setMyPosts(data?.userPosts || []);
    } catch (error) {
      console.error('Failed to load posts:', error);
      Alert.alert('Error', 'Failed to load posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getFollowedPosts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/post/posts-followed-by-user?username=${user.username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const filteredPosts = data?.posts.filter(post =>
        user.followedPosts.includes(post._id)
      ) || [];
      setPosts(filteredPosts);
    } catch (error) {
      console.error('Failed to load followed posts:', error);
      Alert.alert('Error', 'Failed to load followed posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'groups') {
      getFollowedPosts();
    } else {
      getUserPosts();
    }
  }, [activeTab, user.followedPosts]);

  // Group items into rows of two
  const groupItems = (items) => {
    const grouped = [];
    for (let i = 0; i < items.length; i += 2) {
      grouped.push(items.slice(i, i + 2));
    }
    return grouped;
  };

  // following post action
  const handleFollowPost = async (postId) => {
    try {
      await followPost(postId);
      Alert.alert('Success', 'Post followed successfully.');
    } catch (error) {
      console.error('Failed to follow post:', error);
      Alert.alert('Error', 'Failed to follow post. Please try again later.');
    }
  };

  // Handle unfollowing action
  const handleUnfollowPost = async (postId) => {
    try {
      await unfollowPost(postId);
      // Remove the unfollowed post from the posts state
      setPosts(posts.filter(post => post._id !== postId));
      Alert.alert('Success', 'Post unfollowed successfully.');
    } catch (error) {
      console.error('Failed to unfollow post:', error);
      Alert.alert('Error', 'Failed to unfollow post. Please try again later.');
    }
  };

  // filtering posts for display
  const displayPosts = activeTab === 'groups' ? posts : myPosts;
  const groupedPosts = groupItems(displayPosts);

  return (
    <SafeAreaView style={styles.safearea}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          {loading ? (
            <ActivityIndicator size="large" color="#FFFFFF" />
          ) : groupedPosts.length > 0 ? (
            groupedPosts.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.row}>
                {row.map((post) => (
                  <TouchableOpacity
                    key={post._id}
                    style={[styles.postButton, { backgroundColor: post.color || '#00CFFF' }]}
                    onPress={() => {
                      navigation.navigate('Community', { post }); // Navigate to chat screen
                    }}
                  >
                    <Text style={styles.postText}>{post.title}</Text>
                    <Text style={styles.username}>@{post.postedBy?.username}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))
          ) : (
            <Text style={styles.noPostsText}>No posts available</Text>
          )}
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
  scrollView: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    marginTop: 10,
    marginLeft: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  postButton: {
    padding: 10,
    height: 150,
    width: '48%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderRadius: 10,
  },
  postText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  username: {
    color: 'black',
    fontSize: 15,
    textAlign: 'center',
  },
  noPostsText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 18,
    marginTop: 20,
  },
});

export default Comm;
