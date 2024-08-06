import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { AuthContext } from '../context/authContext';
import FooterMenu from '../components/Menus/FooterMenu';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';


function Profile() {
    const [state, setState] = useContext(AuthContext);
    //make the constant set to either the user profile or set it to a blank image.
    // const [profileImage, setProfileImage] = useState(state.user.profileImage || 'https://via.placeholder.com/100');
    //log out function
    const [profileImage, setProfileImage] = useState(state.user.profileImage || 'https://via.placeholder.com/100');
    const handleLogout = async () => {
        setState({ token: '', user: null });
        await AsyncStorage.removeItem('@auth');
        alert('Log Out Successfully');
    };
    //make the const choose photo functiont that accessthe image from the image profile picker 
    // const handleImageChooser = () => {
    //     launchImageLibrary({noData: true }, (response) =>{
    //         if(response.assets){
    //             setProfileImage(response.assets[0].uri);
    //             setState((prevState)=>({
    //                 ...prevState, //copy the state of the user 
    //                 user:{
    //                     ...prevState.user, //copy the user object of the prev state
    //                     profileImage: response.assets[0].uri //update the profile image of the user
    //                 },
    //             }));
    //         }
    //     });
    // };
    return (
        <SafeAreaView style={styles.safearea}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.container}>
                    <View style={styles.profileContainer}>
                    <TouchableOpacity>
                        <Image source={{ uri: profileImage }} style={styles.profileImage} />
                    </TouchableOpacity>
                        <View style={styles.headerInfo}>
                            <Text style={styles.name}>{state?.user.name}</Text>
                            <Text style={styles.username}>{state?.user.username}</Text>
                            <Text style={styles.email}>{state?.user.email}</Text>
                        </View>
                    </View>
                    <View style={styles.statsContainer}>
                        <Text style={styles.statsText}>Following</Text>
                        <Text style={styles.statsText}>Followers</Text>


                    </View>


                    <TouchableOpacity style={styles.editButton}>
                        <Text style={styles.editText}>Edit</Text>
                    </TouchableOpacity>
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
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
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
        paddingLeft: 10,
    },
    name: {
        fontSize: 20,
        color: 'white',
    },
    username: {
        fontSize: 16,
        color: '#23CAFF',
    },
    email: {
        fontSize: 14,
        color: '#23CAFF',
    },
    editButton: {
        backgroundColor: '#23CAFF',
        padding: 10,
        borderRadius: 30,
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
        flexDirection: 'row'
    },
    optionButton: {
        // backgroundColor: '#1A1637',
        borderColor:'white',
        borderWidth: 1,
        padding: 10,
        borderRadius: 30,
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
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 20,
    },
    logoutText: {
        color: 'white',
        fontSize: 16,
    },
});

export default Profile;