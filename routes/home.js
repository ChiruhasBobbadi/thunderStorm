const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const route = require('../middleware/routeAuthenticator');

router.get('/home',route,homeController.getHome);

router.post('/home',route,homeController.postHome);

router.get('/error',route,homeController.error);

router.get('/logout',homeController.logout);

router.get('/manual',route,homeController.manual);

module.exports = router;