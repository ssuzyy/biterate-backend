const express = require('express');
const router = express.Router();
const products = require('../controllers/product.controller.js');
const { verifyToken } = require('../middleware/auth.middleware');

// Create a new Product (protected route)
router.post('/', verifyToken, products.create);

// Retrieve all Products (public route)
router.get('/', products.findAll);

// Retrieve a single Product with id (public route)
router.get('/:id', products.findOne);

module.exports = router;