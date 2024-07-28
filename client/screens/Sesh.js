import { View, Text, StyleSheet, SafeAreaView} from 'react-native'
import React from 'react'
import FooterMenu from '../components/Menus/FooterMenu';

const Sesh = () => {
    return (
        <SafeAreaView style={styles.safearea}>
          <View style={styles.container}>
            <View style = {{flex:1, justifyContent: 'flex-end'}}>
                
            </View>
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
})
export default Sesh