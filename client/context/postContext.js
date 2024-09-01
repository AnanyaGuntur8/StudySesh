import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const [state, setState] = useContext(AuthContext);

    const fetchPosts = async () => {
        try {
            const { data } = await axios.get('/post/get-all-posts');
            if (data?.posts) {
                setPosts(data.posts);
            } else {
                console.warn('No posts found');
            }
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

            const response = await axios.post(`/post/follow/${postId}/${user.username}`, {
                username: user.username,
            });

            const updatedFollowedPosts = [...user.followedPosts, postId];
            const updatedGroups = (state.groups || []).map(group => {
                if (group._id === postId) {
                    return { ...group, followedBy: [...(group.followedBy || []), user._id] };
                }
                return group;
            });

            setState(prevState => {
                const newState = {
                    ...prevState,
                    user: {
                        ...prevState.user,
                        followedPosts: updatedFollowedPosts
                    },
                    groups: updatedGroups
                };

                // Log new state to ensure correct updates
                console.log('Updated State:', newState);

                return newState;
            });

            const updatedUser = { ...user, followedPosts: updatedFollowedPosts };
            const authData = { ...state, user: updatedUser, groups: updatedGroups };

            // Log authData to verify correct structure
            console.log('Auth Data to be saved:', authData);

            await AsyncStorage.setItem('@auth', JSON.stringify(authData));

            await fetchPosts();  // Refetch to ensure posts are updated

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

            if (!user.followedPosts) {
                throw new Error('Followed posts list is not available');
            }

            const response = await axios.delete(`/post/unfollow/${postId}/${user.username}`);

            const updatedFollowedPosts = user.followedPosts.filter(id => id !== postId);
            const updatedGroups = (state.groups || []).map(group => {
                if (group._id === postId) {
                    return { ...group, followedBy: (group.followedBy || []).filter(id => id.toString() !== user._id.toString()) };
                }
                return group;
            });

            setState(prevState => {
                const newState = {
                    ...prevState,
                    user: {
                        ...prevState.user,
                        followedPosts: updatedFollowedPosts
                    },
                    groups: updatedGroups
                };

                // Log new state to ensure correct updates
                console.log('Updated State:', newState);

                return newState;
            });

            const updatedUser = { ...user, followedPosts: updatedFollowedPosts };
            const authData = { ...state, user: updatedUser, groups: updatedGroups };

            // Log authData to verify correct structure
            console.log('Auth Data to be saved:', authData);

            await AsyncStorage.setItem('@auth', JSON.stringify(authData));

            await fetchPosts();  // Refetch to ensure posts are updated

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
