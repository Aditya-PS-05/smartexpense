const { validationResult, body, param, query } = require('express-validator');

// Validation error handler
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

// Auth validations
const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 50 })
    .withMessage('Name cannot exceed 50 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  validate,
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

// Item validations
const createItemValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn([
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
    ])
    .withMessage('Invalid category'),
  body('condition')
    .notEmpty()
    .withMessage('Condition is required')
    .isIn(['New', 'Like New', 'Good', 'Fair', 'Poor'])
    .withMessage('Invalid condition'),
  validate,
];

// Request validations
const createRequestValidation = [
  body('itemId')
    .notEmpty()
    .withMessage('Item ID is required')
    .isMongoId()
    .withMessage('Invalid item ID'),
  body('borrowDate')
    .notEmpty()
    .withMessage('Borrow date is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  body('returnDate')
    .notEmpty()
    .withMessage('Return date is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  body('message')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Message cannot exceed 500 characters'),
  validate,
];

// Message validations
const sendMessageValidation = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Message content is required')
    .isLength({ max: 2000 })
    .withMessage('Message cannot exceed 2000 characters'),
  body('conversationId')
    .optional()
    .isMongoId()
    .withMessage('Invalid conversation ID'),
  body('recipientId')
    .optional()
    .isMongoId()
    .withMessage('Invalid recipient ID'),
  validate,
];

// Rating validations
const createRatingValidation = [
  body('borrowRequestId')
    .notEmpty()
    .withMessage('Borrow request ID is required')
    .isMongoId()
    .withMessage('Invalid borrow request ID'),
  body('score')
    .notEmpty()
    .withMessage('Score is required')
    .isInt({ min: 1, max: 5 })
    .withMessage('Score must be between 1 and 5'),
  body('comment')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Comment cannot exceed 500 characters'),
  validate,
];

// Report validations
const createReportValidation = [
  body('reason')
    .notEmpty()
    .withMessage('Reason is required')
    .isIn([
      'inappropriate_content',
      'fake_listing',
      'scam',
      'harassment',
      'damaged_item',
      'no_show',
      'other',
    ])
    .withMessage('Invalid reason'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  validate,
];

// Param validations
const mongoIdParam = [
  param('id').isMongoId().withMessage('Invalid ID format'),
  validate,
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  createItemValidation,
  createRequestValidation,
  sendMessageValidation,
  createRatingValidation,
  createReportValidation,
  mongoIdParam,
};
