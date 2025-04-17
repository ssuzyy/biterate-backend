const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller.js');
const { verifyToken } = require('../middleware/auth.middleware');

// Get user profile (public)
router.get('/:id', userController.findOne);

// Get current user profile (protected)
router.get('/profile/me', verifyToken, userController.getMyProfile);

// Update user profile (protected)
router.put('/profile/me', verifyToken, userController.updateProfile);

// Get user's reviews
router.get('/:id/reviews', userController.getUserReviews);

// Get user's favorite products
router.get('/:id/favorites', userController.getUserFavorites);

// Get user's badges
router.get('/:id/badges', userController.getUserBadges);

module.exports = router;