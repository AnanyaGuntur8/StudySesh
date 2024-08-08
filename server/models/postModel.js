const mongoose = require('mongoose');

//making the schema
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required:[true, 'Please add Title']
    },
    description:{
        type:String,
        required:[true, 'Please add Description']
    },
    update:{
        type:String,
        required:[true,'Please add an Update']
    },
    postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required:true
    }
})
module.exports = mongoose.model('Post', postSchema)