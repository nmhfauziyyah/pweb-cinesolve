const mongoose = require('mongoose');

const GenreSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  icon: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Genre', GenreSchema);
