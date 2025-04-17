const express = require('express');
const router = express.Router();
const badgeController = require('../controllers/badge.controller.js');

// Create a new Badge
router.post('/', badgeController.create);

// Initialize default badges
router.post('/initialize', badgeController.initializeDefaultBadges);

// Retrieve all Badges
router.get('/', badgeController.findAll);

// Retrieve a single Badge with id
router.get('/:id', badgeController.findOne);

// Update a Badge with id
router.put('/:id', badgeController.update);

// Delete a Badge with id
router.delete('/:id', badgeController.delete);

// Get all users who have earned a specific badge
router.get('/:id/users', badgeController.getBadgeUsers);

// Assign a badge to a user
router.post('/:id/assign', badgeController.assignBadge);

// Remove a badge from a user
router.delete('/:badgeId/users/:userId', badgeController.removeBadge);

// Check and award badges based on user activity
router.post('/check/:id', badgeController.checkAndAwardBadges);

module.exports = router;