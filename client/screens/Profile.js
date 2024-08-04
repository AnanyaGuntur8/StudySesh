import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { AuthContext } from '../context/authContext';
import FooterMenu from '../components/Menus/FooterMenu';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = () => {
    const [state, setState] = useContext(AuthContext);
    //log out function
    const handleLogout = async () =>  {
      setState({token:'', user: null})
      await AsyncStorage.removeItem('@auth')
      alert('Log Out Successfully')
    }
    return (
        <SafeAreaView style={styles.safearea}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.container}>
                    <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.profileImage} />
                    <Text style={styles.statsText}>Following</Text>
                    <Text style={styles.statsText}>Followers</Text>
                    <View style={styles.headerInfo}>
                        <Text style={styles.name}>{state?.user.name}</Text>
                        <Text style={styles.username}>{state?.user.username}</Text>
                        <Text style={styles.email}>{state?.user.email}</Text>
                    </View>
                    <TouchableOpacity style={styles.editButton}>
                        <Text style={styles.editText}>Edit</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.statsContainer}>
                    
                </View>
                <TouchableOpacity style={styles.optionButton}>
                    <Text style={styles.optionText}>Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionButton}>
                    <Text style={styles.optionText}>Privacy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionButton}>
                    <Text style={styles.optionText}>Activity Summary</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
                
            </ScrollView>
            <FooterMenu />
        </SafeAreaView>
    );
}

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
        marginTop: 80,
        marginLeft: 10,
    },
    text: {
        color: 'white',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
        flexDirection: 'row'
    },
    headerInfo: {
        marginBottom: 20,
    },
    name: {
        fontSize: 20,
        color: 'white',
    },
    username: {
        fontSize: 16,
        color: 'gray',
    },
    email: {
        fontSize: 14,
        color: 'gray',
    },
    editButton: {
        backgroundColor: '#23CAFF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 20,
    },
    editText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 20
    },
    statsText: {
        color: 'white',
        fontSize: 16,
    },
    optionButton: {
        backgroundColor: '#1A1637',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
    },
    optionText: {
        color: 'white',
        fontSize: 16,
    },
    logoutButton: {
        backgroundColor: '#ff6347',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 20,
    },
    logoutText: {
        color: 'white',
        fontSize: 16,
    },
});

export default Profile;