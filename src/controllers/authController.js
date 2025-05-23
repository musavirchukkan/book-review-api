const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const { asyncHandler, ErrorResponse } = require('../middleware/errorHandler');

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
const signup = asyncHandler(async (req, res, next) => {
    const { username, email, password } = req.body;

    // Create user
    const user = await User.create({
        username,
        email,
        password
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
            user,
            token
        }
    });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Generate token
    const token = generateToken(user._id);

    // Remove password from output
    user.password = undefined;

    res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
            user,
            token
        }
    });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    });
});

module.exports = {
    signup,
    login,
    getMe
};