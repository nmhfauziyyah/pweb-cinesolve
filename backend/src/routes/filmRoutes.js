const express = require('express');
const router = express.Router();
const filmCtrl = require('../controllers/filmController');
const { verifyToken, attachUserModel } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
// Asumsi 'upload' adalah Multer instance
const upload = require('../middleware/uploadMiddleware'); 

// --- Route Upload Poster Terpisah (PENTING untuk Sync Data) ---
// Endpoint ini hanya bertugas menerima file dan mengembalikan nama file yang disimpan.
router.post(
  '/upload-poster', 
  verifyToken, 
  adminOnly, 
  upload.single('poster'), 
  filmCtrl.uploadPoster // <-- Controller baru (atau fungsi sederhana)
);
// --- End Route Upload Poster ---

router.get('/', filmCtrl.getAllFilms);
router.get('/trending', filmCtrl.getTrending);
router.get('/bookmarks/list', verifyToken, attachUserModel, filmCtrl.getBookmarks);
router.get('/:id', filmCtrl.getFilmById);

// POST dan PUT tetap menggunakan Multer, tetapi sekarang bisa diasumsikan
// bahwa filmCtrl.createFilm atau updateFilm hanya perlu membaca req.file.filename
router.post('/', verifyToken, adminOnly, upload.single('poster'), filmCtrl.createFilm);
router.put('/:id', verifyToken, adminOnly, upload.single('poster'), filmCtrl.updateFilm);
router.delete('/:id', verifyToken, adminOnly, filmCtrl.deleteFilm);

// Bookmarks
router.post('/:id/bookmark', verifyToken, attachUserModel, filmCtrl.addBookmark);
router.delete('/:id/bookmark', verifyToken, attachUserModel, filmCtrl.removeBookmark);

module.exports = router;