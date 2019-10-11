const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const route = require('../middleware/routeAuthenticator');

router.get('/reports', route, reportController.getReports);

router.get('/downloadReport',route,reportController.download);

module.exports = router;