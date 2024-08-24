import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/authContext';


const Community = ({ route }) => {
   const [loading, setLoading] = useState(false);
   const [messages, setMessages] = useState([]);
   const [newMessage, setNewMessage] = useState('');
   const [state] = useContext(AuthContext);
   const { token, user } = state; // Destructure user
   const { username } = user; // Destructure username from user
   const { post } = route.params;


   console.log('Username from context:', username); // Debugging


   useEffect(() => {
       const fetchMessages = async () => {
           try {
               setLoading(true);
               const response = await axios.get(`/chat/${post._id}/messages`, {
                   headers: {
                       Authorization: `Bearer ${token}`,
                   },
               });
               console.log('Fetched Messages:', response.data.messages);
               setMessages(response.data.messages); // Assuming the response structure
               setLoading(false);
           } catch (error) {
               setLoading(false);
               console.log('Error fetching messages:', error);
               Alert.alert('Error', error.response ? error.response.data.message : error.message);
           }
       };
  
       fetchMessages();
   }, [post._id, token]);


   const handleSendMessage = async () => {
       if (!newMessage.trim()) {
           Alert.alert('Error', 'Message cannot be empty');
           return;
       }
  
       try {
           const response = await axios.post(`/chat/${post._id}/messages`, {
               message: newMessage,
               username: user.username, // Use user.username directly here
           }, {
               headers: {
                   Authorization: `Bearer ${token}`, // Use the token from the context
               },
           });
  
           // Update the messages state with the new message
           setMessages(response.data.chatMessage);
  
           setNewMessage(''); // Clear the input field
       } catch (error) {
           console.error('Error sending message:', error.response?.data || error.message);
           Alert.alert('Error', error.response ? error.response.data.message : error.message);
       }
   };
   return (
       <View style={styles.container}>
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
                   <View style={styles.messageContainer}>
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
}




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
   subtitle:{
       paddingTop: 10,
       fontSize: 18,
       color: '#666'
   },
   messageContainer: {
       marginVertical: 5,
   },
   message: {
       padding: 10,
       backgroundColor: '#f0f0f0',
       borderRadius: 10,
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
       backgroundColor: '#007bff',
       borderRadius: 20,
       padding: 10,
   },
   sendButtonText: {
       color: 'white',
       fontWeight: 'bold',
   },
});


export default Community;