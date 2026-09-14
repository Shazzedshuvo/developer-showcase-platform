const { Server } = require('socket.io');
const Conversation = require('./models/Conversation');
const Message = require('./models/Message');

const setupSocket = (httpServer, clientOrigin) => {
  const io = new Server(httpServer, {
    cors: {
      origin: clientOrigin || ['http://localhost:5173', 'http://localhost:5000'],
      credentials: true,
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    // Visitor or Admin joins a specific chat session room
    socket.on('join_session', ({ sessionId, isAdmin }) => {
      socket.join(sessionId);
      if (isAdmin) {
        socket.join('admin_inbox');
      }
    });

    // Handle sending a message in real-time
    socket.on('send_message', async ({ sessionId, sender, text, visitorName, visitorEmail }) => {
      try {
        if (!sessionId || !text?.trim()) return;

        let conversation = await Conversation.findOne({ sessionId });
        if (!conversation) {
          conversation = await Conversation.create({
            sessionId,
            visitorName: visitorName || `Visitor #${sessionId.slice(-4)}`,
            visitorEmail: visitorEmail || '',
          });
        }

        // Create the message in database
        const message = await Message.create({
          conversationId: conversation._id,
          sessionId,
          sender, // 'visitor' or 'admin'
          text: text.trim(),
          isRead: false,
        });

        // Update conversation summary
        conversation.lastMessage = text.trim();
        conversation.lastMessageAt = new Date();
        if (sender === 'visitor') {
          conversation.unreadByAdmin += 1;
          if (visitorName) conversation.visitorName = visitorName;
          if (visitorEmail) conversation.visitorEmail = visitorEmail;
        } else if (sender === 'admin') {
          conversation.unreadByVisitor += 1;
        }
        await conversation.save();

        // Broadcast to everyone in this session's room (both visitor and admin viewing this chat)
        io.to(sessionId).emit('receive_message', {
          message,
          conversation,
        });

        // Broadcast notification to Admin Inbox room
        io.to('admin_inbox').emit('inbox_updated', {
          conversation,
          message,
        });
      } catch (err) {
        console.error('Socket send_message error:', err);
      }
    });

    // Handle typing indicator
    socket.on('typing', ({ sessionId, sender, isTyping }) => {
      socket.to(sessionId).emit('user_typing', { sender, isTyping });
    });

    // Handle mark as read
    socket.on('mark_read', async ({ conversationId, sessionId, reader }) => {
      try {
        if (!conversationId) return;
        const conversation = await Conversation.findById(conversationId);
        if (conversation) {
          if (reader === 'admin') {
            conversation.unreadByAdmin = 0;
            await Message.updateMany({ conversationId, sender: 'visitor', isRead: false }, { isRead: true });
          } else if (reader === 'visitor') {
            conversation.unreadByVisitor = 0;
            await Message.updateMany({ conversationId, sender: 'admin', isRead: false }, { isRead: true });
          }
          await conversation.save();
          io.to(sessionId).emit('messages_read', { reader, conversationId });
          io.to('admin_inbox').emit('inbox_updated', { conversation });
        }
      } catch (err) {
        console.error('Socket mark_read error:', err);
      }
    });

    socket.on('disconnect', () => {
      // Clean disconnect
    });
  });

  return io;
};

module.exports = setupSocket;
