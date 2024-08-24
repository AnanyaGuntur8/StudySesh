const mongoose = require('mongoose');
const { Schema } = mongoose;


const chatSchema = new Schema({
   message: {
       type: String,
       required: true,
   },
   sender: {
       type: String, // Store the username directly
       required: true,
   },
   post: {
       type: Schema.Types.ObjectId,
       ref: 'Post',  // Reference to the Post model
       required: true,
   },
   createdAt: {
       type: Date,
       default: Date.now,
   },
});


module.exports = mongoose.model('Chat', chatSchema);