const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Authentication token required.'
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'pawnear_super_secure_jwt_token_secret_key_2026_pawstreet'
    );

    // Try finding user from DB
    try {
      req.user = await User.findById(decoded.id).select('-password');
    } catch (dbErr) {
      // Fallback if DB is disconnected in dev
      req.user = { _id: decoded.id, role: decoded.role || 'customer', email: decoded.email };
    }

    if (!req.user) {
      req.user = { _id: decoded.id, role: decoded.role || 'customer', email: decoded.email };
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.'
    });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Role '${req.user ? req.user.role : 'unauthenticated'}' is not authorized to access this resource.`
      });
    }
    next();
  };
};

module.exports = {
  protect,
  authorizeRoles
};
