const Film = require('../models/Film');
const Review = require('../models/Review');
const fs = require('fs');

const getAllFilms = async (req, res) => {
  try {
    const films = await Film.find()
      .populate('created_by', 'name email')
      .sort({ createdAt: -1 });
    
    // Transform posterUpload/posterUrl to poster field for frontend compatibility
    // Respect posterType: if it's 'url', use posterUrl; if 'upload', use posterUpload
    const transformedFilms = films.map(film => {
      let posterUrl;
      if (film.posterType === 'url') {
        posterUrl = film.posterUrl || film.posterUpload || '/placeholder.svg';
      } else {
        posterUrl = film.posterUpload || film.posterUrl || '/placeholder.svg';
      }
      
      return {
        ...film.toObject(),
        id: film._id,
        poster: posterUrl,
        genres: film.genre,
        year: film.releaseYear
      };
    });
    
    res.json(transformedFilms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getFilmById = async (req, res) => {
  try {
    const film = await Film.findById(req.params.id).populate('created_by', 'name email');
    if (!film) return res.status(404).json({ message: 'Film not found' });
    
    // Transform for frontend compatibility
    // Respect posterType: if it's 'url', use posterUrl; if 'upload', use posterUpload
    let posterUrl;
    if (film.posterType === 'url') {
      posterUrl = film.posterUrl || film.posterUpload || '/placeholder.svg';
    } else {
      posterUrl = film.posterUpload || film.posterUrl || '/placeholder.svg';
    }
    
    const transformedFilm = {
      ...film.toObject(),
      id: film._id,
      poster: posterUrl,
      genres: film.genre,
      year: film.releaseYear
    };
    
    res.json(transformedFilm);
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

    // Transform for frontend compatibility
    // Respect posterType: if it's 'url', use posterUrl; if 'upload', use posterUpload
    const transformedFilms = agg.map(film => {
      let posterUrl;
      if (film.posterType === 'url') {
        posterUrl = film.posterUrl || film.posterUpload || '/placeholder.svg';
      } else {
        posterUrl = film.posterUpload || film.posterUrl || '/placeholder.svg';
      }
      
      return {
        ...film,
        id: film._id,
        poster: posterUrl,
        genres: film.genre,
        year: film.releaseYear
      };
    });

    res.json(transformedFilms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


const createFilm = async (req, res) => {
  try {
    const { title, description, genre, country, releaseYear, posterUrl, moodTags, watchSources } = req.body;
    
    let posterData = {};
    if (req.file) {
      posterData.posterType = 'upload';
      posterData.posterUpload = req.file.filename;
    } else if (posterUrl) {
      posterData.posterType = 'url';
      posterData.posterUrl = posterUrl;
    }

    // Handle genre: can be array, string, or multiple form values
    let genreArray = [];
    if (Array.isArray(genre)) {
      genreArray = genre;
    } else if (typeof genre === 'string') {
      // Try parsing as JSON first (for backwards compatibility)
      try {
        genreArray = JSON.parse(genre);
        if (!Array.isArray(genreArray)) genreArray = [genre];
      } catch (e) {
        // If not JSON, treat as single genre
        genreArray = [genre];
      }
    }

    // Handle watchSources
    let watchSourcesArray = [];
    if (watchSources) {
      try {
        watchSourcesArray = typeof watchSources === 'string' ? JSON.parse(watchSources) : watchSources;
        if (!Array.isArray(watchSourcesArray)) watchSourcesArray = [];
      } catch (e) {
        watchSourcesArray = [];
      }
    }

    const film = await Film.create({
      title,
      description,
      genre: genreArray.length > 0 ? genreArray : [],
      country,
      releaseYear: parseInt(releaseYear),
      moodTags: Array.isArray(moodTags) ? moodTags : [],
      watchSources: watchSourcesArray,
      ...posterData,
      created_by: req.user.id
    });

    // Transform response
    const transformedFilm = {
      ...film.toObject(),
      id: film._id,
      poster: film.posterUpload || film.posterUrl || '/placeholder.svg',
      genres: film.genre,
      year: film.releaseYear
    };

    res.status(201).json(transformedFilm);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateFilm = async (req, res) => {
  try {
    const { title, description, genre, country, releaseYear, posterUrl: posterUrlFromBody, moodTags, watchSources } = req.body;
    
    let updateData = {
      title,
      description,
      country,
      releaseYear: parseInt(releaseYear),
      moodTags: Array.isArray(moodTags) ? moodTags : []
    };

    // Handle genre: can be array, string, or multiple form values
    let genreArray = [];
    if (Array.isArray(genre)) {
      genreArray = genre;
    } else if (typeof genre === 'string') {
      // Try parsing as JSON first (for backwards compatibility)
      try {
        genreArray = JSON.parse(genre);
        if (!Array.isArray(genreArray)) genreArray = [genre];
      } catch (e) {
        // If not JSON, treat as single genre
        genreArray = [genre];
      }
    }
    
    updateData.genre = genreArray.length > 0 ? genreArray : [];

    // Handle watchSources
    if (watchSources) {
      try {
        updateData.watchSources = typeof watchSources === 'string' ? JSON.parse(watchSources) : watchSources;
        if (!Array.isArray(updateData.watchSources)) updateData.watchSources = [];
      } catch (e) {
        updateData.watchSources = [];
      }
    }

    if (req.file) {
      // *** PERUBAHAN KRUSIAL: HANYA SIMPAN NAMA FILE ***
      // Sebelumnya: updateData.posterUpload = `/uploads/posters/${req.file.filename}`;
      updateData.posterType = 'upload';
      updateData.posterUpload = req.file.filename;
    } else if (posterUrlFromBody) {
      updateData.posterType = 'url';
      updateData.posterUrl = posterUrlFromBody;
    }

    const film = await Film.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!film) return res.status(404).json({ message: 'Film not found' });

    // Transform response
    // Respect posterType: if it's 'url', use posterUrl; if 'upload', use posterUpload
    let finalPosterUrl;
    if (film.posterType === 'url') {
      finalPosterUrl = film.posterUrl || film.posterUpload || '/placeholder.svg';
    } else {
      finalPosterUrl = film.posterUpload || film.posterUrl || '/placeholder.svg';
    }
    
    const transformedFilm = {
      ...film.toObject(),
      id: film._id,
      poster: finalPosterUrl,
      genres: film.genre,
      year: film.releaseYear
    };

    res.json(transformedFilm);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const deleteFilm = async (req, res) => {
  try {
    const film = await Film.findById(req.params.id);
    if (!film) return res.status(404).json({ message: 'Film not found' });
    
    // remove poster file if exists and is local
    if (film.posterUpload && film.posterUpload.startsWith('/uploads')) {
      const path = `.${film.posterUpload}`;
      if (fs.existsSync(path)) {
        fs.unlinkSync(path);
      }
    }
    
    // Use findByIdAndDelete instead of deprecated remove()
    await Film.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Error deleting film:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const uploadPoster = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }
    
    // PENTING: Mengembalikan HANYA NAMA FILE SAJA
    // Contoh: "image_a09d02.jpg"
    res.json({ 
        message: 'Poster uploaded successfully.',
        fileName: req.file.filename 
    });
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
    
    // Transform for frontend compatibility
    // Respect posterType: if it's 'url', use posterUrl; if 'upload', use posterUpload
    const transformedBookmarks = user.bookmarks.map(film => {
      let posterUrl;
      if (film.posterType === 'url') {
        posterUrl = film.posterUrl || film.posterUpload || '/placeholder.svg';
      } else {
        posterUrl = film.posterUpload || film.posterUrl || '/placeholder.svg';
      }
      
      return {
        ...film.toObject(),
        id: film._id,
        poster: posterUrl,
        genres: film.genre,
        year: film.releaseYear
      };
    });
    
    res.json(transformedBookmarks);
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
  uploadPoster,
  addBookmark,
  removeBookmark,
  getBookmarks
};
