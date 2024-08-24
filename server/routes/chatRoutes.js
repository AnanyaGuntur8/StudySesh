const express = require('express');
const { requireSignin } = require('../controllers/userController');
const { postMessageController, getMessagesController } = require('../controllers/chatController');
const router = express.Router();


router.get('/:postId/messages', requireSignin, getMessagesController);
// Updated route to match the structure in your Community component
router.post('/:postId/messages', requireSignin, postMessageController);


module.exports = router;