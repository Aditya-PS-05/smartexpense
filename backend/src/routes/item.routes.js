const express = require('express');
const router = express.Router();
const {
  createItem,
  getItems,
  getItem,
  updateItem,
  deleteItem,
  getMyItems,
} = require('../controllers/item.controller');
const { protect } = require('../middleware/auth.middleware');

// Public routes
router.get('/', getItems);
router.get('/my-items', protect, getMyItems);
router.get('/:id', getItem);

// Protected routes
router.post('/', protect, createItem);
router.put('/:id', protect, updateItem);
router.delete('/:id', protect, deleteItem);

module.exports = router;
