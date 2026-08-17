'use client';

import React, { useState } from 'react';
import { Sparkles, Send, Loader2, Bot, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ContactModal } from '@/components/ui/contact-modal';

interface LandingPageAiAssistantProps {
  pageTitle: string;
  targetKeyword?: string;
  badgeText?: string;
}

export function LandingPageAiAssistant({ pageTitle, targetKeyword, badgeText }: LandingPageAiAssistantProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string }>>([
    {
      sender: 'bot',
      text: `👋 Hi! I'm RowBot, Rowell's AI Engineering & Strategic Marketing Co-Pilot. Have questions about hiring Rowell for ${targetKeyword || pageTitle}? Ask me about technical architecture, performance CRO, or custom estimates!`,
    },
  ]);

  const topic = targetKeyword || pageTitle;

  const QUICK_PROMPTS = [
    `Why hire Rowell for ${topic}?`,
    `What are the senior dev rates & UK/US timezone overlap?`,
    `How do sub-second Web Vitals boost conversions?`,
    `How do I book a discovery call or request a proposal?`,
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
          messages: [
            {
              role: 'system',
              content: `You are Rowell's AI Engineering & Strategic Marketing Co-Pilot on rowellblanca.dev. The user is visiting the landing page: "${pageTitle}" focusing on ${topic}.`,
            },
            ...messages.map((m) => ({
              role: m.sender === 'user' ? 'user' : 'assistant',
              content: m.text,
            })),
            { role: 'user', content: prompt.trim() },
          ],
        }),
      });

      const data = await res.json();
      const botMessage = {
        sender: 'bot' as const,
        text:
          data.reply ||
          `Rowell is a Senior Full-Stack Engineer & Strategic Marketing Architect specializing in ${topic}. Based in the Philippines (PST, GMT+8), he offers seamless overlap with UK (GMT/BST), US, and Australian business hours at direct senior developer rates.`,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `Rowell is open for direct engagements, custom web builds, and developer retainers. Feel free to click "Book Discovery Call" below!`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-[#0b172a] to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6 shadow-2xl relative overflow-hidden font-sans text-slate-100 my-12 max-w-5xl mx-auto">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-white">RowBot — AI Engineering & Marketing Co-Pilot</h3>
              <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                Live
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Ask questions about hiring Rowell for <span className="text-amber-400 font-bold">{topic}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsContactOpen(true)}
          className="text-xs font-black uppercase tracking-wider text-slate-950 bg-brand-amber hover:bg-amber-400 px-5 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer shrink-0"
        >
          <span>Book Discovery Call</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Messages Thread */}
      <div className="max-h-72 overflow-y-auto space-y-3.5 text-xs pr-1">
        {messages.map((m, idx) => (
          <div
            key={idx}
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

            <div
              className={`p-4 rounded-2xl max-w-[85%] leading-relaxed ${
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
            <span>RowBot is thinking...</span>
          </div>
        )}
      </div>

      {/* Quick Prompt Chips */}
      {messages.length < 3 && (
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Suggested Questions:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="text-[11px] font-bold bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 hover:border-amber-500/50 rounded-full px-3.5 py-1.5 transition-all text-left truncate max-w-full"
              >
                💡 {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Field */}
      <div className="flex items-center gap-2 pt-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Ask RowBot about ${topic}...`}
          className="flex-1 px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-white text-xs font-medium focus:outline-none focus:border-amber-500 transition-all"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="px-5 py-3 rounded-2xl bg-[#1d63ed] hover:bg-blue-600 disabled:opacity-40 text-white font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          <span>Ask</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
}
