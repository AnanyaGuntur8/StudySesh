const chatModel = require('../models/chatModel');
const postModel = require('../models/postModel');


// Get Messages Controller
const getMessagesController = async (req, res) => {
   try {
       const { postId } = req.params;


       // Validate postId as a string
       if (!postId || typeof postId !== 'string') {
           return res.status(400).json({ message: 'Invalid post ID format' });
       }


       // Check if the post exists
       const post = await postModel.findById(postId);
       if (!post) {
           return res.status(404).json({ message: 'Post not found' });
       }


       // Fetch messages for the post, sorted by creation time in descending order
       const messages = await chatModel.find({ post: postId }).sort({ createdAt: -1 });


       res.status(200).json({
           success: true,
           messages,
       });
   } catch (error) {
       console.error('Error fetching messages:', error);
       res.status(500).json({ message: 'Server error' });
   }
};


// Post Message Controller
const postMessageController = async (req, res) => {
   try {
       const { message, username } = req.body;
       const { postId } = req.params;


       if (!username) {
           return res.status(401).json({ message: 'No username provided' });
       }


       // Check if the post exists
       const post = await postModel.findById(postId);
       if (!post) {
           return res.status(404).json({ message: 'Post not found' });
       }


       // Create a new chat message
       const chatMessage = new chatModel({
           message,
           sender: username,
           post: postId,
       });


       // Save the chat message to the database
       await chatMessage.save();




       // Send a success response
       res.status(201).json({
           success: true,
           message: 'Message sent successfully',
           chatMessage,
       });
   } catch (error) {
       console.error('Error posting message:', error);
       res.status(500).json({ message: 'Server error' });
   }
};
module.exports = { postMessageController, getMessagesController };
