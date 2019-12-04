const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const route = require('../middleware/routeAuthenticator');

router.get('/home',route,homeController.getHome);

router.post('/home',route,homeController.postHome);

router.post('/delete',route,homeController.delete);

router.get('/error:type',route,homeController.error);

router.get('/logout',homeController.logout);

router.get('/manual',route,homeController.manual);

router.post('/manual',route,homeController.postmanual);
module.exports = router;