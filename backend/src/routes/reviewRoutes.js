const express = require('express');
const router = express.Router();
const reviewCtrl = require('../controllers/reviewController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/movie/:movieId', reviewCtrl.getReviewsByMovie);
router.post('/', verifyToken, reviewCtrl.createReview);
router.put('/:id', verifyToken, reviewCtrl.updateReview);
router.delete('/:id', verifyToken, reviewCtrl.deleteReview);

module.exports = router;
