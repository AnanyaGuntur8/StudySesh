import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { AuthContext } from '../context/authContext';
import FooterMenu from '../components/Menus/FooterMenu';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const Groups = () => {
  const [posts, setPosts] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('groups');
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
      setPosts(data?.allPosts || []); 
      setMyPosts(data?.userPosts || []);
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

  // Group items in a 2xN layout
  const groupItems = (items) => {
    const grouped = [];
    for (let i = 0; i < items.length; i += 2) {
      grouped.push(items.slice(i, i + 2));
    }
    return grouped;
  };

  const displayPosts = activeTab === 'groups' ? posts : myPosts;
  const groupedPosts = groupItems(displayPosts);

  return (
    <SafeAreaView style={styles.safearea}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'groups' && styles.activeTab]}
          onPress={() => setActiveTab('groups')}
        >
          <Text style={styles.tabText}>Groups</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'myGroups' && styles.activeTab]}
          onPress={() => setActiveTab('myGroups')}
        >
          <Text style={styles.tabText}>My Groups</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          {loading ? (
            <ActivityIndicator size="large" color="#FFFFFF" />
          ) : (
            groupedPosts.length > 0 ? (
              groupedPosts.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                  {row.map((post) => (
                    <TouchableOpacity
                      key={post._id}
                      style={[styles.postButton, { backgroundColor: post.color || '#00CFFF' }]}  // Default color if none provided
                      onPress={() => {
                        navigation.navigate('PostCard', { post, isMyGroup: activeTab === 'myGroups' });
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
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 30,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#00CFFF',
  },
  tabText: {
    color: '#FFFFFF',
    fontSize: 18,
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
