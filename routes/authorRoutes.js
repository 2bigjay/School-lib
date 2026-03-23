const express = require('express');
const router = express.Router();
const Author = require('../models/Author');

// POST /authors - Create a new author
router.post('/', async (req, res) => {
  try {
    const author = new Author(req.body);   // get data from request body
    await author.save();                   // save to MongoDB
    res.status(201).json(author);          // send back the new author
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /authors - Get all authors
router.get('/', async (req, res) => {
  try {
    const authors = await Author.find();   // find all in database
    res.json(authors);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;