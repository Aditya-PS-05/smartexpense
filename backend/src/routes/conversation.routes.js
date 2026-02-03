const express = require('express');
const router = express.Router();
const {
  getConversations,
  getOrCreateConversation,
  getConversation,
} = require('../controllers/conversation.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.route('/').get(getConversations).post(getOrCreateConversation);
router.get('/:id', getConversation);

module.exports = router;
