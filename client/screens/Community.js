import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/authContext';
import { getSocket } from '../components/utils/socket'; // Adjust the path to your socket file

const Community = ({ route }) => {
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [state] = useContext(AuthContext);
    const { token, user } = state;
    const { username } = user;
    const { post } = route.params;

    const postColor = post.color || '#007bff';
    const postId = post._id;

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`/chat/${postId}/messages`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setMessages(response.data.messages);
            } catch (error) {
                console.log('Error fetching messages:', error);
                Alert.alert('Error', error.response ? error.response.data.message : error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();

        // Get the socket instance
        const socket = getSocket();

        // Join the specific room for this post
        socket.emit('joinRoom', postId);

        // Listen for new messages
        socket.on('receiveMessage', (message) => {
            setMessages(prevMessages => [message, ...prevMessages]);
        });

        return () => {
            socket.off('receiveMessage');
            socket.emit('leaveRoom', postId);
        };
    }, [postId, token]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) {
            Alert.alert('Error', 'Message cannot be empty');
            return;
        }

        try {
            const messageData = {
                message: newMessage,
                username: user.username,
                postId: postId,
            };

            const response = await axios.post(`/chat/${postId}/messages`, messageData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const socket = getSocket(); // Get the socket instance to emit the message
            socket.emit('sendMessage', response.data.chatMessage);

            setMessages(prevMessages => [response.data.chatMessage, ...prevMessages]);
            setNewMessage('');
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
                    keyExtractor={(item) => item.id ? item.id : Math.random().toString()} 
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
