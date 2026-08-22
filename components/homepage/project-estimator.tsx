"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Calculator,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Send,
  Loader2,
  Code2,
  Layers,
  Clock,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectTypeOption {
  id: string;
  title: string;
  desc: string;
  baseWeeks: string;
  recommendedStack: string[];
}

const PROJECT_TYPES: ProjectTypeOption[] = [
  {
    id: "nextjs_app",
    title: "Next.js / React Web App",
    desc: "Scalable SaaS, client portal, or custom web platform with sub-second performance.",
    baseWeeks: "3–6 weeks",
    recommendedStack: ["Next.js 14", "React 19", "TypeScript", "TailwindCSS", "PostgreSQL"],
  },
  {
    id: "wordpress_engine",
    title: "Custom WordPress & Gutenberg",
    desc: "Bespoke theme, headless setup, or custom Gutenberg block plugins without page builder bloat.",
    baseWeeks: "2–4 weeks",
    recommendedStack: ["WordPress", "Gutenberg Core", "PHP 8.2+", "React Block Editor", "MySQL"],
  },
  {
    id: "ai_integration",
    title: "AI / Workflow Automation",
    desc: "LLM copilot, RAG knowledge system, OpenAI/Gemini integration, or automated CRM workflows.",
    baseWeeks: "2–3 weeks",
    recommendedStack: ["LangChain", "Gemini / OpenAI API", "Vector DB", "Next.js API", "Node.js"],
  },
  {
    id: "fractional_retainer",
    title: "Dedicated Senior Dev Retainer",
    desc: "Continuous sprint shipping, agency overflow support, codebase rescue, and feature iterations.",
    baseWeeks: "Ongoing monthly",
    recommendedStack: ["Full-Stack", "Daily Standups", "Git Flow", "Sub-second CRO", "CI/CD"],
  },
];

const FEATURE_OPTIONS = [
  { id: "auth_db", label: "User Authentication & Database Architecture" },
  { id: "payments", label: "Stripe / Payment Billing & Subscription Engine" },
  { id: "admin_cms", label: "Custom Admin Dashboard & Content Management" },
  { id: "api_sync", label: "Third-Party API Integrations & Webhooks" },
  { id: "speed_cro", label: "98+ Lighthouse Core Web Vitals Optimization" },
];

const TIMELINE_OPTIONS = [
  { id: "urgent", label: "⚡ Fast Sprint (2–4 Weeks)", desc: "Need to launch MVP or overhaul rapidly" },
  { id: "standard", label: "📅 Standard Build (1–2 Months)", desc: "Comprehensive phased production rollout" },
  { id: "retainer", label: "🔄 Ongoing Fractional (Monthly)", desc: "20–40+ hours/month dedicated senior dev" },
];

export function ProjectEstimator() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string>("nextjs_app");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    "auth_db",
    "speed_cro",
  ]);
  const [selectedTimeline, setSelectedTimeline] = useState<string>("urgent");

  // Lead capture state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactCompany, setContactCompany] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [formLoadedAt, setFormLoadedAt] = useState<number>(Date.now());
  const [honeypot, setHoneypot] = useState({ website: "", hp_field: "" });

  useEffect(() => {
    setFormLoadedAt(Date.now());
  }, []);

  const toggleFeature = (id: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const currentTypeConfig =
    PROJECT_TYPES.find((t) => t.id === selectedType) || PROJECT_TYPES[0];

  const handleSubmitEstimate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim()) {
      setErrorMsg("Please enter your name and email address.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    const featureLabels = selectedFeatures
      .map((f) => FEATURE_OPTIONS.find((opt) => opt.id === f)?.label)
      .filter(Boolean)
      .join(", ");

    const timelineLabel =
      TIMELINE_OPTIONS.find((t) => t.id === selectedTimeline)?.label || selectedTimeline;

    const summaryDetails = `
--- INTERACTIVE PROJECT ESTIMATOR SCOPE ---
• Project Category: ${currentTypeConfig.title}
• Desired Timeline: ${timelineLabel}
• Selected Features: ${featureLabels || "Core Baseline"}
• Recommended Stack: ${currentTypeConfig.recommendedStack.join(", ")}
    `.trim();

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName.trim(),
          email: contactEmail.trim(),
          company: contactCompany.trim() || undefined,
          phone: contactPhone.trim() || undefined,
          service: currentTypeConfig.title,
          subject: `Estimate Request: ${currentTypeConfig.title}`,
          message: summaryDetails,
          sourceUrl: "Interactive Project Estimator (Homepage)",
          website: honeypot.website,
          hp_field: honeypot.hp_field,
          formLoadedAt,
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok || data?.success) {
        setSubmitted(true);
        router.push("/thank-you");
      } else {
        setErrorMsg(data?.error || "Failed to submit estimate. Please try again.");
      }
    } catch (err) {
      setErrorMsg("An error occurred during submission. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative w-full py-16 sm:py-24 bg-gradient-to-b from-[#FAFAF7] via-white to-[#FAFAF7] overflow-hidden font-sans border-t border-slate-200/80">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs font-black uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5 text-amber-600" />
            <span>Interactive Project Scope & Estimate</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0b1a30] tracking-tight">
            Estimate Your Project Scope & Architecture
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            Select your requirements to see estimated timelines, recommended technical stack, and request an itemized proposal within 24 hours.
          </p>
        </div>

        {/* Main Grid: Steps on Left, Live Summary on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Step 1 & 2 Form Controls */}
          <div className="lg:col-span-7 space-y-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xl">
            {/* Step 1: Project Type */}
            <div className="space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                Step 1 · Choose Project Type
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PROJECT_TYPES.map((type) => {
                  const isSelected = selectedType === type.id;
                  return (
                    <div
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-200 relative ${
                        isSelected
                          ? "bg-amber-50/70 border-amber-500 shadow-sm ring-2 ring-amber-500/20"
                          : "bg-slate-50 hover:bg-slate-100/70 border-slate-200/80"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-xs font-black text-[#0b1a30]">
                          {type.title}
                        </h4>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        {type.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Key Features */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                Step 2 · Select Included Features
              </span>
              <div className="grid grid-cols-1 gap-2.5">
                {FEATURE_OPTIONS.map((feat) => {
                  const isChecked = selectedFeatures.includes(feat.id);
                  return (
                    <div
                      key={feat.id}
                      onClick={() => toggleFeature(feat.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isChecked
                          ? "bg-blue-50/60 border-blue-400 text-[#0b1a30]"
                          : "bg-slate-50 hover:bg-slate-100/60 border-slate-200 text-slate-700"
                      }`}
                    >
                      <span className="text-xs font-extrabold">{feat.label}</span>
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                          isChecked
                            ? "bg-[#1d63ed] border-[#1d63ed] text-white"
                            : "bg-white border-slate-300"
                        }`}
                      >
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Timeline & Engagement Preference */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                Step 3 · Timeline & Urgency
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {TIMELINE_OPTIONS.map((time) => {
                  const isSelected = selectedTimeline === time.id;
                  return (
                    <div
                      key={time.id}
                      onClick={() => setSelectedTimeline(time.id)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? "bg-amber-50 border-amber-500 ring-2 ring-amber-500/20"
                          : "bg-slate-50 hover:bg-slate-100 border-slate-200"
                      }`}
                    >
                      <span className="text-xs font-black block text-[#0b1a30]">
                        {time.label}
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        {time.desc}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Live Calculated Estimate & Proposal Request */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#0b1a30] via-slate-900 to-[#0b1a30] p-6 sm:p-8 rounded-3xl text-white shadow-2xl space-y-6 relative overflow-hidden border border-slate-800">
            {/* Ambient Corner Sparkle */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                <h3 className="text-base font-black tracking-wide">
                  Scope Summary & Stack
                </h3>
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-500/30">
                Direct Senior Dev
              </span>
            </div>

            {/* Calculated Delivery Time & Recommendations */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Estimated Delivery Timeframe
                </span>
                <p className="text-lg font-black text-white">
                  {currentTypeConfig.baseWeeks}
                </p>
                <p className="text-xs text-slate-400">
                  Includes full QA testing, responsive breakpoints, and Core Web Vitals audit.
                </p>
              </div>

              {/* Recommended Stack */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Recommended Architecture Stack
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentTypeConfig.recommendedStack.map((tech, i) => (
                    <span
                      key={i}
                      className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Highlights */}
              <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Full UK (GMT), US & Australian (AEST) Timezone Overlap</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>40–50% Cost Savings vs UK / US / AU Agency Bloat</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100% Direct Senior Code Quality & Daily Comms</span>
                </div>
              </div>
            </div>

            {/* Request Formal Proposal Form */}
            <div className="pt-3 border-t border-slate-800">
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-300 mb-3 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Lock In Your Proposal & Call
              </h4>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold mb-3">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmitEstimate} className="space-y-3 text-xs">
                {/* Anti-spam honeypot bot trap */}
                <div
                  aria-hidden="true"
                  style={{
                    opacity: 0,
                    position: "absolute",
                    top: 0,
                    left: "-9999px",
                    height: 0,
                    width: 0,
                    zIndex: -1,
                    pointerEvents: "none",
                  }}
                >
                  <label htmlFor="est_website_hp">Website URL</label>
                  <input
                    type="text"
                    id="est_website_hp"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot.website}
                    onChange={(e) =>
                      setHoneypot({ ...honeypot, website: e.target.value })
                    }
                  />
                  <label htmlFor="est_extra_hp">Leave empty</label>
                  <input
                    type="text"
                    id="est_extra_hp"
                    name="hp_field"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot.hp_field}
                    onChange={(e) =>
                      setHoneypot({ ...honeypot, hp_field: e.target.value })
                    }
                  />
                </div>

                <div>
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name *"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <input
                      type="email"
                      required
                      placeholder="Work Email Address *"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-medium"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Company (Optional)"
                      value={contactCompany}
                      onChange={(e) => setContactCompany(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Submitting Estimate Request...</span>
                    </>
                  ) : (
                    <>
                      <span>Get Itemized Proposal & Scope</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                <span className="text-[10px] text-slate-400 block text-center">
                  🔒 Direct senior response within 24h · Zero spam · Strict NDA
                </span>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
