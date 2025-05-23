# 📊 Database Schema Design

## Overview

The Book Review API uses MongoDB as the primary database with three main collections: Users, Books, and Reviews. The schema is designed to be efficient, scalable, and maintain data integrity.

## Collections

### 1. Users Collection

```javascript
{
  _id: ObjectId("648a1b2c3d4e5f6789012345"),
  username: "johndoe",
  email: "john@example.com",
  password: "$2a$12$hashcodehere...", // bcrypt hashed
  createdAt: ISODate("2024-01-15T10:30:00Z"),
  updatedAt: ISODate("2024-01-15T10:30:00Z")
}
```

**Indexes:**

- `email: 1` (unique)
- `username: 1` (unique)

**Validation Rules:**

- username: 3-20 characters, alphanumeric + underscore
- email: valid email format, lowercase
- password: minimum 6 characters (stored hashed)

### 2. Books Collection

```javascript
{
  _id: ObjectId("648a1b2c3d4e5f6789012346"),
  title: "The Great Gatsby",
  author: "F. Scott Fitzgerald",
  genre: "Classic Literature",
  description: "A classic American novel set in the Jazz Age...",
  isbn: "978-0-7432-7356-5",
  publishedYear: 1925,
  addedBy: ObjectId("648a1b2c3d4e5f6789012345"), // Reference to User
  createdAt: ISODate("2024-01-15T10:30:00Z"),
  updatedAt: ISODate("2024-01-15T10:30:00Z")
}
```

**Indexes:**

- `title: "text", author: "text"` (text search)
- `author: 1`
- `genre: 1`
- `addedBy: 1`

**Validation Rules:**

- title: 1-200 characters
- author: 1-100 characters
- genre: 1-50 characters
- description: 10-1000 characters
- isbn: optional, valid ISBN format
- publishedYear: 1000 to current year

### 3. Reviews Collection

```javascript
{
  _id: ObjectId("648a1b2c3d4e5f6789012347"),
  bookId: ObjectId("648a1b2c3d4e5f6789012346"), // Reference to Book
  userId: ObjectId("648a1b2c3d4e5f6789012345"), // Reference to User
  rating: 5,
  comment: "An absolute masterpiece of American literature...",
  createdAt: ISODate("2024-01-15T10:30:00Z"),
  updatedAt: ISODate("2024-01-15T10:30:00Z")
}
```

**Indexes:**

- `{bookId: 1, userId: 1}` (compound unique index)
- `bookId: 1`
- `userId: 1`

**Validation Rules:**

- rating: integer 1-5
- comment: 10-500 characters
- One review per user per book

## Relationships

```
Users (1) -----> (N) Books [addedBy]
Users (1) -----> (N) Reviews [userId]
Books (1) -----> (N) Reviews [bookId]
```

## Data Integrity Constraints

1. **One Review Per User Per Book**: Enforced by compound unique index
2. **Reference Integrity**: Foreign key relationships maintained via ObjectId references
3. **Data Validation**: Mongoose schema validation ensures data quality
4. **Cascading**: Reviews are logically linked but not physically cascaded (manual cleanup if needed)

## Performance Considerations

1. **Text Search Index**: Enables efficient book search by title and author
2. **Compound Indexes**: Optimizes queries for user-book review combinations
3. **Pagination**: Implemented to handle large datasets efficiently
4. **Aggregation Pipelines**: Used for calculating average ratings

## Sample Queries

### Get Books with Average Ratings

```javascript
db.books.aggregate([
  {
    $lookup: {
      from: "reviews",
      localField: "_id",
      foreignField: "bookId",
      as: "reviews",
    },
  },
  {
    $addFields: {
      averageRating: { $avg: "$reviews.rating" },
      totalReviews: { $size: "$reviews" },
    },
  },
]);
```

### Search Books by Title or Author

```javascript
db.books
  .find({
    $text: { $search: "gatsby fitzgerald" },
  })
  .sort({ score: { $meta: "textScore" } });
```

### Get User's Reviews with Book Details

```javascript
db.reviews.aggregate([
  {
    $match: { userId: ObjectId("648a1b2c3d4e5f6789012345") },
  },
  {
    $lookup: {
      from: "books",
      localField: "bookId",
      foreignField: "_id",
      as: "book",
    },
  },
  {
    $unwind: "$book",
  },
]);
```

## Migration Considerations

For future schema changes:

1. Always use migrations for index changes
2. Consider backward compatibility
3. Plan for data transformation scripts
4. Test migrations on staging environment first

## Security Notes

1. **Password Hashing**: All passwords stored using bcrypt with salt rounds
2. **Data Sanitization**: Input validation prevents injection attacks
3. **Reference Validation**: ObjectId validation prevents invalid references
4. **Unique Constraints**: Prevent duplicate users and duplicate reviews
