const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || req.headers['x-access-token'];
    if (!auth) return res.status(401).json({ message: 'No token' });
    const token = auth.startsWith('Bearer ') ? auth.split(' ')[1] : auth;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Invalid token' });
  }
};

// helper middleware to attach full user model for bookmark endpoints
const attachUserModel = async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'No user' });
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.userModel = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { verifyToken, attachUserModel };
