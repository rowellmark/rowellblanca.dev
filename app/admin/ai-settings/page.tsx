'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  Key,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Send,
  Loader2,
  Cpu,
  Zap,
  Globe,
  Radio,
  Server,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface AISettings {
  activeProvider: 'gemini' | 'openai' | 'claude' | 'ollama' | 'groq';
  geminiApiKey: string;
  geminiHasKey: boolean;
  geminiModel: string;
  openaiApiKey: string;
  openaiHasKey: boolean;
  openaiModel: string;
  claudeApiKey: string;
  claudeHasKey: boolean;
  claudeModel: string;
  ollamaUrl: string;
  ollamaModel: string;
  groqApiKey: string;
  groqHasKey: boolean;
  groqModel: string;
  noAiMode: boolean;
}

interface OllamaStatus {
  online: boolean;
  models: string[];
  message: string;
}

export default function AISettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testPrompt, setTestPrompt] = useState('Introduce yourself briefly as Rowell Blanca\'s AI Assistant.');
  const [testResult, setTestResult] = useState<{ text: string; provider?: string; model?: string } | null>(null);

  const [settings, setSettings] = useState<AISettings>({
    activeProvider: 'gemini',
    geminiApiKey: '',
    geminiHasKey: false,
    geminiModel: 'gemini-2.5-flash',
    openaiApiKey: '',
    openaiHasKey: false,
    openaiModel: 'gpt-4o-mini',
    claudeApiKey: '',
    claudeHasKey: false,
    claudeModel: 'claude-3-5-sonnet-20241022',
    ollamaUrl: 'http://localhost:11434',
    ollamaModel: 'llama3',
    groqApiKey: '',
    groqHasKey: false,
    groqModel: 'llama-3.3-70b-versatile',
    noAiMode: false,
  });

  const [ollamaStatus, setOllamaStatus] = useState<OllamaStatus>({
    online: false,
    models: [],
    message: 'Checking Ollama status...',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/ai-settings');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setSettings(data.settings);
          if (data.ollamaStatus) setOllamaStatus(data.ollamaStatus);
        }
      }
    } catch (e) {
      console.error('Failed to load AI settings:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/ai-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        alert('AI Provider settings saved successfully!');
        fetchSettings();
      } else {
        alert(data.message || 'Failed to save settings');
      }
    } catch (e) {
      alert('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleTestPrompt = async () => {
    if (!testPrompt.trim() || testing) return;
    setTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/admin/ai-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: testPrompt.trim(), provider: settings.activeProvider }),
      });
      const data = await res.json();
      if (data.success && data.result) {
        setTestResult(data.result);
      } else {
        setTestResult({ text: data.message || 'Error executing AI request', provider: 'error', model: 'none' });
      }
    } catch (e) {
      setTestResult({ text: 'Network error communicating with AI endpoint', provider: 'error', model: 'none' });
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-zinc-500 font-bold text-xs gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
        <span>Loading AI Provider Configurations...</span>
      </div>
    );
  }

  const providers = [
    {
      id: 'gemini',
      name: 'Google Gemini',
      tagline: 'Recommended default · High speed & low latency',
      badge: settings.geminiHasKey ? 'Key Configured' : 'Missing Key',
      badgeColor: settings.geminiHasKey ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      id: 'openai',
      name: 'OpenAI GPT',
      tagline: 'GPT-4o & GPT-4o-mini models',
      badge: settings.openaiHasKey ? 'Key Configured' : 'Missing Key',
      badgeColor: settings.openaiHasKey ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-zinc-100 text-zinc-600 border-zinc-200',
    },
    {
      id: 'claude',
      name: 'Anthropic Claude',
      tagline: 'Claude 3.5 Sonnet & Haiku models',
      badge: settings.claudeHasKey ? 'Key Configured' : 'Missing Key',
      badgeColor: settings.claudeHasKey ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-zinc-100 text-zinc-600 border-zinc-200',
    },
    {
      id: 'ollama',
      name: 'Ollama (Local / Self-Hosted)',
      tagline: 'Privacy-first, zero cloud data transfer',
      badge: ollamaStatus.online ? 'Online (Local)' : 'Offline',
      badgeColor: ollamaStatus.online ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200',
    },
    {
      id: 'groq',
      name: 'Groq',
      tagline: 'Free tier · Llama/Mixtral models, works in production',
      badge: settings.groqHasKey ? 'Key Configured' : 'Missing Key',
      badgeColor: settings.groqHasKey ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-zinc-100 text-zinc-600 border-zinc-200',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-brand-amber animate-pulse" />
            AI Provider & API Settings
          </h1>
          <p className="text-xs text-zinc-500 font-medium mt-1">
            Configure, manage API keys, and auto-detect AI models (Gemini, OpenAI GPT, Anthropic Claude, and Local Ollama).
          </p>
        </div>

        <button
          onClick={fetchSettings}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs border border-zinc-200 transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Status
        </button>
      </div>

      {/* 0. No AI Mode Toggle */}
      <div
        className={`p-5 rounded-xl border flex items-center justify-between gap-4 transition-all ${
          settings.noAiMode
            ? 'bg-amber-50 border-amber-300'
            : 'bg-white border-zinc-200'
        }`}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-semibold text-sm text-zinc-950">
            <ShieldCheck className="w-4 h-4 text-amber-600" /> No AI Mode (Content-Only)
          </div>
          <p className="text-[11px] text-zinc-500 font-medium leading-relaxed max-w-xl">
            Skip all external AI providers entirely. The chat widget answers only from Rowell's actual site content
            (projects, tech stack, availability, contact info) with zero external API calls.
          </p>
        </div>

        <button
          type="button"
          onClick={async () => {
            const next = { ...settings, noAiMode: !settings.noAiMode };
            setSettings(next);
            setSaving(true);
            try {
              await fetch('/api/admin/ai-settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(next),
              });
            } finally {
              setSaving(false);
            }
          }}
          className={`shrink-0 w-14 h-8 rounded-full relative transition-all cursor-pointer ${
            settings.noAiMode ? 'bg-amber-500' : 'bg-zinc-300'
          }`}
        >
          <span
            className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all ${
              settings.noAiMode ? 'left-7' : 'left-1'
            }`}
          />
        </button>
      </div>

      {/* 1. Active Provider Selector Cards */}
      <div className={`space-y-4 ${settings.noAiMode ? 'opacity-40 pointer-events-none' : ''}`}>
        <h2 className="text-sm font-semibold text-zinc-950 uppercase tracking-wider flex items-center gap-2">
          <Cpu className="w-4 h-4 text-indigo-600" />
          1. Select Active AI Provider
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {providers.map((p) => {
            const isSelected = settings.activeProvider === p.id;
            return (
              <div
                key={p.id}
                onClick={() => setSettings((prev) => ({ ...prev, activeProvider: p.id as any }))}
                className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                  isSelected
                    ? 'bg-gradient-to-b from-indigo-50/90 to-zinc-50 border-zinc-900 shadow-md ring-2 ring-zinc-900/30'
                    : 'bg-white border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-950 text-sm">{p.name}</span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${p.badgeColor}`}>
                      {p.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">{p.tagline}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
                  <span className="text-[11px] font-bold text-zinc-600">
                    {isSelected ? '✓ Active Provider' : 'Click to select'}
                  </span>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Provider API Credentials & Config Form */}
      <form onSubmit={handleSave} className={`space-y-6 ${settings.noAiMode ? 'opacity-40 pointer-events-none' : ''}`}>
        <h2 className="text-sm font-semibold text-zinc-950 uppercase tracking-wider flex items-center gap-2">
          <Key className="w-4 h-4 text-amber-500" />
          2. Provider API Keys & Model Parameters
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* GEMINI SETTINGS */}
          <div className="bg-white rounded-xl p-6 border border-zinc-200 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 font-semibold text-sm text-zinc-950">
              <Sparkles className="w-4 h-4 text-amber-500" /> Google Gemini Configuration
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Gemini API Key (GEMINI_API_KEY)
              </label>
              <input
                type="password"
                value={settings.geminiApiKey}
                onChange={(e) => setSettings({ ...settings, geminiApiKey: e.target.value })}
                placeholder="AIzaSy..."
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-300 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Gemini Model</label>
              <select
                value={settings.geminiModel}
                onChange={(e) => setSettings({ ...settings, geminiModel: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-300 text-xs font-bold text-zinc-800"
              >
                <option value="gemini-2.5-flash">gemini-2.5-flash (Fast & Intelligent)</option>
                <option value="gemini-1.5-flash">gemini-1.5-flash (Standard)</option>
                <option value="gemini-2.0-flash">gemini-2.0-flash (Experimental)</option>
              </select>
            </div>
          </div>

          {/* OPENAI SETTINGS */}
          <div className="bg-white rounded-xl p-6 border border-zinc-200 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 font-semibold text-sm text-zinc-950">
              <Bot className="w-4 h-4 text-emerald-600" /> OpenAI GPT Configuration
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                OpenAI API Key (OPENAI_API_KEY)
              </label>
              <input
                type="password"
                value={settings.openaiApiKey}
                onChange={(e) => setSettings({ ...settings, openaiApiKey: e.target.value })}
                placeholder="sk-proj-..."
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-300 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">OpenAI Model</label>
              <select
                value={settings.openaiModel}
                onChange={(e) => setSettings({ ...settings, openaiModel: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-300 text-xs font-bold text-zinc-800"
              >
                <option value="gpt-4o-mini">gpt-4o-mini (Fast & Cost-Efficient)</option>
                <option value="gpt-4o">gpt-4o (High Performance)</option>
                <option value="gpt-3.5-turbo">gpt-3.5-turbo (Legacy)</option>
              </select>
            </div>
          </div>

          {/* CLAUDE SETTINGS */}
          <div className="bg-white rounded-xl p-6 border border-zinc-200 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 font-semibold text-sm text-zinc-950">
              <Zap className="w-4 h-4 text-orange-500" /> Anthropic Claude Configuration
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Claude API Key (ANTHROPIC_API_KEY)
              </label>
              <input
                type="password"
                value={settings.claudeApiKey}
                onChange={(e) => setSettings({ ...settings, claudeApiKey: e.target.value })}
                placeholder="sk-ant-api03-..."
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-300 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Claude Model</label>
              <select
                value={settings.claudeModel}
                onChange={(e) => setSettings({ ...settings, claudeModel: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-300 text-xs font-bold text-zinc-800"
              >
                <option value="claude-3-5-sonnet-20241022">claude-3-5-sonnet (High Intelligence)</option>
                <option value="claude-3-haiku-20240307">claude-3-haiku (Lightweight & Fast)</option>
              </select>
            </div>
          </div>

          {/* OLLAMA LOCAL SETTINGS */}
          <div className="bg-white rounded-xl p-6 border border-zinc-200 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold text-sm text-zinc-950">
                <Server className="w-4 h-4 text-indigo-600" /> Ollama Local / Self-Hosted
              </div>

              <span
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                  ollamaStatus.online
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
              >
                {ollamaStatus.online ? '● Ollama Connected' : '○ Offline'}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Ollama Host URL</label>
              <input
                type="text"
                value={settings.ollamaUrl}
                onChange={(e) => setSettings({ ...settings, ollamaUrl: e.target.value })}
                placeholder="http://localhost:11434"
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-300 text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Target Model Name</label>
              <input
                type="text"
                value={settings.ollamaModel}
                onChange={(e) => setSettings({ ...settings, ollamaModel: e.target.value })}
                placeholder="e.g. llama3, mistral, qwen2.5"
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-300 text-xs font-bold"
              />
            </div>

            <p className="text-[11px] text-zinc-500">{ollamaStatus.message}</p>
          </div>

          {/* GROQ SETTINGS */}
          <div className="bg-white rounded-xl p-6 border border-zinc-200 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 font-semibold text-sm text-zinc-950">
              <Radio className="w-4 h-4 text-purple-600" /> Groq Configuration
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Groq API Key (GROQ_API_KEY)
              </label>
              <input
                type="password"
                value={settings.groqApiKey}
                onChange={(e) => setSettings({ ...settings, groqApiKey: e.target.value })}
                placeholder="gsk_..."
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-300 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Groq Model</label>
              <div className="flex gap-2">
                <select
                  value={['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'qwen/qwen3.6-27b', 'deepseek-r1-distill-llama-70b', 'qwen-2.5-32b', 'mixtral-8x7b-32768', 'gemma2-9b-it'].includes(settings.groqModel) ? settings.groqModel : 'custom'}
                  onChange={(e) => {
                    if (e.target.value !== 'custom') {
                      setSettings({ ...settings, groqModel: e.target.value });
                    }
                  }}
                  className="px-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-300 text-xs font-bold text-zinc-800"
                >
                  <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile (Recommended)</option>
                  <option value="llama-3.1-8b-instant">llama-3.1-8b-instant (Fastest ~800 tok/s)</option>
                  <option value="qwen/qwen3.6-27b">qwen/qwen3.6-27b (Preview — 500 T/s)</option>
                  <option value="deepseek-r1-distill-llama-70b">deepseek-r1-distill-llama-70b</option>
                  <option value="qwen-2.5-32b">qwen-2.5-32b (Qwen 2.5)</option>
                  <option value="mixtral-8x7b-32768">mixtral-8x7b-32768</option>
                  <option value="gemma2-9b-it">gemma2-9b-it</option>
                  <option value="custom">Custom Model ID...</option>
                </select>
                <input
                  type="text"
                  value={settings.groqModel}
                  onChange={(e) => setSettings({ ...settings, groqModel: e.target.value })}
                  placeholder="e.g. llama-3.3-70b-versatile"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-300 text-xs font-mono font-bold"
                />
              </div>
            </div>

            <p className="text-[11px] text-zinc-500">Free tier, no credit card required. Get a key at console.groq.com. Valid models: llama-3.3-70b-versatile, llama-3.1-8b-instant, qwen-2.5-32b.</p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {saving ? 'Saving Settings...' : 'Save AI Settings'}
          </button>
        </div>
      </form>

      {/* 3. Interactive AI Playground Sandbox */}
      <div className="bg-zinc-900 rounded-xl p-6 sm:p-8 text-white space-y-6 shadow-md border border-zinc-800">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> Interactive AI Playground
            </h2>
            <p className="text-xs text-zinc-400 font-medium mt-0.5">
              Test execution using the currently selected provider (<span className="text-amber-400 font-semibold uppercase">{settings.activeProvider}</span>).
            </p>
          </div>

          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-amber-300">
            Provider: {settings.activeProvider}
          </span>
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-bold text-zinc-300">Test Prompt</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={testPrompt}
              onChange={(e) => setTestPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTestPrompt()}
              placeholder="Type a test prompt for the active AI model..."
              className="flex-1 px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={handleTestPrompt}
              disabled={testing || !testPrompt.trim()}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-xs transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>{testing ? 'Testing...' : 'Run Test'}</span>
            </button>
          </div>
        </div>

        {testResult && (
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 border-b border-zinc-800 pb-2">
              <span>Output Response</span>
              <span className="text-amber-400">
                Provider: {testResult.provider} ({testResult.model})
              </span>
            </div>
            <p className="text-xs text-zinc-200 font-mono leading-relaxed whitespace-pre-wrap pt-1">
              {testResult.text}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
