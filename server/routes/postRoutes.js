const express = require('express');
const { requireSignin } = require('../controllers/userController');
const { createPostController, getAllPostsController, getUserPostsController, deletePostController, updatePostController } = require('../controllers/postController');
const router = express.Router();//router object


//create post and post
router.post('/create-post', requireSignin, createPostController)
router.get('/get-all-posts', getAllPostsController)
router.get('/get-user-posts', requireSignin, getUserPostsController )
router.delete('/delete-post/:id', requireSignin, deletePostController)
router.put('/update-post/:id', requireSignin, updatePostController )

module.exports = router;//export router 