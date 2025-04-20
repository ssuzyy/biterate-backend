const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../src/config/db.config.js');

// Initialize Sequelize
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: dbConfig.pool
});

// Define Product model
const Product = sequelize.define("Product", {
  productID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  SKU: DataTypes.STRING,
  name: DataTypes.STRING,
  brand: DataTypes.STRING,
  category: DataTypes.STRING,
  ingredients: DataTypes.TEXT,
  createdByUserID: DataTypes.INTEGER,
  imageUrl: DataTypes.STRING // Added this field to store image URLs
});

// Load product data from JSON file
const productsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../products.json'), 'utf8'));

// Seed the database
async function seedDatabase() {
  try {
    // Force sync to recreate the table (be careful, this will drop the table if it exists)
    await Product.sync({ force: true });
    
    console.log('Products table created successfully.');
    
    // Insert product data
    const productPromises = productsData.map(product => Product.create(product));
    await Promise.all(productPromises);
    
    console.log(`${productsData.length} products were inserted successfully.`);
    
    // Close the database connection
    await sequelize.close();
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Run the seeding function
seedDatabase();