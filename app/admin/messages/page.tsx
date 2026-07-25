'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Trash2,
  Mail,
  Send,
  User,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

interface Reply {
  id: number;
  sender: 'user' | 'admin';
  senderName: string;
  message: string;
  createdAt: string;
}

interface ContactMessage {
  id: number;
  sessionId?: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: string; // UNREAD, READ, REPLIED
  sentAt: string;
  updatedAt: string;
  replies?: Reply[];
}

const QUICK_RESPONSES = [
  "Hi! Thanks for reaching out. I'd love to discuss your project requirements in more detail.",
  "Hello! I am currently available for new freelance / contract development projects. When would be a good time to connect?",
  "Thanks for your inquiry! I have received your details and will put together a preliminary proposal.",
  "Hi! Could you share a bit more detail about your project timeline and preferred tech stack?",
];

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMsgId, setSelectedMsgId] = useState<number | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'REPLIED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Reply form states
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [sendEmailNotification, setSendEmailNotification] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async (maintainSelected = true) => {
    try {
      const res = await fetch('/api/crm/messages');
      const data = await res.json();
      if (data.success && Array.isArray(data.messages)) {
        setMessages(data.messages);
        if (data.messages.length > 0 && (!selectedMsgId || !maintainSelected)) {
          setSelectedMsgId(data.messages[0].id);
        }
      }
    } catch (e) {
      console.error('Error fetching messages:', e);
    } finally {
      setLoading(false);
    }
  };

  const selectedMessage = messages.find((m) => m.id === selectedMsgId);

  // Auto scroll chat thread to bottom when selected message or replies change
  useEffect(() => {
    if (selectedMessage) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedMsgId, selectedMessage?.replies?.length]);

  const handleDelete = async (id: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!confirm('Are you sure you want to delete this message thread?')) return;
    try {
      const res = await fetch(`/api/crm/messages?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        if (selectedMsgId === id) {
          setSelectedMsgId(null);
        }
        fetchMessages(false);
      }
    } catch (e) {
      alert('Failed to delete message');
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      const res = await fetch('/api/crm/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
        );
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMsgId || !replyText.trim()) return;

    setSendingReply(true);

    try {
      const res = await fetch('/api/crm/messages/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactMessageId: selectedMsgId,
          replyMessage: replyText,
          sendEmail: sendEmailNotification,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setReplyText('');
        // Refresh message thread
        fetchMessages(true);
      } else {
        alert(data.message || 'Failed to send reply');
      }
    } catch (err) {
      alert('Error sending reply');
    } finally {
      setSendingReply(false);
    }
  };

  // Filter & Search logic
  const filteredMessages = messages.filter((msg) => {
    const matchesFilter =
      filter === 'ALL' ||
      (filter === 'UNREAD' && msg.status === 'UNREAD') ||
      (filter === 'REPLIED' && msg.status === 'REPLIED');

    const matchesSearch =
      msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (msg.subject && msg.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
      msg.message.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const unreadCount = messages.filter((m) => m.status === 'UNREAD').length;

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans text-slate-800">
      {/* Top Title & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-[#0b1a30]">Inquiries & Live Chat CRM</h1>
            {unreadCount > 0 && (
              <span className="bg-blue-600 text-white text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Manage live website chat inquiries, send interactive replies, and dispatch Mailtrap email alerts.
          </p>
        </div>

        <button
          onClick={() => fetchMessages(true)}
          className="self-start md:self-auto flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Inbox</span>
        </button>
      </div>

      {/* Main CRM Workspace (2-Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Message List & Search (4 Cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs flex flex-col h-[calc(100vh-14rem)] min-h-[500px]">
          
          {/* Search & Filter Header */}
          <div className="p-3 border-b border-slate-100 bg-slate-50/50 space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search sender, email, or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl pl-9 pr-3 py-1.5 text-xs font-medium focus:outline-none transition-colors"
              />
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-1">
              {(['ALL', 'UNREAD', 'REPLIED'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-1 text-[11px] font-extrabold py-1 px-2 rounded-lg transition-all text-center ${
                    filter === f
                      ? 'bg-[#0b1a30] text-white shadow-xs'
                      : 'text-slate-500 hover:bg-slate-200/60'
                  }`}
                >
                  {f === 'ALL' ? `All (${messages.length})` : f === 'UNREAD' ? `Unread (${unreadCount})` : 'Replied'}
                </button>
              ))}
            </div>
          </div>

          {/* List Scroll Area */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 scrollbar-thin">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                <span>Loading inquiries...</span>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No matching inquiries found.
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isSelected = msg.id === selectedMsgId;
                const isUnread = msg.status === 'UNREAD';

                return (
                  <div
                    key={msg.id}
                    onClick={() => {
                      setSelectedMsgId(msg.id);
                      if (isUnread) handleUpdateStatus(msg.id, 'READ');
                    }}
                    className={`p-3.5 cursor-pointer transition-all flex items-start justify-between gap-2 ${
                      isSelected
                        ? 'bg-blue-50/80 border-l-4 border-blue-600'
                        : isUnread
                        ? 'bg-white hover:bg-slate-50/80 font-bold'
                        : 'bg-white hover:bg-slate-50/60 opacity-85'
                    }`}
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-black truncate ${isSelected ? 'text-blue-900' : 'text-[#0b1a30]'}`}>
                          {msg.name}
                        </span>
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
                        )}
                        {msg.status === 'REPLIED' && (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0">
                            Replied
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] font-semibold text-slate-600 truncate">
                        {msg.subject || 'Website Inquiry'}
                      </p>

                      <p className="text-[11px] text-slate-500 truncate line-clamp-1">
                        {msg.message}
                      </p>

                      <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 pt-0.5">
                        <Clock className="w-3 h-3" />
                        {new Date(msg.sentAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleDelete(msg.id, e)}
                      title="Delete Thread"
                      className="p-1 text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Active Message Thread & Live Reply Composer (8 Cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs flex flex-col h-[calc(100vh-14rem)] min-h-[500px]">
          {selectedMessage ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-black text-[#0b1a30]">{selectedMessage.name}</h2>
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="text-xs font-medium text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>{selectedMessage.email}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-xs text-slate-500 font-semibold">
                    Subject: <span className="text-slate-800">{selectedMessage.subject || 'Website Inquiry'}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedMessage.status}
                    onChange={(e) => handleUpdateStatus(selectedMessage.id, e.target.value)}
                    className="bg-white border border-slate-200 text-xs font-bold text-slate-700 rounded-xl px-2.5 py-1.5 focus:outline-none shadow-2xs"
                  >
                    <option value="UNREAD">Mark UNREAD</option>
                    <option value="READ">Mark READ</option>
                    <option value="REPLIED">Mark REPLIED</option>
                    <option value="CLOSED">Mark CLOSED</option>
                  </select>

                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="p-1.5 bg-white border border-slate-200 text-slate-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                    title="Delete Thread"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Chat Thread Scroll Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30 scrollbar-thin">
                
                {/* Initial Visitor Message Card */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs shrink-0">
                    {selectedMessage.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="space-y-1 max-w-2xl flex-1">
                    <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs p-4 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="text-xs font-extrabold text-[#0b1a30]">
                          {selectedMessage.name} &lt;{selectedMessage.email}&gt;
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(selectedMessage.sentAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 font-medium whitespace-pre-wrap leading-relaxed">
                        {selectedMessage.message}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Back-and-forth Replies Stream */}
                {selectedMessage.replies && selectedMessage.replies.length > 0 && (
                  selectedMessage.replies.map((rep) => {
                    const isAdmin = rep.sender === 'admin';
                    return (
                      <div
                        key={rep.id}
                        className={`flex items-start gap-3 ${isAdmin ? 'flex-row-reverse' : ''}`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                            isAdmin
                              ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xs'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {isAdmin ? 'RB' : rep.senderName.charAt(0).toUpperCase()}
                        </div>

                        <div className="space-y-1 max-w-xl flex-1">
                          <div
                            className={`p-4 rounded-2xl text-xs shadow-2xs space-y-1 ${
                              isAdmin
                                ? 'bg-[#0b1a30] text-white rounded-tr-xs border border-slate-800'
                                : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs'
                            }`}
                          >
                            <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-1">
                              <span className={`font-bold flex items-center gap-1 ${isAdmin ? 'text-cyan-400' : 'text-slate-700'}`}>
                                {isAdmin && <Sparkles className="w-3 h-3" />}
                                {rep.senderName} {isAdmin && '(You)'}
                              </span>
                              <span className={`text-[10px] font-mono ${isAdmin ? 'text-slate-400' : 'text-slate-400'}`}>
                                {new Date(rep.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <p className="whitespace-pre-wrap leading-relaxed">{rep.message}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Live Reply Composer */}
              <div className="p-4 border-t border-slate-200 bg-white space-y-3">
                {/* Canned Quick Templates */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Quick Templates
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_RESPONSES.map((tmpl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setReplyText(tmpl)}
                        className="text-[11px] font-medium bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 rounded-lg px-2.5 py-1 transition-all text-left truncate max-w-xs"
                      >
                        Template {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSendReply} className="space-y-2">
                  <textarea
                    rows={3}
                    required
                    placeholder={`Type your reply to ${selectedMessage.name}...`}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-colors resize-none font-medium"
                  />

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600">
                      <input
                        type="checkbox"
                        checked={sendEmailNotification}
                        onChange={(e) => setSendEmailNotification(e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>Dispatch email copy via Mailtrap to {selectedMessage.email}</span>
                    </label>

                    <button
                      type="submit"
                      disabled={sendingReply || !replyText.trim()}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all disabled:opacity-50"
                    >
                      {sendingReply ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <span>Send Reply</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-3">
              <MessageSquare className="w-12 h-12 text-slate-300 stroke-[1.5]" />
              <h3 className="text-sm font-bold text-slate-600">No Inquiry Selected</h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Select an inquiry thread from the inbox on the left to view conversation details and send interactive replies.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
