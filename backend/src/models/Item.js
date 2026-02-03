const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: [
        'Tools',
        'Electronics',
        'Sports & Outdoors',
        'Kitchen & Appliances',
        'Games & Toys',
        'Books',
        'Garden & Outdoor',
        'Party & Events',
        'Baby & Kids',
        'Music & Instruments',
        'Camping & Hiking',
        'Other',
      ],
    },
    images: [
      {
        type: String,
      },
    ],
    condition: {
      type: String,
      required: [true, 'Please specify item condition'],
      enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'],
    },
    availability: {
      type: String,
      enum: ['Available', 'Borrowed', 'Unavailable'],
      default: 'Available',
    },
    lendingTerms: {
      maxDuration: {
        type: Number,
        default: 7, // days
      },
      depositRequired: {
        type: Boolean,
        default: false,
      },
      depositAmount: {
        type: Number,
        default: 0,
      },
      instructions: String,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
        index: '2dsphere',
      },
      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: { type: String, default: 'India' },
      },
    },
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    borrowCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for geospatial queries
ItemSchema.index({ 'location.coordinates': '2dsphere' });

// Index for text search
ItemSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Item', ItemSchema);
