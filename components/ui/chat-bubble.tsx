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

export default function ChatBubble() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [showContactInput, setShowContactInput] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  // Input fields
  const [input, setInput] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [threadId, setThreadId] = useState<number | null>(null);

  const handleSaveInitialInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    localStorage.setItem('rb_chat_user_name', name.trim());
    localStorage.setItem('rb_chat_user_email', email.trim());
    setIsRegistered(true);

    setMessages((prev) => [
      ...prev,
      {
        id: `sys_${Date.now()}`,
        sender: 'ai',
        senderName: "Friday (Rowell's AI Assistant)",
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
      senderName: "Friday (Rowell's AI Assistant)",
      text: "👋 Hi! I'm Friday, Rowell's AI Assistant. Ask me anything about Rowell's portfolio, UK client projects, tech stack, or booking a call!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // End Chat & Reset Session (Saves History to DB & Emails Admin)
  const handleEndChat = async () => {
    if (messages.length > 1 && name.trim() && email.trim()) {
      const transcriptText = messages
        .map((m) => `[${m.time || 'HH:MM'}] ${m.senderName}: ${m.text}`)
        .join('\n\n');

      try {
        await fetch('/api/chat/end', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            name: name.trim(),
            email: email.trim(),
            transcript: transcriptText,
          }),
        });
      } catch (e) {
        console.warn('[handleEndChat] Failed to log session transcript:', e);
      }
    }

    const newSid = 'session_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    localStorage.setItem('rb_chat_session_id', newSid);
    localStorage.removeItem('rb_chat_user_name');
    localStorage.removeItem('rb_chat_user_email');
    setSessionId(newSid);
    setThreadId(null);
    setName('');
    setEmail('');
    setIsRegistered(false);
    setShowContactInput(false);
    setInput('');
    setMessages([
      {
        id: `sys_${Date.now()}`,
        sender: 'ai',
        senderName: "Friday (Rowell's AI Assistant)",
        text: "👋 Hi! I'm Friday, Rowell's AI Assistant. Ask me anything about Rowell's portfolio, UK client projects, tech stack, or booking a call!",
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
    if (savedName && savedEmail) {
      setName(savedName);
      setEmail(savedEmail);
      setIsRegistered(true);
    }
  }, []);

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

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

      // 2. If user mentions hiring/proposal/contact, prompt contact capture
      const queryLower = query.toLowerCase();
      if (
        queryLower.includes('hire') ||
        queryLower.includes('quote') ||
        queryLower.includes('project') ||
        queryLower.includes('call') ||
        queryLower.includes('contact')
      ) {
        setShowContactInput(true);
      }

      // 3. Log query silently to CRM
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

  // Submit Contact Form to notify Rowell
  const handleSaveContactDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    localStorage.setItem('rb_chat_user_name', name);
    localStorage.setItem('rb_chat_user_email', email);
    setShowContactInput(false);

    const lastUserMsg = [...messages].reverse().find((m) => m.sender === 'user')?.text || 'Inquiry from hybrid chat';

    try {
      await fetch('/api/chat/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          name,
          email,
          subject: 'Hybrid Live Chat Contact Request',
          message: lastUserMsg,
        }),
      });

      setMessages((prev) => [
        ...prev,
        {
          id: `sys_${Date.now()}`,
          sender: 'ai',
          senderName: 'Gemini AI Assistant',
          text: `✅ Thanks ${name}! I've notified Rowell directly. He'll receive your inquiry at ${email} and can reply right here in this chat thread!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (e) {
      alert('Failed to send contact info');
    }
  };

  if (!mounted) return null;

  return (
    <>
      {/* Floating Single Hybrid Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#0b1a30] via-slate-900 to-[#1d63ed] text-white shadow-2xl border border-amber-400/40 hover:border-amber-400 cursor-pointer group"
          title="Chat with Gemini AI & Rowell"
        >
          <div className="relative flex items-center gap-1 text-amber-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <span className="text-xs font-black tracking-wide hidden sm:inline">Ask Friday!</span>
          {!isOpen && (
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping absolute -top-1 -right-1" />
          )}
        </motion.button>
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
                    Friday • Rowell's AI Desk
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                      Online
                    </span>
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium">Friday AI + Direct Human Support</p>
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
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                  title="Close Chat Drawer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Compulsory Upfront Registration Gate */}
            {!isRegistered ? (
              <div className="flex-1 flex flex-col justify-center p-6 space-y-5 text-center">
                <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 border border-amber-400/40 flex items-center justify-center text-slate-950 mx-auto shadow-lg">
                  <Sparkles className="w-7 h-7 animate-pulse" />
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-base font-black text-white">Welcome, I&apos;m FRIDAY — Rowell&apos;s AI Assistant</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Please enter your name and email to start chatting with Friday & connect with Rowell:
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

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 mt-2"
                  >
                    <span>🚀 Start Chatting with Friday</span>
                  </button>
                </form>
              </div>
            ) : (
              <>
                {/* Single Merged Conversation Stream */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
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
                  <div ref={messagesEndRef} />
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
