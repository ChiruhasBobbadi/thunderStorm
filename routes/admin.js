const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const route = require('../middleware/adminAuth');


router.get('/update',route,adminController.update);

router.get('/upload',route,adminController.upload);

router.get('/downloadRef',route,adminController.upload);

router.get('/login',adminController.adminLogin);

router.post('/login',adminController.postLogin);

router.get('/update-mro',route,adminController.getupdateMro);

router.post('/update-mro',route,adminController.postUpdateMro);

module.exports = router;