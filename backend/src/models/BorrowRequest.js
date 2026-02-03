const mongoose = require('mongoose');

const BorrowRequestSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.ObjectId,
      ref: 'Item',
      required: true,
    },
    borrower: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    lender: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'active', 'completed', 'cancelled'],
      default: 'pending',
    },
    message: {
      type: String,
      maxlength: [500, 'Message cannot be more than 500 characters'],
    },
    borrowDate: {
      type: Date,
      required: [true, 'Please specify borrow date'],
    },
    returnDate: {
      type: Date,
      required: [true, 'Please specify return date'],
    },
    actualReturnDate: {
      type: Date,
    },
    pickupDetails: {
      location: String,
      time: String,
      notes: String,
    },
    returnDetails: {
      location: String,
      time: String,
      notes: String,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate pending requests for same item by same borrower
BorrowRequestSchema.index(
  { item: 1, borrower: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: 'pending' } }
);

module.exports = mongoose.model('BorrowRequest', BorrowRequestSchema);
