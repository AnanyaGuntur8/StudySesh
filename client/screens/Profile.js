import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import React, { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import FooterMenu from '../components/Menus/FooterMenu';

const Profile = () => {
    const [state] = useContext(AuthContext);
    return (
      <SafeAreaView style={styles.safearea}>
        <View style={styles.container}>
          <Text style={styles.text}>Name: {state?.user.name}</Text>
          <Text style={styles.text}>Email: {state?.user.email}</Text>
          <Text style={styles.text}> Role: {state?.user.role}</Text>
          <FooterMenu />
        </View>
      </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    safearea: {
      flex: 1, // Ensure it fills the screen
      backgroundColor: '#050315', // Background color for the SafeAreaView
    },
    container: {
      flex: 1,
      justifyContent: 'space-between',
      marginTop: 80,
      marginLeft: 10,
    },
    text: {
        color: 'white',
    }
})
export default Profile