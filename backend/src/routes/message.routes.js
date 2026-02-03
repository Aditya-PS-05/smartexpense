const express = require('express');
const router = express.Router();
const { sendMessage, getMessages } = require('../controllers/message.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.post('/', sendMessage);
router.get('/:conversationId', getMessages);

module.exports = router;
