const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    visitorName: {
      type: String,
      default: 'Guest Client',
      trim: true,
    },
    visitorEmail: {
      type: String,
      default: '',
      trim: true,
    },
    lastMessage: {
      type: String,
      default: '',
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
    unreadByAdmin: {
      type: Number,
      default: 0,
    },
    unreadByVisitor: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'archived'],
      default: 'active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Conversation', conversationSchema);
