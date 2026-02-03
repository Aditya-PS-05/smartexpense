const express = require('express');
const router = express.Router();
const {
  register,
  login,
  verifyEmail,
  getMe,
  updateProfile,
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;
