const db = require('../models');
const User = db.User;
const { verifyGoogleToken } = require('../utils/googleAuth');

// Google OAuth authentication
exports.googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ success: false, message: "Token is required" });
    }
    
    // Verify Google token
    const payload = await verifyGoogleToken(token);
    
    if (!payload) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
    
    // Extract user data from payload
    const { email, name, picture } = payload;
    
    // Check if user already exists
    let user = await User.findOne({ where: { email } });
    
    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        email,
        // Store additional user data as needed
        // No password needed for OAuth users
      });
    }
    
    // Generate session token or JWT (implement your own auth mechanism)
    // For example:
    // const token = jwt.sign({ id: user.userID }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    res.status(200).json({
      success: true,
      message: "Authentication successful",
      user: {
        id: user.userID,
        email: user.email,
        joinDate: user.joinDate,
        userRating: user.userRating
      },
      // token: token // Uncomment when we implement JWT
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({ success: false, message: "Authentication failed", error: error.message });
  }
};

// Check authentication status
exports.checkAuthStatus = async (req, res) => {
  try {
    // This function should verify the user's session or JWT token
    // For now, returning a placeholder response
    res.status(200).json({ 
      authenticated: false,
      message: "Auth status check not yet implemented" 
    });
  } catch (error) {
    console.error("Auth status check error:", error);
    res.status(500).json({ success: false, message: "Status check failed", error: error.message });
  }
};