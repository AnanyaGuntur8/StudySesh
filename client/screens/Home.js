import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/authContext';
import { useNavigation } from '@react-navigation/native';
import FooterMenu from '../components/Menus/FooterMenu';
import { PostContext } from '../context/postContext';
import HeaderMenu from '../components/Menus/HeaderMenu';

const Home = () => {
  const [state] = useContext(AuthContext);
  const [posts] = useContext(PostContext);
  const navigation = useNavigation();
  const [searchItem, setSearchItem] = useState('');

  // using the filter posts. in the future add a filtering option that allows for posts to be filtered without search
  const filteredPosts = posts.filter(
    (post) =>
      //let the title be genrated in lower case and the input item to be lowercase so that the input can accurately manage it 
      post.title.toLowerCase().includes(searchItem.toLowerCase()) ||
      post.postedBy.username.toLowerCase().includes(searchItem.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safearea}>
      <HeaderMenu onSearch={setSearchItem} />
       {/* this will use the filtered posts  */}
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          {filteredPosts.map((post, index) => (
            <View key={index} style={styles.row}>
              {index % 2 === 0 && (
                //evaluating true or false, if 0 then allow for the post card to appear
                <>
                  <TouchableOpacity 
                    style={[styles.postButton, { backgroundColor: post.color || '#00CFFF' }]}  // If no color is selected, make blue the default color.
                    onPress={() => navigation.navigate('PostCard', { post })}
                  >
                    <Text style={styles.postText}>{post.title}</Text>
                    <Text style={styles.username}>@{post.postedBy?.username}</Text>
                  </TouchableOpacity>
                  {filteredPosts[index + 1] && (
                    <TouchableOpacity 
                      style={[styles.postButton, { backgroundColor: filteredPosts[index + 1].color || '#00CFFF' }]}  // Apply color
                      onPress={() => navigation.navigate('PostCard', { post: filteredPosts[index + 1] })}
                    >
                      <Text style={styles.postText}>{filteredPosts[index + 1].title}</Text>
                      <Text style={styles.username}>@{filteredPosts[index + 1].postedBy?.username}</Text>
                    </TouchableOpacity>
                  )}
                </>
                //latter is for the index+1, so that it appears as 2 by n
              )}
            </View>
          ))}
        </View>
      </ScrollView>
      <FooterMenu />
    </SafeAreaView>
  );
};
//styles sheet according to figma design
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
    marginTop: 20,
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
});

export default Home;
