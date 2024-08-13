const express = require('express');
const { requireSignin } = require('../controllers/userController');
const { createPostController, getAllPostsController } = require('../controllers/postController');
const router = express.Router();//router object


//create post and post
router.post('/create-post', requireSignin, createPostController)
router.get('/get-all-posts', getAllPostsController)

module.exports = router;//export router 