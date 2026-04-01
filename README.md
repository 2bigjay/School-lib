# School Library Management API

A RESTful API built for managing a school library system, including Authors, Books, Students, Library Attendants, and Book Borrowing & Returns.

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

school_library_api/
├── server.js
├── routes/
│   └── bookRoutes.js
├── controllers/
│   └── bookController.js
├── models/
│   ├── Book.js
│   ├── Author.js
│   ├── Student.js
│   └── LibraryAttendant.js
├── middlewares/
│   ├── validation.js
│   └── auth.js
└── README.md



## Setup Instructions

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd school_library_api
