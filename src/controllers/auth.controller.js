const admin = require('../config/firebaseAdmin');
const db = require('../models');
const User = db.User;

exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ message: 'No token provided' });
    }

    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email } = decodedToken;
    
    // Find or create user in your database
    let [user, created] = await User.findOrCreate({
      where: { email },
      defaults: {
        email,
        firebaseUid: uid,
        joinDate: new Date(),
        userRating: 0
      }
    });

    // If user exists but doesn't have firebaseUid, update it
    if (!created && !user.firebaseUid) {
      user.firebaseUid = uid;
      await user.save();
    }

    // Create session data to return to client
    const userData = {
      id: user.userID,
      email: user.email,
      joinDate: user.joinDate,
      userRating: user.userRating
    };

    return res.status(200).json({
      ...userData,
      token // Return the token so it can be stored client-side
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Authentication failed', error: error.message });
  }
};

// Create a test user (admin use only)
exports.createTestUser = async (req, res) => {
  try {
    const { email, password, displayName } = req.body;
    
    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Create user in Firebase
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: displayName || email.split('@')[0],
      emailVerified: true
    });
    
    // Create user in your database
    const user = await User.create({
      email,
      firebaseUid: userRecord.uid,
      joinDate: new Date(),
      userRating: 0
    });
    
    return res.status(201).json({
      message: 'Test user created successfully',
      uid: userRecord.uid,
      userID: user.userID
    });
  } catch (error) {
    console.error('Error creating test user:', error);
    return res.status(500).json({ message: 'Failed to create test user', error: error.message });
  }
};

// Get user data
exports.getUserData = async (req, res) => {
  try {
    // The user object was attached in the middleware
    const { uid } = req.user;
    
    const user = await User.findOne({
      where: { firebaseUid: uid }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.status(200).json({
      id: user.userID,
      email: user.email,
      joinDate: user.joinDate,
      userRating: user.userRating
    });
  } catch (error) {
    console.error('Error getting user data:', error);
    return res.status(500).json({ message: 'Failed to get user data', error: error.message });
  }
};