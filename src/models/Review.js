const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: [true, 'Book ID is required']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5']
    },
    comment: {
        type: String,
        required: [true, 'Review comment is required'],
        trim: true,
        minlength: [10, 'Comment must be at least 10 characters'],
        maxlength: [500, 'Comment cannot exceed 500 characters']
    }
}, {
    timestamps: true
});

// Compound index to ensure one review per user per book
reviewSchema.index({ bookId: 1, userId: 1 }, { unique: true });

// Populate user info when querying reviews
reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'userId',
        select: 'username'
    });
    next();
});

module.exports = mongoose.model('Review', reviewSchema);