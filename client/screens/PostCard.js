import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React from 'react';

const PostCard = ({ route }) => {
  const { post } = route.params;  // will help you access the data points of the post

//using the data recieved by the post in the return
  return (
    <View style={styles.container}>
      <ScrollView>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.username}>@{post.postedBy?.username}</Text>
      <Text style={styles.content}>{post.description}</Text>
      <Text style={styles.content}>{post.update}</Text>
      
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    paddingTop:50,
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    fontSize: 18,
    marginTop: 10,
  },
  username: {
    fontSize: 16,
    marginTop: 20,
    fontStyle: 'italic',
  },
});

export default PostCard;