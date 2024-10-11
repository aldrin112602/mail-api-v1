const express = require('express');
const emailController = require('../controllers/emailController');
const router = express.Router();
router.post('/send', emailController.sendEmail);
router.get('/logs', emailController.getLogs);
module.exports = router;
