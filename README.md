# School Library Management API

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-blue.svg)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-5.2+-black.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

A comprehensive RESTful API built for managing a school library system, including Authors, Books, Students, Library Attendants, and Book Borrowing & Returns.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Deployment](#deployment)
- [API Endpoints](#api-endpoints)
- [API Examples](#api-examples)
- [Testing with Postman](#testing-with-postman)
- [Troubleshooting](#troubleshooting)
- [Data Models](#data-models)
- [Contributing](#contributing)
- [License](#license)

## Features

- Full CRUD operations for Authors, Books, Students, and Library Attendants
- Book borrowing and returning system with proper validation
- Proper relationships using Mongoose population
- Pagination and search functionality
- Overdue book detection
- Input validation using express-validator
- JWT Authentication (Simple login)
- Clean MVC architecture

## Tech Stack

- **Backend**: Node.js + Express.js
- **Database**: MongoDB (with Mongoose ODM)
- **Validation**: express-validator
- **Authentication**: JSON Web Token (JWT)

## Project Structure

```
school_library_api/
├── server.js
├── package.json
├── README.md
├── config/
│   └── db.js
├── controllers/
│   ├── bookController.js
│   ├── authorController.js
│   ├── studentController.js
│   └── attendantController.js
├── middlewares/
│   ├── auth.js
│   └── validation.js
├── models/
│   ├── Book.js
│   ├── Author.js
│   ├── Student.js
│   └── LibraryAttendant.js
├── routes/
│   ├── bookRoutes.js
│   ├── authorRoutes.js
│   ├── studentRoutes.js
│   └── attendantRoutes.js
└── postman/
    ├── collections/
    ├── environments/
    ├── flows/
    ├── globals/
    │   └── workspace.globals.yaml
    ├── mocks/
    └── specs/
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or cloud instance like MongoDB Atlas)
- Postman (for API testing)

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd school_library_api
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory (copy from `.env.example`):

```bash
cp .env.example .env
```

Then update the values in `.env`:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/school-lib
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

4. Start MongoDB service (if running locally).

## Running the Application

### Development Mode
```bash
npm run dev
```

The server will start on the port specified in your `.env` file or default to 5000.

### Production Mode
```bash
node server.js
```

## Deployment

### Using MongoDB Atlas (Cloud)
1. Create a MongoDB Atlas account and cluster
2. Get your connection string from Atlas
3. Update `MONGODB_URI` in your `.env` file:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/school-lib?retryWrites=true&w=majority
```

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use a strong, random `JWT_SECRET`
- Configure your MongoDB URI for production database

### Hosting Options
- **Heroku**: Add MongoDB Atlas URI to config vars
- **Railway/Vercel**: Set environment variables in dashboard
- **AWS/DigitalOcean**: Use their database services

## API Endpoints

### Authentication
- `POST /api/books/login` - Login for library attendants

### Books
- `GET /api/books` - Get all books (with pagination & search)
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Create new book (Authenticated)
- `PUT /api/books/:id` - Update book (Authenticated)
- `DELETE /api/books/:id` - Delete book (Authenticated)
- `POST /api/books/:id/borrow` - Borrow book (Authenticated)
- `POST /api/books/:id/return` - Return book (Authenticated)

### Authors
- `GET /api/authors` - Get all authors
- `GET /api/authors/:id` - Get author by ID
- `POST /api/authors` - Create new author
- `PUT /api/authors/:id` - Update author
- `DELETE /api/authors/:id` - Delete author

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create new student

### Library Attendants
- `GET /api/attendants` - Get all attendants
- `GET /api/attendants/:id` - Get attendant by ID
- `POST /api/attendants` - Create new attendant

## API Examples

### Authentication
```bash
# Login (Demo credentials)
POST /api/books/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password123"
}
```

### Create a Book
```bash
POST /api/books
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "title": "The Great Gatsby",
  "isbn": "978-0-7432-7356-5",
  "authors": ["60d5ecb74b24c72b8c8b4567"]
}
```

### Borrow a Book
```bash
POST /api/books/:id/borrow
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "studentId": "60d5ecb74b24c72b8c8b4568"
}
```

### Get Books with Search & Pagination
```bash
GET /api/books?page=1&limit=10&search=gatsby
```

The `postman/` folder contains:
- Collections: Pre-built API requests
- Environments: Different environments (dev, prod)
- Flows: Automated test flows

1. Import the collection from `postman/collections/`
2. Set up environment from `postman/environments/`
3. Run requests to test the API

## Troubleshooting

### Common Issues

**MongoDB Connection Error:**
- Ensure MongoDB is running locally or your Atlas URI is correct
- Check your `.env` file has the right `MONGODB_URI`

**Port Already in Use:**
- Change the `PORT` in `.env` or kill the process using the port
- On Windows: `netstat -ano | findstr :5000` then `taskkill /PID <PID> /F`

**JWT Authentication Issues:**
- Ensure you're sending the token in the `Authorization` header as `Bearer <token>`
- Check that your `JWT_SECRET` matches between login and verification

**Validation Errors:**
- Check request body format matches the API documentation
- Ensure required fields are included

### Development Tips
- Use `npm run dev` for auto-restart on file changes
- Check server logs for detailed error messages
- Use Postman console for debugging API requests

## Data Models

### Book
```javascript
{
  title: String (required),
  isbn: String (required, unique),
  authors: [ObjectId] (references Author),
  status: String (enum: 'IN', 'OUT', default: 'IN'),
  borrowedBy: ObjectId (references Student, default: null),
  issuedBy: ObjectId (references LibraryAttendant, default: null),
  returnDate: Date (default: null),
  createdAt: Date,
  updatedAt: Date
}
```

### Author
```javascript
{
  name: String (required),
  bio: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Student
```javascript
{
  name: String (required),
  email: String (required, unique),
  studentId: String (required, unique),
  createdAt: Date,
  updatedAt: Date
}
```

### LibraryAttendant
```javascript
{
  name: String (required),
  staffId: String (required, unique),
  createdAt: Date,
  updatedAt: Date
}
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.
