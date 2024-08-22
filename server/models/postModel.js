const mongoose = require('mongoose');

// Making the schema
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add Title']
    },
    description: {
        type: String,
        required: [true, 'Please add Description']
    },
    update: {
        type: String,
        required: [true, 'Please add an Update']
    },
    color: {
        type: String,
        default: '#23CAFF'
    },
    postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    link: {
        type: String,
        required: false
    },
    // communityLink: {
    //     type: String,
    //     required: false
    // },
    followedBy: [
        {
            type: String, // Store usernames instead of ObjectIds
        }
    ]
});

module.exports = mongoose.model('Post', postSchema);
