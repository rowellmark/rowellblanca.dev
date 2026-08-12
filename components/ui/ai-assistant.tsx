'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, MessageSquare, X, Send, Loader2, Bot, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContactModal } from '@/components/ui/contact-modal';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
}

const QUICK_PROMPTS = [
  'What are your React & Next.js capabilities?',
  'Tell me about your UK client work (Macmanus / Towerfire)',
  'What are your engagement rates & working hours?',
  'How do I book a discovery call?',
];

export function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: "👋 Hi! I'm RowBot, Rowell's Gemini AI Assistant. How can I help with your web development or software engineering project today?",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const sendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
        }),
      });

      const data = await res.json();
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: data.reply || "I'm available to answer any questions about Rowell's portfolio and technical background!",
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: "Rowell is a Senior Full-Stack Engineer specializing in React, Next.js, and Custom WordPress. Feel free to use the Book Discovery Call button to connect directly!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#0b1a30] via-slate-900 to-[#1d63ed] text-white shadow-2xl border border-amber-400/30 hover:border-amber-400 cursor-pointer group"
          title="Chat with Gemini AI Assistant"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
          </div>
          <span className="text-xs font-black tracking-wide hidden sm:inline">Ask Gemini AI</span>
          {!isOpen && (
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping absolute -top-1 -right-1" />
          )}
        </motion.button>
      </div>

      {/* Chat Drawer Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] h-[520px] bg-slate-950/95 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden font-sans"
          >
            {/* Drawer Header */}
            <div className="p-4 bg-gradient-to-r from-[#0b1a30] to-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-white flex items-center gap-1.5">
                    Gemini AI Assistant
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                      Online
                    </span>
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium">Rowell Mark Blanca Portfolio Expert</p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-black ${
                      m.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div
                    className={`p-3 rounded-2xl max-w-[82%] leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-[#1d63ed] text-white font-medium rounded-tr-none'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-slate-400 text-xs italic pl-8">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  <span>Gemini is thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            {messages.length < 3 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {QUICK_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(prompt)}
                    className="text-[10px] font-bold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-full px-3 py-1 transition-all text-left truncate max-w-full"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Book Call CTA Bar */}
            <div className="px-4 py-2 bg-amber-500/10 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> GMT/BST Overlap Available
              </span>
              <button
                onClick={() => setIsContactOpen(true)}
                className="text-[10px] font-black uppercase tracking-wider text-slate-950 bg-brand-amber hover:bg-amber-400 px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition-all cursor-pointer"
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
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask Gemini AI anything..."
                className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-amber-500 transition-all"
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                className="p-2.5 rounded-xl bg-[#1d63ed] hover:bg-blue-600 disabled:opacity-40 text-white transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Direct Contact Modal */}
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  );
}
