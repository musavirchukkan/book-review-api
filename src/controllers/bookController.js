const Book = require('../models/Book');
const Review = require('../models/Review');
const { asyncHandler, ErrorResponse } = require('../middleware/errorHandler');

// @desc    Add new book
// @route   POST /api/books
// @access  Private
const addBook = asyncHandler(async (req, res, next) => {
    // Add user ID to book
    req.body.addedBy = req.user.id;

    const book = await Book.create(req.body);

    res.status(201).json({
        success: true,
        message: 'Book added successfully',
        data: book
    });
});

// @desc    Get all books with pagination and filters
// @route   GET /api/books
// @access  Public
const getBooks = asyncHandler(async (req, res, next) => {
    // Build query
    let query = {};

    // Filter by author
    if (req.query.author) {
        query.author = { $regex: req.query.author, $options: 'i' };
    }

    // Filter by genre
    if (req.query.genre) {
        query.genre = { $regex: req.query.genre, $options: 'i' };
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Get total count for pagination info
    const total = await Book.countDocuments(query);

    // Execute query with pagination
    const books = await Book.find(query)
        .populate('addedBy', 'username')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(startIndex);

    // Get average rating for each book
    const booksWithRatings = await Promise.all(
        books.map(async (book) => {
            const ratings = await Review.aggregate([
                { $match: { bookId: book._id } },
                {
                    $group: {
                        _id: '$bookId',
                        averageRating: { $avg: '$rating' },
                        totalReviews: { $sum: 1 }
                    }
                }
            ]);

            const bookObj = book.toObject();
            if (ratings.length > 0) {
                bookObj.averageRating = Math.round(ratings[0].averageRating * 10) / 10;
                bookObj.totalReviews = ratings[0].totalReviews;
            } else {
                bookObj.averageRating = 0;
                bookObj.totalReviews = 0;
            }

            return bookObj;
        })
    );

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        };
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        };
    }

    res.status(200).json({
        success: true,
        count: booksWithRatings.length,
        pagination,
        data: booksWithRatings
    });
});

// @desc    Get single book with reviews
// @route   GET /api/books/:id
// @access  Public
const getBook = asyncHandler(async (req, res, next) => {
    const book = await Book.findById(req.params.id).populate('addedBy', 'username');

    if (!book) {
        return next(new ErrorResponse('Book not found', 404));
    }

    // Get reviews with pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const totalReviews = await Review.countDocuments({ bookId: req.params.id });

    const reviews = await Review.find({ bookId: req.params.id })
        .populate('userId', 'username')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(startIndex);

    // Calculate average rating
    const ratingStats = await Review.aggregate([
        { $match: { bookId: book._id } },
        {
            $group: {
                _id: '$bookId',
                averageRating: { $avg: '$rating' },
                totalReviews: { $sum: 1 }
            }
        }
    ]);

    // Pagination for reviews
    const reviewPagination = {};
    if (endIndex < totalReviews) {
        reviewPagination.next = {
            page: page + 1,
            limit
        };
    }
    if (startIndex > 0) {
        reviewPagination.prev = {
            page: page - 1,
            limit
        };
    }

    const bookData = book.toObject();
    if (ratingStats.length > 0) {
        bookData.averageRating = Math.round(ratingStats[0].averageRating * 10) / 10;
        bookData.totalReviews = ratingStats[0].totalReviews;
    } else {
        bookData.averageRating = 0;
        bookData.totalReviews = 0;
    }

    bookData.reviews = {
        data: reviews,
        pagination: reviewPagination,
        count: reviews.length,
        total: totalReviews
    };

    res.status(200).json({
        success: true,
        data: bookData
    });
});

// @desc    Search books by title or author
// @route   GET /api/search
// @access  Public
const searchBooks = asyncHandler(async (req, res, next) => {
    const { q } = req.query;

    if (!q) {
        return next(new ErrorResponse('Search query is required', 400));
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Build search query
    const searchQuery = {
        $or: [
            { title: { $regex: q, $options: 'i' } },
            { author: { $regex: q, $options: 'i' } }
        ]
    };

    // Get total count
    const total = await Book.countDocuments(searchQuery);

    // Execute search
    const books = await Book.find(searchQuery)
        .populate('addedBy', 'username')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(startIndex);

    // Get ratings for each book
    const booksWithRatings = await Promise.all(
        books.map(async (book) => {
            const ratings = await Review.aggregate([
                { $match: { bookId: book._id } },
                {
                    $group: {
                        _id: '$bookId',
                        averageRating: { $avg: '$rating' },
                        totalReviews: { $sum: 1 }
                    }
                }
            ]);

            const bookObj = book.toObject();
            if (ratings.length > 0) {
                bookObj.averageRating = Math.round(ratings[0].averageRating * 10) / 10;
                bookObj.totalReviews = ratings[0].totalReviews;
            } else {
                bookObj.averageRating = 0;
                bookObj.totalReviews = 0;
            }

            return bookObj;
        })
    );

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
        count: booksWithRatings.length,
        total,
        pagination,
        query: q,
        data: booksWithRatings
    });
});

module.exports = {
    addBook,
    getBooks,
    getBook,
    searchBooks
};