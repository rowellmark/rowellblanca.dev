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
  Server,
  AlertCircle,
  Cpu,
} from "lucide-react";

interface ProjectTypeOption {
  id: string;
  title: string;
  desc: string;
  baseWeeks: string;
  basePriceUsd: number;
  recommendedStack: string[];
}

const PROJECT_TYPES: ProjectTypeOption[] = [
  {
    id: "nextjs_app",
    title: "Next.js / React Web App",
    desc: "Scalable SaaS platform, client portal, or custom web platform with sub-second performance.",
    baseWeeks: "3–6 weeks",
    basePriceUsd: 3600,
    recommendedStack: ["Next.js 15", "React 19", "TypeScript", "TailwindCSS", "PostgreSQL"],
  },
  {
    id: "wordpress_engine",
    title: "Custom WordPress & Gutenberg",
    desc: "Bespoke high-speed theme, headless setup, or custom Gutenberg block plugins without page builder bloat.",
    baseWeeks: "2–4 weeks",
    basePriceUsd: 2240,
    recommendedStack: ["WordPress 6.7+", "Native Gutenberg", "PHP 8.3", "React Block Editor", "MySQL"],
  },
  {
    id: "ai_integration",
    title: "AI / Workflow Automation",
    desc: "LLM copilot, RAG knowledge system, OpenAI/Gemini integration, or automated CRM workflows.",
    baseWeeks: "2–3 weeks",
    basePriceUsd: 2560,
    recommendedStack: ["LangChain", "Gemini / OpenAI API", "Vector DB", "Next.js API", "Node.js"],
  },
  {
    id: "fractional_retainer",
    title: "Dedicated Senior Dev Retainer",
    desc: "Continuous sprint shipping, daily standups, codebase maintenance, and feature iteration sprints.",
    baseWeeks: "Monthly Ongoing",
    basePriceUsd: 600,
    recommendedStack: ["React 19 / Next.js", "WordPress Gutenberg", "TypeScript / Node", "Prisma / SQL"],
  },
];

const DEVELOPER_SKILLS_CATEGORIES = [
  {
    title: "Frontend & Modern Web",
    icon: Code2,
    skills: [
      "React 19 & Next.js 15 (App Router, Server Actions, RSC)",
      "TypeScript & Modern ESNext JavaScript",
      "TailwindCSS & Bespoke Component Design Systems",
      "Responsive Mobile-First Architecture & Micro-Interactions",
    ],
  },
  {
    title: "WordPress & CMS Architecture",
    icon: Layers,
    skills: [
      "Bespoke Native Gutenberg Block Development (React)",
      "Custom Theme Engineering & PHP 8.3 OOP Architecture",
      "Zero-Bloat Plugin Development & Database Optimization",
      "REST API & GraphQL Endpoints Integration",
    ],
  },
  {
    title: "Backend, Database & APIs",
    icon: Server,
    skills: [
      "Node.js & Edge Serverless Architecture",
      "PostgreSQL (NeonDB), MySQL & Prisma ORM",
      "Stripe Payments, Billing Portals & Webhook Pipelines",
      "Secure Session Auth & Role-Based Access Control (RBAC)",
    ],
  },
  {
    title: "AI & Workflow Automation",
    icon: Cpu,
    skills: [
      "OpenAI & Google Gemini APIs Integration",
      "RAG Systems, Vector Embeddings & LangChain",
      "Automated Inbound Lead Qualification & CRM Pipelines",
      "Autonomous Multi-Step Workflow Automation",
    ],
  },
  {
    title: "Performance, DevOps & Operations",
    icon: Zap,
    skills: [
      "Core Web Vitals Speed Optimization (LCP < 1.2s, 98+ Score)",
      "Technical SEO, XML Sitemaps & Structured JSON-LD",
      "Git Flow, Pull Requests & CI/CD Automated Pipelines",
      "Direct Async Slack / Teams Sync & Daily Standups",
    ],
  },
];

const FEATURE_OPTIONS = [
  {
    id: "ui_ux_design",
    label: "Bespoke UI/UX Design Fee (Full Figma mockups & wireframes — required if design not provided)",
    price: 720,
    badge: "Design Fee",
  },
  {
    id: "seo",
    label: "Technical SEO & Rich Schema LD Engine (Automated JSON-LD, sitemaps & search indexing)",
    price: 480,
  },
  {
    id: "crm",
    label: "Inbound Leads CRM & Sales Pipeline (Real-time capture, instant email alerts & Kanban)",
    price: 480,
  },
  {
    id: "email_followup",
    label: "Automated Email Follow-Up & Drip Campaigns (Multi-step lead nurture funnels)",
    price: 420,
  },
  {
    id: "custom_blocks",
    label: "Bespoke React Gutenberg Block Suite",
    price: 480,
  },
  {
    id: "auth_portal",
    label: "Client Portal & 1-Click SSO Authentication",
    price: 640,
  },
  {
    id: "stripe_billing",
    label: "Stripe Payments, Invoices & Subscriptions",
    price: 720,
  },
  {
    id: "monitoring",
    label: "24/7 Production Telemetry, Health Checks & Error Monitoring",
    price: 320,
  },
];

const TIMELINE_OPTIONS = [
  { id: "urgent", label: "⚡ Fast Sprint (2–3 Weeks)", multiplier: 1.15, desc: "Priority queue for immediate launch" },
  { id: "standard", label: "🚀 Standard Build (4–6 Weeks)", multiplier: 1.0, desc: "Comprehensive phased production delivery" },
  { id: "retainer", label: "🔄 Monthly Partnership", multiplier: 1.0, desc: "Ongoing sprint capacity & dedicated hours" },
];

export function ProjectEstimator() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string>("nextjs_app");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    "ui_ux_design",
    "seo",
    "crm",
    "email_followup",
    "custom_blocks",
    "auth_portal",
    "monitoring",
  ]);
  const [selectedTimeline, setSelectedTimeline] = useState<string>("standard");
  const [retainerBillingMode, setRetainerBillingMode] = useState<"monthly" | "project">("monthly");

  // Lead capture state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactCompany, setContactCompany] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactWebsite, setContactWebsite] = useState("");
  const [contactNotes, setContactNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [formLoadedAt, setFormLoadedAt] = useState<number>(Date.now());
  const [honeypot, setHoneypot] = useState({ website: "", hp_field: "" });

  useEffect(() => {
    setFormLoadedAt(Date.now());
  }, []);

  const isRetainer = selectedType === "fractional_retainer";
  const currentTypeConfig =
    PROJECT_TYPES.find((t) => t.id === selectedType) || PROJECT_TYPES[0];
  const activeTimelineObj =
    TIMELINE_OPTIONS.find((t) => t.id === selectedTimeline) || TIMELINE_OPTIONS[1];

  const toggleFeature = (id: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  // Calculate estimated investment
  const featureCost = selectedFeatures.reduce((acc, featId) => {
    const feat = FEATURE_OPTIONS.find((f) => f.id === featId);
    return acc + (feat ? feat.price : 0);
  }, 0);

  const baseCalculated = isRetainer
    ? retainerBillingMode === "monthly"
      ? 600
      : 0
    : (currentTypeConfig.basePriceUsd + featureCost) * activeTimelineObj.multiplier;

  const lowEstimate = Math.round(baseCalculated / 100) * 100;
  const highEstimate = Math.round((baseCalculated * 1.25) / 100) * 100;

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

    const summaryDetails = isRetainer
      ? `--- DEDICATED SENIOR DEV RETAINER INQUIRY ---
• Engagement Basis: ${retainerBillingMode === "monthly" ? "Monthly Dedicated Retainer ($600 USD / month)" : "Project-Based Scope (Custom Quote Request)"}
• Selected Cadence: ${timelineLabel}
• Recommended Stack: ${currentTypeConfig.recommendedStack.join(", ")}
• Investment: ${retainerBillingMode === "monthly" ? "$600 USD / month" : "Custom Quote (Inquiry Based)"}
• Scope / Project Notes: ${contactNotes || "N/A"}`
      : `--- INTERACTIVE PROJECT ESTIMATOR SCOPE ---
• Project Category: ${currentTypeConfig.title}
• Desired Timeline: ${timelineLabel}
• Estimated Investment: $${lowEstimate.toLocaleString()} – $${highEstimate.toLocaleString()} USD
• Selected Architecture: ${featureLabels || "Core Baseline"}
• Recommended Stack: ${currentTypeConfig.recommendedStack.join(", ")}
• Scope / Project Notes: ${contactNotes || "N/A"}`;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName.trim(),
          email: contactEmail.trim(),
          company: contactCompany.trim() || undefined,
          phone: contactPhone.trim() || undefined,
          service: isRetainer
            ? retainerBillingMode === "monthly"
              ? "Dedicated Senior Dev Retainer ($600 USD / mo)"
              : "Project-Based Development (Custom Quote Request)"
            : currentTypeConfig.title,
          subject: isRetainer
            ? `Retainer Inquiry: ${retainerBillingMode === "monthly" ? "Monthly ($600/mo)" : "Project Scope (Custom Quote)"}`
            : `Estimate Request: ${currentTypeConfig.title} ($${lowEstimate.toLocaleString()} - $${highEstimate.toLocaleString()})`,
          budget: isRetainer
            ? retainerBillingMode === "monthly"
              ? "$600 USD / month"
              : "Custom Quote (Project-Based)"
            : `$${lowEstimate.toLocaleString()} - $${highEstimate.toLocaleString()} USD`,
          message: summaryDetails,
          sourceUrl: "Interactive Project Estimator (Homepage)",
          website: honeypot.website || contactWebsite.trim() || undefined,
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
    } catch {
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
            <span>Scope & Investment Calculator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0b1a30] tracking-tight">
            Interactive Project Scope Estimator
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            Configure your technical requirements, select add-ons, and get a transparent timeline and budget estimate in 60 seconds.
          </p>
        </div>

        {/* Main Grid: Steps on Left, Live Summary on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Step 1 & 2 Form Controls */}
          <div className="lg:col-span-7 space-y-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xl">
            
            {/* Step 1: Project Type */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                  Step 1 · Choose Engineering Core
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PROJECT_TYPES.map((type) => {
                  const isSelected = selectedType === type.id;
                  return (
                    <div
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-200 relative ${
                        isSelected
                          ? "bg-amber-50/80 border-amber-500 shadow-sm ring-2 ring-amber-500/20"
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
                      <div className="mt-3 flex items-center justify-between text-[11px] font-mono">
                        <span className={isSelected ? "text-amber-700 font-bold" : "text-slate-500"}>
                          {type.id === "fractional_retainer" ? "Rolling Sprints" : `Est. ${type.baseWeeks}`}
                        </span>
                        <span className="font-bold text-slate-900">
                          {type.id === "fractional_retainer" ? "$600 USD / mo" : `From $${type.basePriceUsd.toLocaleString()}`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Key Features OR Developer Skills (Retainer Mode) */}
            {isRetainer ? (
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                      Step 2 · Senior Developer Skills & Competencies
                    </span>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Direct engineering capability included in dedicated retainer partnerships.
                    </p>
                  </div>
                </div>

                {/* Engagement Basis Toggle (Monthly vs Project Base) */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2.5">
                  <span className="text-xs font-black text-amber-950 uppercase tracking-wider block">
                    Select Retainer Engagement Model:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setRetainerBillingMode("monthly")}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        retainerBillingMode === "monthly"
                          ? "bg-slate-900 text-white border-slate-900 shadow-sm ring-2 ring-amber-400/40"
                          : "bg-white text-slate-700 border-amber-200 hover:bg-amber-100/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-xs">Monthly Basis</span>
                        <span className={`text-[11px] font-mono font-bold ${retainerBillingMode === "monthly" ? "text-amber-400" : "text-slate-900"}`}>
                          $600 USD / mo
                        </span>
                      </div>
                      <p className={`text-[11px] mt-1 leading-snug ${retainerBillingMode === "monthly" ? "text-slate-300" : "text-slate-500"}`}>
                        Continuous sprint shipping, daily standups & dedicated weekly capacity.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRetainerBillingMode("project")}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        retainerBillingMode === "project"
                          ? "bg-slate-900 text-white border-slate-900 shadow-sm ring-2 ring-amber-400/40"
                          : "bg-white text-slate-700 border-amber-200 hover:bg-amber-100/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-xs">Project Base</span>
                        <span className={`text-[11px] font-mono font-bold ${retainerBillingMode === "project" ? "text-amber-400" : "text-slate-900"}`}>
                          Custom Quote
                        </span>
                      </div>
                      <p className={`text-[11px] mt-1 leading-snug ${retainerBillingMode === "project" ? "text-slate-300" : "text-slate-500"}`}>
                        Fixed scope deliverable with milestone review. Submit inquiry below.
                      </p>
                    </button>
                  </div>
                </div>

                {/* Developer Skills Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {DEVELOPER_SKILLS_CATEGORIES.map((cat, idx) => {
                    const IconComp = cat.icon;
                    return (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2"
                      >
                        <div className="flex items-center gap-2 text-xs font-black text-slate-900">
                          <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                            <IconComp className="h-3.5 w-3.5" />
                          </div>
                          <span>{cat.title}</span>
                        </div>
                        <ul className="space-y-1.5 pl-1">
                          {cat.skills.map((skill, sIdx) => (
                            <li
                              key={sIdx}
                              className="text-[11px] text-slate-600 flex items-start gap-1.5 leading-snug"
                            >
                              <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{skill}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                    Step 2 · Select Included Architecture & Capabilities
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {selectedFeatures.length} selected
                  </span>
                </div>

                {/* Design Fee Disclaimer Notice */}
                <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/90 flex items-start gap-2.5 text-xs text-amber-950">
                  <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    <strong className="font-bold">Important Notice:</strong> Custom UI/UX Design is a specialized external fee ($720). Core software engineering does not include Figma mockups unless selected or provided by your design team.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {FEATURE_OPTIONS.map((feat) => {
                    const isChecked = selectedFeatures.includes(feat.id);
                    return (
                      <div
                        key={feat.id}
                        onClick={() => toggleFeature(feat.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isChecked
                            ? "bg-amber-50/60 border-amber-400 text-[#0b1a30]"
                            : "bg-slate-50 hover:bg-slate-100/60 border-slate-200 text-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 pr-2">
                          <span className="text-xs font-extrabold leading-snug">{feat.label}</span>
                          {feat.badge && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-mono font-bold shrink-0">
                              {feat.badge}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2.5 shrink-0">
                          <span className="text-xs font-mono font-bold text-slate-900">
                            +${feat.price}
                          </span>
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                              isChecked
                                ? "bg-[#0b1a30] border-[#0b1a30] text-amber-400"
                                : "bg-white border-slate-300"
                            }`}
                          >
                            {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Timeline & Cadence */}
            {isRetainer ? (
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                  Step 3 · Retainer Sprint Cadence
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: "rolling", label: "🔄 Sprint-by-Sprint", desc: "Rolling monthly flexibility without lock-in" },
                    { id: "quarterly", label: "🎯 Quarterly Strategic", desc: "3-month planned sprint roadmap & feature focus" },
                    { id: "longterm", label: "🛡️ Half-Year Retainer", desc: "Dedicated engineering capacity & high-priority SLA" },
                  ].map((cadence, cIdx) => (
                    <div
                      key={cIdx}
                      className="p-3 rounded-xl border bg-slate-50 border-slate-200 text-left"
                    >
                      <span className="text-xs font-black block text-[#0b1a30]">
                        {cadence.label}
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        {cadence.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
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
            )}

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

            {/* Calculated Investment & Delivery Time */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800/80 pb-2">
                  <span>Calculated Project Scope:</span>
                  <span className="text-amber-400 font-bold">
                    {isRetainer
                      ? retainerBillingMode === "monthly"
                        ? "Monthly Retainer"
                        : "Project Scope"
                      : currentTypeConfig.title.split(" ")[0]}
                  </span>
                </div>

                <div>
                  <div className="text-xs text-slate-400 font-mono uppercase">
                    {isRetainer
                      ? retainerBillingMode === "monthly"
                        ? "Monthly Retainer Investment"
                        : "Engagement Basis"
                      : "Estimated Investment Range"}
                  </div>
                  <div className="text-3xl font-extrabold text-white tracking-tight font-mono mt-1">
                    {isRetainer ? (
                      retainerBillingMode === "monthly" ? (
                        <>
                          $600 <span className="text-xs font-normal text-slate-400">USD / month</span>
                        </>
                      ) : (
                        <>
                          Custom Quote <span className="text-xs font-normal text-slate-400">(Inquiry Based)</span>
                        </>
                      )
                    ) : (
                      <>
                        ${lowEstimate.toLocaleString()} – ${highEstimate.toLocaleString()}{" "}
                        <span className="text-xs font-normal text-slate-400">USD</span>
                      </>
                    )}
                  </div>
                  {isRetainer && retainerBillingMode === "project" && (
                    <p className="text-[11px] text-slate-400 mt-1 font-sans">
                      Submit your project specifications below to receive an itemized proposal and timeline.
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-slate-300 pt-2 border-t border-slate-800/80">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Target Delivery:</span>
                  </span>
                  <span className="font-bold text-white">
                    {isRetainer
                      ? retainerBillingMode === "monthly"
                        ? "Rolling Monthly Sprints"
                        : "Milestone-Based Timeline"
                      : currentTypeConfig.baseWeeks}
                  </span>
                </div>
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
                <Zap className="w-3.5 h-3.5" />
                {isRetainer
                  ? retainerBillingMode === "monthly"
                    ? "Lock In Dedicated Retainer ($600 USD / mo)"
                    : "Submit Project Scope for Custom Quote"
                  : "Lock In Your Proposal & Call"}
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <input
                      type="tel"
                      placeholder="Phone Number (Optional)"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-medium"
                    />
                  </div>
                  <div>
                    <input
                      type="url"
                      placeholder="Website / Repo URL (Optional)"
                      value={contactWebsite}
                      onChange={(e) => setContactWebsite(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <textarea
                    rows={2}
                    placeholder={
                      isRetainer
                        ? retainerBillingMode === "project"
                          ? "Describe your project scope, features, deliverables, and timeline requirements..."
                          : "Describe your weekly/monthly backlog, preferred stack, or onboarding schedule (optional)..."
                        : "Project details or special requirements (optional)..."
                    }
                    value={contactNotes}
                    onChange={(e) => setContactNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-medium"
                  />
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
                      <span>
                        {isRetainer
                          ? retainerBillingMode === "monthly"
                            ? "Request $600/mo Retainer Onboarding"
                            : "Submit Project Scope Inquiry"
                          : "Get Itemized Proposal & Scope"}
                      </span>
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
