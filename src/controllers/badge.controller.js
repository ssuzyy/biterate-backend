const db = require('../models');
const Badge = db.Badge;
const User = db.User;
const UserBadge = db.UserBadge;
const Review = db.Review;
const Product = db.Product;
const Op = db.Sequelize.Op;

// Create and Save a new Badge
exports.create = async (req, res) => {
  try {
    // Validate request
    if (!req.body.name || !req.body.criteria) {
      return res.status(400).send({
        message: "Badge name and criteria cannot be empty!"
      });
    }

    // Create a Badge
    const badge = {
      name: req.body.name,
      description: req.body.description,
      criteria: req.body.criteria,
      rarityLevel: req.body.rarityLevel || 'common'
    };

    // Save Badge in the database
    const data = await Badge.create(badge);
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Badge."
    });
  }
};

// Retrieve all Badges from the database
exports.findAll = async (req, res) => {
  try {
    const badges = await Badge.findAll();
    res.send(badges);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving badges."
    });
  }
};

// Find a single Badge with an id
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;

    const badge = await Badge.findByPk(id);

    if (!badge) {
      return res.status(404).send({
        message: `Badge with id=${id} was not found.`
      });
    }

    res.send(badge);
  } catch (err) {
    res.status(500).send({
      message: "Error retrieving Badge with id=" + req.params.id
    });
  }
};

// Update a Badge by the id in the request
exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    const [num] = await Badge.update(req.body, {
      where: { badgeID: id }
    });

    if (num === 1) {
      res.send({
        message: "Badge was updated successfully."
      });
    } else {
      res.send({
        message: `Cannot update Badge with id=${id}. Maybe Badge was not found or req.body is empty!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Error updating Badge with id=" + id
    });
  }
};

// Delete a Badge with the specified id in the request
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    const num = await Badge.destroy({
      where: { badgeID: id }
    });

    if (num === 1) {
      res.send({
        message: "Badge was deleted successfully!"
      });
    } else {
      res.send({
        message: `Cannot delete Badge with id=${id}. Maybe Badge was not found!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Could not delete Badge with id=" + id
    });
  }
};

// Get all users who have earned a specific badge
exports.getBadgeUsers = async (req, res) => {
  try {
    const badgeId = req.params.id;
    
    const userBadges = await UserBadge.findAll({
      where: { badgeID: badgeId },
      include: [{
        model: User,
        attributes: ['userID', 'email', 'joinDate', 'userRating']
      }]
    });
    
    res.send(userBadges);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving badge users."
    });
  }
};

// Assign a badge to a user
exports.assignBadge = async (req, res) => {
  try {
    const badgeId = req.params.id;
    const userId = req.body.userId;
    
    if (!userId) {
      return res.status(400).send({
        message: "User ID cannot be empty!"
      });
    }
    
    // Check if badge exists
    const badge = await Badge.findByPk(badgeId);
    if (!badge) {
      return res.status(404).send({
        message: `Badge with id=${badgeId} was not found.`
      });
    }
    
    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send({
        message: `User with id=${userId} was not found.`
      });
    }
    
    // Check if user already has this badge
    const existingBadge = await UserBadge.findOne({
      where: {
        userID: userId,
        badgeID: badgeId
      }
    });
    
    if (existingBadge) {
      return res.status(400).send({
        message: "User already has this badge!"
      });
    }
    
    // Assign badge to user
    const userBadge = await UserBadge.create({
      userID: userId,
      badgeID: badgeId,
      date_earned: new Date()
    });
    
    res.send({
      message: "Badge assigned successfully!",
      data: userBadge
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while assigning badge."
    });
  }
};

// Remove a badge from a user
exports.removeBadge = async (req, res) => {
  try {
    const badgeId = req.params.badgeId;
    const userId = req.params.userId;
    
    const num = await UserBadge.destroy({
      where: {
        badgeID: badgeId,
        userID: userId
      }
    });
    
    if (num === 1) {
      res.send({
        message: "Badge was removed from user successfully!"
      });
    } else {
      res.send({
        message: `Cannot remove badge from user. Maybe the user doesn't have this badge!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while removing badge from user."
    });
  }
};

// Check and award badges based on user activity
exports.checkAndAwardBadges = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Get user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send({
        message: `User with id=${userId} was not found.`
      });
    }
    
    // Get user's reviews
    const reviews = await Review.findAll({
      where: { userID: userId }
    });
    
    // Get user's existing badges
    const userBadges = await UserBadge.findAll({
      where: { userID: userId },
      include: [Badge]
    });
    
    const userBadgeIds = userBadges.map(ub => ub.badgeID);
    
    // Get all badges
    const allBadges = await Badge.findAll();
    
    // Awards to track which badges were awarded
    const awarded = [];
    
    // Check criteria for each badge
    for (const badge of allBadges) {
      // Skip if user already has this badge
      if (userBadgeIds.includes(badge.badgeID)) {
        continue;
      }
      
      // Check badge criteria
      let shouldAward = false;
      
      switch (badge.name) {
        case "Reviewer":
          // Award if user has at least 1 review
          shouldAward = reviews.length >= 1;
          break;
          
        case "Prolific Reviewer":
          // Award if user has at least 5 reviews
          shouldAward = reviews.length >= 5;
          break;
          
        case "Expert Reviewer":
          // Award if user has at least 10 reviews with average helpfulness > 3
          if (reviews.length >= 10) {
            const totalHelpful = reviews.reduce((sum, review) => sum + review.helpfulCount, 0);
            const avgHelpful = totalHelpful / reviews.length;
            shouldAward = avgHelpful > 3;
          }
          break;
          
        case "Trusted Reviewer":
          // Award if user rating is >= 4.0
          shouldAward = user.userRating >= 4.0;
          break;
          
        // Add more badge criteria as needed
      }
      
      if (shouldAward) {
        // Award the badge
        await UserBadge.create({
          userID: userId,
          badgeID: badge.badgeID,
          date_earned: new Date()
        });
        
        awarded.push(badge.name);
      }
    }
    
    res.send({
      message: awarded.length > 0 
        ? `User awarded ${awarded.length} new badge(s): ${awarded.join(", ")}`
        : "No new badges awarded",
      awardedBadges: awarded
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while checking and awarding badges."
    });
  }
};

// Initialize default badges in the system
exports.initializeDefaultBadges = async (req, res) => {
  try {
    const defaultBadges = [
      {
        name: "Newcomer",
        description: "Welcome to BiteRate! You've joined the gluten-free community.",
        criteria: "Join the platform",
        rarityLevel: "common"
      },
      {
        name: "Reviewer",
        description: "You've written your first review!",
        criteria: "Write at least 1 review",
        rarityLevel: "common"
      },
      {
        name: "Prolific Reviewer",
        description: "You're becoming known for your helpful reviews.",
        criteria: "Write at least 5 reviews",
        rarityLevel: "uncommon"
      },
      {
        name: "Expert Reviewer",
        description: "The community values your detailed and helpful reviews.",
        criteria: "Write at least 10 reviews with high helpfulness ratings",
        rarityLevel: "rare"
      },
      {
        name: "Trusted Reviewer",
        description: "Your opinion is highly valued in the community.",
        criteria: "Achieve a user rating of 4.0 or higher",
        rarityLevel: "epic"
      },
      {
        name: "Product Pioneer",
        description: "You're helping expand our database with new products.",
        criteria: "Add at least 3 new products to the database",
        rarityLevel: "uncommon"
      },
      {
        name: "Helpful Community Member",
        description: "You regularly help others by voting on reviews.",
        criteria: "Vote on at least 20 reviews",
        rarityLevel: "uncommon"
      }
    ];
    
    // Check if badges already exist
    const existingBadges = await Badge.findAll();
    
    if (existingBadges.length > 0) {
      return res.status(400).send({
        message: "Badges are already initialized in the system.",
        existingBadges: existingBadges.length
      });
    }
    
    // Create all default badges
    const createdBadges = await Badge.bulkCreate(defaultBadges);
    
    res.send({
      message: "Default badges initialized successfully!",
      badges: createdBadges
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while initializing default badges."
    });
  }
};