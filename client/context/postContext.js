import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './authContext'; // Ensure this is correctly imported
import AsyncStorage from '@react-native-async-storage/async-storage';

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const [state, setState] = useContext(AuthContext); // Access the AuthContext

    const fetchPosts = async () => {
        try {
            const { data } = await axios.get('/post/get-all-posts');
            setPosts(data?.posts || []);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const followPost = async (postId) => {
        try {
            const { user } = state;
            if (!user || !user.username) {
                throw new Error('Username is required');
            }

            const response = await axios.post(`/post/join-post/${postId}`, {
                username: user.username,
            });

            const updatedFollowedPosts = [...user.followedPosts, postId];
            const followedPost = posts.find(post => post._id === postId);
            const updatedGroups = [...(state.groups || [])];

            if (followedPost && followedPost.followedBy.includes(user.username)) {
                updatedGroups.push(followedPost);
            }

            setState(prevState => ({
                ...prevState,
                user: {
                    ...prevState.user,
                    followedPosts: updatedFollowedPosts
                },
                groups: updatedGroups
            }));

            const updatedUser = { ...user, followedPosts: updatedFollowedPosts };
            const authData = { ...state, user: updatedUser, groups: updatedGroups };
            await AsyncStorage.setItem('@auth', JSON.stringify(authData));

            alert(response.data.message || 'Followed post successfully');
        } catch (error) {
            alert(error.response ? error.response.data.message : error.message);
        }
    };

    const unfollowPost = async (postId) => {
        try {
            const { user } = state;
            if (!user || !user.username) {
                throw new Error('Username is required');
            }

            const response = await axios.delete(`/post/unfollow/${postId}`, {
                data: { username: user.username }, // Send username in the body of the request
            });

            const updatedFollowedPosts = user.followedPosts.filter(id => id !== postId);
            const updatedGroups = (state.groups || []).filter(group => group._id !== postId);

            setState(prevState => ({
                ...prevState,
                user: {
                    ...prevState.user,
                    followedPosts: updatedFollowedPosts
                },
                groups: updatedGroups
            }));

            const updatedUser = { ...user, followedPosts: updatedFollowedPosts };
            const authData = { ...state, user: updatedUser, groups: updatedGroups };
            await AsyncStorage.setItem('@auth', JSON.stringify(authData));

            alert(response.data.message || 'Unfollowed post successfully');
        } catch (error) {
            alert(error.response ? error.response.data.message : error.message);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <PostContext.Provider value={[posts, setPosts, followPost, unfollowPost]}>
            {children}
        </PostContext.Provider>
    );
};