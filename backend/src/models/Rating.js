const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema(
  {
    rater: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    ratedUser: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    item: {
      type: mongoose.Schema.ObjectId,
      ref: 'Item',
    },
    borrowRequest: {
      type: mongoose.Schema.ObjectId,
      ref: 'BorrowRequest',
      required: true,
    },
    score: {
      type: Number,
      required: [true, 'Please add a rating score'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxlength: [500, 'Comment cannot be more than 500 characters'],
    },
    ratingType: {
      type: String,
      enum: ['borrower_to_lender', 'lender_to_borrower'],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate ratings for same borrow request by same user
RatingSchema.index({ borrowRequest: 1, rater: 1 }, { unique: true });

// Static method to calculate average rating for a user
RatingSchema.statics.getAverageRating = async function (userId) {
  const obj = await this.aggregate([
    {
      $match: { ratedUser: userId },
    },
    {
      $group: {
        _id: '$ratedUser',
        averageRating: { $avg: '$score' },
        totalRatings: { $sum: 1 },
      },
    },
  ]);

  try {
    await this.model('User').findByIdAndUpdate(userId, {
      averageRating: obj[0] ? Math.round(obj[0].averageRating * 10) / 10 : 0,
      totalRatings: obj[0] ? obj[0].totalRatings : 0,
    });
  } catch (err) {
    console.error(err);
  }
};

// Update average rating after save
RatingSchema.post('save', function () {
  this.constructor.getAverageRating(this.ratedUser);
});

// Update average rating after remove
RatingSchema.post('remove', function () {
  this.constructor.getAverageRating(this.ratedUser);
});

module.exports = mongoose.model('Rating', RatingSchema);
