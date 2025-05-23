const Review = require('../models/Review');
const Book = require('../models/Book');
const { asyncHandler, ErrorResponse } = require('../middleware/errorHandler');

// @desc    Add review for a book
// @route   POST /api/books/:id/reviews
// @access  Private
const addReview = asyncHandler(async (req, res, next) => {
    const { rating, comment } = req.body;
    const bookId = req.params.id;
    const userId = req.user.id;

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
        return next(new ErrorResponse('Book not found', 404));
    }

    // Check if user has already reviewed this book
    const existingReview = await Review.findOne({ bookId, userId });
    if (existingReview) {
        return next(new ErrorResponse('You have already reviewed this book', 400));
    }

    // Create review
    const review = await Review.create({
        bookId,
        userId,
        rating,
        comment
    });

    // Populate user info
    await review.populate('userId', 'username');

    res.status(201).json({
        success: true,
        message: 'Review added successfully',
        data: review
    });
});

// @desc    Update user's own review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = asyncHandler(async (req, res, next) => {
    const { rating, comment } = req.body;

    // Find review
    let review = await Review.findById(req.params.id);

    if (!review) {
        return next(new ErrorResponse('Review not found', 404));
    }

    // Check if user owns the review
    if (review.userId.toString() !== req.user.id) {
        return next(new ErrorResponse('Not authorized to update this review', 403));
    }

    // Update review
    review = await Review.findByIdAndUpdate(
        req.params.id,
        { rating, comment },
        { new: true, runValidators: true }
    ).populate('userId', 'username');

    res.status(200).json({
        success: true,
        message: 'Review updated successfully',
        data: review
    });
});

// @desc    Delete user's own review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id);

    if (!review) {
        return next(new ErrorResponse('Review not found', 404));
    }

    // Check if user owns the review
    if (review.userId.toString() !== req.user.id) {
        return next(new ErrorResponse('Not authorized to delete this review', 403));
    }

    // Delete review
    await Review.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: 'Review deleted successfully'
    });
});

// @desc    Get all reviews by a user
// @route   GET /api/reviews/user/:userId
// @access  Public
const getUserReviews = asyncHandler(async (req, res, next) => {
    const userId = req.params.userId;

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Get total count
    const total = await Review.countDocuments({ userId });

    // Get reviews
    const reviews = await Review.find({ userId })
        .populate('bookId', 'title author')
        .populate('userId', 'username')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(startIndex);

    // Pagination
    const pagination = {};
    if (endIndex < total) {
        pagination.next = { page: page + 1, limit };
    }
    if (startIndex > 0) {
        pagination.prev = { page: page - 1, limit };
    }

    res.status(200).json({
        success: true,
        count: reviews.length,
        total,
        pagination,
        data: reviews
    });
});

// @desc    Get review by ID
// @route   GET /api/reviews/:id
// @access  Public
const getReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id)
        .populate('bookId', 'title author')
        .populate('userId', 'username');

    if (!review) {
        return next(new ErrorResponse('Review not found', 404));
    }

    res.status(200).json({
        success: true,
        data: review
    });
});

module.exports = {
    addReview,
    updateReview,
    deleteReview,
    getUserReviews,
    getReview
};