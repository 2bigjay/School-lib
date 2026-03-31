const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ====================== ROUTES ======================
// Only uncomment routes that you have already created

const bookRoutes = require('./routes/bookRoutes');
const authorRoutes = require('./routes/authorRoutes');
const studentRoutes = require('./routes/studentRoutes');
const attendantRoutes = require('./routes/attendantRoutes');

// ====================== DATABASE CONNECTION ======================
// Use YOUR own connection string here
mongoose.connect('mongodb://127.0.0.1:27017/school-lib')   // ← Change if your DB name is different
    .then(() => console.log('✅ MongoDB Connected Successfully to school-lib'))
    .catch((err) => console.log('❌ MongoDB Connection Error:', err.message));

// ====================== API ROUTES ======================
app.use('/api/books', bookRoutes);           // Active
app.use('/api/authors', authorRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendants', attendantRoutes);

// Root Route
app.get('/', (req, res) => {
    res.json({
        message: "School Library Management API is running",
        version: "1.0.0"
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});