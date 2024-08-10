const express = require('express');
const { requireSignin } = require('../controllers/userController');
const { createPostController } = require('../controllers/postController');
const router = express.Router();//router object


//create post and post
router.post('/create-post', requireSignin, createPostController)

module.exports = router;//export router 

