const db = require('../models');
const User = db.User;
const Badge = db.Badge;
const UserBadge = db.UserBadge;
const Review = db.Review;
const FavoriteProduct = db.FavoriteProduct;
const Product = db.Product;
const Op = db.Sequelize.Op;

// Create and Save a new User
exports.create = async (req, res) => {
  try {
    // Validate request
    if (!req.body.email) {
      return res.status(400).send({
        message: "Email cannot be empty!"
      });
    }

    // Check if user with email already exists
    const existingUser = await User.findOne({ where: { email: req.body.email } });
    if (existingUser) {
      return res.status(400).send({
        message: "User with this email already exists!"
      });
    }

    // Create a User
    const user = {
      email: req.body.email,
      password: req.body.password, // Consider hashing before storing
      userRating: req.body.userRating || 0,
    };

    // Save User in the database
    const data = await User.create(user);
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the User."
    });
  }
};

// Retrieve all Users from the database
exports.findAll = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['userID', 'email', 'joinDate', 'userRating']
    });
    res.send(users);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving users."
    });
  }
};

// Find a single User with an id
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await User.findByPk(id, {
      attributes: ['userID', 'email', 'joinDate', 'userRating'],
      include: [
        {
          model: UserBadge,
          include: [{
            model: Badge,
            attributes: ['name', 'description', 'rarityLevel']
          }]
        }
      ]
    });

    if (!user) {
      return res.status(404).send({
        message: `User with id=${id} was not found.`
      });
    }

    res.send(user);
  } catch (err) {
    res.status(500).send({
      message: "Error retrieving User with id=" + req.params.id
    });
  }
};

// Update a User by the id in the request
exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    // Check if the user exists
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).send({
        message: `User with id=${id} was not found.`
      });
    }

    // Update user data
    const [num] = await User.update(req.body, {
      where: { userID: id }
    });

    if (num === 1) {
      res.send({
        message: "User was updated successfully."
      });
    } else {
      res.send({
        message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Error updating User with id=" + id
    });
  }
};

// Delete a User with the specified id in the request
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    const num = await User.destroy({
      where: { userID: id }
    });

    if (num === 1) {
      res.send({
        message: "User was deleted successfully!"
      });
    } else {
      res.send({
        message: `Cannot delete User with id=${id}. Maybe User was not found!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Could not delete User with id=" + id
    });
  }
};

// Get user's badges
exports.getUserBadges = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const badges = await UserBadge.findAll({
      where: { userID: userId },
      include: [{
        model: Badge,
        attributes: ['badgeID', 'name', 'description', 'criteria', 'rarityLevel']
      }]
    });
    
    res.send(badges);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving user badges."
    });
  }
};

// Get user's reviews
exports.getUserReviews = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const reviews = await Review.findAll({
      where: { userID: userId },
      include: [{
        model: Product,
        attributes: ['productID', 'name', 'brand', 'category']
      }]
    });
    
    res.send(reviews);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving user reviews."
    });
  }
};

// Get user's favorite products
exports.getFavoriteProducts = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const favorites = await FavoriteProduct.findAll({
      where: { userID: userId },
      include: [{
        model: Product,
        attributes: ['productID', 'name', 'brand', 'category', 'ingredients']
      }]
    });
    
    res.send(favorites);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving favorite products."
    });
  }
};

// Add a product to user's favorites
exports.addFavoriteProduct = async (req, res) => {
  try {
    if (!req.body.productID) {
      return res.status(400).send({
        message: "Product ID cannot be empty!"
      });
    }

    const userId = req.params.id;
    const productId = req.body.productID;

    // Check if already in favorites
    const existingFavorite = await FavoriteProduct.findOne({
      where: {
        userID: userId,
        productID: productId
      }
    });

    if (existingFavorite) {
      return res.status(400).send({
        message: "This product is already in favorites!"
      });
    }

    // Add to favorites
    const favorite = await FavoriteProduct.create({
      userID: userId,
      productID: productId
    });

    res.send(favorite);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while adding favorite product."
    });
  }
};

// Remove a product from user's favorites
exports.removeFavoriteProduct = async (req, res) => {
  try {
    const userId = req.params.id;
    const productId = req.params.productId;

    const num = await FavoriteProduct.destroy({
      where: {
        userID: userId,
        productID: productId
      }
    });

    if (num === 1) {
      res.send({
        message: "Product was removed from favorites successfully!"
      });
    } else {
      res.send({
        message: `Cannot remove product from favorites. Maybe it was not found!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while removing favorite product."
    });
  }
};

// Update user rating based on reviews and activity
exports.updateUserRating = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Get user's reviews
    const reviews = await Review.findAll({
      where: { userID: userId }
    });
    
    // Calculate rating based on helpful votes, number of reviews, etc.
    let helpfulCount = 0;
    let unhelpfulCount = 0;
    
    reviews.forEach(review => {
      helpfulCount += review.helpfulCount || 0;
      unhelpfulCount += review.unhelpfulCount || 0;
    });
    
    // Simple rating formula: (helpful votes / total votes) * (1 + number of reviews/10)
    // Can be adjusted as needed
    let userRating = 0;
    const totalVotes = helpfulCount + unhelpfulCount;
    
    if (totalVotes > 0) {
      const voteRatio = helpfulCount / totalVotes;
      const reviewBonus = 1 + (reviews.length / 10);
      userRating = voteRatio * reviewBonus;
      
      // Cap at 5.0
      userRating = Math.min(userRating * 5, 5.0);
    } else if (reviews.length > 0) {
      // If no votes but has reviews, give a base rating
      userRating = 2.5;
    }
    
    // Update user rating
    const [num] = await User.update(
      { userRating },
      { where: { userID: userId } }
    );
    
    if (num === 1) {
      // Get updated user
      const updatedUser = await User.findByPk(userId);
      res.send({
        message: "User rating updated successfully!",
        userRating: updatedUser.userRating
      });
    } else {
      res.send({
        message: `Cannot update user rating. Maybe user was not found!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while updating user rating."
    });
  }
};