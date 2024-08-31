import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [state, setState] = useState({
        user: { _id: '', username: '', followedPosts: [] },
        token: '',
        groups: [],
    });

    axios.defaults.baseURL = 'http://192.168.1.105:8080/api/v1';

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
                            _id: loginData.user?._id,
                            followedPosts: loginData.user?.followedPosts || []
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

    const fetchFollowedPosts = async () => {
        try {
            const userId = state.user._id;
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

                await AsyncStorage.setItem('@auth', JSON.stringify({
                    ...state,
                    user: {
                        ...state.user,
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

    return (
        <AuthContext.Provider value={[state, setState]}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
