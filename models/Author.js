const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,        // must have a name
    trim: true             // removes extra spaces
  },
  bio: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now      // automatically sets current date/time
  }
},
{timestamps: true} // automatically adds createdAt and updatedAt fields
);

// Create the model (this lets us use it later)
module.exports = mongoose.model('Author', authorSchema);