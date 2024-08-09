import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import {AuthContext} from '../context/authContext'
import FooterMenu from '../components/Menus/FooterMenu';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';




function Profile() {
    const [state, setState] = useContext(AuthContext);
    const { user } = state;
    const [profileImage, setProfileImage] = useState(user?.profileImage || 'https://via.placeholder.com/100');
    const [name, setName] = useState(user?.name);
    const [username, setUsername] = useState(user?.username);
    const [email, setEmail] = useState(user?.email);
    const [isEditing, setIsEditing] = useState(false);

    const handleLogout = async () => {
        setState({ token: '', user: null });
        await AsyncStorage.removeItem('@auth');
        alert('Logged Out Successfully');
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleSave = async () => {
        if(!username || !email || !name){
            alert('Please fill all the fields');
        }
        else{
        try {
            const { data } = await axios.put('/auth/update-user', {
                name, username, email,
            });

            if (data.success) {
                setState((prevState) => ({
                    ...prevState,
                    user: data.updatedUser,
                }));
                await AsyncStorage.setItem('@auth', JSON.stringify({
                    token: state.token,
                    user: data.updatedUser,
                }));
                Alert.alert('Success', 'Profile Updated Successfully');
                setIsEditing(false);
            } else {
                Alert.alert('Error', data.message);
            }
        } catch (error) {
            console.log('Error updating profile:', error);
            Alert.alert('Error', 'Something went wrong');
        }
    }
    };

    return (
        <SafeAreaView style={styles.safearea}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.container}>
                    <View style={styles.profileContainer}>
                        <TouchableOpacity>
                            <Image source={{ uri: profileImage }} style={styles.profileImage} />
                        </TouchableOpacity>
                        <View style={styles.headerInfo}>
                            {isEditing ? (
                                <>
                                    <TextInput
                                        style={[styles.name, styles.input]}
                                        value={name}
                                        onChangeText={setName}
                                        placeholder="Name"
                                        placeholderTextColor = "#828282"
                                    />
                                    <TextInput
                                        style={[styles.username, styles.input]}
                                        value={username}
                                        onChangeText={setUsername}
                                        placeholder="Username"
                                        placeholderTextColor = "#828282"
                                    />
                                    <TextInput
                                        style={[styles.email, styles.input]}
                                        value={email}
                                        onChangeText={setEmail}
                                        placeholder="Email"
                                        placeholderTextColor = "#828282"
                                    />
                                </>
                            ) : (
                                <>
                        {/* if the state of edititng is false */}
                            <Text style={styles.name}>{name}</Text> 
                            
                            <Text style={styles.username}>{username}</Text>
                            <Text style={styles.email}>{email}</Text>
                                </>
                            )}
                        </View>
                    </View>
                    <View style={styles.statsContainer}>
                        <Text style={styles.statsText}>Following</Text>
                        <Text style={styles.statsText}>Followers</Text>
                    </View>

                    <TouchableOpacity style={styles.editButton} onPress={isEditing ? handleSave : handleEditToggle}>
                        <Text style={styles.editText}>{isEditing ? 'Save' : 'Edit'}</Text>
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
    input: {
        fontSize: 15,
        color: 'white',
        borderWidth: 1,
        borderRadius:10,
        width:200,
        height:35,
        borderColor: 'gray',
        paddingHorizontal: 10,
        marginBottom: 10,
        padding: 2,
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
        borderRadius: 10,
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
        backgroundColor: '#1A1637',
        // borderColor:'white',
        borderWidth: 1,
        padding: 20,
        borderRadius: 22,
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
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    logoutText: {
        color: 'white',
        fontSize: 16,
    },
});

export default Profile;