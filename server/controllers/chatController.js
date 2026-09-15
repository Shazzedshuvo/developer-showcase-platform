const asyncHandler = require('express-async-handler');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

/**
 * @route   GET /api/chat/session/:sessionId
 * @access  Public
 */
const getOrCreateSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const { visitorName, visitorEmail } = req.query;

  let conversation = await Conversation.findOne({ sessionId });
  if (!conversation) {
    conversation = await Conversation.create({
      sessionId,
      visitorName: visitorName || `Visitor #${sessionId.slice(-4)}`,
      visitorEmail: visitorEmail || '',
    });
  }

  const messages = await Message.find({ conversationId: conversation._id }).sort({ createdAt: 1 });

  res.json({ conversation, messages });
});

/**
 * @route   GET /api/chat/conversations
 * @access  Admin
 */
const getAdminConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find().sort({ lastMessageAt: -1, updatedAt: -1 });
  res.json(conversations);
});

/**
 * @route   GET /api/chat/messages/:conversationId
 * @access  Admin
 */
const getConversationMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
  res.json(messages);
});

/**
 * @route   PUT /api/chat/read/:conversationId
 * @access  Public / Admin
 */
const markMessagesRead = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const { reader } = req.body; // 'admin' or 'visitor'

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }

  if (reader === 'admin') {
    conversation.unreadByAdmin = 0;
    await Message.updateMany({ conversationId, sender: 'visitor', isRead: false }, { isRead: true });
  } else if (reader === 'visitor') {
    conversation.unreadByVisitor = 0;
    await Message.updateMany({ conversationId, sender: 'admin', isRead: false }, { isRead: true });
  }

  await conversation.save();
  res.json({ success: true });
});

/**
 * @route   DELETE /api/chat/conversations/:conversationId
 * @access  Admin
 */
const deleteConversation = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  await Message.deleteMany({ conversationId });
  await Conversation.findByIdAndDelete(conversationId);
  res.json({ success: true, message: 'Conversation deleted' });
});

/**
 * @route   GET /api/chat/leads
 * @access  Admin
 */
const getClientLeads = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find().sort({ lastMessageAt: -1, updatedAt: -1 }).lean();

  // Aggregate message count for each conversation
  const convIds = conversations.map((c) => c._id);
  let countMap = {};
  if (convIds.length > 0) {
    const counts = await Message.aggregate([
      { $match: { conversationId: { $in: convIds } } },
      { $group: { _id: '$conversationId', count: { $sum: 1 } } },
    ]);
    counts.forEach((item) => {
      countMap[item._id.toString()] = item.count;
    });
  }

  const leads = conversations.map((c) => ({
    ...c,
    messageCount: countMap[c._id.toString()] || 0,
  }));

  res.json(leads);
});

module.exports = {
  getOrCreateSession,
  getAdminConversations,
  getClientLeads,
  getConversationMessages,
  markMessagesRead,
  deleteConversation,
};
