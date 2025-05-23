# 📚 Book Review API

A comprehensive RESTful API for a Book Review System built with Node.js, Express, MongoDB, and JWT authentication. This application allows users to manage books, write reviews, and search through a collection of books with advanced features like pagination, filtering, and user authentication.

## 🚀 Features

- **User Authentication**: JWT-based authentication with secure password hashing
- **Book Management**: Add, view, and search books with detailed information
- **Review System**: Users can add, update, and delete their own book reviews
- **Advanced Search**: Search books by title or author with partial matching
- **Pagination**: Efficient pagination for books and reviews
- **Data Validation**: Comprehensive input validation and sanitization
- **Security**: Rate limiting, CORS, helmet security headers
- **Error Handling**: Centralized error handling with meaningful messages

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express-validator
- **Security**: Helmet, CORS, Rate limiting
- **Password Hashing**: bcryptjs
- **Environment Variables**: dotenv

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16.0.0 or higher)
- **npm** (v7.0.0 or higher)
- **MongoDB** (v4.4 or higher)

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/book-review-api.git
cd book-review-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory and add the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/book-review-api

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-complex
JWT_EXPIRE=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Database Setup

Make sure MongoDB is running on your system:

```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Ubuntu/Linux
sudo systemctl start mongod

# On Windows
net start MongoDB
```

### 5. Start the Application

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 📚 Database Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  username: String (unique, 3-20 chars),
  email: String (unique, valid email),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Books Collection

```javascript
{
  _id: ObjectId,
  title: String (1-200 chars),
  author: String (1-100 chars),
  genre: String (1-50 chars),
  description: String (10-1000 chars),
  isbn: String (optional, valid ISBN),
  publishedYear: Number (1000-current year),
  addedBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Reviews Collection

```javascript
{
  _id: ObjectId,
  bookId: ObjectId (ref: Book),
  userId: ObjectId (ref: User),
  rating: Number (1-5),
  comment: String (10-500 chars),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔗 API Endpoints

### Authentication Endpoints

#### Register User

```http
POST /api/auth/signup
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Login User

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Get Current User

```http
GET /api/auth/me
Authorization: Bearer your-jwt-token
```

### Book Endpoints

#### Get All Books (with pagination and filters)

```http
GET /api/books?page=1&limit=10&author=tolkien&genre=fantasy
```

#### Get Single Book with Reviews

```http
GET /api/books/648a1b2c3d4e5f6789012345?page=1&limit=5
```

#### Add New Book (Protected)

```http
POST /api/books
Authorization: Bearer your-jwt-token
Content-Type: application/json

{
  "title": "The Hobbit",
  "author": "J.R.R. Tolkien",
  "genre": "Fantasy",
  "description": "A hobbit's unexpected journey...",
  "isbn": "978-0547928227",
  "publishedYear": 1937
}
```

#### Search Books

```http
GET /api/search?q=tolkien&page=1&limit=10
```

### Review Endpoints

#### Add Review (Protected)

```http
POST /api/books/648a1b2c3d4e5f6789012345/reviews
Authorization: Bearer your-jwt-token
Content-Type: application/json

{
  "rating": 5,
  "comment": "An amazing adventure story that captivates readers of all ages!"
}
```

#### Update Review (Protected)

```http
PUT /api/reviews/648a1b2c3d4e5f6789012346
Authorization: Bearer your-jwt-token
Content-Type: application/json

{
  "rating": 4,
  "comment": "Updated review: Still a great book, but not perfect."
}
```

#### Delete Review (Protected)

```http
DELETE /api/reviews/648a1b2c3d4e5f6789012346
Authorization: Bearer your-jwt-token
```

#### Get User's Reviews

```http
GET /api/reviews/user/648a1b2c3d4e5f6789012347?page=1&limit=10
```

## 🧪 Testing with cURL

### 1. Register a new user

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

### 2. Login and get token

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

### 3. Add a book (replace TOKEN with actual JWT)

```bash
curl -X POST http://localhost:5000/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "title": "1984",
    "author": "George Orwell",
    "genre": "Dystopian Fiction",
    "description": "A dystopian social science fiction novel and cautionary tale.",
    "publishedYear": 1949
  }'
```

### 4. Get all books

```bash
curl http://localhost:5000/api/books
```

### 5. Search books

```bash
curl "http://localhost:5000/api/search?q=orwell"
```

### 6. Add a review (replace BOOK_ID and TOKEN)

```bash
curl -X POST http://localhost:5000/api/books/BOOK_ID/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "rating": 5,
    "comment": "A thought-provoking masterpiece that remains relevant today."
  }'
```

## 🎯 Postman Collection

You can import the following collection into Postman for easier testing:

```json
{
  "info": {
    "name": "Book Review API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Passwords are hashed using bcrypt with salt rounds
- **Rate Limiting**: API calls are rate-limited to prevent abuse
- **Input Validation**: All inputs are validated and sanitized
- **CORS Configuration**: Cross-origin requests are properly configured
- **Security Headers**: Helmet middleware adds security headers
- **Authorization**: Users can only modify their own reviews

## 📊 Response Format

All API responses follow a consistent format:

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  },
  "count": 10,
  "pagination": {
    "next": { "page": 2, "limit": 10 },
    "prev": { "page": 1, "limit": 10 }
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Please enter a valid email address"
    }
  ]
}
```

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bookreviews
JWT_SECRET=your-production-jwt-secret-very-long-and-secure
JWT_EXPIRE=7d
```

### Docker Support (Optional)

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🎨 Design Decisions & Assumptions

1. **One Review Per User Per Book**: Each user can only submit one review per book to maintain review integrity
2. **Soft Validation**: ISBN validation is optional to accommodate books without ISBN numbers
3. **Pagination Defaults**: Default page size is 10 items to balance performance and usability
4. **Search Implementation**: Case-insensitive partial matching for better user experience
5. **Rating System**: 1-5 star rating system for consistency and simplicity
6. **Password Requirements**: Minimum 6 characters with complexity requirements for security
7. **Error Handling**: Comprehensive error handling with user-friendly messages
8. **API Versioning**: Routes are prefixed with `/api` for future versioning capability

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Express.js team for the excellent web framework
- MongoDB team for the powerful NoSQL database
- JWT.io for secure authentication implementation
- Node.js community for excellent packages and documentation

## 📞 Support

If you have any questions or need help with setup, please:

1. Check the [Issues](https://github.com/yourusername/book-review-api/issues) section
2. Create a new issue with detailed description
3. Contact: your.email@example.com

## 🔄 Version History

- **v1.0.0** - Initial release with core functionality
  - User authentication and authorization
  - Book management with search and filtering
  - Review system with CRUD operations
  - Comprehensive API documentation

---

**Built with ❤️ for the developer community**
