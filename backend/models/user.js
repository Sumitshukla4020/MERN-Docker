const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI);

// Subschema for shared files
const sharedFileSchema = mongoose.Schema({
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userfile",
  },
  email: {
    type: String,
  },
  expiry: {
    type: Date,
  }
}, { _id: false }); // Disable _id for sharedFiles

// Main user schema
const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
  },
  password: String,
  sharedFiles: [sharedFileSchema] // Use the sharedFileSchema here
});

module.exports = mongoose.model("user", userSchema);
