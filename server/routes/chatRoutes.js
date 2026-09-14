const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getOrCreateSession,
  getAdminConversations,
  getConversationMessages,
  markMessagesRead,
  deleteConversation,
} = require('../controllers/chatController');

// Public chat session endpoints
router.get('/session/:sessionId', getOrCreateSession);
router.put('/read/:conversationId', markMessagesRead);

// Admin chat endpoints
router.get('/conversations', protect, getAdminConversations);
router.get('/messages/:conversationId', protect, getConversationMessages);
router.delete('/conversations/:conversationId', protect, deleteConversation);

module.exports = router;
