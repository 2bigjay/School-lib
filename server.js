require('dotenv').config();           // Loads your .env file (MONGODB_URI, PORT, etc.)

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import the author routes (this line must come after creating the routes folder/file)
const authorRoutes = require('./routes/authorRoutes');

const app = express();

// Middleware (these must come early)
app.use(cors());                      // Allows Postman, frontend, etc. to connect
app.use(express.json());              // Lets the server understand JSON in requests

// Connect to MongoDB (using the string from .env)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch(err => console.log("❌ MongoDB Connection Error:", err));

// Test route – open http://localhost:5000 in browser to confirm server works
app.get('/', (req, res) => {
  res.send("School Library API is running! 🚀");
});

// IMPORTANT: Add your routes here – AFTER middleware, BEFORE app.listen
app.use('/authors', authorRoutes);
// You will add more later, e.g.:
// app.use('/books', require('./routes/bookRoutes'));
// app.use('/students', require('./routes/studentRoutes'));

// Start the server (this must be at the bottom)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});