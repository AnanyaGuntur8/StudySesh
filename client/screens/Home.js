import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import React, { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import FooterMenu from '../components/Menus/FooterMenu';

const Home = () => {
  // global state
  const [state] = useContext(AuthContext);

  return (
    <SafeAreaView style={styles.safearea}>
      <View style={styles.container}>
        <Text style={styles.text}>{JSON.stringify(state, null, 4)}</Text>
        <FooterMenu />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safearea: {
    flex: 1, 
    backgroundColor: '#050315', 
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    marginTop: 80,
    marginLeft: 10,
  },
  text: {
    color: 'white',
    paddingRight:10,
  },
});

export default Home;
