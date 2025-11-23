const Film = require('../models/Film');
const Review = require('../models/Review');
const fs = require('fs');

const getAllFilms = async (req, res) => {
  try {
    const films = await Film.find().sort({ createdAt: -1 });
    res.json(films);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getFilmById = async (req, res) => {
  try {
    const film = await Film.findById(req.params.id).populate('created_by', 'name email');
    if (!film) return res.status(404).json({ message: 'Film not found' });
    res.json(film);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getTrending = async (req, res) => {
  try {
    const agg = await Review.aggregate([
      { $group: { _id: '$film_id', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $lookup: { from: 'films', localField: '_id', foreignField: '_id', as: 'film' } },
      { $unwind: '$film' },
      { $replaceRoot: { newRoot: { $mergeObjects: ['$film', { reviewsCount: '$count' }] } } }
    ]);

    res.json(agg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const createFilm = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) {
      data.poster = `/uploads/posters/${req.file.filename}`;
    }
    const film = await Film.create({ ...data, created_by: req.user.id });
    res.status(201).json(film);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateFilm = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.poster = `/uploads/posters/${req.file.filename}`;
    const film = await Film.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!film) return res.status(404).json({ message: 'Film not found' });
    res.json(film);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteFilm = async (req, res) => {
  try {
    const film = await Film.findById(req.params.id);
    if (!film) return res.status(404).json({ message: 'Film not found' });
    // remove poster file if exists and is local
    if (film.poster && film.poster.startsWith('/uploads')) {
      const path = `.${film.poster}`;
      if (fs.existsSync(path)) fs.unlinkSync(path);
    }
    await film.remove();
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Bookmark handlers
const addBookmark = async (req, res) => {
  try {
    const filmId = req.params.id;
    const user = req.userModel;
    if (!user.bookmarks.includes(filmId)) {
      user.bookmarks.push(filmId);
      await user.save();
    }
    res.json({ bookmarks: user.bookmarks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const removeBookmark = async (req, res) => {
  try {
    const filmId = req.params.id;
    const user = req.userModel;
    user.bookmarks = user.bookmarks.filter(b => b.toString() !== filmId.toString());
    await user.save();
    res.json({ bookmarks: user.bookmarks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getBookmarks = async (req, res) => {
  try {
    const user = await req.userModel.populate('bookmarks');
    res.json(user.bookmarks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllFilms,
  getFilmById,
  getTrending,
  createFilm,
  updateFilm,
  deleteFilm,
  addBookmark,
  removeBookmark,
  getBookmarks
};
