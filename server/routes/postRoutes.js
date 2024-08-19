const express = require('express');
const { requireSignin } = require('../controllers/userController');
const {
  createPostController,
  getAllPostsController,
  getUserPostsController,
  deletePostController,
  updatePostController,
  joinPostController,
  unfollowPostController,
  getPostsFollowedByUserController
} = require('../controllers/postController');
const router = express.Router();
router.post('/create-post', requireSignin, createPostController);
router.get('/get-all-posts', getAllPostsController);
router.get('/get-user-posts', requireSignin, getUserPostsController);
router.delete('/delete-post/:id', requireSignin, deletePostController);
router.put('/update-post/:id', requireSignin, updatePostController);
router.post('/join-post/:id', joinPostController);
router.post('/post/unfollow/:id', unfollowPostController);

// Get posts followed by user (ensure this route requires signin if necessary)
router.get('/posts-followed-by-user', requireSignin, getPostsFollowedByUserController);

module.exports = router;