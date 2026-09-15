const { Server } = require('socket.io');
const Conversation = require('./models/Conversation');
const Message = require('./models/Message');

const setupSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        // Allow all origins (Vercel, Localhost, Preview deployments)
        callback(null, true);
      },
      credentials: true,
      methods: ['GET', 'POST'],
    },
    transports: ['polling', 'websocket'],
    allowEIO3: true,
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  const attachHandlers = (namespace) => {
    namespace.on('connection', (socket) => {
      // Visitor or Admin joins a specific chat session room
      socket.on('join_session', ({ sessionId, isAdmin }) => {
        if (sessionId) {
          socket.join(sessionId);
        }
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

          // Broadcast to everyone in this session's room (both visitor and admin)
          io.to(sessionId).emit('receive_message', { message, conversation });
          io.of('/api').to(sessionId).emit('receive_message', { message, conversation });

          // Broadcast notification to Admin Inbox room
          io.to('admin_inbox').emit('inbox_updated', { conversation, message });
          io.of('/api').to('admin_inbox').emit('inbox_updated', { conversation, message });
        } catch (err) {
          console.error('Socket send_message error:', err);
        }
      });

      // Handle typing indicator
      socket.on('typing', ({ sessionId, sender, isTyping }) => {
        if (sessionId) {
          socket.to(sessionId).emit('user_typing', { sender, isTyping });
        }
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
            if (sessionId) {
              io.to(sessionId).emit('messages_read', { reader, conversationId });
              io.of('/api').to(sessionId).emit('messages_read', { reader, conversationId });
            }
            io.to('admin_inbox').emit('inbox_updated', { conversation });
            io.of('/api').to('admin_inbox').emit('inbox_updated', { conversation });
          }
        } catch (err) {
          console.error('Socket mark_read error:', err);
        }
      });

      socket.on('disconnect', () => {
        // Clean disconnect
      });
    });
  };

  attachHandlers(io);
  attachHandlers(io.of('/api'));

  return io;
};

module.exports = setupSocket;
