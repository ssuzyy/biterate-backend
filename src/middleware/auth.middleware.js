const verifyGoogleToken = require('../utils/googleAuth');

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const payload = await verifyGoogleToken(token);
    req.userId = payload.sub; // Google's user ID
    req.email = payload.email;
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = { verifyToken };