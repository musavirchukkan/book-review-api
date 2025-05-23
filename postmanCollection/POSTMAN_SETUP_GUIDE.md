# 📮 Postman Collection Setup Guide

This guide will help you set up and use the professional Postman collection for the Book Review API.

## 📦 What's Included

- **Complete Postman Collection** with 25+ requests
- **Environment Files** for Local and Production
- **Automated Testing** with 50+ test cases
- **Dynamic Variables** that auto-update between requests
- **Error Handling Examples** for common scenarios
- **Professional Documentation** for each endpoint

## 🚀 Quick Setup (5 minutes)

### Step 1: Import Collection

1. Open Postman
2. Click **Import** button (top left)
3. Drag and drop or select the file: `Book_Review_API.postman_collection.json`
4. Click **Import**

### Step 2: Import Environment

1. Click **Import** again
2. Select: `Book_Review_API.postman_environment.json`
3. Click **Import**
4. Select the environment from the dropdown (top right)

### Step 3: Start Your API Server

```bash
# Make sure your API is running
npm run dev
```

### Step 4: Test the Collection

1. Go to **Authentication** folder
2. Run **User Registration** - this will auto-set your token
3. Explore other endpoints!

## 🏗️ Collection Structure

```
📚 Book Review API
├── 🔐 Authentication
│   ├── User Registration (auto-sets token)
│   ├── User Login (auto-sets token)
│   └── Get Current User
├── 📚 Books Management
│   ├── Add New Book (auto-sets bookId)
│   ├── Get All Books
│   ├── Get Books with Filters
│   ├── Get Single Book with Reviews
│   └── Search Books
├── ⭐ Reviews Management
│   ├── Add Review to Book (auto-sets reviewId)
│   ├── Update Own Review
│   ├── Get Single Review
│   ├── Get User Reviews
│   └── Delete Own Review
├── 🔍 Advanced Examples
│   ├── Complete Workflow Test
│   ├── Error Handling Examples (4 types)
│   └── Pagination Test
└── 🏥 Health & Monitoring
    ├── Health Check
    └── API Welcome
```

## 🔧 Environment Variables

The collection uses these variables (auto-managed):

| Variable | Description | Auto-Set |
|----------|-------------|----------|
| `baseUrl` | API base URL | Manual |
| `token` | JWT token | ✅ After login |
| `userId` | Current user ID | ✅ After login |
| `bookId` | Last created book ID | ✅ After book creation |
| `reviewId` | Last created review ID | ✅ After review creation |
| `randomUsername` | Generated username | ✅ Dynamic |
| `randomEmail` | Generated email | ✅ Dynamic |

## 🧪 Automated Testing Features

### Response Validation
- ✅ Status code validation
- ✅ Response structure validation
- ✅ Data type validation
- ✅ Required field validation

### Performance Testing
- ✅ Response time validation (< 5 seconds)
- ✅ Content-type validation
- ✅ Error logging

### Workflow Testing
- ✅ Token auto-extraction and setting
- ✅ ID auto-extraction for chaining requests
- ✅ Dynamic test data generation

## 🎯 Usage Scenarios

### Scenario 1: Complete API Testing
```
1. Run "User Registration" ➜ Token auto-set
2. Run "Add New Book" ➜ BookId auto-set  
3. Run "Add Review to Book" ➜ ReviewId auto-set
4. Run "Get Single Book with Reviews" ➜ See your review
5. Run "Search Books" ➜ Find your book
```

### Scenario 2: Error Testing
```
1. Run "Error Handling - Invalid Book ID"
2. Run "Error Handling - Unauthorized Access"
3. Run "Error Handling - Validation Error"
4. Run "Pagination Test - Large Limit"
```

### Scenario 3: Performance Testing
1. Use **Collection Runner** (⚡ icon)
2. Select entire collection
3. Set iterations (e.g., 10)
4. Click **Run** - all tests will execute

## 🔄 Collection Runner Guide

### Running Complete Test Suite

1. Click **Collections** in sidebar
2. Click **⚡** (Run collection) next to "Book Review API"
3. Configuration:
   - **Iterations**: 1 (or more for load testing)
   - **Delay**: 1000ms (between requests)
   - **Data**: None (uses generated data)
4. Click **Run Book Review API**

### Expected Results
- ✅ **25+ requests** should execute
- ✅ **50+ tests** should pass
- ✅ **Variables** should auto-populate
- ✅ **Workflow** should complete end-to-end

## 🌐 Environment Setup

### Local Development
```json
{
  "baseUrl": "http://localhost:5000"
}
```

### Production/Staging
```json
{
  "baseUrl": "https://your-api-domain.com"
}
```

### Custom Port
```json
{
  "baseUrl": "http://localhost:3001"
}
```

## 🔍 Advanced Features

### 1. Pre-request Scripts
- Generate random test data
- Set dynamic timestamps
- Log request information

### 2. Test Scripts
- Validate response structure
- Extract and set variables
- Chain requests automatically

### 3. Dynamic Variables
```javascript
// Examples used in collection:
{{$randomInt}}          // Random integer
{{$timestamp}}          // Current timestamp
{{$randomFirstName}}    // Random first name
{{$randomEmail}}        // Random email
```

### 4. Environment Switching
- Quickly switch between Local/Production
- Variables automatically apply
- No need to modify requests

## 🐛 Troubleshooting

### Issue: "baseUrl not defined"
**Solution**: Make sure environment is selected (top-right dropdown)

### Issue: "401 Unauthorized"
**Solution**: 
1. Run "User Registration" or "User Login"
2. Token should auto-set
3. Check if token is in environment variables

### Issue: "Connection refused"
**Solution**: 
1. Make sure API server is running: `npm run dev`
2. Check if port matches environment baseUrl

### Issue: Tests failing
**Solution**:
1. Check server logs for errors
2. Verify database connection
3. Clear environment variables and start fresh

## 📊 Test Reports

### Viewing Results
1. After running collection, click **View Results**
2. See detailed test results
3. Export results as JSON/HTML

### Key Metrics
- **Total Requests**: 25+
- **Total Tests**: 50+
- **Pass Rate**: Should be 100%
- **Average Response Time**: < 2 seconds

## 🔐 Security Testing

The collection includes security test scenarios:

1. **Authentication Testing**
   - Invalid tokens
   - Missing tokens
   - Expired tokens

2. **Authorization Testing**
   - User can only modify own reviews
   - Protected endpoints require auth

3. **Input Validation**
   - Invalid data formats
   - Missing required fields
   - Field length limits

## 📚 Collection Documentation

Each request includes:
- **Detailed descriptions**
- **Parameter explanations**
- **Example responses**
- **Error scenarios**
- **Usage notes**

## 🚀 Pro Tips

### 1. Keyboard Shortcuts
- `Ctrl+Enter` / `Cmd+Enter`: Send request
- `Ctrl+/` / `Cmd+/`: Comment/uncomment
- `Ctrl+Space` / `Cmd+Space`: Autocomplete

### 2. Bulk Testing
- Use Collection Runner for regression testing
- Set up monitors for API health checks
- Export results for CI/CD integration

### 3. Collaboration
- Share collection with team members
- Use Postman workspaces for collaboration
- Version control your collections

### 4. Documentation
- Generate API documentation from collection
- Share public documentation link
- Keep collection updated with API changes

## 📞 Support

If you encounter issues:

1. **Check this guide** first
2. **Verify API server** is running
3. **Check environment variables** are set correctly
4. **Review server logs** for errors
5. **Test with cURL** to isolate issues

## 🎉 Success Checklist

After setup, you should be able to:

- ✅ Import collection successfully
- ✅ Set up environment variables
- ✅ Register and login users
- ✅ Create books and reviews
- ✅ Search and filter books
- ✅ Run complete test suite
- ✅ See all tests passing
- ✅ Handle error scenarios

---

**Happy Testing! 🚀📮**

*Created for the Book Review API - A professional MERN stack demonstration project*