import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { AuthContext } from '../context/authContext';
import FooterMenu from '../components/Menus/FooterMenu';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const Groups = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [state] = useContext(AuthContext);
  const { token } = state;
  const navigation = useNavigation();

  const getUserPosts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/post/get-user-posts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(data?.userPosts || []);
    } catch (error) {
      console.error('Failed to load posts:', error);
      Alert.alert('Error', 'Failed to load posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserPosts();
  }, []);

  return (
    <SafeAreaView style={styles.safearea}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          {loading ? (
            <ActivityIndicator size="large" color="#FFFFFF" />
          ) : (
            posts.length > 0 ? (
              posts.map((post, index) => (
                <View key={post._id} style={styles.row}>
                  {index % 2 === 0 && (
                    <>
                      <TouchableOpacity
                        style={[styles.postButton, { backgroundColor: post.color || '#00CFFF' }]}  // Default color if none provided
                        onPress={() => {
                          // Navigate to PostCard with the current post
                          navigation.navigate('PostCard', { post });
                        }}
                      >
                        <Text style={styles.postText}>{post.title}</Text>
                        {/* Optionally display username */}
                        <Text style={styles.username}>@{post.postedBy?.username || 'Unknown User'}</Text>
                      </TouchableOpacity>
                      {posts[index + 1] && (
                        <TouchableOpacity
                          style={[styles.postButton, { backgroundColor: posts[index + 1].color || '#00CFFF' }]}
                          onPress={() => {
                            // Navigate to PostCard with the next post
                            navigation.navigate('PostCard', { post: posts[index + 1] });
                          }}
                        >
                          <Text style={styles.postText}>{posts[index + 1].title}</Text>
                          {/* Optionally display username */}
                          <Text style={styles.username}>@{posts[index + 1].postedBy?.username || 'Unknown User'}</Text>
                        </TouchableOpacity>
                      )}
                    </>
                  )}
                </View>
              ))
            ) : (
              <Text style={styles.noPostsText}>No posts available</Text>
            )
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 50,
    marginLeft: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  postButton: {
    padding: 10,
    height: 150,
    width: '48%',
    justifyContent: 'top',
    alignItems: 'left',
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

export default Groups;
