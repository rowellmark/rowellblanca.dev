'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Send, Sparkles, CheckCircle2, Clock, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
}

export function ContactModal({ isOpen, onClose, defaultService = '' }: ContactModalProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: defaultService || 'Full-Stack Web App Development',
    budget: 'Below $1,500',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          company: form.company,
          service: form.service,
          budget: form.budget,
          subject: `Inquiry: ${form.service}`,
          message: form.message,
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
    setForm({
      name: '',
      email: '',
      phone: '',
      company: '',
      service: 'Full-Stack Web App Development',
      budget: 'Below $1,500',
      message: '',
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 overflow-y-auto bg-slate-950/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-8 overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={resetAndClose}
              className="absolute top-5 right-5 h-9 w-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {success ? (
              <div className="text-center py-8 space-y-4">
                <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-black text-[#0b1a30]">Message Received!</h3>
                <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Thank you for reaching out. I've received your project details and will review and reply within 24 hours.
                </p>
                <div className="pt-4">
                  <button
                    onClick={resetAndClose}
                    className="px-6 py-3 rounded-xl bg-[#1d63ed] text-white font-extrabold text-xs shadow-md"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/80">
                    Fast Inquiry Form
                  </span>
                  <h3 className="text-2xl font-black text-[#0b1a30] mt-2">
                    Let's Build Something Great
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Fill out your project details below to request a call or fast proposal.
                  </p>
                </div>

                {error ? (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700">
                    {error}
                  </div>
                ) : null}

                <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-sans">
                  <div>
                    <label className="block text-slate-700 font-extrabold mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. John Smith"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-[#1d63ed]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-extrabold mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="john@company.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-[#1d63ed]"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-extrabold mb-1">Phone / WhatsApp</label>
                      <input
                        type="text"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-[#1d63ed]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-extrabold mb-1">Service Interest</label>
                      <select
                        value={form.service}
                        onChange={(e) => setForm({ ...form, service: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold"
                      >
                        <option value="React / Next.js Web App">React / Next.js Web App</option>
                        <option value="Custom WordPress Engine / Plugin">Custom WordPress Engine / Plugin</option>
                        <option value="Full-Stack Web App Development">Full-Stack Web App Development</option>
                        <option value="AI / Automation Workflow Integration">AI / Automation Workflow Integration</option>
                        <option value="Retainer / Ongoing Maintenance">Retainer / Ongoing Maintenance</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-extrabold mb-1">Estimated Budget</label>
                      <select
                        value={form.budget}
                        onChange={(e) => setForm({ ...form, budget: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold"
                      >
                        <option value="Below $1,500">Below $1,500</option>
                        <option value="$1,500 - $3,000">$1,500 - $3,000</option>
                        <option value="$3,000 - $5,000">$3,000 - $5,000</option>
                        <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                        <option value="$10,000+">$10,000+</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-extrabold mb-1">Project Details / Message *</label>
                    <textarea
                      required
                      rows={3}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Briefly describe your project requirements, timeline, or goal..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-[#1d63ed]"
                    />
                  </div>

                  {/* GDPR Consent Checkbox */}
                  <div className="pt-1">
                    <div className="flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        id="modalGdprConsent"
                        required
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                      />
                      <label htmlFor="modalGdprConsent" className="text-[11px] text-slate-600 leading-snug cursor-pointer">
                        I consent to the processing of my personal data according to the{' '}
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
                      className="w-full py-3.5 px-6 rounded-2xl bg-[#1d63ed] hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <span>Submitting Request...</span>
                      ) : (
                        <>
                          <Send className="h-4 w-4" /> Submit Inquiry
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
