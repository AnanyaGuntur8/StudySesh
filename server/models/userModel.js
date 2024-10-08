const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'please enter email'],
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'please enter password'],
        min: 10,
        max: 20,
    },
    role: {
        type: String,
        default: 'user',
    },
    followedPosts: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Post' 
    }], 
    // createdPosts:[{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Post'
    // }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);