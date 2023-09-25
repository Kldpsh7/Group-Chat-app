const express = require('express');
const userController = require('../controllers/user-conroller');

const router = express.Router();

router.get('/signup',userController.getSignUp);
router.post('/signup',userController.postSignUp);
router.get('/login',userController.getLogin);

module.exports = router;