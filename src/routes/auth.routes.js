// src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.middleware');
const controller = require('../controllers/auth.controller');

// Add CORS headers middleware at the router level
router.use(function(req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, Origin, Content-Type, Accept"
  );
  next();
});

// Google login route
router.post('/google-login', controller.googleLogin);

// Create test user (you might want to add admin middleware here)
router.post('/create-test-user', controller.createTestUser);

// Get user data (protected route)
router.get('/user', verifyToken, controller.getUserData);

module.exports = router;