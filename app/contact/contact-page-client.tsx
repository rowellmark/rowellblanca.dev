"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Phone,
  Clock,
  ShieldCheck,
  Send,
  Calendar,
  Video,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Globe,
  Loader2,
  Zap,
} from "lucide-react";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandFacebook,
  IconBrandInstagram,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectEstimator } from "@/components/homepage/project-estimator";
import { EngagementModels } from "@/components/homepage/engagement-models";
import { SpeedRacerGame } from "@/components/interactive/speed-racer-game";

export function ContactPageClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"inquiry" | "call">("inquiry");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "React / Next.js Web App",
    preferredTimezone: "AU (AEST/AEDT/AWST)",
    timeline: "2–4 Weeks (Fast Sprint)",
    message: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gdprConsent, setGdprConsent] = useState(false);
  const [formLoadedAt, setFormLoadedAt] = useState<number>(Date.now());
  const [honeypot, setHoneypot] = useState({ website: "", hp_field: "" });

  useEffect(() => {
    setFormLoadedAt(Date.now());
  }, []);

  const socialMedia = [
    { title: "LinkedIn", icon: IconBrandLinkedin, url: "https://www.linkedin.com/in/rowell-blanca/" },
    { title: "GitHub", icon: IconBrandGithub, url: "https://github.com/rowellmark" },
    { title: "Instagram", icon: IconBrandInstagram, url: "https://www.instagram.com/its.mr.row/" },
    { title: "Facebook", icon: IconBrandFacebook, url: "https://www.facebook.com/itsmrrowrow" },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const newErrors: { [key: string]: string } = {};
    if (!form.name.trim()) newErrors.name = "Your name is required";
    if (!form.email.trim()) {
      newErrors.email = "Work email address is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!form.message.trim()) newErrors.message = "Please enter your message or project requirements";
    if (!gdprConsent) newErrors.gdpr = "Please accept the privacy policy to proceed";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    const currentPath = typeof window !== "undefined"
      ? `${window.location.pathname}${window.location.search || ""}`
      : "/contact";

    const sourceUrl = `Contact Page [${activeTab === "call" ? "15-Min Discovery Call" : "Direct Inquiry"}] (${currentPath})`;

    const formattedMessage = activeTab === "call"
      ? `[15-MIN DISCOVERY CALL REQUEST]\n• Preferred Timezone: ${form.preferredTimezone}\n• Desired Timeline: ${form.timeline}\n• Discussion Goals:\n${form.message}`
      : `[PROJECT INQUIRY]\n• Desired Timeline: ${form.timeline}\n• Requirements:\n${form.message}`;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          company: form.company.trim() || undefined,
          service: activeTab === "call" ? `Discovery Call (${form.service})` : form.service,
          subject: activeTab === "call" ? `Discovery Call Request: ${form.name}` : `Inquiry: ${form.service}`,
          message: formattedMessage,
          sourceUrl,
          website: honeypot.website,
          hp_field: honeypot.hp_field,
          formLoadedAt,
          gdprConsent: true,
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok || data?.success) {
        router.push("/thank-you");
      } else {
        setErrors({ general: data?.error || "Failed to send message. Please try again." });
      }
    } catch (err) {
      setErrors({ general: "An error occurred. Please reach out to rowellblanca94@gmail.com directly." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Hero Header */}
      <section className="relative pt-32 pb-16 bg-gradient-to-b from-indigo-950 via-slate-900 to-[#0b1a30] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#4338ca_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 relative z-10 text-center space-y-5">
          <motion.div
            initial={{ y: -15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-black uppercase tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Available for Select Client Projects</span>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight max-w-3xl mx-auto"
          >
            Let's Discuss Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200">Next Digital Product</span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Partner directly with senior engineer Rowell Mark Blanca for bespoke React, Next.js, and custom WordPress systems with full UK, US & Australian timezone overlap.
          </motion.p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-14 sm:py-20 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Direct Info & Trust Cards (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Contact Direct Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md inline-block">
                  Direct Contact Channels
                </span>
                <h3 className="text-xl font-black text-[#0b1a30]">Get In Touch Directly</h3>
              </div>

              <div className="space-y-3 pt-2">
                <a
                  href="mailto:rowellblanca94@gmail.com"
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-amber-50/70 border border-slate-200/80 hover:border-amber-300 transition-all flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-amber-600 shadow-2xs group-hover:scale-105 transition-transform">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Primary Email</span>
                    <span className="text-xs font-black text-[#0b1a30] group-hover:text-amber-700 transition-colors">
                      rowellblanca94@gmail.com
                    </span>
                  </div>
                </a>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shadow-2xs">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Timezone Coverage</span>
                    <span className="text-xs font-black text-[#0b1a30]">
                      AU (AEST) · UK (GMT) · US (EST/PST)
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-emerald-600 shadow-2xs">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Response Time</span>
                    <span className="text-xs font-black text-[#0b1a30]">
                      Direct reply within 2–4 business hours
                    </span>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Professional Networks
                </span>
                <div className="flex items-center gap-2">
                  {socialMedia.map(({ title, icon: Icon, url }, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={title}
                      className="h-10 w-10 rounded-xl bg-slate-50 hover:bg-slate-900 border border-slate-200 hover:border-slate-800 text-slate-600 hover:text-white flex items-center justify-center transition-all shadow-2xs hover:shadow-xs hover:scale-105"
                    >
                      <Icon size={18} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Why Work Directly With Rowell Card */}
            <div className="bg-gradient-to-br from-[#0b1a30] to-indigo-950 text-white rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-xl space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

              <h4 className="text-sm font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" /> The Senior Dev Advantage
              </h4>

              <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Zero Junior Delegation:</strong> Every line of code is written by a senior engineer with 12+ years exp.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>40–50% Cost Efficiency:</strong> Premium UK/US/AU agency quality without agency overhead.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>98+ Core Web Vitals Guarantee:</strong> Fast, accessible, SEO-hardened digital platforms.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Clear Weekly Sprints:</strong> Daily async updates, Git PRs, and Slack collaboration.</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Right Column: Dual-Tab Interactive Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-9 border border-slate-200/90 shadow-xl space-y-6">
            {/* Mode Switcher Tabs */}
            <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab("inquiry")}
                className={`flex-1 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === "inquiry"
                    ? "bg-white text-[#0b1a30] shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>Fast Project Inquiry</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("call")}
                className={`flex-1 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === "call"
                    ? "bg-amber-400 text-slate-950 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Video className="w-4 h-4 text-slate-950" />
                <span>Book 15-Min Discovery Call</span>
              </button>
            </div>

            <div>
              <h2 className="text-2xl font-black text-[#0b1a30]">
                {activeTab === "call" ? "Schedule a 15-Minute Architecture Call" : "Request a Project Proposal & Scope"}
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-1">
                {activeTab === "call"
                  ? "Select your preferred timezone and discussion topics for a focused 15-minute engineering consult."
                  : "Fill out your requirements below to receive an itemized estimate and technical breakdown within 24 hours."}
              </p>
            </div>

            {errors.general && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              {/* Anti-spam honeypot bot trap */}
              <div aria-hidden="true" style={{ opacity: 0, position: "absolute", top: 0, left: "-9999px", height: 0, width: 0, zIndex: -1, pointerEvents: "none" }}>
                <label htmlFor="contact_page_hp">Website URL</label>
                <input
                  type="text"
                  id="contact_page_hp"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot.website}
                  onChange={(e) => setHoneypot({ ...honeypot, website: e.target.value })}
                />
                <label htmlFor="contact_page_extra_hp">Leave empty</label>
                <input
                  type="text"
                  id="contact_page_extra_hp"
                  name="hp_field"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot.hp_field}
                  onChange={(e) => setHoneypot({ ...honeypot, hp_field: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="contactName" className="block text-slate-700 font-extrabold mb-1.5 uppercase tracking-wider text-[11px]">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  id="contactName"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-500 font-medium transition-all"
                />
                {errors.name && <span className="text-xs text-rose-600 font-bold mt-1 block">{errors.name}</span>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contactEmail" className="block text-slate-700 font-extrabold mb-1.5 uppercase tracking-wider text-[11px]">
                    Work Email Address *
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="alex@company.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-500 font-medium transition-all"
                  />
                  {errors.email && <span className="text-xs text-rose-600 font-bold mt-1 block">{errors.email}</span>}
                </div>

                <div>
                  <label htmlFor="contactPhone" className="block text-slate-700 font-extrabold mb-1.5 uppercase tracking-wider text-[11px]">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="text"
                    id="contactPhone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+61 400 000 000 / +44 7000"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-500 font-medium transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contactService" className="block text-slate-700 font-extrabold mb-1.5 uppercase tracking-wider text-[11px]">
                    Project Category
                  </label>
                  <select
                    id="contactService"
                    value={form.service}
                    onChange={(e) => setForm({ ...form, service: e.target.value })}
                    className="w-full px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold focus:outline-none focus:border-amber-500 transition-all"
                  >
                    <option value="React / Next.js Web App">React / Next.js Web App</option>
                    <option value="Custom WordPress Engine / Plugin">Custom WordPress Engine / Plugin</option>
                    <option value="Fractional Senior Dev Retainer">Fractional Senior Dev Retainer</option>
                    <option value="AI / Automation Workflow Integration">AI / Automation Workflow Integration</option>
                    <option value="Codebase Rescue & Speed Audit">Codebase Rescue & Speed Audit</option>
                  </select>
                </div>

                {activeTab === "call" ? (
                  <div>
                    <label htmlFor="contactTimezone" className="block text-slate-700 font-extrabold mb-1.5 uppercase tracking-wider text-[11px]">
                      Your Preferred Timezone
                    </label>
                    <select
                      id="contactTimezone"
                      value={form.preferredTimezone}
                      onChange={(e) => setForm({ ...form, preferredTimezone: e.target.value })}
                      className="w-full px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold focus:outline-none focus:border-amber-500 transition-all"
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
                    <label htmlFor="contactTimeline" className="block text-slate-700 font-extrabold mb-1.5 uppercase tracking-wider text-[11px]">
                      Target Launch Urgency
                    </label>
                    <select
                      id="contactTimeline"
                      value={form.timeline}
                      onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                      className="w-full px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold focus:outline-none focus:border-amber-500 transition-all"
                    >
                      <option value="2–4 Weeks (Fast Sprint)">⚡ 2–4 Weeks (Fast Sprint)</option>
                      <option value="1–2 Months (Standard Build)">📅 1–2 Months (Standard Build)</option>
                      <option value="Ongoing Monthly (Fractional Retainer)">🔄 Ongoing Monthly (Fractional Retainer)</option>
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="contactMessage" className="block text-slate-700 font-extrabold mb-1.5 uppercase tracking-wider text-[11px]">
                  {activeTab === "call" ? "Call Discussion Goals & What You Are Building *" : "Project Requirements & Goals *"}
                </label>
                <textarea
                  id="contactMessage"
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder={activeTab === "call" ? "Tell me about your product requirements and key topics to cover on the call..." : "Briefly describe your project requirements, scope, or challenges..."}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-500 font-medium transition-all"
                />
                {errors.message && <span className="text-xs text-rose-600 font-bold mt-1 block">{errors.message}</span>}
              </div>

              {/* GDPR Consent Checkbox */}
              <div className="pt-1">
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="contactPageGdpr"
                    checked={gdprConsent}
                    onChange={(e) => setGdprConsent(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                  />
                  <label htmlFor="contactPageGdpr" className="text-xs text-slate-600 leading-snug cursor-pointer font-medium">
                    I consent to having my details processed to receive a project proposal in accordance with the{" "}
                    <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-[#1d63ed] underline font-bold hover:text-blue-700">
                      Privacy Policy
                    </a>.
                  </label>
                </div>
                {errors.gdpr && <span className="text-xs text-rose-600 font-bold mt-1 block">{errors.gdpr}</span>}
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
                    activeTab === "call"
                      ? "bg-amber-400 hover:bg-amber-300 text-slate-950"
                      : "bg-[#0b1a30] hover:bg-slate-800 text-white"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing Request...</span>
                    </>
                  ) : activeTab === "call" ? (
                    <>
                      <Calendar className="w-4 h-4" />
                      <span>Confirm 15-Min Discovery Call</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Project Inquiry</span>
                    </>
                  )}
                </button>
                <span className="text-[11px] text-slate-400 font-medium block text-center mt-2.5">
                  🔒 Direct senior response within 2–4 hours · Zero spam · Strict NDA
                </span>
              </div>
            </form>
          </div>

        </div>
      </section>

      {/* Interactive Scope & Architecture Estimator */}
      <div id="project-estimator" className="border-t border-slate-200">
        <ProjectEstimator />
      </div>

      {/* Transparent Engagement Models */}
      <EngagementModels />

      {/* Interactive Speed Racer Game */}
      <SpeedRacerGame />
    </div>
  );
}
