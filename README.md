# Course Management System Backend API

A comprehensive RESTful API built with Express.js and MongoDB for managing users and courses. Features include JWT authentication, Cloudinary image storage, and complete CRUD operations.

## 🚀 Features

- **User Management**: Registration, login, profile management, and account deletion
- **Course Management**: Create, read, update, and delete courses with image uploads
- **Authentication**: JWT token-based authentication with secure HTTP-only cookies
- **Image Storage**: Cloudinary integration for course image uploads
- **Authorization**: Role-based access control (users can only modify their own courses)
- **Data Validation**: Comprehensive input validation and error handling
- **Auto Cleanup**: Automatic deletion of images when courses/users are deleted

## 📋 Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
  - [User Routes](#user-routes)
  - [Course Routes](#course-routes)
- [Request Examples](#request-examples)
- [Technologies Used](#technologies-used)

## 🛠️ Installation

1. **Clone the repository**

```bash
git clone https://github.com/AsiF-noob44/course-management-backend-task.git
cd course-management-backend-task
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**
   Create a `.env` file in the root directory (see [Environment Variables](#environment-variables))

4. **Start the server**

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## 📡 API Endpoints

### Base URL

```
http://localhost:3000/api/v1
```

---

## 👤 User Routes

### 1. Register User

**POST** `/users/register`

Register a new user account.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phoneNumber": "+1234567890"
}
```

**Response (201):**

```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "+1234567890",
    "createdAt": "2025-11-10T12:00:00.000Z",
    "updatedAt": "2025-11-10T12:00:00.000Z"
  }
}
```

---

### 2. Login User

**POST** `/users/login`

Authenticate user and receive JWT token.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "+1234567890"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Note:** JWT token is also set as an HTTP-only cookie named `user-token`.

---

### 3. Get User Profile

**GET** `/users/profile`

Get the logged-in user's profile information.

**Headers:**

```
Authorization: Bearer <token>
```

OR

```
Cookie: user-token=<token>
```

**Response (200):**

```json
{
  "success": true,
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "+1234567890",
    "createdAt": "2025-11-10T12:00:00.000Z",
    "updatedAt": "2025-11-10T12:00:00.000Z"
  }
}
```

---

### 4. Update User Profile

**PUT** `/users/profile`

Update user profile information.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body (all fields optional):**

```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "phoneNumber": "+1987654321",
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword456"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "User updated successfully",
  "user": {
    "_id": "...",
    "name": "John Smith",
    "email": "johnsmith@example.com",
    "phoneNumber": "+1987654321",
    "createdAt": "2025-11-10T12:00:00.000Z",
    "updatedAt": "2025-11-10T13:30:00.000Z"
  }
}
```

---

### 5. Delete User Account

**DELETE** `/users/profile`

Permanently delete user account and all associated courses.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "password": "password123"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "User account and all associated data deleted successfully",
  "deletedCourses": 5
}
```

**Note:** This will delete:

- User account
- All courses created by the user
- All course images from Cloudinary

---

### 6. Logout User

**POST** `/users/logout`

Logout the current user and clear authentication cookie.

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 7. Get All Users

**GET** `/users/`

Get a list of all registered users.

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "success": true,
  "count": 10,
  "users": [
    {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "phoneNumber": "+1234567890",
      "createdAt": "2025-11-10T12:00:00.000Z",
      "updatedAt": "2025-11-10T12:00:00.000Z"
    }
  ]
}
```

---

## 📚 Course Routes

### 1. Create Course

**POST** `/courses`

Create a new course with optional image upload.

**Headers:**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (form-data):**

```
title: Full Stack Web Development
description: Learn MERN stack from scratch
price: 99.99
duration: 40
durationUnit: hours
category: Programming
instructorName: John Doe
courseImage: [FILE] (optional)
```

**OR JSON Body:**

```json
{
  "title": "Full Stack Web Development",
  "description": "Learn MERN stack from scratch",
  "price": 99.99,
  "duration": 40,
  "durationUnit": "hours",
  "category": "Programming",
  "instructorName": "John Doe",
  "courseImage": "https://example.com/image.jpg"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Course created successfully",
  "course": {
    "_id": "...",
    "title": "Full Stack Web Development",
    "description": "Learn MERN stack from scratch",
    "price": 99.99,
    "duration": 40,
    "durationUnit": "hours",
    "category": "Programming",
    "instructorName": "John Doe",
    "courseImage": "https://res.cloudinary.com/...",
    "createdBy": "...",
    "createdAt": "2025-11-10T12:00:00.000Z",
    "updatedAt": "2025-11-10T12:00:00.000Z"
  }
}
```

---

### 2. Get All Courses

**GET** `/courses`

Retrieve all courses with creator information.

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "success": true,
  "count": 25,
  "courses": [
    {
      "_id": "...",
      "title": "Full Stack Web Development",
      "description": "Learn MERN stack from scratch",
      "price": 99.99,
      "duration": 40,
      "durationUnit": "hours",
      "category": "Programming",
      "instructorName": "John Doe",
      "courseImage": "https://res.cloudinary.com/...",
      "createdBy": {
        "_id": "...",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "createdAt": "2025-11-10T12:00:00.000Z",
      "updatedAt": "2025-11-10T12:00:00.000Z"
    }
  ]
}
```

---

### 3. Get Single Course by ID

**GET** `/courses/:id`

Retrieve a specific course by its ID.

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "success": true,
  "course": {
    "_id": "...",
    "title": "Full Stack Web Development",
    "description": "Learn MERN stack from scratch",
    "price": 99.99,
    "duration": 40,
    "durationUnit": "hours",
    "category": "Programming",
    "instructorName": "John Doe",
    "courseImage": "https://res.cloudinary.com/...",
    "createdBy": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2025-11-10T12:00:00.000Z",
    "updatedAt": "2025-11-10T12:00:00.000Z"
  }
}
```

---

### 4. Update Course by ID

**PUT** `/courses/:id`

Update a course (only by the creator).

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body (all fields optional):**

```json
{
  "title": "Updated Course Title",
  "description": "Updated description",
  "price": 79.99,
  "duration": 45,
  "durationUnit": "hours",
  "category": "Web Development",
  "instructorName": "John Smith"
}
```

**With File Upload (form-data):**

```
title: Updated Course Title
price: 79.99
courseImage: [NEW FILE]
```

**Response (200):**

```json
{
  "success": true,
  "message": "Course updated successfully",
  "course": {
    "_id": "...",
    "title": "Updated Course Title",
    "description": "Updated description",
    "price": 79.99,
    "duration": 45,
    "durationUnit": "hours",
    "category": "Web Development",
    "instructorName": "John Smith",
    "courseImage": "https://res.cloudinary.com/...",
    "createdBy": "...",
    "createdAt": "2025-11-10T12:00:00.000Z",
    "updatedAt": "2025-11-10T13:30:00.000Z"
  }
}
```

**Note:** Old image is automatically deleted from Cloudinary when a new one is uploaded.

---

### 5. Delete Course by ID

**DELETE** `/courses/:id`

Delete a course (only by the creator).

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "success": true,
  "message": "Course deleted successfully"
}
```

**Note:** Course image is automatically deleted from Cloudinary.

---

## 📝 Request Examples

### Using cURL

**Register User:**

```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phoneNumber": "+1234567890"
  }'
```

**Login:**

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Create Course with Image:**

```bash
curl -X POST http://localhost:3000/api/courses \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=Full Stack Development" \
  -F "description=Learn MERN stack" \
  -F "price=99.99" \
  -F "duration=40" \
  -F "durationUnit=hours" \
  -F "category=Programming" \
  -F "instructorName=John Doe" \
  -F "courseImage=@/path/to/image.jpg"
```

---

## 🔒 Authentication

All protected routes require a JWT token. You can provide the token in two ways:

1. **Authorization Header:**

```
Authorization: Bearer <your_jwt_token>
```

2. **Cookie:**

```
Cookie: user-token=<your_jwt_token>
```

The token is automatically set as a cookie when you log in.

---

## ⚠️ Error Responses

### Common Error Codes:

- **400 Bad Request**: Invalid input or validation error
- **401 Unauthorized**: Missing or invalid token
- **403 Forbidden**: Not authorized to perform action
- **404 Not Found**: Resource not found
- **409 Conflict**: Duplicate entry (e.g., email already exists)
- **500 Internal Server Error**: Server error

### Example Error Response:

```json
{
  "success": false,
  "message": "Error message here",
  "errors": ["Detailed error 1", "Detailed error 2"]
}
```

---

## 🛡️ Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT token-based authentication
- ✅ HTTP-only secure cookies
- ✅ Input validation and sanitization
- ✅ Authorization checks (users can only modify their own data)
- ✅ Password confirmation for account deletion
- ✅ CORS protection
- ✅ XSS protection

---

## 📦 Technologies Used

- **Backend Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer
- **Cloud Storage**: Cloudinary
- **Environment Variables**: dotenv
- **Cookie Parsing**: cookie-parser

---

## 📁 Project Structure

```
course-management-backend-task/
├── src/
│   ├── configs/
│   │   ├── auth.js          # JWT configuration
│   │   ├── cloudinary.js    # Cloudinary setup
│   │   ├── db.js            # MongoDB connection
│   │   └── multer.js        # File upload config
│   ├── controllers/
│   │   ├── userController.js    # User logic
│   │   └── courseController.js  # Course logic
│   ├── middlewares/
│   │   └── validate.js      # Authentication middleware
│   ├── models/
│   │   ├── User.js          # User schema
│   │   └── Course.js        # Course schema
│   └── routes/
│       ├── userRoutes.js    # User endpoints
│       └── courseRoutes.js  # Course endpoints
├── .env                     # Environment variables
├── .gitignore
├── package.json
├── server.js               # Entry point
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Abu Sayeed Rifat**

- GitHub: [@AsiF-noob44](https://github.com/AsiF-noob44)
- Email: abusayeedrifat20@gmail.com

---

**Happy Coding! 🚀**
