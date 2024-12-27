const jwt = require('jsonwebtoken');
const { asyncHandler } = require('./asyncHandler');

const verifyToken = asyncHandler(async (req, res, next) => {
  try {
    console.log("hrere");
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'Access denied. No token provided or invalid format' 
      });
    }

    // Extract the token (remove "Bearer " prefix)
    const token = authHeader.split(' ')[1];

    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Add decoded user data to request object
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role_id: decoded.role_id
      };
      
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          message: 'Token has expired. Please login again' 
        });
      }
      
      return res.status(401).json({ 
        message: 'Invalid token' 
      });
    }
  } catch (error) {
    console.error('Error in JWT verification:', error);
    return res.status(500).json({ 
      message: 'Internal Server Error' 
    });
  }
});

// Optional: Middleware to check for specific roles
const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role_id)) {
      return res.status(403).json({ 
        message: 'Access denied. Insufficient permissions' 
      });
    }
    next();
  };
};

module.exports = { verifyToken, checkRole };