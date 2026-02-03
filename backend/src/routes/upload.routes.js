const express = require('express');
const router = express.Router();
const {
  uploadProfileImage,
  uploadItemImages,
} = require('../controllers/upload.controller');
const {
  uploadProfileImage: uploadProfileMiddleware,
  uploadItemImages: uploadItemsMiddleware,
  handleUploadError,
} = require('../middleware/upload.middleware');
const { protect } = require('../middleware/auth.middleware');
const { uploadLimiter } = require('../middleware/rateLimit.middleware');

router.post(
  '/profile',
  protect,
  uploadLimiter,
  uploadProfileMiddleware,
  handleUploadError,
  uploadProfileImage
);

router.post(
  '/items',
  protect,
  uploadLimiter,
  uploadItemsMiddleware,
  handleUploadError,
  uploadItemImages
);

module.exports = router;
