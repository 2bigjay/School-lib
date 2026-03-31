const { body, param, validationResult } = require('express-validator');

// Validation for creating a new book
const validateBook = [
  body('title').trim().notEmpty().withMessage('Book title is required'),
  body('isbn').trim().notEmpty().withMessage('ISBN is required'),
  body('authors').isArray({ min: 1 }).withMessage('At least one author is required'),
  body('authors.*').isMongoId().withMessage('Invalid author ID format')
];

// Validation for borrowing a book
const validateBorrow = [
  body('studentId').isMongoId().withMessage('Valid student ID is required'),
  body('attendantId').isMongoId().withMessage('Valid attendant ID is required'),
  body('returnDate').isISO8601().withMessage('Return date must be a valid date')
];

// Validation for book ID in URL params
const validateBookId = [
  param('id').isMongoId().withMessage('Invalid book ID')
];

// Middleware to check if validation failed
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

module.exports = {
  validateBook,
  validateBorrow,
  validateBookId,
  handleValidationErrors
};