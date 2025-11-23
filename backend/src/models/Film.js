const mongoose = require('mongoose');
const { Schema } = mongoose;

const WatchSourceSchema = new Schema({
  platformName: String,
  platformIcon: String,
  platformUrl: String
});

const FilmSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  posterType: { type: String, enum: ['upload', 'url'], default: 'upload' },
  posterUpload: String, // Path ke file yang di-upload: /uploads/posters/filename.jpg
  posterUrl: String, // External image URL
  poster: String, // Deprecated - diisi otomatis dari posterUpload atau posterUrl
  genre: [String],
  country: String,
  moodTags: [String],
  releaseYear: Number,
  watchSources: [WatchSourceSchema],
  created_by: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Film', FilmSchema);
