'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  Send,
  CheckCircle2,
  Mail,
  Calendar,
  Video,
  Loader2,
} from 'lucide-react';
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandFacebook,
  IconBrandInstagram,
} from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';

const SERVICE_OPTIONS = [
  'React / Next.js Web App',
  'Custom WordPress Engine / Plugin',
  'Fractional Senior Dev Retainer',
  'AI / Automation Workflow Integration',
  'Codebase Rescue & Speed Audit',
];

export interface ContactModalProps {
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

  // Escape closes; lock page scroll while open (Lenis + native).
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') resetAndClose();
    };
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const serviceOptions = SERVICE_OPTIONS.includes(form.service) ? SERVICE_OPTIONS : [form.service, ...SERVICE_OPTIONS];
  const fieldClass =
    'w-full min-h-[48px] px-4 rounded-xl bg-brand-bg border border-brand-border text-brand-navy text-[15px] placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 transition-colors';
  const labelClass = 'block mb-1.5 text-sm font-semibold text-brand-navy';
  const isCall = activeTab === 'call';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="contact-modal"
          data-lenis-prevent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) resetAndClose();
          }}
          className="fixed inset-0 z-[10000] flex items-end sm:items-start justify-center sm:p-6 overflow-y-auto overscroll-contain bg-brand-ink/70 backdrop-blur-md font-sans"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full sm:max-w-[960px] sm:my-auto max-h-[92dvh] sm:max-h-none overflow-y-auto sm:overflow-hidden rounded-t-[28px] sm:rounded-[28px] bg-white text-brand-navy shadow-[0_60px_140px_-40px_rgba(0,0,0,0.8)]"
          >
            <button
              type="button"
              onClick={resetAndClose}
              aria-label="Close"
              className="absolute top-4 right-4 z-10 h-11 w-11 rounded-full bg-brand-bg hover:bg-brand-border text-brand-navy flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {success ? (
              <div className="px-6 py-14 sm:p-16 flex flex-col items-center text-center gap-5">
                <span className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="h-9 w-9" />
                </span>
                <h3 id="contact-modal-title" className="m-0 text-[clamp(28px,3vw,40px)] font-extrabold tracking-[-0.04em] leading-tight">
                  Request received.
                </h3>
                <p className="m-0 max-w-md text-brand-slate leading-relaxed">
                  Thank you for reaching out. I&apos;ve received your inquiry and will review your scope to reply within 2–4
                  hours.
                </p>
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="motion-btn mt-2 min-h-[52px] px-8 rounded-full bg-brand-navy hover:bg-brand-ink text-white font-bold cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* LEFT: direct channels & guarantees (desktop) */}
                <aside className="hidden lg:flex lg:col-span-5 bg-brand-ink text-white p-10 flex-col justify-between gap-10">
                  <div className="flex flex-col gap-6">
                    <span className="inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.08em] text-slate-400">
                      <span className="motion-pulse h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                      Direct senior developer
                    </span>
                    <p className="m-0 text-[40px] font-extrabold tracking-[-0.045em] leading-[1]">
                      Let&apos;s build your next platform<span className="text-amber-500">.</span>
                    </p>
                    <p className="m-0 text-slate-300 leading-relaxed">
                      Partner directly with Rowell Mark Blanca for bespoke React, Next.js, and WordPress systems.
                    </p>
                    <dl className="m-0 flex flex-col border-t border-white/10">
                      <div className="flex flex-col-reverse gap-1 py-4 border-b border-white/10">
                        <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-slate-400">Email</dt>
                        <dd className="m-0"><a href="mailto:hello@rowellblanca.dev" className="motion-underline font-semibold">hello@rowellblanca.dev</a></dd>
                      </div>
                      <div className="flex flex-col-reverse gap-1 py-4 border-b border-white/10">
                        <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-slate-400">Timezone overlap</dt>
                        <dd className="m-0 font-semibold">AU (AEST) · UK (GMT) · US (EST)</dd>
                      </div>
                      <div className="flex flex-col-reverse gap-1 py-4 border-b border-white/10">
                        <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-slate-400">Turnaround</dt>
                        <dd className="m-0 font-semibold">Reply within 2–4 business hours</dd>
                      </div>
                    </dl>
                    <ul className="m-0 p-0 list-none flex flex-col gap-2.5 text-sm text-slate-300">
                      {['12+ yrs experience · zero junior delegation', '98+ Core Web Vitals speed guarantee', 'Strict NDA & code IP ownership'].map((item) => (
                        <li key={item} className="flex gap-3"><span aria-hidden="true" className="text-amber-500">—</span>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center gap-2">
                    {socialMedia.map(({ title, icon: Icon, url }) => (
                      <a
                        key={title}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={title}
                        className="h-11 w-11 rounded-full border border-white/15 hover:border-amber-400 text-slate-300 hover:text-amber-400 flex items-center justify-center transition-colors"
                      >
                        <Icon size={16} />
                      </a>
                    ))}
                  </div>
                </aside>

                {/* RIGHT: form */}
                <div className="lg:col-span-7 px-5 pt-6 pb-8 sm:p-10 flex flex-col gap-6">
                  {/* Mobile: compact channel strip in place of the side panel */}
                  <a href="mailto:hello@rowellblanca.dev" className="lg:hidden self-start inline-flex items-center gap-2 font-mono text-xs text-brand-slate pr-14">
                    <span className="motion-pulse h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                    hello@rowellblanca.dev · reply in 2–4h
                  </a>

                  <div role="tablist" aria-label="Contact type" className="grid grid-cols-2 p-1 rounded-full bg-brand-bg border border-brand-border mr-14 sm:mr-14">
                    {([
                      { id: 'inquiry', label: 'Project inquiry', short: 'Inquiry', Icon: Mail },
                      { id: 'call', label: 'Book a 15-min call', short: 'Book a call', Icon: Video },
                    ] as const).map(({ id, label, short, Icon }) => (
                      <button
                        key={id}
                        type="button"
                        role="tab"
                        aria-selected={activeTab === id}
                        onClick={() => setActiveTab(id)}
                        className={`min-h-[44px] rounded-full text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                          activeTab === id ? 'bg-brand-ink text-white shadow-sm' : 'text-brand-slate hover:text-brand-navy'
                        }`}
                      >
                        <Icon className="w-4 h-4" aria-hidden="true" />
                        <span className="sm:hidden">{short}</span>
                        <span className="hidden sm:inline">{label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <h3 id="contact-modal-title" className="m-0 text-[clamp(26px,2.6vw,34px)] font-extrabold tracking-[-0.035em] leading-tight">
                      {isCall ? 'Schedule a 15-min architecture call' : 'Request a project proposal'}
                    </h3>
                    <p className="m-0 text-brand-slate">
                      {isCall
                        ? 'Pick your timezone and agenda for a focused engineering consult.'
                        : 'Share your requirements to receive an itemized estimate within 24 hours.'}
                    </p>
                  </div>

                  {error ? (
                    <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                      {error}
                    </div>
                  ) : null}

                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                      <label htmlFor="cm_name" className={labelClass}>Full name *</label>
                      <input id="cm_name" type="text" required autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Alex Morgan" className={fieldClass} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="cm_email" className={labelClass}>Work email *</label>
                        <input id="cm_email" type="email" required autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="alex@company.com" className={fieldClass} />
                      </div>
                      <div>
                        <label htmlFor="cm_phone" className={labelClass}>Phone / WhatsApp</label>
                        <input id="cm_phone" type="tel" autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+44 7000 000000" className={fieldClass} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label htmlFor="cm_service" className={labelClass}>Project type</label>
                        <select id="cm_service" value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className={`${fieldClass} pr-10`}>
                          {serviceOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                      {isCall ? (
                        <div>
                          <label htmlFor="cm_tz" className={labelClass}>Preferred timezone</label>
                          <select id="cm_tz" value={form.preferredTimezone} onChange={(e) => setForm({ ...form, preferredTimezone: e.target.value })} className={`${fieldClass} pr-10`}>
                            <option value="AU (AEST/AEDT/AWST)">Australia (AEST / AEDT / AWST)</option>
                            <option value="UK (GMT/BST)">UK (GMT / BST)</option>
                            <option value="US East (EST/EDT)">US East (EST / EDT)</option>
                            <option value="US West (PST/PDT)">US West (PST / PDT)</option>
                            <option value="Europe (CET/CEST)">Europe (CET / CEST)</option>
                            <option value="Asia-Pacific">Asia-Pacific</option>
                          </select>
                        </div>
                      ) : (
                        <div>
                          <label htmlFor="cm_timeline" className={labelClass}>Launch timeline</label>
                          <select id="cm_timeline" value={form.timeline} onChange={(e) => setForm({ ...form, timeline: e.target.value })} className={`${fieldClass} pr-10`}>
                            <option value="2–4 Weeks (Fast Sprint)">2–4 weeks (fast sprint)</option>
                            <option value="1–2 Months (Standard Build)">1–2 months (standard build)</option>
                            <option value="Ongoing Monthly (Fractional Retainer)">Ongoing monthly (retainer)</option>
                          </select>
                        </div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="cm_message" className={labelClass}>
                        {isCall ? 'What would you like to cover? *' : 'Project requirements & goals *'}
                      </label>
                      <textarea
                        id="cm_message"
                        required
                        rows={3}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder={isCall ? 'A sentence or two about what you want to achieve on the call…' : 'Briefly describe your requirements, timeline, or scope…'}
                        className={`${fieldClass} py-3 resize-y`}
                      />
                    </div>

                    <label htmlFor="modalPopupGdpr" className="flex items-start gap-3 text-sm text-brand-slate leading-snug cursor-pointer">
                      <input
                        type="checkbox"
                        id="modalPopupGdpr"
                        checked={gdprConsent}
                        onChange={(e) => setGdprConsent(e.target.checked)}
                        className="mt-0.5 h-5 w-5 shrink-0 rounded border-brand-border accent-amber-500 cursor-pointer"
                      />
                      <span>
                        I consent to having my details processed in accordance with the{' '}
                        <a href="/privacy" target="_blank" rel="noopener noreferrer" className="motion-underline font-semibold text-brand-navy">
                          Privacy Policy
                        </a>
                        .
                      </span>
                    </label>

                    <button
                      type="submit"
                      disabled={submitting}
                      className={`motion-btn mt-1 w-full min-h-[56px] px-7 rounded-full font-bold flex items-center justify-between gap-3 cursor-pointer disabled:opacity-50 ${
                        isCall ? 'bg-amber-500 hover:bg-amber-400 text-brand-ink' : 'bg-brand-ink hover:bg-brand-navy text-white'
                      }`}
                    >
                      {submitting ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> Sending…
                        </span>
                      ) : (
                        <>
                          <span className="flex items-center gap-2.5">
                            {isCall ? <Calendar className="h-4 w-4" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
                            {isCall ? 'Confirm discovery call' : 'Send inquiry'}
                          </span>
                          <span className="motion-arrow" aria-hidden="true">→</span>
                        </>
                      )}
                    </button>
                    <span className="text-xs text-slate-500 text-center">Direct senior engineer response · Zero spam · Strict NDA</span>
                  </form>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
