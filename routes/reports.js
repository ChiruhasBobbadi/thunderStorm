const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const route = require('../middleware/routeAuthenticator');

router.get('/report', route, reportController.getReports);

router.post('/report', route, reportController.postReports);

router.get('/downloadReport',route,reportController.download);

module.exports = router;