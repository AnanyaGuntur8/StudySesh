const express = require('express');
const { requireSignin } = require('../controllers/userController');
const { postMessageController, getMessagesController } = require('../controllers/chatController');
const router = express.Router();

module.exports = (io) => {
    router.get('/:postId/messages', requireSignin, getMessagesController);

    router.post('/:postId/messages', requireSignin, (req, res) => postMessageController(req, res, io));

    return router;
};