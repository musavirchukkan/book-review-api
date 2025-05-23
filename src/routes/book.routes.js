const express = require('express');
const router = express.Router();

const {
    addBook,
    getBooks,
    getBook,
    searchBooks
} = require('../controllers/bookController');

const { addReview } = require('../controllers/reviewController');

const { protect } = require('../middleware/auth');
const {
    validateBook,
    validateReview,
    validatePagination,
    validateObjectId,
    validateSearch
} = require('../middleware/validation');

// Public routes
router.get('/', validatePagination, getBooks);
router.get('/search', validateSearch, validatePagination, searchBooks);
router.get('/:id', validateObjectId, validatePagination, getBook);

// Protected routes
router.post('/', protect, validateBook, addBook);
router.post('/:id/reviews', protect, validateObjectId, validateReview, addReview);

module.exports = router;