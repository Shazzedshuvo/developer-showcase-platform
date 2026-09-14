import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Check,
  CheckCheck,
  Smile,
  Shield,
  Zap,
  ArrowRight,
  User,
  Mail,
  Minus,
} from 'lucide-react';
import { socket, getVisitorSessionId, getVisitorProfile, setVisitorProfile } from '../../socket';
import api from '../../api/axios';

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [profile, setProfile] = useState(getVisitorProfile());
  const [showProfileSetup, setShowProfileSetup] = useState(!getVisitorProfile().name);
  const [conversation, setConversation] = useState(null);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const sessionId = getVisitorSessionId();

  // Scroll to bottom helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 1. Initial Load & Join Session Room
  useEffect(() => {
    // Join socket room
    socket.emit('join_session', { sessionId, isAdmin: false });

    // Fetch conversation & message history
    api
      .get(`/chat/session/${sessionId}`)
      .then(({ data }) => {
        if (data?.conversation) setConversation(data.conversation);
        if (data?.messages) setMessages(data.messages);
      })
      .catch(console.error);

    // Socket Event: Receive Message
    const handleReceiveMessage = ({ message, conversation: updatedConv }) => {
      setMessages((prev) => {
        // Prevent duplicates
        if (prev.some((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });
      if (updatedConv) setConversation(updatedConv);

      // Increment unread if chat window is closed and message is from admin
      if (!isOpen && message.sender === 'admin') {
        setUnreadCount((c) => c + 1);
      }
    };

    // Socket Event: User Typing
    const handleUserTyping = ({ sender, isTyping: typingStatus }) => {
      if (sender === 'admin') {
        setIsTyping(typingStatus);
      }
    };

    // Socket Event: Read Receipts
    const handleMessagesRead = ({ reader }) => {
      if (reader === 'admin') {
        setMessages((prev) => prev.map((m) => ({ ...m, isRead: true })));
      }
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('user_typing', handleUserTyping);
    socket.on('messages_read', handleMessagesRead);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('user_typing', handleUserTyping);
      socket.off('messages_read', handleMessagesRead);
    };
  }, [sessionId, isOpen]);

  // Scroll on message change
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  // Mark as read when chat is opened
  const handleOpen = () => {
    setIsOpen(true);
    setUnreadCount(0);
    if (conversation?._id) {
      socket.emit('mark_read', {
        conversationId: conversation._id,
        sessionId,
        reader: 'visitor',
      });
    }
  };

  // Handle typing input
  const handleInputChange = (e) => {
    setInputText(e.target.value);
    socket.emit('typing', { sessionId, sender: 'visitor', isTyping: true });

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing', { sessionId, sender: 'visitor', isTyping: false });
    }, 1500);
  };

  // Send message
  const handleSendMessage = (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    socket.emit('send_message', {
      sessionId,
      sender: 'visitor',
      text,
      visitorName: profile.name || `Visitor #${sessionId.slice(-4)}`,
      visitorEmail: profile.email || '',
    });

    socket.emit('typing', { sessionId, sender: 'visitor', isTyping: false });
    setInputText('');
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    setVisitorProfile(profile);
    setShowProfileSetup(false);
  };

  const quickPrompts = [
    'Need a custom website quote 🚀',
    'Want to redesign my Wix Studio site 🎨',
    'Are you available for freelance work? 💼',
  ];

  return (
    <>
      {/* ─── Floating Launcher Button ─────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50 select-none">
        <motion.button
          onClick={isOpen ? () => setIsOpen(false) : handleOpen}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex items-center gap-3 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white shadow-2xl shadow-indigo-600/40 border border-indigo-400/30 hover:shadow-indigo-500/60 transition-all group cursor-pointer"
        >
          <div className="relative">
            {isOpen ? (
              <X className="w-5 h-5 transition-transform group-hover:rotate-90" />
            ) : (
              <MessageSquare className="w-5 h-5 animate-pulse-subtle" />
            )}
            {/* Online Pulse Dot */}
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
            </span>
          </div>

          <span className="hidden sm:inline-block text-xs font-bold tracking-wide">
            {isOpen ? 'Close Chat' : 'Chat with Shazzed'}
          </span>

          {/* Unread Message Badge */}
          {unreadCount > 0 && !isOpen && (
            <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-500 text-white shadow-lg animate-bounce">
              {unreadCount}
            </span>
          )}
        </motion.button>
      </div>

      {/* ─── Expandable Live Chat Window ──────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] h-[540px] max-h-[80vh] flex flex-col rounded-3xl bg-white dark:bg-[#0c0f17] border border-slate-200 dark:border-zinc-800/90 shadow-2xl shadow-black/30 overflow-hidden backdrop-blur-2xl"
          >
            {/* Window Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-indigo-900/30 via-purple-900/20 to-zinc-900/40 border-b border-slate-200 dark:border-zinc-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-[1.5px]">
                    <div className="w-full h-full bg-[#0c0f17] rounded-[10px] flex items-center justify-center font-bold text-white text-sm">
                      SS
                    </div>
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-900"></span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm tracking-tight">
                      Shazzed Shuvo
                    </h4>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
                      LIVE
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Online • Direct Chat</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Setup Bar (Optional details) */}
            {showProfileSetup ? (
              <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 border-b border-indigo-100 dark:border-indigo-900/40">
                <form onSubmit={handleProfileSave} className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-indigo-700 dark:text-indigo-300 font-semibold mb-1">
                    <span>Introduce Yourself (Optional):</span>
                    <button
                      type="button"
                      onClick={() => setShowProfileSetup(false)}
                      className="text-[10px] text-slate-500 hover:underline cursor-pointer"
                    >
                      Skip
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="input !py-1.5 !text-xs !bg-white dark:!bg-zinc-900"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                  <input
                    type="email"
                    placeholder="Your Email (for offline reply)"
                    className="input !py-1.5 !text-xs !bg-white dark:!bg-zinc-900"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                  <button
                    type="submit"
                    className="w-full btn-primary !py-1.5 !text-xs !rounded-lg"
                  >
                    Save &amp; Continue
                  </button>
                </form>
              </div>
            ) : null}

            {/* Messages Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 custom-scrollbar">
              {/* Automated Welcome Message */}
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-500 border border-indigo-500/30 flex items-center justify-center font-bold text-xs shrink-0">
                  SS
                </div>
                <div className="max-w-[80%] rounded-2xl rounded-tl-none p-3.5 bg-slate-100 dark:bg-zinc-800/90 text-slate-800 dark:text-slate-200 text-xs leading-relaxed shadow-sm border border-slate-200/60 dark:border-zinc-700/60">
                  <p className="font-semibold text-indigo-600 dark:text-indigo-400 mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Shazzed Shuvo</span>
                  </p>
                  <p>
                    Hi there! 👋 Welcome to my showcase platform. Feel free to ask any question about Wix Studio, Squarespace, Webflow, or custom web projects!
                  </p>
                </div>
              </div>

              {/* Message Bubbles */}
              {messages.map((msg, index) => {
                const isVisitor = msg.sender === 'visitor';
                return (
                  <div
                    key={msg._id || index}
                    className={`flex items-end gap-1.5 ${
                      isVisitor ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {!isVisitor && (
                      <div className="w-6 h-6 rounded-md bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-[10px] font-bold shrink-0 mb-1">
                        SS
                      </div>
                    )}

                    <div
                      className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                        isVisitor
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none'
                          : 'bg-slate-100 dark:bg-zinc-800/90 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200/60 dark:border-zinc-700/60'
                      }`}
                    >
                      <p className="break-words">{msg.text}</p>
                      <div
                        className={`flex items-center justify-end gap-1 text-[9px] mt-1 ${
                          isVisitor ? 'text-indigo-200' : 'text-slate-400'
                        }`}
                      >
                        <span>
                          {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {isVisitor && (
                          <span>
                            {msg.isRead ? (
                              <CheckCheck className="w-3 h-3 text-emerald-300 inline" />
                            ) : (
                              <Check className="w-3 h-3 inline" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Live Typing Indicator */}
              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-slate-500 italic">
                  <div className="w-6 h-6 rounded-md bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-[10px] font-bold">
                    SS
                  </div>
                  <span className="flex items-center gap-1">
                    <span>Shazzed is typing</span>
                    <span className="flex gap-0.5">
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-150"></span>
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-300"></span>
                    </span>
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts Pills (Shown when fewer than 2 messages sent) */}
            {messages.length === 0 && (
              <div className="px-4 py-2 border-t border-slate-100 dark:border-zinc-800/60 flex flex-wrap gap-1.5 bg-slate-50/50 dark:bg-zinc-900/30">
                {quickPrompts.map((prompt, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => handleSendMessage(prompt)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-300 hover:border-indigo-500/40 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input Bar */}
            <div className="p-3 bg-white dark:bg-[#0c0f17] border-t border-slate-200 dark:border-zinc-800/80">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="input !py-2 !text-xs !rounded-xl flex-1 !bg-slate-50 dark:!bg-zinc-900/80"
                  value={inputText}
                  onChange={handleInputChange}
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/20 disabled:opacity-40 disabled:cursor-not-allowed hover:from-indigo-500 hover:to-purple-500 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
