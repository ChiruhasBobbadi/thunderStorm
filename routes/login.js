const express = require('express');
const router = express.Router();
const loginController = require('../controllers/LoginController');


router.get('/login',loginController.Login);


router.post('/login',loginController.postLogin);


module.exports = router;