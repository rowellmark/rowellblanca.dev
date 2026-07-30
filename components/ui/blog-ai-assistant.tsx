'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Loader2, Bot, User, ArrowRight, Cpu, Zap, ShieldCheck } from 'lucide-react';
import { ContactModal } from '@/components/ui/contact-modal';

interface BlogAiAssistantProps {
  title: string;
  category?: string;
  technologies?: string[];
  description?: string;
  challenge?: string;
  solution?: string;
  results?: string;
  content?: string;
  className?: string;
}

export function BlogAiAssistant({
  title,
  category,
  technologies = [],
  description,
  challenge,
  solution,
  results,
  content,
  className,
}: BlogAiAssistantProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [activeEngine, setActiveEngine] = useState<string>('Backend AI');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string }>>([
    {
      sender: 'bot',
      text: `👋 Hi! I'm Friday, Rowell's AI Assistant. Ask me anything about the technical architecture, stack, or results for "${title}"!`,
    },
  ]);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, loading]);

  // Restore contact details already captured elsewhere on the site (e.g. the floating chat widget)
  useEffect(() => {
    let sid = localStorage.getItem('rb_chat_session_id');
    if (!sid) {
      sid = 'session_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
      localStorage.setItem('rb_chat_session_id', sid);
    }
    setSessionId(sid);

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

  const handleSaveInitialInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    localStorage.setItem('rb_chat_user_name', name.trim());
    localStorage.setItem('rb_chat_user_email', email.trim());
    if (phone.trim()) localStorage.setItem('rb_chat_user_phone', phone.trim());
    setIsRegistered(true);
  };

  const lastSavedMessageCount = useRef(0);

  // Refs so the unmount/beforeunload handlers (registered once) always read
  // current values instead of the stale closure from whichever render set them up.
  const latestRef = useRef({ messages, name, email, phone, sessionId, title });
  latestRef.current = { messages, name, email, phone, sessionId, title };

  // Persist the full transcript as a Lead + ContactMessage — called on unmount
  // (navigating away) and tab close; no-ops without contact info or new messages.
  const persistChatHistory = () => {
    const { messages, name, email, phone, sessionId, title } = latestRef.current;
    if (messages.length <= 1 || !name.trim() || !email.trim()) return;
    if (messages.length === lastSavedMessageCount.current) return;
    lastSavedMessageCount.current = messages.length;

    const transcriptText = messages
      .map((m) => `[${m.sender === 'user' ? 'User' : 'Friday'}] ${m.text}`)
      .join('\n\n');

    const payload = JSON.stringify({
      sessionId,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      transcript: transcriptText,
      sourceUrl: `My Work — ${title}${typeof window !== 'undefined' ? ` (${window.location.pathname})` : ''}`,
    });

    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      navigator.sendBeacon('/api/chat/end', new Blob([payload], { type: 'application/json' }));
    } else {
      fetch('/api/chat/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch((e) => console.warn('[BlogAiAssistant] Failed to log session transcript:', e));
    }
  };

  // Registered once: fires on real tab close/navigation (beforeunload) and on
  // this component actually unmounting (route change) — not on every render.
  useEffect(() => {
    window.addEventListener('beforeunload', persistChatHistory);
    return () => {
      window.removeEventListener('beforeunload', persistChatHistory);
      persistChatHistory();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const QUICK_PROMPTS = [
    `Summarize architecture for ${title}`,
    `Tech stack used?`,
    `Key challenges solved?`,
    `Build a similar solution?`,
  ];

  const handleSend = async (queryText?: string) => {
    const prompt = queryText || input;
    if (!prompt.trim() || loading) return;

    const userMessage = { sender: 'user' as const, text: prompt.trim() };
    setMessages((prev) => [...prev, userMessage]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt.trim(),
          context: {
            title,
            category,
            technologies,
            description,
            challenge,
            solution,
            results,
            content,
          },
        }),
      });

      const data = await res.json();
      if (data.success && data.reply) {
        setMessages((prev) => [...prev, { sender: 'bot', text: data.reply }]);
        if (data.provider) {
          const providerName =
            data.provider === 'gemini'
              ? `Gemini ${data.model || 'Flash'}`
              : data.provider === 'openai'
              ? `OpenAI ${data.model || 'GPT-4o'}`
              : data.provider === 'claude'
              ? `Claude ${data.model || 'Sonnet'}`
              : data.provider === 'ollama'
              ? `Local Ollama`
              : 'Backend AI';
          setActiveEngine(providerName);
        }
      } else {
        throw new Error(data.message || 'Failed to get answer');
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `This project showcases expertise in ${technologies.slice(0, 3).join(', ')}. Book a discovery call to discuss building a custom platform!`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`bg-gradient-to-br from-[#0b172a] via-slate-900 to-indigo-950 border border-slate-800/80 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl relative overflow-hidden font-sans text-slate-100 backdrop-blur-md flex flex-col justify-between ${
        className || ''
      }`}
    >
      {/* Subtle Ambient Glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3.5 relative z-10 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0 shadow-xs">
            <Sparkles className="w-4.5 h-4.5 animate-pulse text-amber-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-black text-white tracking-tight truncate">
                AI Engineering Assistant
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                <Cpu className="w-3 h-3 text-emerald-400" />
                <span>{activeEngine}</span>
              </span>
            </div>
            <p className="text-xs text-slate-300 truncate pt-0.5">
              Architecture & stack Q&A for {title}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsContactOpen(true)}
          className="text-xs font-black uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-300 px-3.5 py-1.5 rounded-lg hidden sm:flex items-center gap-1.5 transition-all shadow-sm shrink-0 cursor-pointer hover:scale-105"
        >
          <span>Build Similar</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
        </button>
      </div>

      {!isRegistered ? (
        <form
          onSubmit={handleSaveInitialInfo}
          className="h-[230px] max-h-[250px] flex flex-col justify-center gap-3 relative z-10"
        >
          <p className="text-xs text-slate-300 leading-relaxed">
            Leave your details so Rowell can follow up directly, then ask away about this project's architecture.
          </p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-amber-400 transition-all shadow-inner"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            required
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-amber-400 transition-all shadow-inner"
          />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone (optional)"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-amber-400 transition-all shadow-inner"
          />
          <button
            type="submit"
            className="w-full px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all cursor-pointer"
          >
            Start Chat
          </button>
        </form>
      ) : (
        <>
      {/* Messages Thread (Fixed Height, Scrollable Answer Container with Auto-Scroll) */}
      <div ref={messagesContainerRef} className="h-[230px] max-h-[250px] overflow-y-auto space-y-3 pr-1.5 relative z-10 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900/50">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                m.sender === 'user'
                  ? 'bg-amber-400 text-slate-950 font-black'
                  : 'bg-slate-800 text-amber-400 border border-slate-700'
              }`}
            >
              {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>
            <div
              className={`p-3.5 rounded-2xl max-w-[88%] text-xs sm:text-sm leading-relaxed font-medium ${
                m.sender === 'user'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 rounded-tr-none font-bold shadow-xs'
                  : 'bg-slate-800/90 text-slate-100 border border-slate-700/70 rounded-tl-none shadow-xs'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-slate-300 text-xs py-1.5">
            <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
            <span>Analyzing architecture...</span>
          </div>
        )}
      </div>

      {/* Bottom Section: Suggested Questions + Input + Quick Specs Footer */}
      <div className="space-y-3 shrink-0 pt-3 border-t border-slate-800/80 relative z-10">
        {/* Suggested Quick Question Chips */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            SUGGESTED QUESTIONS:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_PROMPTS.map((promptText, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(promptText)}
                disabled={loading}
                className="text-left text-xs font-semibold text-slate-200 bg-slate-800/90 hover:bg-amber-500/20 hover:text-amber-300 border border-slate-700/80 hover:border-amber-400/40 px-3 py-1.5 rounded-full transition-all cursor-pointer disabled:opacity-50"
              >
                💡 {promptText}
              </button>
            ))}
          </div>
        </div>

        {/* Input Field */}
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Ask AI about ${title}...`}
            className="w-full pl-4 pr-24 py-3 rounded-xl bg-slate-950/90 border border-slate-800 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-amber-400 transition-all shadow-inner"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="absolute right-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs transition-all disabled:opacity-40 flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bottom Feature Badges */}
        <div className="flex items-center justify-between text-xs text-slate-300 pt-1 font-mono">
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Speed Optimized</span>
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified Architecture</span>
          </span>
          <button
            onClick={() => setIsContactOpen(true)}
            className="text-amber-400 hover:underline font-bold"
          >
            Book Call →
          </button>
        </div>
      </div>
        </>
      )}

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
}
