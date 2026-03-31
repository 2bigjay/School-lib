const express = require('express');
const router = express.Router();

const bookController = require('../controllers/bookController');
const { 
    validateBook, 
    validateBorrow, 
    validateBookId, 
    handleValidationErrors 
} = require('../middlewares/validation');

// Book CRUD Routes with Validation
router.post('/', validateBook, handleValidationErrors, bookController.createBook);
router.get('/', bookController.getAllBooks);
router.get('/:id', validateBookId, handleValidationErrors, bookController.getBookById);
router.put('/:id', validateBookId, handleValidationErrors, bookController.updateBook);
router.delete('/:id', validateBookId, handleValidationErrors, bookController.deleteBook);

// Borrow & Return Routes
router.post('/:id/borrow', validateBorrow, handleValidationErrors, bookController.borrowBook);
router.post('/:id/return', validateBookId, handleValidationErrors, bookController.returnBook);

module.exports = router;