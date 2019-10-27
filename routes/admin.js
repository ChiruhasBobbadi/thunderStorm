const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const route = require('../middleware/adminAuth');


router.get('/update',route,adminController.update);


router.post('/update',route,adminController.postUpdate);

// router.post('/downloadRef',route,adminController.upload);

router.post('/upload',route,adminController.upload);

router.get('/login',adminController.adminLogin);

router.post('/login',adminController.postLogin);

router.get('/downloadRef',adminController.downloadRef);

router.get('/update-mro',route,adminController.getUpdateMro);

router.post('/update-mro',route,adminController.postUpdateMro);

module.exports = router;