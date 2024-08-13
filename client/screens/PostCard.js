import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';

const PostCard = ({ route }) => {
  const { post } = route.params;  // receive post data from params
  const color = post.color; // no need for default color
  const navigation = useNavigation();

  return (
    <SafeAreaView style={[styles.safearea, { backgroundColor: color }]}>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.titleAndIcon}>
            <Entypo name='chevron-with-circle-left' style={styles.iconStyle} 
            onPress={() => navigation.goBack()} />
            <Text style={styles.title}>{post.title}</Text>
          </View>
          {/* since the margin isnt working, add empty spacer */}
          
          <Text style={styles.contentDescription}>Description</Text>
          <Text style={styles.description}>{post.description}</Text>
          
          {/* Putting in the user name and the Join Group button in the same row */}
          <View style={styles.usernameAndJoinContainer}>
            <TouchableOpacity>
              <Text style={styles.username}>@{post.postedBy?.username}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.joinGroup}>
              <Text style={styles.joinButtonText}>Join Group</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.content}>Update</Text>
          <Text style={styles.update}>{post.update}</Text>
          
          {/* Delivering the post details to the page and navigating it to home */}
          {/* Making the button, make an API for the notes */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity>
              <Text style={styles.notes}>Notes</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.notes}>Community</Text>
            </TouchableOpacity>
          </View>
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
    justifyContent: 'flex-start',
    marginBottom:50,
  },
  iconStyle: {
    fontSize: 40,
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    paddingLeft: 10,
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
  spacer: {
    height: 10, 
  },
  description: {
    borderRadius: 30,
    fontSize: 16,
    paddingBottom: 10,
    // marginTop: 5,
  },
  contentDescription: {
    fontSize: 16,
    fontWeight: 'bold',
    borderWidth: 2,
    borderRadius: 15,
    height: 40,
    width: 150,
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
  content: {
    fontSize: 16,
    fontWeight: 'bold',
    borderWidth: 2,
    borderRadius: 15,
    height: 40,
    width: 100,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginVertical: 10,
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
    fontSize: 16,
    borderWidth: 2,
    borderRadius: 15,
    height: 150,
    width: 150,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: 'bold',
  }
});

export default PostCard;
