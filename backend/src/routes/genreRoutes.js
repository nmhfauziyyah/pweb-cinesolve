const express = require('express');
const { getAllGenres, createGenre, deleteGenre } = require('../controllers/genreController');
const { adminOnly } = require('../middleware/adminMiddleware');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllGenres);
router.post('/', verifyToken, adminOnly, createGenre);
router.delete('/:id', verifyToken, adminOnly, deleteGenre);

module.exports = router;
