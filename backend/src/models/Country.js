const mongoose = require('mongoose');

const CountrySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, unique: true }, // ISO 3166-1 alpha-2
  flag: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Country', CountrySchema);
