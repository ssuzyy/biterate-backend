const db = require('../models');
const Review = db.Review;
const User = db.User;
const Product = db.Product;
const ReviewVote = db.ReviewVote;

// Create and save a new Review
exports.create = async (req, res) => {
  try {
    // Validate request
    if (!req.body.productID || !req.body.productRating) {
      return res.status(400).json({ 
        message: "Product ID and rating are required" 
      });
    }

    // Create a Review object
    const review = {
      userID: req.userId, // From auth middleware
      productID: req.body.productID,
      productRating: req.body.productRating,
      description: req.body.description,
      storePurchasedAt: req.body.storePurchasedAt,
      helpfulCount: 0,
      unhelpfulCount: 0
    };

    // Save Review in the database
    const data = await Review.create(review);
    
    // Return the created review
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({
      message: err.message || "Some error occurred while creating the review."
    });
  }
};

// Retrieve all Reviews
exports.findAll = async (req, res) => {
  try {
    const data = await Review.findAll({
      include: [
        {
          model: User,
          attributes: ['userID', 'email', 'userRating']
        },
        {
          model: Product,
          attributes: ['productID', 'name', 'brand', 'category']
        }
      ]
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({
      message: err.message || "Some error occurred while retrieving reviews."
    });
  }
};

// Find a single Review with an id
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    
    const data = await Review.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['userID', 'email', 'userRating']
        },
        {
          model: Product,
          attributes: ['productID', 'name', 'brand', 'category']
        }
      ]
    });
    
    if (data) {
      res.json(data);
    } else {
      res.status(404).json({
        message: `Cannot find Review with id=${id}.`
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Error retrieving Review with id=" + req.params.id
    });
  }
};

// Update a Review by the id
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    
    // First, check if the review belongs to the user
    const review = await Review.findByPk(id);
    
    if (!review) {
      return res.status(404).json({
        message: `Review with id=${id} not found.`
      });
    }
    
    if (review.userID !== req.userId) {
      return res.status(403).json({
        message: "You do not have permission to update this review."
      });
    }
    
    // Now update the review
    const [num] = await Review.update(req.body, {
      where: { reviewID: id }
    });
    
    if (num === 1) {
      res.json({
        message: "Review was updated successfully."
      });
    } else {
      res.status(500).json({
        message: `Cannot update Review with id=${id}.`
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Error updating Review with id=" + req.params.id
    });
  }
};

// Delete a Review with the specified id
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    
    // First, check if the review belongs to the user
    const review = await Review.findByPk(id);
    
    if (!review) {
      return res.status(404).json({
        message: `Review with id=${id} not found.`
      });
    }
    
    if (review.userID !== req.userId) {
      return res.status(403).json({
        message: "You do not have permission to delete this review."
      });
    }
    
    // Now delete the review
    const num = await Review.destroy({
      where: { reviewID: id }
    });
    
    if (num === 1) {
      res.json({
        message: "Review was deleted successfully!"
      });
    } else {
      res.status(500).json({
        message: `Cannot delete Review with id=${id}.`
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Could not delete Review with id=" + req.params.id
    });
  }
};

// Vote on a review (helpful/unhelpful)
exports.vote = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.userId;
    const { voteType } = req.body;
    
    if (!voteType || !['helpful', 'unhelpful'].includes(voteType)) {
      return res.status(400).json({ 
        message: "Vote type must be either 'helpful' or 'unhelpful'" 
      });
    }
    
    // Check if review exists
    const review = await Review.findByPk(reviewId);
    
    if (!review) {
      return res.status(404).json({
        message: `Review with id=${reviewId} not found.`
      });
    }
    
    // Check if user has already voted on this review
    const existingVote = await ReviewVote.findOne({
      where: {
        reviewID: reviewId,
        userID: userId
      }
    });
    
    if (existingVote) {
      // Update existing vote if the type is different
      if (existingVote.voteType !== voteType) {
        // Remove the old vote count
        if (existingVote.voteType === 'helpful') {
          await Review.update(
            { helpfulCount: review.helpfulCount - 1 },
            { where: { reviewID: reviewId } }
          );
        } else {
          await Review.update(
            { unhelpfulCount: review.unhelpfulCount - 1 },
            { where: { reviewID: reviewId } }
          );
        }
        
        // Add the new vote count
        if (voteType === 'helpful') {
          await Review.update(
            { helpfulCount: review.helpfulCount + 1 },
            { where: { reviewID: reviewId } }
          );
        } else {
          await Review.update(
            { unhelpfulCount: review.unhelpfulCount + 1 },
            { where: { reviewID: reviewId } }
          );
        }
        
        // Update the vote type
        await ReviewVote.update(
          { voteType },
          { where: { voteID: existingVote.voteID } }
        );
        
        res.json({ message: "Vote updated successfully" });
      } else {
        res.status(400).json({
          message: "You have already voted this way on this review"
        });
      }
    } else {
      // Create new vote
      await ReviewVote.create({
        reviewID: reviewId,
        userID: userId,
        voteType
      });
      
      // Update the review's vote count
      if (voteType === 'helpful') {
        await Review.update(
          { helpfulCount: review.helpfulCount + 1 },
          { where: { reviewID: reviewId } }
        );
      } else {
        await Review.update(
          { unhelpfulCount: review.unhelpfulCount + 1 },
          { where: { reviewID: reviewId } }
        );
      }
      
      res.status(201).json({ message: "Vote recorded successfully" });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message || "Some error occurred while processing the vote."
    });
  }
};

// Get reviews for a specific product
exports.getProductReviews = async (req, res) => {
  try {
    const productId = req.params.productId;
    
    const data = await Review.findAll({
      where: { productID: productId },
      include: [
        {
          model: User,
          attributes: ['userID', 'email', 'userRating']
        }
      ],
      order: [['datePosted', 'DESC']]
    });
    
    // Calculate average rating
    let totalRating = 0;
    data.forEach(review => {
      totalRating += review.productRating;
    });
    const averageRating = data.length > 0 ? totalRating / data.length : 0;
    
    res.json({
      reviews: data,
      averageRating,
      totalReviews: data.length
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Some error occurred while retrieving reviews."
    });
  }
};