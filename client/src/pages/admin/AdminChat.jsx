import { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Search,
  Send,
  User,
  Trash2,
  Check,
  CheckCheck,
  Sparkles,
  Clock,
  Mail,
  Shield,
  Circle,
  RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { socket } from '../../socket';
import api from '../../api/axios';

export default function AdminChat() {
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isVisitorTyping, setIsVisitorTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 1. Fetch Conversations List & Connect to Admin Socket Room
  const fetchConversations = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/chat/conversations');
      setConversations(data || []);
      // If we don't have an active conversation and list is not empty, select the first
      if (!activeConv && data?.length > 0) {
        selectConversation(data[0]);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();

    // Join Admin Inbox Socket room
    socket.emit('join_session', { sessionId: 'admin_inbox', isAdmin: true });

    // Handle inbox update (when any visitor sends a message)
    const handleInboxUpdated = ({ conversation: updatedConv, message }) => {
      setConversations((prev) => {
        const index = prev.findIndex((c) => c._id === updatedConv._id);
        if (index !== -1) {
          const next = [...prev];
          next[index] = { ...next[index], ...updatedConv };
          // Move to top
          const [item] = next.splice(index, 1);
          return [item, ...next];
        } else {
          return [updatedConv, ...prev];
        }
      });

      // If this message belongs to currently active conversation
      if (activeConv && activeConv._id === updatedConv._id && message) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === message._id)) return prev;
          return [...prev, message];
        });
        // Mark as read immediately since admin is looking at it
        socket.emit('mark_read', {
          conversationId: activeConv._id,
          sessionId: activeConv.sessionId,
          reader: 'admin',
        });
      } else if (message && message.sender === 'visitor') {
        toast.success(`💬 New message from ${updatedConv.visitorName || 'Visitor'}`);
      }
    };

    // Handle incoming message in active session
    const handleReceiveMessage = ({ message }) => {
      if (activeConv && message.sessionId === activeConv.sessionId) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === message._id)) return prev;
          return [...prev, message];
        });
      }
    };

    // Handle visitor typing
    const handleUserTyping = ({ sender, isTyping }) => {
      if (sender === 'visitor') {
        setIsVisitorTyping(isTyping);
      }
    };

    socket.on('inbox_updated', handleInboxUpdated);
    socket.on('receive_message', handleReceiveMessage);
    socket.on('user_typing', handleUserTyping);

    return () => {
      socket.off('inbox_updated', handleInboxUpdated);
      socket.off('receive_message', handleReceiveMessage);
      socket.off('user_typing', handleUserTyping);
    };
  }, [activeConv]);

  // Select a conversation
  const selectConversation = async (conv) => {
    setActiveConv(conv);
    setIsVisitorTyping(false);

    // Join this specific session room
    socket.emit('join_session', { sessionId: conv.sessionId, isAdmin: true });

    // Mark as read in DB & socket
    socket.emit('mark_read', {
      conversationId: conv._id,
      sessionId: conv.sessionId,
      reader: 'admin',
    });

    // Update local state unread counter
    setConversations((prev) =>
      prev.map((c) => (c._id === conv._id ? { ...c, unreadByAdmin: 0 } : c))
    );

    // Fetch messages for this conversation
    try {
      const { data } = await api.get(`/chat/messages/${conv._id}`);
      setMessages(data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load messages');
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isVisitorTyping]);

  // Send admin reply
  const handleSendMessage = (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text || !activeConv) return;

    socket.emit('send_message', {
      sessionId: activeConv.sessionId,
      sender: 'admin',
      text,
    });

    socket.emit('typing', { sessionId: activeConv.sessionId, sender: 'admin', isTyping: false });
    setInputText('');
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    if (activeConv) {
      socket.emit('typing', { sessionId: activeConv.sessionId, sender: 'admin', isTyping: true });
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing', { sessionId: activeConv.sessionId, sender: 'admin', isTyping: false });
      }, 1500);
    }
  };

  // Delete conversation
  const handleDeleteConversation = async (convId, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this conversation thread permanently?')) return;

    try {
      await api.delete(`/chat/conversations/${convId}`);
      toast.success('Conversation deleted');
      setConversations((prev) => prev.filter((c) => c._id !== convId));
      if (activeConv?._id === convId) {
        setActiveConv(null);
        setMessages([]);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete conversation');
    }
  };

  // Filter conversations
  const filteredConversations = conversations.filter(
    (c) =>
      c.visitorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.visitorEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const quickReplies = [
    '👋 Hello! Thanks for reaching out. How can I help you?',
    '🚀 Yes, I am currently available for new client projects!',
    '💼 Please share your project requirements and target timeline.',
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner Header */}
      <div className="card p-6 bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-zinc-950 border border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 mb-2">
            <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
            <span>Live Chat Inbox</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Direct Client Inquiries &amp; Messages
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real-time two-way messaging with prospective clients and website visitors.
          </p>
        </div>

        <button
          onClick={fetchConversations}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-slate-300 text-xs font-semibold self-start sm:self-center transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Inbox</span>
        </button>
      </div>

      {/* Main Split-Screen Inbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[650px]">
        {/* ─── Left Column: Conversations List ────────────────── */}
        <div className="lg:col-span-4 card flex flex-col overflow-hidden h-full">
          {/* Search Box */}
          <div className="p-4 border-b border-zinc-800/80">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search clients or messages..."
                className="input !pl-9 !py-2 !text-xs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Conversations Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/60 custom-scrollbar">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-500">Loading inbox...</div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                {searchTerm ? 'No matching conversations' : 'No client messages yet.'}
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = activeConv?._id === conv._id;
                const hasUnread = conv.unreadByAdmin > 0;

                return (
                  <div
                    key={conv._id}
                    onClick={() => selectConversation(conv)}
                    className={`p-4 transition-colors cursor-pointer flex items-start justify-between gap-3 group relative ${
                      isSelected
                        ? 'bg-indigo-600/15 border-l-4 border-indigo-500'
                        : 'hover:bg-zinc-800/50'
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="relative shrink-0">
                        <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-sm text-indigo-400">
                          {conv.visitorName?.charAt(0) || 'V'}
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-zinc-900" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <h4
                            className={`text-xs font-bold truncate ${
                              hasUnread ? 'text-white' : 'text-slate-200'
                            }`}
                          >
                            {conv.visitorName}
                          </h4>
                          <span className="text-[10px] text-slate-500 shrink-0">
                            {new Date(conv.lastMessageAt || conv.updatedAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>

                        {conv.visitorEmail && (
                          <p className="text-[10px] text-slate-400 truncate mb-1">
                            {conv.visitorEmail}
                          </p>
                        )}

                        <p
                          className={`text-xs truncate ${
                            hasUnread ? 'text-indigo-300 font-semibold' : 'text-slate-400'
                          }`}
                        >
                          {conv.lastMessage || 'Started conversation'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between gap-2 shrink-0">
                      {hasUnread && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500 text-white shadow-sm">
                          {conv.unreadByAdmin}
                        </span>
                      )}

                      <button
                        onClick={(e) => handleDeleteConversation(conv._id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                        title="Delete Thread"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ─── Right Column: Active Conversation Stream ───────── */}
        <div className="lg:col-span-8 card flex flex-col overflow-hidden h-full">
          {activeConv ? (
            <>
              {/* Active Conversation Header */}
              <div className="p-4 px-6 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-900/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center font-bold text-sm">
                    {activeConv.visitorName?.charAt(0) || 'V'}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <span>{activeConv.visitorName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                        Connected
                      </span>
                    </h3>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      {activeConv.visitorEmail && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-500" />
                          <span>{activeConv.visitorEmail}</span>
                        </span>
                      )}
                      <span className="text-slate-600">•</span>
                      <span>Session ID: {activeConv.sessionId.slice(-8)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => handleDeleteConversation(activeConv._id, e)}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>

              {/* Messages Stream */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar bg-[#090b10]">
                {messages.length === 0 ? (
                  <div className="text-center py-20 text-slate-500 text-xs">
                    No messages in this conversation yet. Send a greeting below!
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const isAdmin = msg.sender === 'admin';
                    return (
                      <div
                        key={msg._id || index}
                        className={`flex items-end gap-2 ${
                          isAdmin ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {!isAdmin && (
                          <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 text-slate-300 flex items-center justify-center font-bold text-xs shrink-0 mb-1">
                            {activeConv.visitorName?.charAt(0) || 'V'}
                          </div>
                        )}

                        <div
                          className={`max-w-[70%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-md ${
                            isAdmin
                              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none'
                              : 'bg-zinc-800/90 text-slate-200 rounded-bl-none border border-zinc-700/60'
                          }`}
                        >
                          <p className="break-words">{msg.text}</p>
                          <div
                            className={`flex items-center justify-end gap-1 text-[9px] mt-1.5 ${
                              isAdmin ? 'text-indigo-200' : 'text-slate-400'
                            }`}
                          >
                            <span>
                              {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            {isAdmin && (
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
                  })
                )}

                {/* Visitor Typing status */}
                {isVisitorTyping && (
                  <div className="flex items-center gap-2 text-xs text-indigo-400 italic">
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-150" />
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-300" />
                    </span>
                    <span>{activeConv.visitorName} is typing...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Reply Bar */}
              <div className="px-6 py-2 border-t border-zinc-800/80 bg-zinc-950 flex flex-wrap gap-2">
                {quickReplies.map((qr, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(qr)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {qr}
                  </button>
                ))}
              </div>

              {/* Message Input Box */}
              <div className="p-4 bg-zinc-900/60 border-t border-zinc-800/80">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-3"
                >
                  <input
                    type="text"
                    placeholder={`Reply to ${activeConv.visitorName}... (Press Enter)`}
                    className="input !py-3 !text-xs !rounded-xl flex-1 !bg-zinc-900"
                    value={inputText}
                    onChange={handleInputChange}
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="btn-primary !px-5 !py-3 !text-xs !rounded-xl inline-flex items-center gap-1.5"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send</span>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-500">
              <div className="w-16 h-16 rounded-2xl bg-zinc-800/80 border border-zinc-700 flex items-center justify-center text-indigo-400 mb-4">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">No Conversation Selected</h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Select a client from the left inbox list to view live message history and reply in real-time.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
