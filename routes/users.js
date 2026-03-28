const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// @route   POST /api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide email and password' 
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Check if user is active
    if (user.status !== 'active') {
      return res.status(401).json({ 
        success: false, 
        message: 'Account is inactive. Please contact administrator.' 
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid password' 
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        permissions: user.permissions,
        avatar: user.avatar,
        lastLogin: user.lastLogin,
        createdDate: user.createdDate
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/users
// @desc    Get all users
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdDate: -1 });
    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   POST /api/users
// @desc    Create a new user
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { name, email, phone, password, role, status, permissions } = req.body;

    // Validate input
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User with this email already exists' 
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      phone,
      password,
      role: role || 'staff',
      status: status || 'active',
      permissions: permissions || []
    });

    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      user: userResponse
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, email, phone, role, status, permissions } = req.body;

    // Find user
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: 'User with this email already exists' 
        });
      }
    }

    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (role) user.role = role;
    if (status) user.status = status;
    if (permissions) user.permissions = permissions;

    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      user: userResponse
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   DELETE /api/users/delete-all
// @desc    Delete all users
// @access  Private
router.delete('/delete-all', auth, async (req, res) => {
  try {
    const result = await User.deleteMany({});
    
    res.json({
      success: true,
      message: `All ${result.deletedCount} users deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Delete all users error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/users/current
// @desc    Get current user
// @access  Private
router.get('/current', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;
