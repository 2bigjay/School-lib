const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Student Routes
router.post('/', studentController.createStudent);
router.get('/', studentController.getAllStudents);
router.get('/:id', studentController.getStudentById);

module.exports = router;