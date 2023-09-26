const express = require('express')
const router = express.Router();
const chatController = require('../controllers/chat-controller');
const { route } = require('./user-routes');

router.get('/chat',chatController.getChat);

module.exports = router;