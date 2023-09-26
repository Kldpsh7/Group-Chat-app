const express = require('express')
const router = express.Router();
const chatController = require('../controllers/chat-controller');
const userAuth = require('../middleware/user-auth');
const { route } = require('./user-routes');

router.get('/chat',chatController.getChatPage);
router.get('/loadChat',userAuth.authenticate,chatController.getLoadChats);
router.post('/send',userAuth.authenticate,chatController.postNewMessage);

module.exports = router;