const Author = require('../models/Author');

// Create new author
exports.createAuthor = async (req, res) => {
    try {
        const author = new Author(req.body);
        await author.save();
        res.status(201).json(author);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all authors
exports.getAllAuthors = async (req, res) => {
    try {
        const authors = await Author.find();
        res.json(authors);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Get single author
exports.getAuthorById = async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        if (!author) {
            return res.status(404).json({ error: 'Author not found' });
        }
        res.json(author);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Update author
exports.updateAuthor = async (req, res) => {
    try {
        const author = await Author.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!author) {
            return res.status(404).json({ error: 'Author not found' });
        }
        res.json(author);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete author
exports.deleteAuthor = async (req, res) => {
    try {
        const author = await Author.findByIdAndDelete(req.params.id);
        if (!author) {
            return res.status(404).json({ error: 'Author not found' });
        }
        res.json({ message: 'Author deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};