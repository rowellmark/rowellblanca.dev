'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, MessageSquare, X, Send, Loader2, Bot, User, ArrowRight, CheckCircle2, Mail, CheckCheck, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContactModal } from '@/components/ui/contact-modal';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user' | 'admin';
  senderName: string;
  text: string;
  time?: string;
}

const QUICK_PROMPTS = [
  'What are your React & Next.js capabilities?',
  'Tell me about your UK client work (Macmanus / Towerfire)',
  'What are your engagement rates & working hours?',
  'I want to hire Rowell for a project',
];

const RANDOM_TEASERS = [
  'Have a project in mind?',
  'Wanna build something cool?',
  'Looking for React & Next.js engineering?',
  'Need custom WordPress & Gutenberg architecture?',
  'Want senior dev rates without agency overhead?',
  'Need full UK/US timezone overlap?',
  'Want to discuss your project idea?',
  'Looking for a high-converting web platform?',
  'Interested in AI & LLM workflow integration?',
];

export default function ChatBubble() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  // Input fields
  const [input, setInput] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [threadId, setThreadId] = useState<number | null>(null);
  const [activeTeaserIndex, setActiveTeaserIndex] = useState(0);
  const [isBubbleDismissed, setIsBubbleDismissed] = useState(false);

  useEffect(() => {
    // Pick a random starting teaser index on mount
    setActiveTeaserIndex(Math.floor(Math.random() * RANDOM_TEASERS.length));

    // Rotate teaser every 5 minutes (300,000 ms)
    const interval = setInterval(() => {
      setActiveTeaserIndex((prev) => (prev + 1) % RANDOM_TEASERS.length);
      setIsBubbleDismissed(false);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSaveInitialInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    localStorage.setItem('rb_chat_user_name', name.trim());
    localStorage.setItem('rb_chat_user_email', email.trim());
    if (phone.trim()) localStorage.setItem('rb_chat_user_phone', phone.trim());
    setIsRegistered(true);

    setMessages((prev) => [
      ...prev,
      {
        id: `sys_${Date.now()}`,
        sender: 'ai',
        senderName: "Rowell's AI Assistant",
        text: `Nice to meet you, ${name.trim()}! 👋 I've saved your contact info so Rowell can also connect with you directly. How can I help you today?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Unified Chat Stream (Gemini AI + Admin Replies)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      senderName: "Rowell's AI Assistant",
      text: "👋 Hi! I'm Rowell's AI Assistant. Ask me anything about Rowell's portfolio, UK client projects, tech stack, or booking a call!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const lastSavedMessageCount = useRef(0);

  // Persist the full transcript as a Lead + ContactMessage — safe to call on
  // any exit path (close button, End Chat, tab close) since it no-ops when
  // there's no contact info yet or nothing new to save since the last call.
  const persistChatHistory = () => {
    if (messages.length <= 1 || !name.trim() || !email.trim()) return;
    if (messages.length === lastSavedMessageCount.current) return;
    lastSavedMessageCount.current = messages.length;

    const transcriptText = messages
      .map((m) => `[${m.time || 'HH:MM'}] ${m.senderName}: ${m.text}`)
      .join('\n\n');

    const payload = JSON.stringify({
      sessionId,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      transcript: transcriptText,
      sourceUrl: typeof window !== 'undefined' ? window.location.pathname : undefined,
    });

    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      navigator.sendBeacon('/api/chat/end', new Blob([payload], { type: 'application/json' }));
    } else {
      fetch('/api/chat/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch((e) => console.warn('[persistChatHistory] Failed to log session transcript:', e));
    }
  };

  // End Chat & Reset Session (Saves History to DB & Emails Admin)
  const handleEndChat = async () => {
    persistChatHistory();

    const newSid = 'session_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    localStorage.setItem('rb_chat_session_id', newSid);
    localStorage.removeItem('rb_chat_user_name');
    localStorage.removeItem('rb_chat_user_email');
    localStorage.removeItem('rb_chat_user_phone');
    setSessionId(newSid);
    setThreadId(null);
    setName('');
    setEmail('');
    setPhone('');
    setIsRegistered(false);
    setInput('');
    lastSavedMessageCount.current = 0;
    setMessages([
      {
        id: `sys_${Date.now()}`,
        sender: 'ai',
        senderName: "Rowell's AI Assistant",
        text: "👋 Hi! I'm Rowell's AI Assistant. Ask me anything about Rowell's portfolio, UK client projects, tech stack, or booking a call!",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Initialize session & restore contact details
  useEffect(() => {
    setMounted(true);
    let id = localStorage.getItem('rb_chat_session_id');
    if (!id) {
      id = 'session_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
      localStorage.setItem('rb_chat_session_id', id);
    }
    setSessionId(id);

    const savedName = localStorage.getItem('rb_chat_user_name');
    const savedEmail = localStorage.getItem('rb_chat_user_email');
    const savedPhone = localStorage.getItem('rb_chat_user_phone');
    if (savedName && savedEmail) {
      setName(savedName);
      setEmail(savedEmail);
      if (savedPhone) setPhone(savedPhone);
      setIsRegistered(true);
    }
  }, []);

  // Save transcript on tab close / navigation away, even if the widget was never explicitly closed
  useEffect(() => {
    const handler = () => persistChatHistory();
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [messages, name, email, sessionId]);

  // Poll for admin replies if thread exists
  useEffect(() => {
    if (!sessionId || !isOpen) return;

    const fetchAdminReplies = async () => {
      try {
        const res = await fetch(`/api/chat/inquiry?sessionId=${sessionId}`);
        const data = await res.json();

        if (data.success && data.thread) {
          setThreadId(data.thread.id);
          const replies: any[] = data.thread.replies || [];

          // Merge admin replies into single message stream
          setMessages((prev) => {
            const existingIds = new Set(prev.map((m) => m.id));
            const newAdminMsgs: ChatMessage[] = [];

            replies.forEach((r) => {
              const msgId = `admin_${r.id}`;
              if (!existingIds.has(msgId) && r.sender === 'admin') {
                newAdminMsgs.push({
                  id: msgId,
                  sender: 'admin',
                  senderName: 'Rowell Mark Blanca (Owner)',
                  text: r.message,
                  time: new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                });
              }
            });

            if (newAdminMsgs.length > 0) {
              return [...prev, ...newAdminMsgs];
            }
            return prev;
          });
        }
      } catch (e) {
        // Silent error handling
      }
    };

    fetchAdminReplies();
    const interval = setInterval(fetchAdminReplies, 5000);
    return () => clearInterval(interval);
  }, [sessionId, isOpen]);

  // Scroll to bottom when messages update — scrolls only the internal message
  // list (via scrollTop), never the page: scrollIntoView() walks every
  // scrollable ancestor including the document, which dragged the whole
  // page down whenever this fixed-position widget updated.
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (isOpen && container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, isOpen, loading]);

  // Unified Message Handler (AI + Direct Inquiry fallback)
  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      senderName: name || 'You',
      text: query.trim(),
      time: timeStr,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      // 1. Call Gemini AI Endpoint
      const aiRes = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages
            .filter((m) => m.sender !== 'admin')
            .map((m) => ({
              role: m.sender === 'user' ? 'user' : 'assistant',
              content: m.text,
            })),
        }),
      });

      const data = await aiRes.json();
      const aiReply =
        data.reply ||
        `Rowell is a Senior Full-Stack Engineer with full UK (GMT/BST) overlap. Would you like to leave your email so he can connect directly?`;

      setMessages((prev) => [
        ...prev,
        {
          id: `ai_${Date.now()}`,
          sender: 'ai',
          senderName: 'Gemini AI Assistant',
          text: aiReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);

      // 2. Log query silently to CRM
      if (name && email) {
        fetch('/api/chat/inquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            name,
            email,
            subject: 'AI Hybrid Chat Inquiry',
            message: query.trim(),
          }),
        }).catch(() => {});
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_${Date.now()}`,
          sender: 'ai',
          senderName: 'Gemini AI Assistant',
          text: "Rowell is a Senior Software Engineer specializing in React, Next.js, and Custom WordPress. Feel free to use the Book Discovery Call button to connect directly!",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };


  if (!mounted) return null;

  return (
    <>
      {/* Floating Circular Trigger Button & Popping Speech Bubble */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
        {/* Popping Speech Bubble Tooltip */}
        <AnimatePresence>
          {!isOpen && !isBubbleDismissed && (
            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.88 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 350, damping: 24 }}
              onClick={() => {
                setIsOpen(true);
                setIsBubbleDismissed(true);
              }}
              className="pointer-events-auto relative max-w-[280px] sm:max-w-[320px] bg-slate-950/95 backdrop-blur-xl border border-amber-400/40 hover:border-amber-400 p-3.5 rounded-2xl shadow-2xl cursor-pointer group transition-all"
            >
              {/* Header inside popout bubble */}
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Bot className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  Quick Question
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsBubbleDismissed(true);
                  }}
                  className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                  title="Dismiss teaser"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Animated Teaser Text */}
              <div className="text-xs font-bold text-slate-100 leading-snug">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={activeTeaserIndex}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.25 }}
                  >
                    "{RANDOM_TEASERS[activeTeaserIndex]}"
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* CTA Hint */}
              <div className="mt-2 text-[10px] font-extrabold text-amber-400 flex items-center justify-end gap-1 group-hover:translate-x-1 transition-transform">
                <span>Click to ask Rowell's AI</span>
                <ArrowRight className="w-3 h-3" />
              </div>

              {/* Tail pointing to circle robot launcher */}
              <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-slate-950 border-r border-b border-amber-400/40 rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Circular Animated Robot Launcher Button */}
        <div className="relative pointer-events-auto">
          {/* Full green pulsing aura around the entire circle button */}
          {!isOpen && (
            <span className="absolute -inset-1.5 rounded-full bg-emerald-400/60 animate-ping pointer-events-none opacity-80" />
          )}

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => {
              setIsOpen(!isOpen);
              if (!isOpen) setIsBubbleDismissed(true);
            }}
            className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-[#0b1a30] via-slate-900 to-[#1d63ed] text-white shadow-2xl border-2 border-amber-400/60 hover:border-amber-400 flex items-center justify-center cursor-pointer group overflow-hidden"
            title="Open Rowell's AI Assistant & Chat"
          >
            {/* Background glow pulse */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-blue-500/20 to-amber-500/10 rounded-full animate-pulse" />

            {/* Animated Robot Icon */}
            {isOpen ? (
              <X className="w-6 h-6 text-white relative z-10" />
            ) : (
              <div className="relative z-10 flex items-center justify-center">
                <Bot className="w-7.5 h-7.5 text-amber-300 group-hover:scale-110 transition-transform animate-bounce duration-1000" />
              </div>
            )}
          </motion.button>
        </div>
      </div>

      {/* Main Unified Hybrid Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] bg-slate-950/95 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden font-sans"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-[#0b1a30] to-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-white flex items-center gap-1.5">
                    Rowel AI Assistant • AI Desk
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                      Online
                    </span>
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium">Rowel AI Assistant + Direct Support</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {isRegistered && (
                  <button
                    type="button"
                    onClick={handleEndChat}
                    className="px-2.5 py-1 rounded-xl text-[10px] font-extrabold text-slate-300 hover:text-amber-300 bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 flex items-center gap-1 transition-all cursor-pointer"
                    title="End Chat & Start New Session"
                  >
                    <RotateCcw className="w-3 h-3 text-amber-400" />
                    <span>End Chat</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    persistChatHistory();
                    setIsOpen(false);
                  }}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                  title="Close Chat Drawer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isRegistered ? (
              <div className="flex-1 flex flex-col justify-center p-6 space-y-5 text-center">
                <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 border border-amber-400/40 flex items-center justify-center text-slate-950 mx-auto shadow-lg">
                  <Sparkles className="w-7 h-7 animate-pulse" />
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-base font-black text-white">Welcome to Rowel AI Assistant</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Please enter your details to start chatting & connect with Rowell:
                  </p>
                </div>

                <form onSubmit={handleSaveInitialInfo} className="space-y-3 text-left">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-white text-xs font-medium focus:outline-none focus:border-amber-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Your Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@company.com"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-white text-xs font-medium focus:outline-none focus:border-amber-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Phone Number (optional)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+44 7700 900000"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-white text-xs font-medium focus:outline-none focus:border-amber-500 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 mt-2"
                  >
                    <span>🚀 Start Chatting with Rowel AI Assistant</span>
                  </button>
                </form>
              </div>
            ) : (
              <>
                {/* Single Merged Conversation Stream */}
                <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div
                        className={`w-6.5 h-6.5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-black ${
                          m.sender === 'user'
                            ? 'bg-blue-600 text-white'
                            : m.sender === 'admin'
                            ? 'bg-emerald-500 text-slate-950 font-black'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {m.sender === 'user' ? (
                          <User className="w-3.5 h-3.5" />
                        ) : m.sender === 'admin' ? (
                          <CheckCheck className="w-3.5 h-3.5 text-slate-950" />
                        ) : (
                          <Bot className="w-3.5 h-3.5" />
                        )}
                      </div>

                      <div className="max-w-[85%] space-y-0.5">
                        <div
                          className={`p-3.5 rounded-2xl leading-relaxed ${
                            m.sender === 'user'
                              ? 'bg-[#1d63ed] text-white font-medium rounded-tr-none'
                              : m.sender === 'admin'
                              ? 'bg-emerald-950/90 border border-emerald-500/40 text-emerald-100 rounded-tl-none font-medium shadow-md'
                              : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                          }`}
                        >
                          <span className="text-[10px] font-extrabold block opacity-75 mb-0.5">
                            {m.senderName}
                          </span>
                          {m.text}
                        </div>
                        {m.time && (
                          <span className="text-[9px] text-slate-500 font-mono block px-1 text-right">
                            {m.time}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="flex items-center gap-2 text-slate-400 text-xs italic pl-8">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                      <span>Gemini AI is thinking...</span>
                    </div>
                  )}
                </div>

                {/* Quick Prompt Chips */}
                {messages.length < 3 && (
                  <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                    {QUICK_PROMPTS.map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(prompt)}
                        className="text-[10px] font-bold bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 rounded-full px-3 py-1 transition-all text-left truncate max-w-full"
                      >
                        💡 {prompt}
                      </button>
                    ))}
                  </div>
                )}

                {/* Book Call CTA Bar */}
                <div className="px-4 py-2 bg-amber-500/10 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> PST (GMT+8) • UK/US Overlap
                  </span>
                  <button
                    onClick={() => setIsContactOpen(true)}
                    className="text-[10px] font-black uppercase tracking-wider text-slate-950 bg-brand-amber hover:bg-amber-400 px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                  >
                    <span>Book Call</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Input Box */}
                <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask AI or type a message to Rowell..."
                    className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-amber-500 transition-all"
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={loading || !input.trim()}
                    className="p-2.5 rounded-xl bg-[#1d63ed] hover:bg-blue-600 disabled:opacity-40 text-white transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  );
}
