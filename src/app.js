const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const { errorHandler } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth.routes');
const bookRoutes = require('./routes/book.routes');
const reviewRoutes = require('./routes/review.routes');

const app = express();

// Security middleware
app.use(helmet());

// Enable CORS
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://yourdomain.com'] // Replace with your frontend URL
        : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

app.use('/api/', limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
    const healthcheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now(),
        environment: process.env.NODE_ENV
    };
    res.status(200).json(healthcheck);
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/reviews', reviewRoutes);

// Search route (alternative to /api/books/search)
const { searchBooks } = require('./controllers/bookController');
const { validateSearch, validatePagination } = require('./middleware/validation');
app.get('/api/search', validateSearch, validatePagination, searchBooks);

// Welcome route
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: '📚 Welcome to Book Review API',
        version: '1.0.0',
        documentation: '/api/docs',
        endpoints: {
            auth: {
                signup: 'POST /api/auth/signup',
                login: 'POST /api/auth/login',
                me: 'GET /api/auth/me'
            },
            books: {
                getAll: 'GET /api/books',
                getOne: 'GET /api/books/:id',
                create: 'POST /api/books',
                search: 'GET /api/search'
            },
            reviews: {
                create: 'POST /api/books/:id/reviews',
                update: 'PUT /api/reviews/:id',
                delete: 'DELETE /api/reviews/:id',
                getOne: 'GET /api/reviews/:id',
                getUserReviews: 'GET /api/reviews/user/:userId'
            }
        }
    });
});

// Handle undefined routes
app.all('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

// Error handler middleware (must be last)
app.use(errorHandler);

module.exports = app;