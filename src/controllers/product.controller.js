const db = require("../models");
const { Product, Review, User } = db;

// Get all products
exports.findAll = async (req, res) => {
  try {
    // Use a raw SQL query to get products with their ratings
    const products = await db.sequelize.query(`
      SELECT 
        p.*,
        COALESCE(AVG(r."productRating"), 0) as "averageRating",
        COUNT(r."reviewID") as "reviewCount"
      FROM 
        "Products" p
      LEFT JOIN 
        "Reviews" r ON p."productID" = r."productID"
      GROUP BY 
        p."productID"
      ORDER BY 
        p."name"
    `, { type: db.sequelize.QueryTypes.SELECT });    
    
    // Format the results to match your existing structure
    const formattedProducts = products.map(product => ({
      ...product,
      averageRating: Number(product.averageRating.toFixed(1)),
      reviewCount: Number(product.reviewCount),
      avgRating: Number(product.averageRating.toFixed(1)) // Keep existing property name for backward compatibility
    }));
    
    res.status(200).json(formattedProducts);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get product by ID
exports.findOne = async (req, res) => {
  try {
    // First get the product with rating info using SQL
    const productWithRatings = await db.sequelize.query(`
      SELECT 
        p.*,
        COALESCE(AVG(r."productRating"), 0) as "averageRating",
        COUNT(r."reviewID") as "reviewCount"
      FROM 
        "Products" p
      LEFT JOIN 
        "Reviews" r ON p."productID" = r."productID"
      WHERE 
        p."productID" = :productId
      GROUP BY 
        p."productID"
    `, { 
      replacements: { productId: req.params.id },
      type: db.sequelize.QueryTypes.SELECT 
    });
    
    if (productWithRatings.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    // Then get the reviews and users for this product
    const productWithDetails = await Product.findByPk(req.params.id, {
      include: [{
        model: Review,
        include: [{
          model: User,
          attributes: ['email']
        }]
      }]
    });
    
    if (!productWithDetails) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    // Combine the SQL rating data with the Sequelize detailed data
    const productObj = productWithDetails.toJSON();
    const ratingInfo = productWithRatings[0];
    
    // Format and return the combined data
    res.status(200).json({
      ...productObj,
      averageRating: Number(ratingInfo.averageRating.toFixed(1)),
      reviewCount: Number(ratingInfo.reviewCount),
      avgRating: Number(ratingInfo.averageRating.toFixed(1)) // Keep existing property name for backward compatibility
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