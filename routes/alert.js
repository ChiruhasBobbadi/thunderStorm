const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
const route = require('../middleware/routeAuthenticator');

router.get('/alerts',route,alertController.alert);

router.post('/service',route,alertController.serviceAlert);



module.exports = router;