import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import React, { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import FooterMenu from '../components/Menus/FooterMenu';
import { PostContext } from '../context/postContext';

const Groups = () => {
  // Global state
  const [state] = useContext(AuthContext);
  const [posts] = useContext(PostContext);

  return (
    <SafeAreaView style={styles.safearea}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.text}>{JSON.stringify(posts, null, 4)}</Text>
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
    justifyContent: 'space-between',
    marginTop: 80,
    marginLeft: 10,
  },
  text: {
    color: 'white',
    paddingRight: 10,
  },
});

export default Groups;
