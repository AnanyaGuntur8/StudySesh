import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { AuthContext } from '../context/authContext';
import FooterMenu from '../components/Menus/FooterMenu';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';

function Settings() {
    const navigation = useNavigation();
    const [state, setState] = useContext(AuthContext);
    const { user } = state;
    const [name, setName] = useState(user?.name || '');
    const [username, setUsername] = useState(user?.username || '');
    const [email, setEmail] = useState(user?.email || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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
        if (!currentPassword || !newPassword || !confirmPassword) {
            alert('Please fill all the fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('New passwords do not match');
            return;
        }

        try {
            const { data } = await axios.put('/auth/update-user', {
                name, username, email, currentPassword, password: newPassword
            });

            if (data.success) {
                setState((prevState) => ({
                    ...prevState,
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
    };

    return (
        <SafeAreaView style={styles.safearea}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.container}>
                    <View style={styles.profileContainer}>
                        <View style={styles.titleAndIcon}>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Entypo name="chevron-with-circle-left" style={styles.iconStyle} />
                            </TouchableOpacity>
                            <Text style={styles.title}>Settings</Text>
                        </View>
                        <Text style={styles.note}>Change Password</Text>
                        <TextInput
                            style={[styles.email, styles.input]}
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            placeholder="Current Password"
                            placeholderTextColor="#828282"
                            secureTextEntry
                        />
                        <TextInput
                            style={[styles.email, styles.input]}
                            value={newPassword}
                            onChangeText={setNewPassword}
                            placeholder="New Password"
                            placeholderTextColor="#828282"
                            secureTextEntry
                        />
                        <TextInput
                            style={[styles.email, styles.input]}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder="Confirm New Password"
                            placeholderTextColor="#828282"
                            secureTextEntry
                        />
                    </View>
                    <TouchableOpacity style={styles.editButton} onPress={handleSave}>
                        <Text style={styles.editText}>Save</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
            </ScrollView>
            {/* <FooterMenu /> */}
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
        marginTop: 30,
        marginLeft: 10,
    },
    text: {
        color: 'white',
    },
    profileContainer: {
        marginBottom: 20,
    },
    titleAndIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom:60,
    },
    iconStyle: {
        color: 'white',
        fontSize: 25,
        marginRight: 10,
    },
    title: {
        color: '#23CAFF',
        fontWeight: 'bold',
        fontSize: 30,
    },
    note: {
        color: '#23CAFF',
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 10,
    },
    input: {
        fontSize: 15,
        color: 'white',
        borderWidth: 1,
        borderRadius: 10,
        width: 200,
        height: 35,
        borderColor: 'gray',
        paddingHorizontal: 10,
        marginBottom: 10,
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
    optionButton: {
        backgroundColor: '#1A1637',
        borderWidth: 1,
        padding: 20,
        borderRadius: 22,
        alignItems: 'center',
        marginBottom: 290,
    },
    optionText: {
        color: 'white',
        fontSize: 16,
    },
    logoutButton: {
        backgroundColor: '#ff6347',
        padding: 10,
        borderRadius: 22,
        alignItems: 'center',
        marginBottom: 20,
    },
    logoutText: {
        color: 'white',
        fontSize: 16,
    },
});

export default Settings;
