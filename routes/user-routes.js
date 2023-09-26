const express = require('express');
const userController = require('../controllers/user-conroller');

const router = express.Router();

router.get('/signup',userController.getSignUpPage);
router.post('/signup',userController.postSignUp);
router.get('/login',userController.getLoginPage);
router.post('/login',userController.postLogin);

module.exports = router;