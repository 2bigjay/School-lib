const express = require('express');
const router = express.Router();

// Import Controllers
const bookController = require('../controllers/bookController');

// Import Middlewares
const { 
    validateBook, 
    validateBorrow, 
    validateBookId, 
    handleValidationErrors 
} = require('../middlewares/validation');

const authenticate = require('../middlewares/auth');

// ====================== PUBLIC ROUTES ======================

// Get all books (with pagination & search) - Public
router.get('/', bookController.getAllBooks);

// Get single book - Public
router.get('/:id', validateBookId, handleValidationErrors, bookController.getBookById);

// ====================== AUTHENTICATED ROUTES ======================

// Create a new book (Protected)
router.post('/', authenticate, validateBook, handleValidationErrors, bookController.createBook);

// Update book (Protected)
router.put('/:id', authenticate, validateBookId, handleValidationErrors, bookController.updateBook);

// Delete book (Protected)
router.delete('/:id', authenticate, validateBookId, handleValidationErrors, bookController.deleteBook);

// Borrow book (Protected - only library attendant should do this)
router.post('/:id/borrow', authenticate, validateBorrow, handleValidationErrors, bookController.borrowBook);

// Return book (Protected)
router.post('/:id/return', authenticate, validateBookId, handleValidationErrors, bookController.returnBook);

// ====================== AUTH ROUTE ======================

// Simple Login
router.post('/login', bookController.login);

module.exports = router;