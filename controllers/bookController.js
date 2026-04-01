const Book = require('../models/Book');
const jwt = require('jsonwebtoken');     // ← Add this line

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

// ==================== GET ALL BOOKS (Pagination + Search + Overdue Check) ====================
const getAllBooks = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;

        const query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { 'authors.name': { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (page - 1) * limit;

        let books = await Book.find(query)
            .populate('authors')
            .populate('borrowedBy')
            .populate('issuedBy')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const totalBooks = await Book.countDocuments(query);

        // Add overdue flag to each book
        books = books.map(book => {
            let isOverdue = false;
            if (book.status === 'OUT' && book.returnDate) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const returnDate = new Date(book.returnDate);
                returnDate.setHours(0, 0, 0, 0);

                if (today > returnDate) {
                    isOverdue = true;
                }
            }
            return { ...book.toObject(), overdue: isOverdue };
        });

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

// ==================== GET SINGLE BOOK (with Overdue Check) ====================
const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
            .populate('authors')
            .populate('borrowedBy')
            .populate('issuedBy');

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Overdue Check Logic
        let isOverdue = false;
        if (book.status === 'OUT' && book.returnDate) {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Reset time for fair comparison
            const returnDate = new Date(book.returnDate);
            returnDate.setHours(0, 0, 0, 0);

            if (today > returnDate) {
                isOverdue = true;
            }
        }

        res.status(200).json({
            message: "Book fetched successfully",
            book,
            overdue: isOverdue
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

// ==================== SIMPLE LOGIN (Demo) ====================
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Simple demo credentials (In real app, check database)
        if (username === "admin" && password === "password123") {
            const token = jwt.sign(
                { 
                    id: "admin001", 
                    role: "library_attendant",
                    name: "Admin User"
                },
                process.env.JWT_SECRET || 'schoollibrary-secret-key-2026',
                { expiresIn: '7d' }
            );

            return res.json({
                message: "Login successful",
                token: token,
                user: {
                    id: "admin001",
                    name: "Admin User",
                    role: "library_attendant"
                }
            });
        }

        res.status(401).json({ message: "Invalid username or password" });

    } catch (err) {
        res.status(500).json({ error: err.message });
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
    returnBook,
    login
};