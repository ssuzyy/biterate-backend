const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller.js');

// Create a new User
router.post('/', userController.create);

// Retrieve all Users
router.get('/', userController.findAll);

// Retrieve a single User with id
router.get('/:id', userController.findOne);

// Update a User with id
router.put('/:id', userController.update);

// Delete a User with id
router.delete('/:id', userController.delete);

// Get user's badges
router.get('/:id/badges', userController.getUserBadges);

// Get user's reviews
router.get('/:id/reviews', userController.getUserReviews);

// Get user's favorite products
router.get('/:id/favorites', userController.getFavoriteProducts);

// Add a product to user's favorites
router.post('/:id/favorites', userController.addFavoriteProduct);

// Remove a product from user's favorites
router.delete('/:id/favorites/:productId', userController.removeFavoriteProduct);

// Update user rating
router.put('/:id/rating', userController.updateUserRating);

module.exports = router;