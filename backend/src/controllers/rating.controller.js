const Rating = require('../models/Rating');
const BorrowRequest = require('../models/BorrowRequest');

// @desc    Submit rating after transaction
// @route   POST /api/ratings
// @access  Private
exports.createRating = async (req, res, next) => {
  try {
    const { borrowRequestId, score, comment } = req.body;

    // Get borrow request
    const borrowRequest = await BorrowRequest.findById(borrowRequestId);

    if (!borrowRequest) {
      return res.status(404).json({
        success: false,
        error: 'Borrow request not found',
      });
    }

    // Only completed requests can be rated
    if (borrowRequest.status !== 'completed') {
      return res.status(400).json({
        success: false,
        error: 'Can only rate completed transactions',
      });
    }

    // Determine who is rating whom
    let ratedUser, ratingType;

    if (borrowRequest.borrower.toString() === req.user.id) {
      // Borrower rating lender
      ratedUser = borrowRequest.lender;
      ratingType = 'borrower_to_lender';
    } else if (borrowRequest.lender.toString() === req.user.id) {
      // Lender rating borrower
      ratedUser = borrowRequest.borrower;
      ratingType = 'lender_to_borrower';
    } else {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to rate this transaction',
      });
    }

    // Check for existing rating
    const existingRating = await Rating.findOne({
      borrowRequest: borrowRequestId,
      rater: req.user.id,
    });

    if (existingRating) {
      return res.status(400).json({
        success: false,
        error: 'You have already rated this transaction',
      });
    }

    const rating = await Rating.create({
      rater: req.user.id,
      ratedUser,
      item: borrowRequest.item,
      borrowRequest: borrowRequestId,
      score,
      comment,
      ratingType,
    });

    const populatedRating = await Rating.findById(rating._id)
      .populate('rater', 'name profileImage')
      .populate('ratedUser', 'name profileImage')
      .populate('item', 'title');

    res.status(201).json({
      success: true,
      data: populatedRating,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's ratings
// @route   GET /api/users/:id/ratings
// @access  Public
exports.getUserRatings = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const total = await Rating.countDocuments({ ratedUser: req.params.id });

    const ratings = await Rating.find({ ratedUser: req.params.id })
      .populate('rater', 'name profileImage')
      .populate('item', 'title images')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: ratings.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: ratings,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Check if user can rate a transaction
// @route   GET /api/ratings/check/:borrowRequestId
// @access  Private
exports.checkCanRate = async (req, res, next) => {
  try {
    const borrowRequest = await BorrowRequest.findById(req.params.borrowRequestId);

    if (!borrowRequest) {
      return res.status(404).json({
        success: false,
        error: 'Borrow request not found',
      });
    }

    // Check if user is part of transaction
    const isParticipant =
      borrowRequest.borrower.toString() === req.user.id ||
      borrowRequest.lender.toString() === req.user.id;

    if (!isParticipant) {
      return res.status(200).json({
        success: true,
        canRate: false,
        reason: 'Not a participant',
      });
    }

    // Check if already rated
    const existingRating = await Rating.findOne({
      borrowRequest: req.params.borrowRequestId,
      rater: req.user.id,
    });

    res.status(200).json({
      success: true,
      canRate: borrowRequest.status === 'completed' && !existingRating,
      hasRated: !!existingRating,
      isCompleted: borrowRequest.status === 'completed',
    });
  } catch (err) {
    next(err);
  }
};
