const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, 
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
        default:'user'
    }
}, 
    {timestamps:true}
);

module.exports = mongoose.model("User", userSchema); 
