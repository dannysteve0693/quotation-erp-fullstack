const jwt = require('jsonwebtoken');
const { jwtSecret, roles } = require('../config/auth');
const { User } = require('../models');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        error: 'Access denied. No token provided.' 
      });
    }

    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findByPk(decoded.userId);

    if (!user || !user.is_active) {
      return res.status(401).json({ 
        error: 'Invalid token or user not found.' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired.' 
      });
    }
    return res.status(403).json({ 
      error: 'Invalid token.' 
    });
  }
};

const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required.' 
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions.' 
      });
    }

    next();
  };
};

const authorizeCustomerOrSales = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Authentication required.' 
    });
  }

  if (req.user.role === roles.SALES) {
    return next();
  }

  if (req.user.role === roles.CUSTOMER) {
    return next();
  }

  return res.status(403).json({ 
    error: 'Insufficient permissions.' 
  });
};

const authorizeResourceOwner = (resourceUserIdField = 'customer_id') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required.' 
      });
    }

    if (req.user.role === roles.SALES) {
      return next();
    }

    if (req.user.role === roles.CUSTOMER) {
      const resourceUserId = req.resource && req.resource[resourceUserIdField];
      if (resourceUserId && resourceUserId !== req.user.id) {
        return res.status(403).json({ 
          error: 'Access denied. You can only access your own resources.' 
        });
      }
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRole,
  authorizeCustomerOrSales,
  authorizeResourceOwner
};