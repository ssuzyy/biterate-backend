const db = require("../models");
const Product = db.Product;
const Review = db.Review;
const User = db.User;

// Get all products
exports.findAll = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{
        model: Review,
        attributes: ['productRating']
      }]
    });
    
    // Calculate average rating for each product
    const productsWithRating = products.map(product => {
      const productObj = product.toJSON();
      
      let avgRating = 0;
      if (productObj.Reviews && productObj.Reviews.length > 0) {
        const sum = productObj.Reviews.reduce((total, review) => total + review.productRating, 0);
        avgRating = sum / productObj.Reviews.length;
      }
      
      return {
        ...productObj,
        avgRating: Number(avgRating.toFixed(1))
      };
    });
    
    res.status(200).json(productsWithRating);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get product by ID
exports.findOne = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{
        model: Review,
        include: [{
          model: User,
          attributes: ['email']
        }]
      }]
    });
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    // Calculate average rating
    const productObj = product.toJSON();
    let avgRating = 0;
    
    if (productObj.Reviews && productObj.Reviews.length > 0) {
      const sum = productObj.Reviews.reduce((total, review) => total + review.productRating, 0);
      avgRating = sum / productObj.Reviews.length;
    }
    
    res.status(200).json({
      ...productObj,
      avgRating: Number(avgRating.toFixed(1))
    });
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ message: err.message });
  }
};

// Create new product
exports.create = async (req, res) => {
  try {
    // Validate request
    if (!req.body.name || !req.body.brand) {
      return res.status(400).json({ message: "Name and brand are required" });
    }
    
    const product = await Product.create({
      SKU: req.body.SKU,
      name: req.body.name,
      brand: req.body.brand,
      category: req.body.category,
      ingredients: req.body.ingredients,
      createdByUserID: req.body.createdByUserID // Should be the logged-in user's ID
    });
    
    res.status(201).json(product);
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ message: err.message });
  }
};

// Update product
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    
    const num = await Product.update(req.body, {
      where: { productID: id }
    });
    
    if (num == 1) {
      res.status(200).json({ message: "Product updated successfully" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ message: err.message });
  }
};

// Delete product
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    
    const num = await Product.destroy({
      where: { productID: id }
    });
    
    if (num == 1) {
      res.status(200).json({ message: "Product deleted successfully" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ message: err.message });
  }
};