'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  Send,
  Sparkles,
  CheckCircle2,
  Clock,
  Mail,
  Calendar,
  Video,
  ShieldCheck,
  Zap,
  Globe,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandFacebook,
  IconBrandInstagram,
} from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
  initialTab?: 'inquiry' | 'call';
}

export function ContactModal({
  isOpen,
  onClose,
  defaultService = '',
  initialTab = 'inquiry',
}: ContactModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'inquiry' | 'call'>(initialTab);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: defaultService || 'React / Next.js Web App',
    preferredTimezone: 'AU (AEST/AEDT/AWST)',
    timeline: '2–4 Weeks (Fast Sprint)',
    message: '',
  });
  const [formLoadedAt, setFormLoadedAt] = useState<number>(Date.now());
  const [honeypot, setHoneypot] = useState({ website: '', hp_field: '' });
  const [gdprConsent, setGdprConsent] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFormLoadedAt(Date.now());
      setHoneypot({ website: '', hp_field: '' });
      setError('');
      if (defaultService) {
        setForm((prev) => ({ ...prev, service: defaultService }));
      }
      if (initialTab) {
        setActiveTab(initialTab);
      }
    }
  }, [isOpen, defaultService, initialTab]);

  const socialMedia = [
    { title: 'LinkedIn', icon: IconBrandLinkedin, url: 'https://www.linkedin.com/in/rowell-blanca/' },
    { title: 'GitHub', icon: IconBrandGithub, url: 'https://github.com/rowellmark' },
    { title: 'Instagram', icon: IconBrandInstagram, url: 'https://www.instagram.com/its.mr.row/' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Please fill in your name, email, and project message.');
      setSubmitting(false);
      return;
    }

    if (!gdprConsent) {
      setError('Please accept the privacy policy consent to proceed.');
      setSubmitting(false);
      return;
    }

    const currentPath = typeof window !== 'undefined'
      ? `${window.location.pathname}${window.location.search || ''}`
      : '/';
    const sourceUrl = `Contact Modal [${activeTab === 'call' ? '15-Min Discovery Call' : 'Fast Inquiry'}] (${currentPath})`;

    const messagePayload = activeTab === 'call'
      ? `[15-MIN DISCOVERY CALL REQUEST]\n• Preferred Timezone: ${form.preferredTimezone}\n• Desired Timeline: ${form.timeline}\n• Discussion Goals:\n${form.message}`
      : `[PROJECT INQUIRY]\n• Desired Timeline: ${form.timeline}\n• Requirements:\n${form.message}`;

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          company: form.company.trim() || undefined,
          service: activeTab === 'call' ? `Discovery Call (${form.service})` : form.service,
          subject: activeTab === 'call' ? `Discovery Call Request: ${form.name}` : `Inquiry: ${form.service}`,
          message: messagePayload,
          sourceUrl,
          website: honeypot.website,
          hp_field: honeypot.hp_field,
          formLoadedAt,
          gdprConsent: true,
        }),
      });

      const data = await res.json().catch(() => null);
      if (res.ok || data?.success) {
        setSuccess(true);
        router.push('/thank-you');
      } else {
        setError(data?.error || 'Failed to submit message.');
      }
    } catch (e) {
      setError('Error sending message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setSuccess(false);
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md font-sans">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="bg-white border border-slate-200/90 rounded-3xl max-w-4xl w-full shadow-2xl relative my-auto overflow-hidden text-slate-900"
          >
            {/* Modal Body */}

            {success ? (
              <div className="text-center p-8 sm:p-12 space-y-4 relative">
                <button
                  onClick={resetAndClose}
                  className="absolute top-4 right-4 h-9 w-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-950 transition-colors cursor-pointer shadow-2xs border border-slate-200"
                  title="Close modal"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-black text-[#0b1a30]">Request Received!</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed font-medium">
                  Thank you for reaching out. I've received your inquiry and will review your scope to reply within 2–4 hours.
                </p>
                <div className="pt-4">
                  <button
                    onClick={resetAndClose}
                    className="px-8 py-3 rounded-xl bg-[#0b1a30] hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider shadow-md cursor-pointer transition-all"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* LEFT COLUMN: Contact Details & Senior Guarantees (5 Cols) */}
                <div className="lg:col-span-5 bg-gradient-to-br from-[#0b1a30] via-slate-900 to-[#0b1a30] text-white p-6 sm:p-8 space-y-6 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="space-y-4 relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-500/20 border border-amber-400/30 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span>Direct Senior Developer</span>
                    </span>

                    <h3 className="text-2xl font-black text-white leading-tight">
                      Let's Build Your Next Digital Platform
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      Partner directly with Rowell Mark Blanca for bespoke React, Next.js, and WordPress systems.
                    </p>

                    {/* Quick Direct Channels */}
                    <div className="space-y-2.5 pt-2">
                      <a
                        href="mailto:rowellblanca94@gmail.com"
                        className="p-3 rounded-xl bg-slate-950/60 hover:bg-amber-500/10 border border-slate-800 hover:border-amber-400/40 transition-all flex items-center gap-2.5 group"
                      >
                        <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                        <div className="overflow-hidden">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Direct Email</span>
                          <span className="text-xs font-black text-white group-hover:text-amber-300 transition-colors truncate block">
                            rowellblanca94@gmail.com
                          </span>
                        </div>
                      </a>

                      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2.5">
                        <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Timezone Overlap</span>
                          <span className="text-xs font-black text-white">AU (AEST) · UK (GMT) · US (EST)</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2.5">
                        <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Direct Turnaround</span>
                          <span className="text-xs font-black text-white">Fast reply within 2–4 business hours</span>
                        </div>
                      </div>
                    </div>

                    {/* Senior Guarantees */}
                    <ul className="space-y-2 text-xs text-slate-300 border-t border-slate-800 pt-3 font-medium">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>12+ Yrs Exp · Zero Junior Delegation</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>98+ Core Web Vitals Speed Guarantee</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Strict NDA & Code IP Ownership</span>
                      </li>
                    </ul>
                  </div>

                  {/* Social Links */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between relative z-10">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Professional
                    </span>
                    <div className="flex items-center gap-1.5">
                      {socialMedia.map(({ title, icon: Icon, url }, i) => (
                        <a
                          key={i}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={title}
                          className="h-8 w-8 rounded-lg bg-slate-800 hover:bg-amber-400 hover:text-slate-950 flex items-center justify-center text-slate-300 transition-all"
                        >
                          <Icon size={14} />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: Interactive Form (7 Cols) */}
                <div className="lg:col-span-7 p-6 sm:p-8 space-y-5 bg-white">
                  {/* Top Action Bar: Mode Switcher Tabs + Close Button */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 flex-1">
                      <button
                        type="button"
                        onClick={() => setActiveTab('inquiry')}
                        className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          activeTab === 'inquiry'
                            ? 'bg-white text-[#0b1a30] shadow-sm'
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Fast Inquiry</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('call')}
                        className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          activeTab === 'call'
                            ? 'bg-amber-400 text-slate-950 shadow-sm'
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        <Video className="w-3.5 h-3.5 text-slate-950" />
                        <span>Book 15-Min Call</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={resetAndClose}
                      className="h-9 w-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-950 transition-colors shrink-0 cursor-pointer shadow-2xs border border-slate-200"
                      title="Close modal"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-[#0b1a30]">
                      {activeTab === 'call' ? 'Schedule a 15-Min Architecture Call' : 'Request a Project Proposal'}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {activeTab === 'call'
                        ? 'Select your preferred timezone and discussion agenda for a focused engineering consult.'
                        : 'Submit your requirements below to receive an itemized estimate within 24 hours.'}
                    </p>
                  </div>

                  {error ? (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-700">
                      {error}
                    </div>
                  ) : null}

                  <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-sans">
                    {/* Anti-spam honeypot bot trap */}
                    <div aria-hidden="true" style={{ opacity: 0, position: 'absolute', top: 0, left: '-9999px', height: 0, width: 0, zIndex: -1, pointerEvents: 'none' }}>
                      <label htmlFor="modal_website_hp">Website URL</label>
                      <input
                        type="text"
                        id="modal_website_hp"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        value={honeypot.website}
                        onChange={(e) => setHoneypot({ ...honeypot, website: e.target.value })}
                      />
                      <label htmlFor="modal_extra_hp">Leave empty</label>
                      <input
                        type="text"
                        id="modal_extra_hp"
                        name="hp_field"
                        tabIndex={-1}
                        autoComplete="off"
                        value={honeypot.hp_field}
                        onChange={(e) => setHoneypot({ ...honeypot, hp_field: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-extrabold mb-1 uppercase tracking-wider text-[10px]">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Alex Morgan"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-500 font-medium transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-700 font-extrabold mb-1 uppercase tracking-wider text-[10px]">
                          Work Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="alex@company.com"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-500 font-medium transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-extrabold mb-1 uppercase tracking-wider text-[10px]">
                          Phone / WhatsApp
                        </label>
                        <input
                          type="text"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="+61 400 / +44 7000"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-500 font-medium transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-700 font-extrabold mb-1 uppercase tracking-wider text-[10px]">
                          Project Category
                        </label>
                        <select
                          value={form.service}
                          onChange={(e) => setForm({ ...form, service: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-amber-500"
                        >
                          <option value="React / Next.js Web App">React / Next.js Web App</option>
                          <option value="Custom WordPress Engine / Plugin">Custom WordPress Engine / Plugin</option>
                          <option value="Fractional Senior Dev Retainer">Fractional Senior Dev Retainer</option>
                          <option value="AI / Automation Workflow Integration">AI / Automation Workflow Integration</option>
                          <option value="Codebase Rescue & Speed Audit">Codebase Rescue & Speed Audit</option>
                        </select>
                      </div>

                      {activeTab === 'call' ? (
                        <div>
                          <label className="block text-slate-700 font-extrabold mb-1 uppercase tracking-wider text-[10px]">
                            Preferred Timezone
                          </label>
                          <select
                            value={form.preferredTimezone}
                            onChange={(e) => setForm({ ...form, preferredTimezone: e.target.value })}
                            className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-amber-500"
                          >
                            <option value="AU (AEST/AEDT/AWST)">🇦🇺 Australia (AEST / AEDT / AWST)</option>
                            <option value="UK (GMT/BST)">🇬🇧 UK (GMT / BST)</option>
                            <option value="US East (EST/EDT)">🇺🇸 US East (EST / EDT)</option>
                            <option value="US West (PST/PDT)">🇺🇸 US West (PST / PDT)</option>
                            <option value="Europe (CET/CEST)">🇪🇺 Europe (CET / CEST)</option>
                            <option value="Asia-Pacific">🌏 Asia-Pacific</option>
                          </select>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-slate-700 font-extrabold mb-1 uppercase tracking-wider text-[10px]">
                            Launch Urgency
                          </label>
                          <select
                            value={form.timeline}
                            onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                            className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-amber-500"
                          >
                            <option value="2–4 Weeks (Fast Sprint)">⚡ 2–4 Weeks (Fast Sprint)</option>
                            <option value="1–2 Months (Standard Build)">📅 1–2 Months (Standard Build)</option>
                            <option value="Ongoing Monthly (Fractional Retainer)">🔄 Ongoing Monthly (Retainer)</option>
                          </select>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-slate-700 font-extrabold mb-1 uppercase tracking-wider text-[10px]">
                        {activeTab === 'call' ? 'Call Discussion Goals / What Are You Building? *' : 'Project Requirements & Goals *'}
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder={activeTab === 'call' ? 'Tell me briefly about what you want to achieve on the call...' : 'Briefly describe your project requirements, timeline, or scope...'}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-500 font-medium transition-all"
                      />
                    </div>

                    {/* GDPR Consent Checkbox */}
                    <div className="pt-1">
                      <div className="flex items-start gap-2.5">
                        <input
                          type="checkbox"
                          id="modalPopupGdpr"
                          checked={gdprConsent}
                          onChange={(e) => setGdprConsent(e.target.checked)}
                          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                        />
                        <label htmlFor="modalPopupGdpr" className="text-[11px] text-slate-600 leading-snug cursor-pointer font-medium">
                          I consent to having my details processed in accordance with the{' '}
                          <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-[#1d63ed] underline font-bold hover:text-blue-700">
                            Privacy Policy
                          </a>.
                        </label>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className={`w-full py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
                          activeTab === 'call'
                            ? 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                            : 'bg-[#0b1a30] hover:bg-slate-800 text-white'
                        }`}
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : activeTab === 'call' ? (
                          <>
                            <Calendar className="h-4 w-4" /> Confirm 15-Min Discovery Call
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" /> Submit Fast Inquiry
                          </>
                        )}
                      </button>
                      <span className="text-[10px] text-slate-400 block text-center mt-2 font-medium">
                        🔒 Direct senior engineer response · Zero spam · Strict NDA
                      </span>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
