const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller.js');

// Google OAuth login/register
router.post('/google', authController.googleAuth);

// Check user authentication status
router.get('/status', authController.checkAuthStatus);

module.exports = router;