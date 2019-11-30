const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
const route = require('../middleware/routeAuthenticator');



router.get('/service',route,alertController.serviceAlert);

router.post('/service',route,alertController.postService);

/*router.get('/message',route,alertController.getMessage);

router.post('/message',route,alertController.postMessage);*/





module.exports = router;