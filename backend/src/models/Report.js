const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    reportedUser: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    reportedItem: {
      type: mongoose.Schema.ObjectId,
      ref: 'Item',
    },
    reportType: {
      type: String,
      enum: ['user', 'item'],
      required: true,
    },
    reason: {
      type: String,
      enum: [
        'inappropriate_content',
        'fake_listing',
        'scam',
        'harassment',
        'damaged_item',
        'no_show',
        'other',
      ],
      required: [true, 'Please select a reason'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
      default: 'pending',
    },
    adminNotes: {
      type: String,
    },
    resolvedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Report', ReportSchema);
