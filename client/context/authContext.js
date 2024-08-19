import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const AuthContext = createContext();

// Provider
const AuthProvider = ({ children }) => {
    const [state, setState] = useState({
        user: { username: '', followedPosts: [] },
        token: '',
    });

    axios.defaults.baseURL = 'http://192.168.1.105:8080/api/v1';

    // Load local storage data on initialization
    useEffect(() => {
        const loadLocalStorageData = async () => {
            try {
                const data = await AsyncStorage.getItem('@auth');
                const loginData = JSON.parse(data);

                if (loginData) {
                    console.log('Local Storage =>', loginData); 
                    setState(prevState => ({
                        ...prevState,
                        user: {
                            ...prevState.user,
                            ...loginData.user,
                            followedPosts: loginData.user?.followedPosts || []
                        },
                        token: loginData.token || ''
                    }));
                }
            } catch (error) {
                console.error('Error loading local storage data:', error);
            }
        };

        loadLocalStorageData();
    }, []);

    // Fetch followed posts
    const fetchFollowedPosts = async () => {
        try {
            const encodedUsername = encodeURIComponent(state.user.username);
            const response = await axios.get(`post/posts-followed-by-user?username=${encodedUsername}`, {
                headers: { Authorization: `Bearer ${state.token}` }
            });
    
            if (response.data.success) {
                const followedPosts = response.data.posts ? response.data.posts.map(post => post._id) : [];
                
                // Update state with the new list of followed posts
                setState(prevState => ({
                    ...prevState,
                    user: {
                        ...prevState.user,
                        followedPosts
                    }
                }));
    
                // Update AsyncStorage with the new list of followed posts
                await AsyncStorage.setItem('@auth', JSON.stringify({
                    ...state,
                    user: {
                        ...state.user,
                        followedPosts
                    }
                }));
            // } else {
            //     console.error('Failed to fetch followed posts:', response.data.message);
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

    return (
        <AuthContext.Provider value={[state, setState]}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };