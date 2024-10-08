import React, { useContext, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/authContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import FooterMenu from '../components/Menus/FooterMenu';
import axios from 'axios';
import { PostContext } from '../context/postContext';
import HeaderMenu from '../components/Menus/HeaderMenu';

const Home = () => {
    const [state] = useContext(AuthContext);
    const [posts, setPosts] = useContext(PostContext); // Assuming you have a way to set posts
    const navigation = useNavigation();
    const [searchItem, setSearchItem] = useState('');

    // Filter posts based on search item
    const filteredPosts = posts.filter(
        (post) =>
            post.title.toLowerCase().includes(searchItem.toLowerCase()) ||
            post.postedBy.username.toLowerCase().includes(searchItem.toLowerCase())
    );

    // Debug: Check if posts are being updated correctly
    useEffect(() => {
        console.log('Current Posts:', posts);
    }, [posts]);

    // Fetch posts or refresh the content every time the screen is focused
    useFocusEffect(
        useCallback(() => {
            // Fetch or refresh posts here
            // const fetchPosts = async () => {
            //     try {
            //         // Assuming there's an API endpoint to fetch the posts
            //         const response = await axios.get('/posts');
            //         setPosts(response.data);
            //     } catch (error) {
            //         console.error('Error fetching posts:', error);
            //     }
            // };

            // fetchPosts();

            // If you need to clean up on unfocus, return a function here
            return () => {
                // Clean up actions, if needed
            };
        }, [])
    );

    return (
        <SafeAreaView style={styles.safearea}>
            <HeaderMenu onSearch={setSearchItem} />
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.container}>
                    {filteredPosts.map((post, index) => (
                        <View key={index} style={styles.row}>
                            {index % 2 === 0 && (
                                <>
                                    <TouchableOpacity
                                        style={[styles.postButton, { backgroundColor: post.color || '#00CFFF' }]}
                                        onPress={() => navigation.navigate('PostCard', { post })}
                                    >
                                        <Text style={styles.postText}>{post.title}</Text>
                                        <Text style={styles.username}>@{post.postedBy?.username}</Text>
                                    </TouchableOpacity>
                                    {filteredPosts[index + 1] && (
                                        <TouchableOpacity
                                            style={[styles.postButton, { backgroundColor: filteredPosts[index + 1].color || '#00CFFF' }]}
                                            onPress={() => navigation.navigate('PostCard', { post: filteredPosts[index + 1] })}
                                        >
                                            <Text style={styles.postText}>{filteredPosts[index + 1].title}</Text>
                                            <Text style={styles.username}>@{filteredPosts[index + 1].postedBy?.username}</Text>
                                        </TouchableOpacity>
                                    )}
                                </>
                            )}
                        </View>
                    ))}
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
    },
    scrollView: {
        flexGrow: 1,
        justifyContent: 'space-between',
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 20,
        marginLeft: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 10,
    },
    postButton: {
        padding: 10,
        height: 150,
        width: '48%',
        justifyContent: 'top',
        alignItems: 'left',
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
        textAlign: 'center',
    },
});

export default Home;
