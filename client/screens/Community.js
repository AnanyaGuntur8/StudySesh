import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet, KeyboardAvoidingView , Platform} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/authContext';
import { getSocket } from '../components/utils/socket'; // Adjust the path to your socket file
import Entypo from 'react-native-vector-icons/Entypo';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const Community = ({ route }) => {
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [state] = useContext(AuthContext);
    const { token, user } = state;
    const { username } = user;
    const { post } = route.params;
    const navigation = useNavigation();

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

        // Listen for new messagessl
        const handleReceiveMessage = (message) => {
            if (message.post == postId){
            setMessages(prevMessages => [message, ...prevMessages]);
            }
            else{
                message.postId = postId
            }
        };

        socket.on('receiveMessage', handleReceiveMessage);

        return () => {
            socket.off('receiveMessage', handleReceiveMessage);
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

            // Move the message addition to the socket listener
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error.response?.data || error.message);
            Alert.alert('Error', error.response ? error.response.data.message : error.message);
        }
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: postColor }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={1} 
        >
            <View style={[styles.container, { backgroundColor: postColor }]}>
                <View style={[styles.borderContainer, { backgroundColor: postColor }]}>
                    <View style={styles.titleAndIcon}>
                    {/* add the back arrow */}
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Entypo name='chevron-with-circle-left' style={styles.iconStyle} />
                        </TouchableOpacity>
                    
                    {/* add the back arrow */}
                    <Text style={styles.title}>Community</Text>
                    </View>
                    <Text style={styles.subtitle}>{post.title}</Text>
                
                
                </View>
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
                        multiline
                        numberOfLines={4} 
                        scrollEnabled
                        textAlignVertical="top"
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                        <Text style={styles.sendButtonText}>Send</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding: 2,
        // paddingBottom:20,
    },
    title: {
        paddingTop: 20,
        fontSize: 30,
        fontWeight: 'bold',
    },
    subtitle: {
        paddingTop: 1,
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        paddingBottom: 10,
        paddingLeft: 70,
    },
    titleAndIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        // marginBottom: 10,
        paddingLeft: 20,
        paddingTop:40,
    },
    iconStyle: {
        paddingTop:20,
        fontSize: 40,
        marginRight: 10,
    },
    borderContainer: {
        paddingBottom: 10,
        borderBottomWidth: 2, // Border width
        borderBottomColor: 'black', // Border color
        width: '100%',
    },
    messageContainer: {
        marginVertical: 5,
        marginHorizontal: 10,
        borderRadius: 10,
        padding: 8,
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
        marginLeft: 15,
        marginRight: 15,
        paddingBottom: 20,
        
    },
    input: {
        flex: 1,
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 20,
        padding: 10,
        marginRight: 10,
        color: 'black',
        maxHeight: 200,
    },
    sendButton: {
        backgroundColor: 'black',
        borderRadius: 20,
        padding: 10,
    },
    sendButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default Community;