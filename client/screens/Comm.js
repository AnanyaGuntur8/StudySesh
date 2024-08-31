import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { AuthContext } from '../context/authContext';
import FooterMenu from '../components/Menus/FooterMenu';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const Comm = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [state] = useContext(AuthContext);
    const { token, user } = state;
    const navigation = useNavigation();

    const getAllPosts = async () => {
        try {
            setLoading(true);
            const { data: userPostsData } = await axios.get('/post/get-user-posts', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const { data: followedPostsData } = await axios.get(`/post/posts-followed-by-user?userId=${user._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const userPosts = userPostsData?.userPosts || [];
            const followedPosts = followedPostsData?.posts || [];
            setPosts([...userPosts, ...followedPosts]);
        } catch (error) {
            console.error('Failed to load posts:', error);
            Alert.alert('Error', 'Failed to load posts. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllPosts();
    }, [user.username]);

    return (
        <SafeAreaView style={styles.safearea}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.container}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#FFFFFF" />
                    ) : posts.length > 0 ? (
                        posts.map((post) => (
                            <TouchableOpacity
                                key={post._id}
                                style={[styles.postButton, { backgroundColor: post.color || '#00CFFF' }]}
                                onPress={() => {
                                    navigation.navigate('Community', { post }); 
                                }}
                            >
                                <Text style={styles.postText}>{post.title}</Text>
                                <Text style={styles.username}>@{post.postedBy?.username}</Text>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text style={styles.noPostsText}>No posts available</Text>
                    )}
                </View>
            </ScrollView>
            <FooterMenu />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safearea: {
        flex: 1,
        backgroundColor: '#050315',
        paddingBottom: 50,
    },
    scrollView: {
        flexGrow: 1,
        justifyContent: 'space-between',
    },
    container: {
        flex: 1,
        marginTop: 30,
        marginLeft: 10,
    },
    postButton: {
        padding: 10,
        height: 100,
        width: '100%',
        marginBottom: 10,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        borderRadius: 10,
    },
    postText: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'left',
    },
    username: {
        color: 'black',
        fontSize: 15,
    },
    noPostsText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontSize: 18,
        marginTop: 20,
    },
});

export default Comm;
