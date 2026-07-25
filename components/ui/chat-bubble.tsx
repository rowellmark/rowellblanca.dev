'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Sparkles, User, RefreshCw, CheckCheck, Clock, LogOut, Timer, AlertCircle } from 'lucide-react';

interface Reply {
  id: number;
  sender: 'user' | 'admin';
  senderName: string;
  message: string;
  createdAt: string;
}

interface Thread {
  id: number;
  sessionId: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: string;
  sentAt: string;
  updatedAt: string;
  replies: Reply[];
}

const QUICK_PROMPTS = [
  '🚀 Request a Project Quote',
  '💼 Hire for Freelance / Full-Time',
  '⚡ Web App / Next.js Inquiry',
];

export default function ChatBubble() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [thread, setThread] = useState<Thread | null>(null);
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  
  // Visitor Form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  
  // Follow-up message input
  const [followUpMsg, setFollowUpMsg] = useState('');
  const [sendingFollowUp, setSendingFollowUp] = useState(false);
  const [autoEndedMsg, setAutoEndedMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize or retrieve visitor session ID from localStorage
  useEffect(() => {
    setMounted(true);
    let id = localStorage.getItem('rb_chat_session_id');
    if (!id) {
      id = 'session_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
      localStorage.setItem('rb_chat_session_id', id);
    }
    setSessionId(id);

    // Retrieve saved user info if available
    const savedName = localStorage.getItem('rb_chat_user_name');
    const savedEmail = localStorage.getItem('rb_chat_user_email');
    if (savedName) setName(savedName);
    if (savedEmail) setEmail(savedEmail);
  }, []);


  // Fetch active thread whenever sessionId changes or widget opens
  useEffect(() => {
    if (sessionId) {
      fetchThread(sessionId);
    }
  }, [sessionId, isOpen]);

  // Set up periodic polling for real-time admin replies when widget is active
  useEffect(() => {
    if (!sessionId || !isOpen) return;

    const interval = setInterval(() => {
      fetchThread(sessionId, true);
    }, 6000); // Poll every 6s

    return () => clearInterval(interval);
  }, [sessionId, isOpen]);

  // Auto scroll to bottom of chat stream
  useEffect(() => {
    if (thread) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [thread, thread?.replies?.length]);

  // Touch activity helper
  const touchActivity = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('rb_chat_last_activity', Date.now().toString());
    }
  };

  // 30-Minute Auto-Deactivation Tracker
  useEffect(() => {
    if (!sessionId || !thread) return;

    const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

    const checkInactivity = () => {
      const lastAct = localStorage.getItem('rb_chat_last_activity');
      if (lastAct) {
        const elapsed = Date.now() - Number(lastAct);
        if (elapsed >= INACTIVITY_TIMEOUT_MS) {
          handleEndChat(true); // Auto-deactivate session
        }
      }
    };

    const interval = setInterval(checkInactivity, 30000); // Check every 30s
    checkInactivity();

    return () => clearInterval(interval);
  }, [sessionId, thread]);

  const fetchThread = async (sid: string, isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setPolling(true);

    try {
      const res = await fetch(`/api/chat/inquiry?sessionId=${sid}`);
      const data = await res.json();
      if (data.success && data.thread) {
        setThread(data.thread);
      }
    } catch (err) {
      console.error('Error fetching chat thread:', err);
    } finally {
      setLoading(false);
      setPolling(false);
    }
  };

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setLoading(true);

    // Save user info for future sessions
    localStorage.setItem('rb_chat_user_name', name);
    localStorage.setItem('rb_chat_user_email', email);

    try {
      const res = await fetch('/api/chat/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          name,
          email,
          subject: subject || 'Portfolio Chat Inquiry',
          message,
        }),
      });

      const data = await res.json();
      if (data.success && data.thread) {
        touchActivity();
        setThread(data.thread);
        setMessage('');
        setAutoEndedMsg(null);
      } else {
        alert(data.error || 'Failed to send message.');
      }
    } catch (err) {
      alert('Error submitting inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpMsg.trim() || !sessionId) return;

    setSendingFollowUp(true);
    const contentToSend = followUpMsg;
    setFollowUpMsg('');

    try {
      const res = await fetch('/api/chat/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          name: name || thread?.name,
          email: email || thread?.email,
          message: contentToSend,
        }),
      });

      const data = await res.json();
      if (data.success && data.thread) {
        touchActivity();
        setThread(data.thread);
      }
    } catch (err) {
      console.error('Error sending follow-up:', err);
      setFollowUpMsg(contentToSend); // restore on error
    } finally {
      setSendingFollowUp(false);
    }
  };

  const selectPrompt = (promptText: string) => {
    setSubject(promptText);
    setMessage(`Hi Rowell! I'd like to talk about: ${promptText}`);
  };

  const handleEndChat = (isAuto = false) => {
    if (!isAuto && typeof window !== 'undefined' && !confirm('Are you sure you want to end this chat session?')) {
      return;
    }

    const newSid = 'session_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    localStorage.setItem('rb_chat_session_id', newSid);
    localStorage.removeItem('rb_chat_last_activity');

    setSessionId(newSid);
    setThread(null);
    setMessage('');
    setSubject('');

    if (isAuto) {
      setAutoEndedMsg('Chat session automatically closed after 30 minutes of inactivity.');
    } else {
      setAutoEndedMsg('Chat session ended. Thank you for reaching out!');
    }
  };

  const hasUnreadAdminReply = thread?.status === 'REPLIED';

  if (!mounted) return null;

  return (

    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-xl shadow-blue-500/30 hover:shadow-cyan-500/40 hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20"
        aria-label="Toggle chat widget"
      >
        {isOpen ? (
          <X className="w-6 h-6 transition-transform duration-200 rotate-90" />
        ) : (
          <>
            <MessageSquare className="w-6 h-6 transition-transform duration-200 group-hover:scale-110" />
            
            {/* Online Pulse Indicator */}
            <span className="absolute top-0.5 right-0.5 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-900"></span>
            </span>

            {/* Unread Reply Badge */}
            {hasUnreadAdminReply && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-slate-900 animate-bounce">
                1
              </span>
            )}
          </>
        )}
      </button>

      {/* Tooltip prompt when closed */}
      {!isOpen && (
        <div className="absolute right-16 bottom-2 hidden sm:flex items-center gap-2 bg-slate-900/90 text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-700/60 shadow-lg whitespace-nowrap backdrop-blur-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span>Chat with Rowell</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>
      )}

      {/* Chat Popup Box */}
      {isOpen && (
        <div className="absolute right-0 bottom-full mb-4 w-[380px] max-w-[calc(100vw-2rem)] h-[540px] max-h-[calc(100vh-7rem)] bg-slate-900/95 backdrop-blur-2xl border border-slate-700/60 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">

          
          {/* Header */}
          <div className="p-4 bg-slate-800/80 border-b border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white font-black text-sm border border-white/20 shadow-inner">
                  RB
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-800"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black text-white leading-none">Rowell Mark Blanca</h3>
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <p className="text-[11px] text-slate-400 font-medium mt-1">
                  {polling ? 'Syncing replies...' : 'Typically replies quickly'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {thread && (
                <button
                  type="button"
                  onClick={() => handleEndChat(false)}
                  title="End Chat Session"
                  className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-100 border border-red-500/30 text-[11px] font-extrabold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-3 h-3 text-red-400" />
                  <span>End Chat</span>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {/* Main Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            {loading && !thread ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
                <p className="text-xs font-medium">Loading chat...</p>
              </div>
            ) : !thread ? (
              /* SCREEN 1: Welcome & Initial Inquiry Form */
              <div className="space-y-4">
                {autoEndedMsg && (
                  <div className="bg-amber-500/20 border border-amber-500/40 rounded-2xl p-3 text-xs text-amber-200 flex items-start gap-2 animate-in fade-in duration-300">
                    <Timer className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-bold text-amber-300">Session Closed</p>
                      <p className="text-[11px] text-amber-200/90 mt-0.5 leading-relaxed">{autoEndedMsg}</p>
                    </div>
                    <button onClick={() => setAutoEndedMsg(null)} className="text-amber-400 hover:text-white">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-3.5 text-xs text-slate-300 space-y-2">
                  <p className="font-bold text-white text-sm flex items-center gap-1.5">
                    <span>👋 Hello & Welcome!</span>
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    Looking to build a modern web application, request a custom project quote, or discuss a freelance opportunity? Drop me a message below!
                  </p>
                </div>

                {/* Quick Prompts */}
                <div className="space-y-1.5">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Quick Topics</p>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => selectPrompt(prompt)}
                        className="text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white border border-slate-700/60 rounded-full px-3 py-1 transition-all text-left"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Visitor Form */}
                <form onSubmit={handleInitialSubmit} className="space-y-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-950/70 border border-slate-700/70 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="alex@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950/70 border border-slate-700/70 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Message / Inquiry *</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Tell me about your project scope, timeline, or questions..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-slate-950/70 border border-slate-700/70 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs py-2.5 rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Start Conversation</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              /* SCREEN 2: Active Chat Conversation Stream */
              <div className="space-y-3">
                {/* Initial Visitor Message Card */}
                <div className="flex flex-col items-end space-y-1">
                  <div className="max-w-[85%] bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs p-3 rounded-2xl rounded-tr-xs shadow-md space-y-1">
                    <div className="text-[10px] text-blue-200 font-bold border-b border-white/15 pb-1 mb-1">
                      {thread.name} ({thread.email})
                    </div>
                    <p className="whitespace-pre-wrap leading-relaxed">{thread.message}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(thread.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Reply Stream */}
                {thread.replies && thread.replies.length > 0 ? (
                  thread.replies.map((rep) => {
                    const isAdmin = rep.sender === 'admin';
                    return (
                      <div
                        key={rep.id}
                        className={`flex flex-col ${isAdmin ? 'items-start' : 'items-end'} space-y-1`}
                      >
                        <div
                          className={`max-w-[85%] text-xs p-3 rounded-2xl ${
                            isAdmin
                              ? 'bg-slate-800 border border-slate-700/80 text-slate-100 rounded-tl-xs shadow-md'
                              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-xs shadow-md'
                          }`}
                        >
                          {isAdmin && (
                            <div className="flex items-center gap-1.5 text-[10px] font-black text-cyan-400 border-b border-slate-700/60 pb-1 mb-1">
                              <Sparkles className="w-3 h-3" />
                              <span>{rep.senderName}</span>
                            </div>
                          )}
                          <p className="whitespace-pre-wrap leading-relaxed">{rep.message}</p>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                          {new Date(rep.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {isAdmin && <CheckCheck className="w-3 h-3 text-cyan-400" />}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-4 bg-slate-800/40 border border-slate-700/40 rounded-xl p-3">
                    <p className="text-xs text-cyan-300 font-medium">Inquiry received! 🚀</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Rowell has been notified. Replies will appear right here in real time.
                    </p>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Follow-up Footer (Active Chat mode) */}
          {thread && (
            <div className="p-3 bg-slate-800/90 border-t border-slate-700/50">
              <form onSubmit={handleSendFollowUp} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type a follow-up message..."
                  value={followUpMsg}
                  onChange={(e) => setFollowUpMsg(e.target.value)}
                  className="flex-1 bg-slate-950/80 border border-slate-700/70 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={sendingFollowUp || !followUpMsg.trim()}
                  className="p-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl disabled:opacity-40 transition-colors flex items-center justify-center"
                >
                  {sendingFollowUp ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
