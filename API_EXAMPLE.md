# 🚀 API Usage Examples

## Complete Workflow Example

This document provides a complete workflow example demonstrating how to use the Book Review API from user registration to creating reviews.

## Step 1: User Registration

### Request

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "bookworm123",
    "email": "reader@example.com",
    "password": "SecurePass123"
  }'
```

### Response

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "648a1b2c3d4e5f6789012345",
      "username": "bookworm123",
      "email": "reader@example.com",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## Step 2: User Login

### Request

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "reader@example.com",
    "password": "SecurePass123"
  }'
```

### Response

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "648a1b2c3d4e5f6789012345",
      "username": "bookworm123",
      "email": "reader@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## Step 3: Add a Book

### Request

```bash
curl -X POST http://localhost:5000/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "title": "To Kill a Mockingbird",
    "author": "Harper Lee",
    "genre": "Classic Literature",
    "description": "A gripping, heart-wrenching, and wholly remarkable tale of coming-of-age in a South poisoned by virulent prejudice.",
    "isbn": "978-0-06-112008-4",
    "publishedYear": 1960
  }'
```

### Response

```json
{
  "success": true,
  "message": "Book added successfully",
  "data": {
    "_id": "648a1b2c3d4e5f6789012346",
    "title": "To Kill a Mockingbird",
    "author": "Harper Lee",
    "genre": "Classic Literature",
    "description": "A gripping, heart-wrenching, and wholly remarkable tale of coming-of-age in a South poisoned by virulent prejudice.",
    "isbn": "978-0-06-112008-4",
    "publishedYear": 1960,
    "addedBy": "648a1b2c3d4e5f6789012345",
    "createdAt": "2024-01-15T10:35:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z"
  }
}
```

## Step 4: Get All Books

### Request

```bash
curl "http://localhost:5000/api/books?page=1&limit=5"
```

### Response

```json
{
  "success": true,
  "count": 5,
  "pagination": {
    "next": {
      "page": 2,
      "limit": 5
    }
  },
  "data": [
    {
      "_id": "648a1b2c3d4e5f6789012346",
      "title": "To Kill a Mockingbird",
      "author": "Harper Lee",
      "genre": "Classic Literature",
      "description": "A gripping, heart-wrenching...",
      "publishedYear": 1960,
      "addedBy": {
        "_id": "648a1b2c3d4e5f6789012345",
        "username": "bookworm123"
      },
      "averageRating": 4.5,
      "totalReviews": 3,
      "createdAt": "2024-01-15T10:35:00.000Z"
    }
  ]
}
```

## Step 5: Search Books

### Request

```bash
curl "http://localhost:5000/api/search?q=harper%20lee&page=1&limit=10"
```

### Response

```json
{
  "success": true,
  "count": 1,
  "total": 1,
  "query": "harper lee",
  "data": [
    {
      "_id": "648a1b2c3d4e5f6789012346",
      "title": "To Kill a Mockingbird",
      "author": "Harper Lee",
      "genre": "Classic Literature",
      "averageRating": 4.5,
      "totalReviews": 3
    }
  ]
}
```

## Step 6: Add a Review

### Request

```bash
curl -X POST http://localhost:5000/api/books/648a1b2c3d4e5f6789012346/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "rating": 5,
    "comment": "An absolutely masterful exploration of moral courage and human dignity. Harper Lee created characters that feel real and a story that resonates across generations."
  }'
```

### Response

```json
{
  "success": true,
  "message": "Review added successfully",
  "data": {
    "_id": "648a1b2c3d4e5f6789012347",
    "bookId": "648a1b2c3d4e5f6789012346",
    "userId": {
      "_id": "648a1b2c3d4e5f6789012345",
      "username": "bookworm123"
    },
    "rating": 5,
    "comment": "An absolutely masterful exploration of moral courage and human dignity. Harper Lee created characters that feel real and a story that resonates across generations.",
    "createdAt": "2024-01-15T10:40:00.000Z",
    "updatedAt": "2024-01-15T10:40:00.000Z"
  }
}
```

## Step 7: Get Book with Reviews

### Request

```bash
curl "http://localhost:5000/api/books/648a1b2c3d4e5f6789012346?page=1&limit=5"
```

### Response

```json
{
  "success": true,
  "data": {
    "_id": "648a1b2c3d4e5f6789012346",
    "title": "To Kill a Mockingbird",
    "author": "Harper Lee",
    "genre": "Classic Literature",
    "description": "A gripping, heart-wrenching...",
    "averageRating": 4.7,
    "totalReviews": 4,
    "addedBy": {
      "_id": "648a1b2c3d4e5f6789012345",
      "username": "bookworm123"
    },
    "reviews": {
      "data": [
        {
          "_id": "648a1b2c3d4e5f6789012347",
          "rating": 5,
          "comment": "An absolutely masterful exploration...",
          "userId": {
            "_id": "648a1b2c3d4e5f6789012345",
            "username": "bookworm123"
          },
          "createdAt": "2024-01-15T10:40:00.000Z"
        }
      ],
      "count": 1,
      "total": 4,
      "pagination": {
        "next": {
          "page": 2,
          "limit": 5
        }
      }
    }
  }
}
```

## Step 8: Update Review

### Request

```bash
curl -X PUT http://localhost:5000/api/reviews/648a1b2c3d4e5f6789012347 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "rating": 4,
    "comment": "Upon second reading, still a powerful novel but I noticed some pacing issues in the middle chapters. Still highly recommended."
  }'
```

### Response

```json
{
  "success": true,
  "message": "Review updated successfully",
  "data": {
    "_id": "648a1b2c3d4e5f6789012347",
    "bookId": "648a1b2c3d4e5f6789012346",
    "userId": {
      "_id": "648a1b2c3d4e5f6789012345",
      "username": "bookworm123"
    },
    "rating": 4,
    "comment": "Upon second reading, still a powerful novel but I noticed some pacing issues in the middle chapters. Still highly recommended.",
    "createdAt": "2024-01-15T10:40:00.000Z",
    "updatedAt": "2024-01-15T11:15:00.000Z"
  }
}
```

## Error Examples

### Validation Error

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "type": "field",
      "value": "short",
      "msg": "Comment must be between 10 and 500 characters",
      "path": "comment",
      "location": "body"
    }
  ]
}
```

### Authentication Error

```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### Duplicate Review Error

```json
{
  "success": false,
  "message": "You have already reviewed this book"
}
```

### Not Found Error

```json
{
  "success": false,
  "message": "Book not found"
}
```

## Advanced Query Examples

### Filter Books by Genre and Author

```bash
curl "http://localhost:5000/api/books?genre=fantasy&author=tolkien&page=1&limit=10"
```

### Get User's Reviews

```bash
curl "http://localhost:5000/api/reviews/user/648a1b2c3d4e5f6789012345?page=1&limit=10"
```

### Health Check

```bash
curl "http://localhost:5000/health"
```

### Response

```json
{
  "uptime": 3600.123,
  "message": "OK",
  "timestamp": 1642248000000,
  "environment": "development"
}
```

## Rate Limiting Example

When rate limit is exceeded:

```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later."
}
```

## Postman Environment Variables

Set these variables in Postman for easier testing:

- `baseUrl`: `http://localhost:5000/api`
- `token`: `your-jwt-token-here`
- `userId`: `your-user-id-here`
- `bookId`: `your-book-id-here`
