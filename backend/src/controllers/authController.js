const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { jwtSecret, jwtExpiration } = require('../config/auth');

const generateToken = (userId) => {
  return jwt.sign({ userId }, jwtSecret, { expiresIn: jwtExpiration });
};

const register = async (req, res) => {
  try {
    const { email, password, role, first_name, last_name, phone } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        error: 'User with this email already exists'
      });
    }

    const user = await User.create({
      email,
      password_hash: password,
      role,
      first_name,
      last_name,
      phone
    });

    const token = generateToken(user.id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Internal server error during registration'
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user || !user.is_active) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal server error during login'
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password_hash'] }
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json({
      user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { first_name, last_name, phone } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    await user.update({
      first_name,
      last_name,
      phone
    });

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};