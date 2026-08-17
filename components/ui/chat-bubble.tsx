'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles, MessageSquare, X, Send, Loader2, Bot, User, ArrowRight,
  CheckCircle2, Mail, CheckCheck, RotateCcw, Calculator, Calendar,
  FileText, Check, Phone, Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContactModal } from '@/components/ui/contact-modal';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user' | 'admin' | 'system_card';
  senderName: string;
  text: string;
  time?: string;
  cardType?: 'lead_form' | 'options';
}

const QUICK_PROMPTS = [
  '⚡ Request a Custom Project Estimate',
  'What are your React & Next.js capabilities?',
  'How do sub-second Web Vitals boost conversions?',
  'What are your senior dev rates & timezone overlap?',
];

const RANDOM_TEASERS = [
  'Have a project in mind? Get an instant estimate!',
  'Need senior Next.js & React 19 architecture?',
  'Want custom WordPress & Gutenberg block systems?',
  'Save 40–50% vs agency bloat with direct senior dev rates!',
  'Need full UK (GMT/BST) & US (EST/PST) timezone overlap?',
  'Looking for high-converting AI & RAG system integration?',
];

const PROJECT_TYPES = [
  'Next.js / React Web App',
  'Bespoke WordPress & Plugins',
  'FinTech / CRM Portal',
  'AI / LLM Integration',
  'Other Custom Project',
];

const INACTIVITY_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes idle timeout

export default function ChatBubble() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isSessionEnded, setIsSessionEnded] = useState(false);

  // User details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedProjectType, setSelectedProjectType] = useState('Next.js / React Web App');
  const [projectNotes, setProjectNotes] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Chat state
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [activeTeaserIndex, setActiveTeaserIndex] = useState(0);
  const [isBubbleDismissed, setIsBubbleDismissed] = useState(false);
  const [showLeadCard, setShowLeadCard] = useState(false);
  const [showExitNurture, setShowExitNurture] = useState(false);
  const [inlineEmail, setInlineEmail] = useState('');
  const [inlineSaved, setInlineSaved] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      senderName: 'RowBot',
      text: "👋 Hi! I'm RowBot, Rowell's AI Engineering & Strategic Marketing Co-Pilot. Ask me anything about custom Next.js apps, bespoke WordPress architecture, project pricing, or request a custom project estimate!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const lastSavedMessageCount = useRef(0);
  const lastActivityRef = useRef<number>(Date.now());

  // Reset idle inactivity timer on user actions
  const resetActivityTimer = () => {
    lastActivityRef.current = Date.now();
  };

  useEffect(() => {
    setActiveTeaserIndex(Math.floor(Math.random() * RANDOM_TEASERS.length));
    const interval = setInterval(() => {
      setActiveTeaserIndex((prev) => (prev + 1) % RANDOM_TEASERS.length);
      setIsBubbleDismissed(false);
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setMounted(true);
    lastActivityRef.current = Date.now();

    const lastActiveStr = localStorage.getItem('rb_chat_last_active');
    const now = Date.now();

    // Auto-reset expired session if user returns after closing tab / 5+ min inactivity
    let id = localStorage.getItem('rb_chat_session_id');
    if (!id || (lastActiveStr && now - parseInt(lastActiveStr, 10) > INACTIVITY_TIMEOUT_MS)) {
      id = 'session_' + Math.random().toString(36).substring(2, 11) + '_' + now;
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

  // Scroll message list to bottom
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (isOpen && container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, isOpen, loading, showLeadCard]);

  // Persist transcript to CRM API (/api/chat/end)
  const persistChatHistory = () => {
    if (messages.length <= 1 || !email.trim()) return;
    if (messages.length === lastSavedMessageCount.current) return;
    lastSavedMessageCount.current = messages.length;

    const transcriptText = messages
      .map((m) => `[${m.time || 'HH:MM'}] ${m.senderName}: ${m.text}`)
      .join('\n\n');

    const payload = JSON.stringify({
      sessionId,
      name: name.trim() || 'Anonymous Visitor',
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
      }).catch(() => {});
    }
  };

  // Browser / Tab Closure Session Ending Listener (beforeunload, pagehide, visibilitychange)
  useEffect(() => {
    const handleTabUnloadOrHide = () => {
      if (document.visibilityState === 'hidden') {
        persistChatHistory();
        localStorage.setItem('rb_chat_last_active', Date.now().toString());
      }
    };

    window.addEventListener('beforeunload', handleTabUnloadOrHide);
    window.addEventListener('pagehide', handleTabUnloadOrHide);
    document.addEventListener('visibilitychange', handleTabUnloadOrHide);

    return () => {
      window.removeEventListener('beforeunload', handleTabUnloadOrHide);
      window.removeEventListener('pagehide', handleTabUnloadOrHide);
      document.removeEventListener('visibilitychange', handleTabUnloadOrHide);
    };
  }, [messages, name, email, sessionId]);

  // Inactivity Idle Timeout Monitor (5 Minutes of user not answering)
  useEffect(() => {
    const idleCheckInterval = setInterval(() => {
      if (isSessionEnded || messages.length <= 1) return;

      const idleDuration = Date.now() - lastActivityRef.current;
      if (idleDuration >= INACTIVITY_TIMEOUT_MS) {
        // Session Auto-End triggered due to 5 mins of user inactivity
        persistChatHistory();
        setIsSessionEnded(true);

        setMessages((prev) => [
          ...prev,
          {
            id: `sys_idle_${Date.now()}`,
            sender: 'ai',
            senderName: 'RowBot',
            text: '⏱️ Session ended due to 5 minutes of inactivity. Your conversation history has been saved! Click "Reset" or type below to start a new session.',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    }, 15000); // Check every 15 seconds

    return () => clearInterval(idleCheckInterval);
  }, [messages, isSessionEnded, email, name, sessionId]);

  // Handle Lead Form Submission
  const handleLeadFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setFormSubmitting(true);
    localStorage.setItem('rb_chat_user_name', name.trim());
    localStorage.setItem('rb_chat_user_email', email.trim());
    if (phone.trim()) localStorage.setItem('rb_chat_user_phone', phone.trim());
    setIsRegistered(true);

    try {
      // 1. Submit lead to CRM API
      const res = await fetch('/api/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactName: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          serviceInterest: selectedProjectType,
          notes: projectNotes ? `[Chat Lead Intake] ${projectNotes}` : `[Chat Lead Intake] Interested in ${selectedProjectType}`,
          source: 'AI Chat Widget',
        }),
      });

      const data = await res.json();

      setFormSubmitted(true);
      setShowLeadCard(false);

      // Add confirmation to chat stream
      setMessages((prev) => [
        ...prev,
        {
          id: `sys_confirm_${Date.now()}`,
          sender: 'ai',
          senderName: "RowBot",
          text: `🎉 Thank you ${name.trim()}! Your project inquiry for "${selectedProjectType}" has been logged into Rowell's CRM. He will review your request and get back to you at ${email.trim()} within 24 hours!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      console.error('Lead submit error:', err);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleInlineEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmail = inlineEmail.trim() || email.trim();
    if (!targetEmail) return;

    setEmail(targetEmail);
    localStorage.setItem('rb_chat_user_email', targetEmail);
    setIsRegistered(true);
    setInlineSaved(true);
    if (showExitNurture) {
      setShowExitNurture(false);
      setIsOpen(false);
    }

    try {
      await fetch('/api/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactName: name || 'Chat Prospect',
          email: targetEmail,
          serviceInterest: 'Chat Quick Email',
          notes: `[Chat Quick Email Capture] Visitor provided email for follow-up.`,
          source: 'AI Chat Widget',
        }),
      });
    } catch (err) {}
  };

  const handleEmailGateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    const trimmedEmail = email.trim();
    const trimmedName = name.trim();
    localStorage.setItem('rb_chat_user_email', trimmedEmail);
    if (trimmedName) localStorage.setItem('rb_chat_user_name', trimmedName);
    setIsRegistered(true);

    try {
      fetch('/api/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactName: trimmedName || 'Chat Visitor',
          email: trimmedEmail,
          serviceInterest: 'Chat Upfront Gate',
          notes: `[Chat Welcome Email Gate] Visitor submitted email before starting conversation.`,
          source: 'AI Chat Widget',
        }),
      }).catch(() => {});
    } catch (err) {}
  };

  const handleCloseChat = () => {
    if (messages.length > 2 && !isRegistered && !formSubmitted && !showExitNurture) {
      setShowExitNurture(true);
      return;
    }
    persistChatHistory();
    setShowExitNurture(false);
    setIsOpen(false);
  };

  // Send Chat Message
  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    resetActivityTimer();

    // If session was ended due to idle timeout, auto-start a fresh session ID
    if (isSessionEnded) {
      setIsSessionEnded(false);
      const newSid = 'session_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
      localStorage.setItem('rb_chat_session_id', newSid);
      setSessionId(newSid);
      lastSavedMessageCount.current = 0;
    }

    // Check if user clicked custom estimate prompt
    if (query.includes('Request a Custom Project Estimate') || query.includes('Estimate')) {
      setShowLeadCard(true);
      setInput('');
      return;
    }

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
      // Auto-extract email if user typed one in prose (e.g. "my email is alex@firm.com")
      const emailMatch = query.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      let detectedEmail = email;
      if (emailMatch && emailMatch[0]) {
        detectedEmail = emailMatch[0];
        setEmail(detectedEmail);
        localStorage.setItem('rb_chat_user_email', detectedEmail);
      }

      const aiRes = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          messages: messages
            .filter((m) => m.sender !== 'admin')
            .map((m) => ({
              role: m.sender === 'user' ? 'user' : 'assistant',
              content: m.text,
            })),
        }),
      });

      const data = await aiRes.json();
      const aiReply = data.reply || `I'm RowBot, Rowell's AI Engineering & Strategic Marketing Co-Pilot. Rowell delivers senior Next.js 14, React 19, and custom WordPress architecture with full UK/US overlap. Would you like an estimate for your project?`;

      setMessages((prev) => [
        ...prev,
        {
          id: `ai_${Date.now()}`,
          sender: 'ai',
          senderName: 'RowBot',
          text: aiReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);

      // Log lead to CRM if email detected in query prose
      if (detectedEmail) {
        fetch('/api/crm/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contactName: name || 'Chat Prospect',
            email: detectedEmail,
            serviceInterest: 'Chat Inquiry',
            notes: `[Auto-Extracted Chat Query] ${query.trim()}`,
            source: 'AI Chat Widget',
          }),
        }).catch(() => {});
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_${Date.now()}`,
          sender: 'ai',
          senderName: 'RowBot',
          text: "Rowell is a Senior Full-Stack Engineer & Strategic Marketing Architect specializing in React 19, Next.js 14, and Custom WordPress. Click 'Request Custom Estimate' below to connect directly!",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleEndChat = () => {
    persistChatHistory();
    resetActivityTimer();
    const newSid = 'session_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    localStorage.setItem('rb_chat_session_id', newSid);
    localStorage.removeItem('rb_chat_user_name');
    localStorage.removeItem('rb_chat_user_email');
    localStorage.removeItem('rb_chat_user_phone');
    setSessionId(newSid);
    setName('');
    setEmail('');
    setPhone('');
    setIsRegistered(false);
    setIsSessionEnded(false);
    setFormSubmitted(false);
    setShowLeadCard(false);
    setInput('');
    lastSavedMessageCount.current = 0;
    setMessages([
      {
        id: `sys_${Date.now()}`,
        sender: 'ai',
        senderName: 'RowBot',
        text: "👋 Hi! I'm RowBot, Rowell's AI Engineering & Strategic Marketing Co-Pilot. Ask me anything about custom Next.js apps, bespoke WordPress architecture, project pricing, or request a custom project estimate!",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  if (!mounted) return null;

  return (
    <>
      {/* ── TRIGGER BUTTON & SPEECH BUBBLE ───────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
        <AnimatePresence>
          {!isOpen && !isBubbleDismissed && (
            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.88 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 350, damping: 24 }}
              onClick={() => { setIsOpen(true); setIsBubbleDismissed(true); }}
              className="pointer-events-auto relative max-w-[290px] sm:max-w-[320px] bg-slate-950/95 backdrop-blur-xl border border-amber-400/40 hover:border-amber-400 p-3.5 rounded-2xl shadow-2xl cursor-pointer group transition-all"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Bot className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  Quick Question
                </span>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setIsBubbleDismissed(true); }}
                  className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

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
                <span>Click to ask RowBot</span>
                <ArrowRight className="w-3 h-3" />
              </div>

              {/* Tail pointing to circle robot launcher */}
              <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-slate-950 border-r border-b border-amber-400/40 rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative pointer-events-auto">
          {!isOpen && (
            <span className="absolute -inset-1.5 rounded-full bg-amber-400/60 animate-ping pointer-events-none opacity-80" />
          )}

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => { setIsOpen(!isOpen); if (!isOpen) setIsBubbleDismissed(true); }}
            className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-[#0b1a30] via-slate-900 to-[#1d63ed] text-white shadow-2xl border-2 border-amber-400/60 hover:border-amber-400 flex items-center justify-center cursor-pointer group overflow-hidden"
            title="Open RowBot — Rowell's AI Co-Pilot"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-blue-500/20 to-amber-500/10 rounded-full animate-pulse" />
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

      {/* ── MAIN CHAT DRAWER ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[430px] h-[600px] bg-slate-950/95 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden font-sans"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-[#0b1a30] to-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-white flex items-center gap-1.5">
                    RowBot
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold border border-amber-500/30">
                      AI Co-Pilot
                    </span>
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium">Rowell Mark Blanca's AI Assistant</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {(messages.length > 2 || formSubmitted) && (
                  <button
                    type="button"
                    onClick={handleEndChat}
                    className="px-2.5 py-1 rounded-xl text-[10px] font-extrabold text-slate-300 hover:text-amber-300 bg-slate-900 border border-slate-800 hover:border-amber-500/40 flex items-center gap-1 transition-all cursor-pointer"
                    title="Reset Session"
                  >
                    <RotateCcw className="w-3 h-3 text-amber-400" />
                    <span>Reset</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleCloseChat}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* If user has not provided email yet, show upfront Email Gate Screen */}
            {!isRegistered ? (
              <div className="flex-1 p-6 flex flex-col justify-center items-center text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Bot className="w-8 h-8 animate-bounce text-amber-400" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-black text-white">Welcome to RowBot!</h3>
                  <p className="text-xs text-slate-300 font-medium max-w-xs leading-relaxed">
                    Rowell Mark Blanca&apos;s AI Co-Pilot. Enter your email to start chatting and get instant technical advice, stack insights, and project estimates.
                  </p>
                </div>

                <form onSubmit={handleEmailGateSubmit} className="w-full max-w-xs space-y-3 pt-2">
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name (Optional)"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500 transition-all"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      required
                      placeholder="Your Email Address *"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Start Chatting with RowBot</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ) : (
              <>
                {/* Conversation Stream */}
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
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                      </div>

                      <div className="max-w-[85%] space-y-0.5">
                        <div
                          className={`p-3.5 rounded-2xl leading-relaxed ${
                            m.sender === 'user'
                              ? 'bg-[#1d63ed] text-white font-medium rounded-tr-none'
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

                  {/* ── INLINE INTERACTIVE LEAD INTAKE CARD ───────────────────── */}
                  {showLeadCard && !formSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="bg-gradient-to-b from-slate-900 to-[#0b1a30] border border-amber-500/40 rounded-2xl p-4 space-y-3 shadow-xl"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            <Calculator className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-white">Request Project Estimate</h4>
                            <p className="text-[10px] text-slate-400">Direct response within 24 hours</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowLeadCard(false)}
                          className="text-slate-500 hover:text-white text-xs p-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <form onSubmit={handleLeadFormSubmit} className="space-y-2.5">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                            Project Type
                          </label>
                          <select
                            value={selectedProjectType}
                            onChange={(e) => setSelectedProjectType(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-amber-500"
                          >
                            {PROJECT_TYPES.map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <input
                              type="text"
                              required
                              placeholder="Your Name *"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                            />
                          </div>
                          <div>
                            <input
                              type="email"
                              required
                              placeholder="Your Email *"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                            />
                          </div>
                        </div>

                        <div>
                          <input
                            type="text"
                            placeholder="Project Details / Budget (Optional)"
                            value={projectNotes}
                            onChange={(e) => setProjectNotes(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={formSubmitting}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          {formSubmitting ? (
                            <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5" />
                              <span>Submit Request to Rowell</span>
                            </>
                          )}
                        </button>
                      </form>
                    </motion.div>
                  )}

                  {loading && (
                    <div className="flex items-center gap-2 text-slate-400 text-xs italic pl-8">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                      <span>RowBot is thinking...</span>
                    </div>
                  )}
                </div>

                {/* Action Chips */}
                <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                  {!showLeadCard && !formSubmitted && (
                    <button
                      onClick={() => setShowLeadCard(true)}
                      className="text-[10px] font-black bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-full px-3 py-1.5 flex items-center gap-1 transition-all"
                    >
                      <Calculator className="w-3 h-3 text-amber-400" />
                      <span>Request Custom Estimate</span>
                    </button>
                  )}
                  {QUICK_PROMPTS.filter(p => !p.includes('Estimate')).map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(prompt)}
                      className="text-[10px] font-bold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-full px-3 py-1 transition-all text-left truncate max-w-[200px]"
                    >
                      💡 {prompt}
                    </button>
                  ))}
                </div>

                {/* Bottom Bar — Book Call CTA */}
                <div className="px-4 py-2.5 bg-amber-500/10 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> UK / US Timezone Overlap
                  </span>
                  <button
                    onClick={() => setIsContactOpen(true)}
                    className="text-[10px] font-black uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-300 px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                  >
                    <Calendar className="w-3 h-3" />
                    <span>Book Call</span>
                  </button>
                </div>

                {/* Input Box */}
                <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask RowBot or type a message..."
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
