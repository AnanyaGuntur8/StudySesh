import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import React, { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import FooterMenu from '../components/Menus/FooterMenu';
import { PostContext } from '../context/postContext';

const Home = () => {
  // Global state
  const [state] = useContext(AuthContext);
  const [posts] = useContext(PostContext);

  return (
    <SafeAreaView style={styles.safearea}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          {posts.map((post, index) => (
            <View key={index} style={styles.row}>
              {index % 2 === 0 && (
                <>
                  <TouchableOpacity style={styles.postButton}>
                    <Text style={styles.postText}>{post.title}</Text>
                    <Text style={styles.username}>@{post.postedBy?.username}</Text>
                  </TouchableOpacity>
                  {posts[index + 1] && (
                    <TouchableOpacity style={styles.postButton}>
                      <Text style={styles.postText}>{posts[index + 1].title}</Text>
                      <Text style={styles.username}>@{post.postedBy?.username}</Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>
          ))}
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
    marginTop: 80,
    marginLeft: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  postButton: {
    backgroundColor: '#00CFFF',
    padding: 10,
    height: 140, 
    width: '48%', 
    justifyContent: 'center',
    alignItems: 'left',
    borderRadius: 10,
  },
  postText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  username: {
    color: 'black',
    fontSize: 15,
    textAlign: 'center',
  },
});

export default Home;
