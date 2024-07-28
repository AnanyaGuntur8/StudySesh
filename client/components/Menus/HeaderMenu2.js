import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView} from 'react-native';
import React,{useContext} from 'react';
import { AuthContext } from '../../context/authContext';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const HeaderMenu2 = ({ title }) => {
    return (
        <SafeAreaView style = {styles.safearea}>
        <View style={styles.container}>
        
            <Text style = {styles.title2}>{title}</Text>
          
        </View>
        </SafeAreaView>
      )
    };
    const styles = StyleSheet.create({
        safearea: {
            backgroundColor: '#050315', 
        },
      container: {
        marginTop: 20,
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: 10, 
      },
      title1: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
      },
      title2: {
        fontSize: 30,
        color: '#23CAFF',
        fontWeight: 'bold',
        paddingLeft:10,
      },
      iconStyle: { 
        fontSize: 25,
        color: '#23CAFF',
        marginRight:15,
        paddingLeft: 120,
      },
      anothericon:{
        fontSize: 25,
        color: '#23CAFF',
        marginRight:15,
        paddingLeft: 10,
      }
    });

export default HeaderMenu2;