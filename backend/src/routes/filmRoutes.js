const express = require('express');
const router = express.Router();
const filmCtrl = require('../controllers/filmController');
const { verifyToken, attachUserModel } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', filmCtrl.getAllFilms);
router.get('/trending', filmCtrl.getTrending);
router.get('/:id', filmCtrl.getFilmById);

router.post('/', verifyToken, adminOnly, upload.single('poster'), filmCtrl.createFilm);
router.put('/:id', verifyToken, adminOnly, upload.single('poster'), filmCtrl.updateFilm);
router.delete('/:id', verifyToken, adminOnly, filmCtrl.deleteFilm);

// Bookmarks
router.post('/:id/bookmark', verifyToken, attachUserModel, filmCtrl.addBookmark);
router.delete('/:id/bookmark', verifyToken, attachUserModel, filmCtrl.removeBookmark);
router.get('/bookmarks/list', verifyToken, attachUserModel, filmCtrl.getBookmarks);

module.exports = router;
