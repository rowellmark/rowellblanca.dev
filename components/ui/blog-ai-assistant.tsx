'use client';

import React, { useState } from 'react';
import { Sparkles, Send, Loader2, Bot, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
}: BlogAiAssistantProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string }>>([
    {
      sender: 'bot',
      text: `👋 Hi! I'm Friday, Rowell's AI Assistant. Ask me anything about the technical architecture, challenges, or results for "${title}"!`,
    },
  ]);

  const QUICK_PROMPTS = [
    `Summarize the key architectural breakthroughs for ${title}`,
    `What technologies were used in this build?`,
    `What challenges were solved during development?`,
    `How can Rowell build a similar solution for my company?`,
  ];

  const handleSend = async (queryText?: string) => {
    const prompt = queryText || input;
    if (!prompt.trim() || loading) return;

    const userMessage = { sender: 'user' as const, text: prompt.trim() };
    setMessages((prev) => [...prev, userMessage]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const articleContext = `Article Title: ${title}
Category: ${category || 'Case Study / Technical Blog'}
Technologies: ${technologies.join(', ')}
Summary: ${description || ''}
Challenge: ${challenge || ''}
Solution: ${solution || ''}
Results: ${results || ''}
Full Content: ${content?.replace(/<[^>]*>?/gm, '').slice(0, 1500) || ''}`;

      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `You are Rowell's AI Blog & Case Study Assistant on rowellblanca.dev. Context:\n${articleContext}`,
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
        text: data.reply || `Great question about ${title}! Rowell built this system focusing on enterprise scalability, performance, and clean code.`,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `This project showcases Rowell's expertise in ${technologies.slice(0, 3).join(', ')}. Feel free to book a call to discuss building a similar platform!`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-[#0b172a] to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden font-sans text-slate-100 my-12">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              Gemini AI Article Assistant
              <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                Interactive
              </span>
            </h3>
            <p className="text-xs text-slate-400">Ask any question about {title}'s architecture & tech stack</p>
          </div>
        </div>

        <button
          onClick={() => setIsContactOpen(true)}
          className="text-xs font-black uppercase tracking-wider text-slate-950 bg-brand-amber hover:bg-amber-400 px-4 py-2 rounded-xl hidden sm:flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
        >
          <span>Build Similar App</span>
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
              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-black ${
                m.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}
            >
              {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
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
            <span>Analyzing article details...</span>
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
                className="text-[11px] font-bold bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 hover:border-amber-500/50 rounded-full px-3 py-1.5 transition-all text-left truncate max-w-full"
              >
                💡 {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Box */}
      <div className="flex items-center gap-2 pt-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Ask Gemini AI anything about ${title}...`}
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
