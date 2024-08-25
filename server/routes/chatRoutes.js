const express = require('express');
const { requireSignin } = require('../controllers/userController');
const { postMessageController, getMessagesController } = require('../controllers/chatController');
const router = express.Router();

module.exports = (io) => {
    // Route to get messages for a specific post
    router.get('/:postId/messages', requireSignin, getMessagesController);

    // Route to post a new message for a specific post
    router.post('/:postId/messages', requireSignin, (req, res) => postMessageController(req, res, io));

    return router;
};