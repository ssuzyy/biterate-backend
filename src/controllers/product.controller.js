const db = require('../models');
const Product = db.Product;

// Create and Save a new Product
exports.create = async (req, res) => {
  try {
    // Validate request
    if (!req.body.name) {
      return res.status(400).json({ message: "Product name cannot be empty" });
    }

    // Create a Product
    const product = {
      name: req.body.name,
      brand: req.body.brand,
      category: req.body.category,
      ingredients: req.body.ingredients,
      SKU: req.body.SKU,
      createdByUserID: req.userId // From auth middleware
    };

    // Save Product in the database
    const data = await Product.create(product);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({
      message: err.message || "Some error occurred while creating the Product."
    });
  }
};

// Retrieve all Products from the database
exports.findAll = async (req, res) => {
  try {
    const data = await Product.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({
      message: err.message || "Some error occurred while retrieving products."
    });
  }
};

// Find a single Product with an id
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Product.findByPk(id);
    
    if (data) {
      res.json(data);
    } else {
      res.status(404).json({
        message: `Cannot find Product with id=${id}.`
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Error retrieving Product with id=" + req.params.id
    });
  }
};