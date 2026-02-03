const express = require('express');
const router = express.Router();

// Placeholder routes - to be implemented
router.get('/:conversationId', (req, res) => {
  res.json({ message: 'Get conversation messages route - to be implemented' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Send message route - to be implemented' });
});

module.exports = router;
