const express = require('express');
const router = express.Router();
const attendantController = require('../controllers/attendantController');

// Library Attendant Routes
router.post('/', attendantController.createAttendant);
router.get('/', attendantController.getAllAttendants);
router.get('/:id', attendantController.getAttendantById);

module.exports = router;