const Book = require('../models/Book');

// ==================== CREATE BOOK ====================
const createBook = async (req, res) => {
    try {
        const book = new Book(req.body);
        await book.save();
        res.status(201).json({
            message: "Book created successfully",
            book
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// ==================== GET ALL BOOKS (with Pagination + Search) ====================
const getAllBooks = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;

        const query = {};

        // Search by title or author name
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },           // Search in title
                { 'authors.name': { $regex: search, $options: 'i' } }   // Search in author names (after populate)
            ];
        }

        const skip = (page - 1) * limit;

        const books = await Book.find(query)
            .populate('authors')
            .populate('borrowedBy')
            .populate('issuedBy')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });   // Newest first

        const totalBooks = await Book.countDocuments(query);

        res.json({
            message: "Books fetched successfully",
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalBooks / limit),
                totalBooks,
                limit: parseInt(limit)
            },
            books
        });

    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// ==================== GET SINGLE BOOK ====================
const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
            .populate('authors')
            .populate('borrowedBy')
            .populate('issuedBy');

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json({
            message: "Book fetched successfully",
            book
        });

    } catch (error) {
        res.status(500).json({ 
            message: "Server error", 
            error: error.message 
        });
    }
};

// ==================== UPDATE BOOK ====================
const updateBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!book) return res.status(404).json({ error: 'Book not found' });
        res.json(book);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// ==================== DELETE BOOK ====================
const deleteBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) return res.status(404).json({ error: 'Book not found' });
        res.json({ message: 'Book deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// ==================== BORROW BOOK ====================
const borrowBook = async (req, res) => {
    try {
        const { studentId, attendantId, returnDate } = req.body;

        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ error: 'Book not found' });
        if (book.status !== 'IN') {
            return res.status(400).json({ error: 'Book is already borrowed' });
        }

        book.status = 'OUT';
        book.borrowedBy = studentId;
        book.issuedBy = attendantId;
        book.returnDate = returnDate;

        await book.save();

        const updatedBook = await Book.findById(book._id)
            .populate('authors')
            .populate('borrowedBy')
            .populate('issuedBy');

        res.json({ 
            message: 'Book borrowed successfully', 
            book: updatedBook 
        });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// ==================== RETURN BOOK ====================
const returnBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) return res.status(404).json({ error: 'Book not found' });
        if (book.status !== 'OUT') {
            return res.status(400).json({ error: 'Book is not borrowed' });
        }

        book.status = 'IN';
        book.borrowedBy = null;
        book.issuedBy = null;
        book.returnDate = null;

        await book.save();

        const updatedBook = await Book.findById(book._id)
            .populate('authors')
            .populate('borrowedBy')
            .populate('issuedBy');

        res.json({ 
            message: 'Book returned successfully', 
            book: updatedBook 
        });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// ====================== EXPORTS ======================
module.exports = {
    createBook,
    getAllBooks,
    getBookById,
    updateBook,
    deleteBook,
    borrowBook,
    returnBook
};