const express = require('express');
const router = express.Router();
const { createRating, checkCanRate } = require('../controllers/rating.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, createRating);
router.get('/check/:borrowRequestId', protect, checkCanRate);

module.exports = router;
