const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,        // must have a name
    trim: true             // removes extra spaces
  },

  Isbn: {
    type: String,
    unique: true,        // ISBN must be unique
    authors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Author' }], // references to Author model
    trim: true 
  },
    status: {
      type: String,
      enum: ['available', 'checked out'],
      default: 'available',
      trim: true
    },

    borrowedBy: {
      type: mongoose.Schema.Types.ObjectId, ref: 'Student' // reference to Student model
    },

    issuedBy: {
         type: mongoose.Schema.Types.ObjectId, ref: 'Attendant' // reference to Attendant model
    }

{timestamps: true} // automatically adds createdAt and updatedAt fields
});

// Create the model (this lets us use it later)
module.exports = mongoose.model('Book', bookSchema);