import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState} from 'react'
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from '@react-navigation/native';

const FooterMenu = () => {
    const navigation = useNavigation()
  return (
    <View style ={styles.container} >
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <FontAwesome5 name="home" style ={styles.iconStyle}/>
        <Text style = {styles.text}>Home</Text>
        </TouchableOpacity>
    {/* sesh */}
        <TouchableOpacity onPress={() => navigation.navigate('Sesh')}>
            <FontAwesome5 name="plus-square" style ={styles.iconStyle}/>
            <Text style = {styles.text}>Sesh</Text>
        </TouchableOpacity>
    {/* notes */}
    <TouchableOpacity onPress={() => navigation.navigate('Groups')}>
        <FontAwesome5 name="book-open" style ={styles.iconStyle}/>
        <Text style = {styles.text}>Groups</Text>
        </TouchableOpacity>
    {/* calendar */}
        <TouchableOpacity onPress={() => navigation.navigate('Comm')}>
        <Ionicons name='people-sharp' style={styles.iconStyle}></Ionicons>
        <Text style = {styles.text}>Communities</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <FontAwesome5 name="user-circle" style ={styles.iconStyle}/>
        <Text style = {styles.text}>profile</Text>
        </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({

    container:{
            flexDirection: 'row',
            margin: 8,
            justifyContent: 'space-between',
           // Add a background color if needed
            paddingVertical: 2, // Adjust padding for better touch area
            paddingHorizontal: 16,

    },
    iconStyle:{ 
        alignSelf: "center",
        fontSize: 20,
        color: '#23CAFF',
    }, 
    text:{
        color: '#23CAFF',
        fontSize: 12,
    }
});


export default FooterMenu;