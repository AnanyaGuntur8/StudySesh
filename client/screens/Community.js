import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/authContext';
import socket from '../components/utils/socket'; // Adjust the path to your socket file

const Community = ({ route }) => {
    const [loading, setLoading] = useState(true); // Set loading to true initially
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [state] = useContext(AuthContext);
    const { token, user } = state; // Destructure user
    const { username } = user; // Destructure username from user
    const { post } = route.params;

    // Extract color from the post
    const postColor = post.color || '#007bff'; // Default color if post.color is undefined

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`/chat/${post._id}/messages`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setMessages(response.data.messages); // Assuming the response structure
            } catch (error) {
                console.log('Error fetching messages:', error);
                Alert.alert('Error', error.response ? error.response.data.message : error.message);
            } finally {
                setLoading(false); // Set loading to false in finally block
            }
        };

        fetchMessages();

        // Join the specific room for this post
        socket.emit('joinRoom', post._id);

        // Listen for new messages
        socket.on('receiveMessage', (message) => {
            setMessages(prevMessages => [message, ...prevMessages]); // Add new message at the top
        });

        return () => {
            socket.off('receiveMessage'); // Clean up the listener on component unmount
            socket.emit('leaveRoom', post._id); // Leave the room when component unmounts
        };
    }, [post._id, token]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) {
            Alert.alert('Error', 'Message cannot be empty');
            return;
        }
    
        try {
            const messageData = {
                message: newMessage,
                username: user.username,
                postId: post._id, // Include post ID
            };
    
            // Make API call to send the message
            const response = await axios.post(`/chat/${post._id}/messages`, messageData, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include token for authorization
                },
            });
    
            // Emit the message through socket
            socket.emit('sendMessage', response.data.chatMessage); // Use the saved message from the response
    
            // Optionally, you can also update local state for immediate feedback
            setMessages(prevMessages => [response.data.chatMessage, ...prevMessages]);
    
            setNewMessage(''); // Clear the input field
        } catch (error) {
            console.error('Error sending message:', error.response?.data || error.message);
            Alert.alert('Error', error.response ? error.response.data.message : error.message);
        }
    };
    

    return (
        <View style={[styles.container, { backgroundColor: postColor }]}>
            <Text style={styles.title}>Community</Text>
            <Text style={styles.subtitle}>{post.title}</Text>
            {loading ? (
                <Text>Loading messages...</Text>
            ) : (
                <FlatList
                    data={messages}
                    inverted
                    keyExtractor={item => item._id}
                    renderItem={({ item }) => (
                        <View style={[styles.messageContainer, { backgroundColor: postColor }]}>
                            <Text style={styles.message}>
                                <Text style={styles.sender}>{item.sender}: </Text>
                                {item.message}
                            </Text>
                        </View>
                    )}
                    contentContainerStyle={{ paddingBottom: 30 }}
                />
            )}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type your message..."
                    value={newMessage}
                    onChangeText={setNewMessage}
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        paddingTop: 60,
        fontSize: 24,
        fontWeight: 'bold',
    },
    subtitle: {
        paddingTop: 10,
        fontSize: 18,
        color: '#666',
    },
    messageContainer: {
        marginVertical: 5,
        borderRadius: 10,
        padding: 10,
    },
    message: {
        color: 'black',
    },
    sender: {
        fontWeight: 'bold',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    input: {
        flex: 1,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 20,
        padding: 10,
        marginRight: 10,
    },
    sendButton: {
        borderRadius: 20,
        padding: 10,
    },
    sendButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default Community;
