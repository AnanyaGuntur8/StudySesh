import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [state, setState] = useState({
        user: { _id: '', username: '', name: '', email: '', followedPosts: [] },
        token: '',
        groups: [],
    });

    axios.defaults.baseURL = 'http://192.168.1.105:8080/api/v1';

    useEffect(() => {
        const loadLocalStorageData = async () => {
            try {
                const data = await AsyncStorage.getItem('@auth');
                const loginData = JSON.parse(data);

                if (loginData && loginData.user) {  // Check if loginData and user exist
                    console.log('Local Storage =>', loginData);
                    setState(prevState => ({
                        ...prevState,
                        user: {
                            ...prevState.user,
                            ...loginData.user,
                        },
                        token: loginData.token || '',
                        groups: loginData.groups || []
                    }));
                }
            } catch (error) {
                console.error('Error loading local storage data:', error);
            }
        };

        loadLocalStorageData();
    }, []);

    useEffect(() => {
        const saveToLocalStorage = async () => {
            try {
                if (state.user && state.user._id) {  // Ensure state.user is defined before saving
                    await AsyncStorage.setItem('@auth', JSON.stringify(state));
                }
            } catch (error) {
                console.error('Error saving state to local storage:', error);
            }
        };

        saveToLocalStorage();
    }, [state]);

    const fetchFollowedPosts = async () => {
        try {
            const userId = state.user?._id;  // Optional chaining to prevent errors
            if (!userId) return;  // Ensure userId exists before making the request

            const response = await axios.get(`post/posts-followed-by-user?userId=${userId}`, {
                headers: { Authorization: `Bearer ${state.token}` }
            });

            if (response.data.success) {
                const followedPosts = response.data.posts ? response.data.posts.map(post => post._id) : [];
                
                setState(prevState => ({
                    ...prevState,
                    user: {
                        ...prevState.user,
                        followedPosts
                    }
                }));
            }
        } catch (error) {
            console.error('Error fetching followed posts:', error);
        }
    };

    useEffect(() => {
        if (state.token) {
            fetchFollowedPosts();
        }
    }, [state.token]);

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('@auth');  // Remove data from local storage
            setState({
                user: { _id: '', username: '', name: '', email: '', followedPosts: [] },
                token: '',
                groups: [],
            });
            console.log('Logged out successfully');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <AuthContext.Provider value={[state, setState, logout]}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
