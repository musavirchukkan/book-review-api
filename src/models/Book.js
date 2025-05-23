const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Book title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    author: {
        type: String,
        required: [true, 'Author name is required'],
        trim: true,
        maxlength: [100, 'Author name cannot exceed 100 characters']
    },
    genre: {
        type: String,
        required: [true, 'Genre is required'],
        trim: true,
        maxlength: [50, 'Genre cannot exceed 50 characters']
    },
    description: {
        type: String,
        required: [true, 'Book description is required'],
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    isbn: {
        type: String,
        trim: true,
        sparse: true,
        unique: true,
        match: [/^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/, 'Please enter a valid ISBN']
    },
    publishedYear: {
        type: Number,
        min: [1000, 'Published year must be after 1000'],
        max: [new Date().getFullYear(), 'Published year cannot be in the future']
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Index for search functionality
bookSchema.index({ title: 'text', author: 'text' });
bookSchema.index({ author: 1 });
bookSchema.index({ genre: 1 });

// Virtual for average rating (will be populated via aggregation)
bookSchema.virtual('averageRating', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'bookId',
    justOne: false
});

// Virtual for total reviews count
bookSchema.virtual('totalReviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'bookId',
    count: true
});

// Ensure virtual fields are serialized
bookSchema.set('toJSON', { virtuals: true });
bookSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Book', bookSchema);