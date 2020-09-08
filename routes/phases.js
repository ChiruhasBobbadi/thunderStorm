const express = require('express');
const router = express.Router();
const phase = require('../controllers/phaseController');
const route = require('../middleware/routeAuthenticator');

router.get('/tele',route,phase.tele);

router.post('/tele/:id',route,phase.postTele);

router.get('/message',route,phase.message);

router.post('/message/:id',route,phase.postMessage);
//
// router.get('/manual',route,homeController.manual);

module.exports = router;