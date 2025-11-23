const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReviewSchema = new Schema({
  film_id: { type: Schema.Types.ObjectId, ref: 'Film', required: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  description: String,
  rating: { type: Number, min: 1, max: 5 },
}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);
