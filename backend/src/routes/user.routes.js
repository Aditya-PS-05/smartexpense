const express = require('express');
const router = express.Router();
const { getUserRatings } = require('../controllers/rating.controller');

router.get('/:id/ratings', getUserRatings);

module.exports = router;
