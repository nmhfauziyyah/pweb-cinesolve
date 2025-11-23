const Review = require('../models/Review');

const getReviewsByMovie = async (req, res) => {
  try {
    const reviews = await Review.find({ film_id: req.params.movieId }).populate('user_id', 'name');
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const createReview = async (req, res) => {
  try {
    const { film_id, description, rating } = req.body;
    const review = await Review.create({ film_id, user_id: req.user.id, description, rating });
    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Not found' });
    if (review.user_id.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

    review.description = req.body.description ?? review.description;
    review.rating = req.body.rating ?? review.rating;
    await review.save();
    res.json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Not found' });
    if (review.user_id.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    await review.remove();
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getReviewsByMovie, createReview, updateReview, deleteReview };
