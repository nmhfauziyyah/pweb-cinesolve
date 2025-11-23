const express = require('express');
const { getAllCountries, createCountry, deleteCountry } = require('../controllers/countryController');
const { adminOnly } = require('../middleware/adminMiddleware');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllCountries);
router.post('/', verifyToken, adminOnly, createCountry);
router.delete('/:id', verifyToken, adminOnly, deleteCountry);

module.exports = router;
