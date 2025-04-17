const express = require('express');
const router = express.Router();
const badgeController = require('../controllers/badge.controller.js');
const { verifyToken } = require('../middleware/auth.middleware');

// Get all badges
router.get('/', badgeController.findAll);

// Get a single badge by id
router.get('/:id', badgeController.findOne);

// Create a new badge (admin only)
router.post('/', verifyToken, badgeController.create);

// Update a badge (admin only)
router.put('/:id', verifyToken, badgeController.update);

// Assign badge to user (admin or system only)
router.post('/assign', verifyToken, badgeController.assignBadge);

// Check if user qualifies for any badges
router.post('/check', verifyToken, badgeController.checkUserBadges);

module.exports = router;