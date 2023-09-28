const express = require('express')
const router = express.Router();
const chatController = require('../controllers/chat-controller');
const userAuth = require('../middleware/user-auth');
const { route } = require('./user-routes');

router.get('/home',chatController.getChatHomePage)
router.get('/chat',chatController.getChatPage);
router.get('/loadChat',userAuth.authenticate,chatController.getLoadChats);
router.post('/send',userAuth.authenticate,chatController.postNewMessage);
router.get('/group',userAuth.authenticate,chatController.getGroups);
router.post('/creategroup',userAuth.authenticate,chatController.postCreateGroup);
router.get('/groupdeatils',userAuth.authenticate,chatController.getGroupDetails);
router.get('/groupmembers',userAuth.authenticate,chatController.getGroupMembers);
router.post('/changegroupname',userAuth.authenticate,chatController.postChangeGroupName);
router.post('/addnewmember',userAuth.authenticate,chatController.postAddNewMember);
router.post('/removemember',userAuth.authenticate,chatController.postRemoveMember);

module.exports = router;