const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller.js');
const { verifyToken } = require('../middleware/auth.middleware');

// Create a new review (protected)
router.post('/', verifyToken, reviewController.create);

// Get all reviews
router.get('/', reviewController.findAll);

// Get a single review by id
router.get('/:id', reviewController.findOne);

// Update a review (protected)
router.put('/:id', verifyToken, reviewController.update);

// Delete a review (protected)
router.delete('/:id', verifyToken, reviewController.delete);

// Vote on a review (helpful/unhelpful) (protected)
router.post('/:id/vote', verifyToken, reviewController.vote);

// Get reviews for a product
router.get('/product/:productId', reviewController.getProductReviews);

module.exports = router;