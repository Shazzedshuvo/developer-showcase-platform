import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Check,
  CheckCheck,
  Shield,
  ArrowRight,
  User,
  Mail,
  Minus,
  Edit3,
  AlertCircle,
} from 'lucide-react';
import { socket, getVisitorSessionId, getVisitorProfile, setVisitorProfile } from '../../socket';
import api from '../../api/axios';
import { useSettings } from '../../context/SettingsContext';

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
};

export default function LiveChatWidget() {
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [profile, setProfile] = useState(getVisitorProfile());
  const [conversation, setConversation] = useState(null);
  const [isConnected, setIsConnected] = useState(socket.connected);

  // Profile validation & setup state
  const isProfileComplete = Boolean(
    profile?.name?.trim()?.length >= 2 &&
    profile?.email?.trim() &&
    isValidEmail(profile.email.trim())
  );
  const [showProfileSetup, setShowProfileSetup] = useState(!isProfileComplete);
  const [validationError, setValidationError] = useState('');

  // Scroll auto-prompt popup state
  const [showScrollPrompt, setShowScrollPrompt] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const sessionId = getVisitorSessionId();

  // Scroll to bottom helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 1. Initial Load & Join Session Room
  useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true);
      socket.emit('join_session', { sessionId, isAdmin: false });
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    if (socket.connected) {
      handleConnect();
    } else {
      socket.connect();
    }

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
        if (prev.some((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });
      if (updatedConv) setConversation(updatedConv);

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
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('receive_message', handleReceiveMessage);
      socket.off('user_typing', handleUserTyping);
      socket.off('messages_read', handleMessagesRead);
    };
  }, [sessionId, isOpen]);

  // 2. Scroll detection for proactive auto message
  useEffect(() => {
    const handleScroll = () => {
      // Trigger when user has scrolled past 250px and chat is closed
      if (window.scrollY > 250 && !isOpen) {
        const alreadyPrompted = sessionStorage.getItem('chat_scroll_auto_prompt_shown');
        if (!alreadyPrompted) {
          setShowScrollPrompt(true);
          sessionStorage.setItem('chat_scroll_auto_prompt_shown', 'true');
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  // Scroll on message change
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  // Mark as read and dismiss scroll prompt when opened
  const handleOpen = () => {
    setIsOpen(true);
    setShowScrollPrompt(false);
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
    if (isProfileComplete) {
      socket.emit('typing', { sessionId, sender: 'visitor', isTyping: true });
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing', { sessionId, sender: 'visitor', isTyping: false });
      }, 1500);
    }
  };

  // Handle saving visitor profile with strict validation
  const handleProfileSave = (e) => {
    if (e) e.preventDefault();
    const name = (profile.name || '').trim();
    const email = (profile.email || '').trim();

    if (!name || name.length < 2) {
      setValidationError('Please enter your full name (minimum 2 characters).');
      return;
    }

    if (!email || !isValidEmail(email)) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    setValidationError('');
    const updated = { name, email };
    setProfile(updated);
    setVisitorProfile(updated);
    setShowProfileSetup(false);
  };

  // Send message with mandatory validation check
  const handleSendMessage = (textToSend) => {
    if (!isProfileComplete) {
      setShowProfileSetup(true);
      setValidationError('🔒 Please enter your Name and Email first to start chatting.');
      return;
    }

    const text = (textToSend || inputText).trim();
    if (!text) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit('send_message', {
      sessionId,
      sender: 'visitor',
      text,
      visitorName: profile.name.trim(),
      visitorEmail: profile.email.trim(),
    });

    socket.emit('typing', { sessionId, sender: 'visitor', isTyping: false });
    setInputText('');
  };

  const quickPrompts = [
    'Need a custom website quote 🚀',
    'Want to redesign my Wix Studio site 🎨',
    'Are you available for freelance work? 💼',
  ];

  return (
    <>
      {/* ─── Scroll-triggered Auto Message Teaser ──────────────────── */}
      <AnimatePresence>
        {showScrollPrompt && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 max-w-[320px] p-4 rounded-3xl bg-white/95 dark:bg-[#0c0f17]/95 border border-indigo-500/30 dark:border-indigo-500/40 shadow-2xl shadow-indigo-600/20 backdrop-blur-2xl select-none"
          >
            <div className="flex items-start gap-3">
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-[1.5px] shadow-md shadow-indigo-500/25">
                  <div className="w-full h-full bg-[#0c0f17] rounded-[10px] flex items-center justify-center font-bold text-white text-xs">
                    {settings?.logoName || 'SS'}
                  </div>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-900 animate-pulse" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {settings?.siteName || 'Shazzed Shuvo'}
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[8px] font-extrabold bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                      LIVE
                    </span>
                  </div>
                  <button
                    onClick={() => setShowScrollPrompt(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                    title="Dismiss"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 mt-1.5 leading-snug font-medium">
                  Hi! For any help or concern, please message us 👋
                </p>

                <button
                  onClick={handleOpen}
                  className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all cursor-pointer shadow-md shadow-indigo-600/20"
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>Send a message</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
            </span>
          </div>

          <span className="hidden sm:inline-block text-xs font-bold tracking-wide">
            {isOpen ? 'Close Chat' : `Chat with ${settings?.siteName ? settings.siteName.split(' ')[0] : 'Shazzed'}`}
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
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] h-[550px] max-h-[82vh] flex flex-col rounded-3xl bg-white dark:bg-[#0c0f17] border border-slate-200 dark:border-zinc-800/90 shadow-2xl shadow-black/30 overflow-hidden backdrop-blur-2xl"
          >
            {/* Window Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-indigo-900/20 via-purple-900/15 to-zinc-900/30 border-b border-slate-200 dark:border-zinc-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-[1.5px]">
                    <div className="w-full h-full bg-[#0c0f17] rounded-[10px] flex items-center justify-center font-bold text-white text-sm">
                      {settings?.logoName || 'SS'}
                    </div>
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-900"></span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm tracking-tight">
                      {settings?.siteName || 'Shazzed Shuvo'}
                    </h4>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
                      LIVE
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`}></span>
                    <span>{isConnected ? 'Online • Direct Chat' : 'Connecting...'}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                title="Close chat window"
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Status Badge (When profile is set and setup is hidden) */}
            {isProfileComplete && !showProfileSetup && (
              <div className="px-4 py-1.5 bg-slate-50 dark:bg-zinc-900/50 border-b border-slate-100 dark:border-zinc-800/60 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1.5 truncate">
                  <User className="w-3 h-3 text-indigo-500 shrink-0" />
                  <span className="truncate">
                    Chatting as <strong className="text-slate-800 dark:text-slate-200">{profile.name}</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowProfileSetup(true)}
                  className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold shrink-0 cursor-pointer"
                  title="Update your contact info"
                >
                  <Edit3 className="w-2.5 h-2.5" />
                  <span>Edit</span>
                </button>
              </div>
            )}

            {/* Mandatory Profile Setup Card */}
            {(showProfileSetup || !isProfileComplete) ? (
              <div className="p-4 bg-indigo-50/90 dark:bg-indigo-950/50 border-b border-indigo-100 dark:border-indigo-900/50">
                <form onSubmit={handleProfileSave} className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span>Identification Required</span>
                    </span>
                    {isProfileComplete && (
                      <button
                        type="button"
                        onClick={() => setShowProfileSetup(false)}
                        className="text-[10px] text-slate-500 hover:underline cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-indigo-700/80 dark:text-indigo-300/80 leading-tight">
                    Please provide your name and email to start chatting so we can assist you directly.
                  </p>

                  {validationError && (
                    <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-[11px] flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{validationError}</span>
                    </div>
                  )}

                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="Your Name (e.g. John Smith)"
                      className="input !py-1.5 !pl-8 !text-xs !bg-white dark:!bg-zinc-900"
                      value={profile.name || ''}
                      onChange={(e) => {
                        setValidationError('');
                        setProfile({ ...profile, name: e.target.value });
                      }}
                    />
                  </div>

                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="email"
                      required
                      placeholder="Your Email (for notifications)"
                      className="input !py-1.5 !pl-8 !text-xs !bg-white dark:!bg-zinc-900"
                      value={profile.email || ''}
                      onChange={(e) => {
                        setValidationError('');
                        setProfile({ ...profile, email: e.target.value });
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-primary !py-2 !text-xs !rounded-xl font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20"
                  >
                    <span>Confirm &amp; Start Chatting</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            ) : null}

            {/* Messages Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 custom-scrollbar">
              {/* Automated Welcome Message */}
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-500 border border-indigo-500/30 flex items-center justify-center font-bold text-xs shrink-0">
                  {settings?.logoName ? settings.logoName.slice(0, 2) : 'SS'}
                </div>
                <div className="max-w-[85%] rounded-2xl rounded-tl-none p-3.5 bg-slate-100 dark:bg-zinc-800/90 text-slate-800 dark:text-slate-200 text-xs leading-relaxed shadow-sm border border-slate-200/60 dark:border-zinc-700/60">
                  <p className="font-semibold text-indigo-600 dark:text-indigo-400 mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>{settings?.siteName || 'Shazzed Shuvo'}</span>
                  </p>
                  <p>
                    Hi! For any help or concern, please message us 👋 Feel free to ask any question about Wix Studio, Squarespace, Webflow, or custom web projects!
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
                        {settings?.logoName ? settings.logoName.slice(0, 2) : 'SS'}
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
                    {settings?.logoName ? settings.logoName.slice(0, 2) : 'SS'}
                  </div>
                  <span className="flex items-center gap-1">
                    <span>{settings?.siteName ? settings.siteName.split(' ')[0] : 'Shazzed'} is typing</span>
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

            {/* Quick Prompts Pills */}
            {messages.length === 0 && (
              <div className="px-4 py-2 border-t border-slate-100 dark:border-zinc-800/60 flex flex-wrap gap-1.5 bg-slate-50/50 dark:bg-zinc-900/30">
                {quickPrompts.map((prompt, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => handleSendMessage(prompt)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-300 hover:border-indigo-500/40 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input Bar */}
            <div className="p-3 bg-white dark:bg-[#0c0f17] border-t border-slate-200 dark:border-zinc-800/80">
              {isProfileComplete ? (
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
                    title="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setShowProfileSetup(true)}
                  className="w-full py-2.5 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/50 text-indigo-700 dark:text-indigo-300 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Enter Name &amp; Email above to unlock chat</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
