const express = require('express');
const router = express.Router();

const {
    updateReview,
    deleteReview,
    getUserReviews,
    getReview
} = require('../controllers/reviewController');

const { protect } = require('../middleware/auth');
const {
    validateReview,
    validatePagination,
    validateObjectId
} = require('../middleware/validation');

// Public routes
router.get('/user/:userId', validateObjectId, validatePagination, getUserReviews);
router.get('/:id', validateObjectId, getReview);

// Protected routes
router.put('/:id', protect, validateObjectId, validateReview, updateReview);
router.delete('/:id', protect, validateObjectId, deleteReview);

module.exports = router;