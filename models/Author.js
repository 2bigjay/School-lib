const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },

    bio: {
      type: String,
      trim: true
    }
},
 {
    timestamps: true     // ← This is the correct place
});

// Create the model
module.exports = mongoose.model('Author', authorSchema);