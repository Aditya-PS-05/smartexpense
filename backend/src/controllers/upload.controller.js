const path = require('path');

// @desc    Upload profile image
// @route   POST /api/upload/profile
// @access  Private
exports.uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload an image',
      });
    }

    const imageUrl = `/uploads/profiles/${req.file.filename}`;

    res.status(200).json({
      success: true,
      data: {
        url: imageUrl,
        filename: req.file.filename,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Upload item images
// @route   POST /api/upload/items
// @access  Private
exports.uploadItemImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please upload at least one image',
      });
    }

    const images = req.files.map((file) => ({
      url: `/uploads/items/${file.filename}`,
      filename: file.filename,
    }));

    res.status(200).json({
      success: true,
      count: images.length,
      data: images,
    });
  } catch (err) {
    next(err);
  }
};
