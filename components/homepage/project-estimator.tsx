"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Loader2,
  Code2,
  Layers,
  Clock,
  Zap,
  Server,
  AlertCircle,
  Cpu,
  Package,
} from "lucide-react";
import { SplitText } from "@/components/ui/split-text";

// Starting monthly price of the dedicated senior developer retainer (USD).
const MONTHLY_RETAINER_USD = 800;
const MONTHLY_RETAINER_LABEL = `from $${MONTHLY_RETAINER_USD} USD`;

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
    id: "fractional_retainer",
    title: "Dedicated Senior Dev Retainer",
    desc: "Continuous sprint shipping, daily standups, codebase maintenance, and feature iteration sprints.",
    baseWeeks: "Monthly Ongoing",
    basePriceUsd: MONTHLY_RETAINER_USD,
    recommendedStack: ["React 19 / Next.js", "WordPress Gutenberg", "TypeScript / Node", "Prisma / SQL"],
  },
  {
    id: "nextjs_app",
    title: "Next.js / React Web App",
    desc: "Scalable SaaS platform, client portal, or custom web platform with sub-second performance.",
    baseWeeks: "3–6 weeks",
    basePriceUsd: 1800,
    recommendedStack: ["Next.js 15", "React 19", "TypeScript", "TailwindCSS", "PostgreSQL"],
  },
  {
    id: "wordpress_engine",
    title: "Custom WordPress & Gutenberg",
    desc: "Bespoke high-speed theme, headless setup, or custom Gutenberg block plugins without page builder bloat.",
    baseWeeks: "2–4 weeks",
    basePriceUsd: 1120,
    recommendedStack: ["WordPress 6.7+", "Native Gutenberg", "PHP 8.3", "React Block Editor", "MySQL"],
  },
  {
    id: "ai_integration",
    title: "AI / Workflow Automation",
    desc: "LLM copilot, RAG knowledge system, OpenAI/Gemini integration, or automated CRM workflows.",
    baseWeeks: "2–3 weeks",
    basePriceUsd: 1280,
    recommendedStack: ["LangChain", "Gemini / OpenAI API", "Vector DB", "Next.js API", "Node.js"],
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

export interface FeaturePackage {
  id: string;
  name: string;
  badge?: string;
  desc: string;
  features: string[];
}

export const FEATURE_PACKAGES: FeaturePackage[] = [
  {
    id: "lead_gen",
    name: "🎯 Inbound Leads Suite",
    badge: "Popular",
    desc: "Leads CRM (Free), Gutenberg Blocks (Free), SEO & Email Drip Campaigns",
    features: ["crm", "custom_blocks", "seo", "email_followup"],
  },
  {
    id: "saas_portal",
    name: "🚀 SaaS & Client Portal",
    badge: "Recommended",
    desc: "Client Portal & SSO (Free), Leads CRM (Free), Stripe Billing & Telemetry",
    features: ["auth_portal", "crm", "stripe_billing", "monitoring", "seo"],
  },
  {
    id: "free_bundle",
    name: "⚡ Free Inclusions Pack",
    badge: "$0 Cost",
    desc: "Leads CRM, Gutenberg Block Suite & Client Portal included at $0",
    features: ["crm", "custom_blocks", "auth_portal"],
  },
  {
    id: "all_inclusive",
    name: "⭐ Full Enterprise Stack",
    badge: "All Add-ons",
    desc: "Complete feature set including UI/UX design mockup fee & all tools",
    features: [
      "ui_ux_design",
      "seo",
      "crm",
      "email_followup",
      "custom_blocks",
      "auth_portal",
      "stripe_billing",
      "monitoring",
    ],
  },
];

const FEATURE_OPTIONS = [
  {
    id: "ui_ux_design",
    label: "Bespoke UI/UX Design Fee (Full Figma mockups & wireframes — required if design not provided)",
    price: 360,
    badge: "Design Fee",
  },
  {
    id: "seo",
    label: "Technical SEO & Rich Schema LD Engine (Automated JSON-LD, sitemaps & search indexing)",
    price: 240,
  },
  {
    id: "crm",
    label: "Inbound Leads CRM & Sales Pipeline (Real-time capture, instant email alerts & Kanban)",
    price: 0,
    badge: "FREE",
  },
  {
    id: "email_followup",
    label: "Automated Email Follow-Up & Drip Campaigns (Multi-step lead nurture funnels)",
    price: 210,
  },
  {
    id: "custom_blocks",
    label: "Bespoke React Gutenberg Block Suite",
    price: 0,
    badge: "FREE",
  },
  {
    id: "auth_portal",
    label: "Client Portal & 1-Click SSO Authentication",
    price: 0,
    badge: "FREE",
  },
  {
    id: "stripe_billing",
    label: "Stripe Payments, Invoices & Subscriptions",
    price: 360,
  },
  {
    id: "monitoring",
    label: "24/7 Production Telemetry, Health Checks & Error Monitoring",
    price: 160,
  },
];

const TIMELINE_OPTIONS = [
  { id: "urgent", label: "⚡ Fast Sprint (2–3 Weeks)", multiplier: 1.15, desc: "Priority queue for immediate launch" },
  { id: "standard", label: "🚀 Standard Build (4–6 Weeks)", multiplier: 1.0, desc: "Comprehensive phased production delivery" },
  { id: "retainer", label: "🔄 Monthly Partnership", multiplier: 1.0, desc: "Ongoing sprint capacity & dedicated hours" },
];

const StepHeading = ({ n, title, note }: { n: string; title: string; note?: string }) => (
  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
    <h3 className="m-0 flex items-baseline gap-3 text-xl sm:text-2xl font-extrabold tracking-[-0.02em] text-brand-navy">
      <span className="font-mono text-[13px] font-normal text-brand-slate">{n}</span>
      {title}
    </h3>
    {note && <span className="text-sm text-brand-slate">{note}</span>}
  </div>
);

export function ProjectEstimator() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string>("fractional_retainer");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    "ui_ux_design",
    "seo",
    "crm",
    "email_followup",
    "custom_blocks",
    "auth_portal",
    "monitoring",
  ]);
  const [activePackageId, setActivePackageId] = useState<string | null>("all_inclusive");
  const [selectedTimeline, setSelectedTimeline] = useState<string>("standard");
  const [retainerBillingMode, setRetainerBillingMode] = useState<"monthly" | "project">("monthly");
  // Progressive disclosure keeps the default view light.
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [showSkills, setShowSkills] = useState(false);
  const [showForm, setShowForm] = useState(false);

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

  const applyPackage = (pkg: FeaturePackage) => {
    setSelectedFeatures(pkg.features);
    setActivePackageId(pkg.id);
  };

  const toggleFeature = (id: string) => {
    setActivePackageId(null);
    setSelectedFeatures((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const freeFeaturesCount = selectedFeatures.filter(
    (featId) => FEATURE_OPTIONS.find((f) => f.id === featId)?.price === 0
  ).length;

  // Calculate estimated investment
  const featureCost = selectedFeatures.reduce((acc, featId) => {
    const feat = FEATURE_OPTIONS.find((f) => f.id === featId);
    return acc + (feat ? feat.price : 0);
  }, 0);

  const baseCalculated = isRetainer
    ? retainerBillingMode === "monthly"
      ? MONTHLY_RETAINER_USD
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
      .map((f) => {
        const feat = FEATURE_OPTIONS.find((opt) => opt.id === f);
        if (!feat) return null;
        return feat.price === 0 ? `${feat.label} [FREE]` : feat.label;
      })
      .filter(Boolean)
      .join(", ");

    const timelineLabel =
      TIMELINE_OPTIONS.find((t) => t.id === selectedTimeline)?.label || selectedTimeline;

    const summaryDetails = isRetainer
      ? `--- DEDICATED SENIOR DEV RETAINER INQUIRY ---
• Engagement Basis: ${retainerBillingMode === "monthly" ? `Monthly Dedicated Retainer (${MONTHLY_RETAINER_LABEL} / month)` : "Project-Based Scope (Custom Quote Request)"}
• Selected Cadence: ${timelineLabel}
• Recommended Stack: ${currentTypeConfig.recommendedStack.join(", ")}
• Investment: ${retainerBillingMode === "monthly" ? `From $${MONTHLY_RETAINER_USD} USD / month` : "Custom Quote (Inquiry Based)"}
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
              ? `Dedicated Senior Dev Retainer (${MONTHLY_RETAINER_LABEL} / mo)`
              : "Project-Based Development (Custom Quote Request)"
            : currentTypeConfig.title,
          subject: isRetainer
            ? `Retainer Inquiry: ${retainerBillingMode === "monthly" ? `Monthly (from $${MONTHLY_RETAINER_USD}/mo)` : "Project Scope (Custom Quote)"}`
            : `Estimate Request: ${currentTypeConfig.title} ($${lowEstimate.toLocaleString()} - $${highEstimate.toLocaleString()})`,
          budget: isRetainer
            ? retainerBillingMode === "monthly"
              ? `From $${MONTHLY_RETAINER_USD} USD / month`
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

  const optionClass = (selected: boolean) =>
    `motion-btn w-full text-left rounded-2xl border p-5 cursor-pointer transition-colors ${
      selected
        ? "bg-brand-ink text-white border-brand-ink"
        : "bg-white text-brand-navy border-brand-border hover:border-brand-navy/40"
    }`;

  const inputClass =
    "w-full min-h-[48px] px-4 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:bg-white/[0.06] text-sm transition-colors";

  const priceKey = isRetainer ? `r-${retainerBillingMode}` : `${lowEstimate}-${highEstimate}`;

  return (
    <section className="relative px-4 sm:px-6 lg:px-10 pb-24 lg:pb-40">
      <div className="mx-auto max-w-[1360px] flex flex-col gap-14 lg:gap-16">
        {/* Section Header */}
        <div className="motion-reveal flex flex-wrap items-end justify-between gap-8">
          <div className="flex flex-col gap-5">
            <p className="m-0 font-mono text-[13px] tracking-[0.08em] uppercase text-brand-slate">
              (04) — Scope &amp; investment calculator
            </p>
            <h2 data-inview className="m-0 font-extrabold tracking-[-0.05em] leading-[0.95] text-brand-navy text-[clamp(44px,6.4vw,104px)]">
              <SplitText lines={["Price your", "project."]} />
            </h2>
          </div>
          <p className="m-0 max-w-[420px] text-brand-slate text-[17px] leading-relaxed">
            Configure your technical requirements, select add-ons, and get a transparent timeline and budget estimate in
            60 seconds.
          </p>
        </div>

        {/* Main Grid: Steps on Left, Live Summary on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Step 1 & 2 Form Controls */}
          <div className="lg:col-span-7 bg-white rounded-[28px] border border-brand-border p-6 sm:p-10 flex flex-col gap-12">

            {/* Step 1: Project Type */}
            <div className="flex flex-col gap-5">
              <StepHeading n="01" title="Engineering core" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PROJECT_TYPES.map((type) => {
                  const isSelected = selectedType === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setSelectedType(type.id)}
                      className={`${optionClass(isSelected)} flex flex-col gap-3`}
                    >
                      <span className="flex items-start justify-between gap-3">
                        <span className="text-base font-extrabold leading-snug">{type.title}</span>
                        <span
                          aria-hidden="true"
                          className={`mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? "border-amber-400" : "border-slate-300"
                          }`}
                        >
                          {isSelected && <span className="h-2 w-2 rounded-full bg-amber-400" />}
                        </span>
                      </span>
                      <span className={`hidden sm:block text-sm leading-relaxed ${isSelected ? "text-slate-300" : "text-brand-slate"}`}>
                        {type.desc}
                      </span>
                      <span className={`mt-auto pt-3 border-t flex items-center justify-between font-mono text-xs ${isSelected ? "border-white/10" : "border-brand-border"}`}>
                        <span className={isSelected ? "text-amber-400" : "text-brand-slate"}>
                          {type.id === "fractional_retainer" ? "Rolling sprints" : `Est. ${type.baseWeeks}`}
                        </span>
                        <span className="font-medium">
                          {type.id === "fractional_retainer" ? `From $${MONTHLY_RETAINER_USD} / mo` : `From $${type.basePriceUsd.toLocaleString()}`}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Key Features OR Developer Skills (Retainer Mode) */}
            {isRetainer ? (
              <div className="flex flex-col gap-5">
                <StepHeading
                  n="02"
                  title="Senior developer skills"
                  note="Included in dedicated retainer partnerships"
                />

                {/* Engagement Basis Toggle (Monthly vs Project Base) */}
                <div className="flex flex-col gap-3">
                  <span className="font-mono text-xs uppercase tracking-[0.08em] text-brand-slate">Retainer engagement model</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {([
                      { id: "monthly", title: "Monthly basis", price: `From $${MONTHLY_RETAINER_USD} / mo`, desc: "Continuous sprint shipping, daily standups & dedicated weekly capacity." },
                      { id: "project", title: "Project base", price: "Custom quote", desc: "Fixed scope deliverable with milestone review. Submit inquiry below." },
                    ] as const).map((mode) => {
                      const isSelected = retainerBillingMode === mode.id;
                      return (
                        <button
                          key={mode.id}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => setRetainerBillingMode(mode.id)}
                          className={`${optionClass(isSelected)} flex flex-col gap-2`}
                        >
                          <span className="flex items-center justify-between gap-3">
                            <span className="font-extrabold">{mode.title}</span>
                            <span className={`font-mono text-xs ${isSelected ? "text-amber-400" : "text-brand-navy"}`}>{mode.price}</span>
                          </span>
                          <span className={`text-sm leading-relaxed ${isSelected ? "text-slate-300" : "text-brand-slate"}`}>{mode.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Developer skills: category chips, details on demand */}
                <div className="flex flex-col gap-3">
                  <ul className="m-0 p-0 list-none flex flex-wrap gap-2">
                    {DEVELOPER_SKILLS_CATEGORIES.map((cat) => {
                      const IconComp = cat.icon;
                      return (
                        <li key={cat.title} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-brand-border bg-brand-bg text-sm font-semibold text-brand-navy">
                          <IconComp className="h-3.5 w-3.5 text-amber-700" aria-hidden="true" />
                          {cat.title}
                        </li>
                      );
                    })}
                  </ul>
                  <button
                    type="button"
                    aria-expanded={showSkills}
                    onClick={() => setShowSkills((v) => !v)}
                    className="self-start inline-flex items-center gap-2 min-h-[44px] text-sm font-semibold text-brand-navy motion-underline cursor-pointer"
                  >
                    {showSkills ? "Hide skill details" : "See every skill included"}
                    <span aria-hidden="true" className={`transition-transform duration-300 ${showSkills ? "rotate-180" : ""}`}>↓</span>
                  </button>
                  {showSkills && (
                    <div className="motion-fade grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 pt-2">
                      {DEVELOPER_SKILLS_CATEGORIES.map((cat) => (
                        <div key={cat.title} className="flex flex-col gap-2">
                          <span className="font-mono text-xs uppercase tracking-[0.08em] text-brand-slate">{cat.title}</span>
                          <ul className="m-0 p-0 list-none flex flex-col gap-1.5">
                            {cat.skills.map((skill) => (
                              <li key={skill} className="flex items-start gap-2.5 text-sm text-brand-slate leading-snug">
                                <span aria-hidden="true" className="text-brand-navy">—</span>
                                <span>{skill}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                <StepHeading
                  n="02"
                  title="Architecture & capabilities"
                  note={`${selectedFeatures.length} selected · ${freeFeaturesCount} free inclusion${freeFeaturesCount === 1 ? "" : "s"}`}
                />

                {/* Quick Package Presets */}
                <div className="flex flex-col gap-3">
                  <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-brand-slate">
                    <Package className="w-3.5 h-3.5" aria-hidden="true" />
                    Curated packages — click to apply
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {FEATURE_PACKAGES.map((pkg) => {
                      const isPkgActive =
                        activePackageId === pkg.id ||
                        (pkg.features.length === selectedFeatures.length &&
                          pkg.features.every((f) => selectedFeatures.includes(f)));
                      return (
                        <button
                          key={pkg.id}
                          type="button"
                          aria-pressed={isPkgActive}
                          onClick={() => applyPackage(pkg)}
                          className={`motion-btn rounded-xl border p-3.5 text-left cursor-pointer flex flex-col justify-between gap-2 transition-colors ${
                            isPkgActive
                              ? "bg-amber-500 border-amber-500 text-brand-ink"
                              : "bg-white border-brand-border text-brand-navy hover:border-brand-navy/40"
                          }`}
                        >
                          <span className="text-sm font-extrabold leading-tight">{pkg.name}</span>
                          <span className={`text-xs leading-snug line-clamp-2 ${isPkgActive ? "text-brand-ink/80" : "text-brand-slate"}`}>
                            {pkg.desc}
                          </span>
                          {pkg.badge && (
                            <span className={`self-start font-mono text-[11px] px-1.5 py-0.5 rounded ${isPkgActive ? "bg-brand-ink/10" : "bg-brand-bg text-brand-slate"}`}>
                              {pkg.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  aria-expanded={showAllFeatures}
                  onClick={() => setShowAllFeatures((v) => !v)}
                  className="w-full min-h-[56px] px-5 rounded-2xl border border-brand-border hover:border-brand-navy/40 flex items-center justify-between gap-4 text-left cursor-pointer transition-colors"
                >
                  <span className="flex flex-col">
                    <span className="font-semibold text-brand-navy">Customize individual features</span>
                    <span className="text-sm text-brand-slate">
                      {selectedFeatures.length} of {FEATURE_OPTIONS.length} selected · {freeFeaturesCount} free
                    </span>
                  </span>
                  <span aria-hidden="true" className={`text-brand-navy transition-transform duration-300 ${showAllFeatures ? "rotate-180" : ""}`}>↓</span>
                </button>

                {showAllFeatures && (
                  <div className="motion-fade flex flex-col gap-5">
                    {/* Design Fee Disclaimer Notice */}
                    <div className="rounded-2xl bg-brand-cream p-4 flex items-start gap-3 text-sm text-brand-navy">
                      <AlertCircle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
                      <p className="m-0 leading-relaxed">
                        <strong className="font-bold">Important notice:</strong> Custom UI/UX Design is a specialized external
                        fee ($360). Core software engineering does not include Figma mockups unless selected or provided by your
                        design team.
                      </p>
                    </div>

                    <ul className="m-0 p-0 list-none flex flex-col border-t border-brand-border">
                      {FEATURE_OPTIONS.map((feat) => {
                        const isChecked = selectedFeatures.includes(feat.id);
                        const isFree = feat.price === 0;
                        return (
                          <li key={feat.id} className="border-b border-brand-border">
                            <button
                              type="button"
                              role="checkbox"
                              aria-checked={isChecked}
                              onClick={() => toggleFeature(feat.id)}
                              className="group w-full min-h-[56px] py-3 flex items-center justify-between gap-4 text-left cursor-pointer"
                            >
                              <span className="flex items-center gap-3.5">
                                <span
                                  aria-hidden="true"
                                  className={`h-5 w-5 shrink-0 rounded-md border-2 flex items-center justify-center transition-colors ${
                                    isChecked ? "bg-brand-ink border-brand-ink text-amber-400" : "border-slate-300 group-hover:border-brand-navy/50"
                                  }`}
                                >
                                  {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                                </span>
                                <span className={`text-[15px] font-semibold leading-snug ${isChecked ? "text-brand-navy" : "text-brand-slate"}`}>
                                  {feat.label}
                                </span>
                                {feat.badge && (
                                  <span
                                    className={`hidden sm:inline font-mono text-[11px] px-2 py-0.5 rounded-full shrink-0 ${
                                      feat.badge === "Design Fee" ? "bg-amber-100 text-amber-900" : "bg-emerald-100 text-emerald-800"
                                    }`}
                                  >
                                    {feat.badge}
                                  </span>
                                )}
                              </span>
                              <span className={`font-mono text-sm shrink-0 ${isFree ? "text-emerald-700" : "text-brand-navy"}`}>
                                {isFree ? "Free" : `+$${feat.price}`}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Timeline & Cadence */}
            {isRetainer ? (
              <div className="flex flex-col gap-5">
                <StepHeading n="03" title="Sprint cadence" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: "rolling", label: "Sprint-by-sprint", desc: "Rolling monthly flexibility without lock-in" },
                    { id: "quarterly", label: "Quarterly strategic", desc: "3-month planned sprint roadmap & feature focus" },
                    { id: "longterm", label: "Half-year retainer", desc: "Dedicated engineering capacity & high-priority SLA" },
                  ].map((cadence) => (
                    <div key={cadence.id} className="rounded-2xl border border-brand-border bg-brand-bg p-4 flex flex-col gap-1">
                      <span className="font-extrabold text-brand-navy">{cadence.label}</span>
                      <span className="text-sm text-brand-slate leading-snug">{cadence.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                <StepHeading n="03" title="Timeline & urgency" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {TIMELINE_OPTIONS.map((time) => {
                    const isSelected = selectedTimeline === time.id;
                    return (
                      <button
                        key={time.id}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => setSelectedTimeline(time.id)}
                        className={`${optionClass(isSelected)} flex flex-col gap-1 !p-4`}
                      >
                        <span className="font-extrabold">{time.label}</span>
                        <span className={`text-sm leading-snug ${isSelected ? "text-slate-300" : "text-brand-slate"}`}>{time.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Live Calculated Estimate & Proposal Request */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 bg-brand-ink text-white rounded-[28px] p-6 sm:p-10 flex flex-col gap-8">
            <div className="flex items-center justify-between gap-4">
              <h3 className="m-0 text-lg font-extrabold tracking-[-0.01em]">Scope summary</h3>
              <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-emerald-400">
                <span className="motion-pulse h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
                Direct senior dev
              </span>
            </div>

            {/* Calculated Investment & Delivery Time */}
            <div className="flex flex-col gap-5 border-y border-white/10 py-7">
              <span className="font-mono text-xs uppercase tracking-[0.08em] text-slate-400">
                {isRetainer
                  ? retainerBillingMode === "monthly"
                    ? "Monthly retainer"
                    : "Project-based retainer"
                  : `Estimated investment · ${currentTypeConfig.title}`}
              </span>

              <div key={priceKey} className="motion-fade" aria-live="polite">
                <div className="font-extrabold tracking-[-0.04em] leading-none text-[clamp(34px,3vw,46px)]">
                  {isRetainer ? (
                    retainerBillingMode === "monthly" ? (
                      <>
                        <span className="block mb-2 font-mono text-xs font-normal tracking-[0.08em] uppercase text-amber-400">Starts at</span>
                        ${MONTHLY_RETAINER_USD} <span className="text-sm font-medium tracking-normal text-slate-400">USD / month</span>
                      </>
                    ) : (
                      <>Custom quote</>
                    )
                  ) : (
                    <>
                      ${lowEstimate.toLocaleString()}
                      <span className="text-slate-500"> – </span>${highEstimate.toLocaleString()}
                      <span className="text-sm font-medium tracking-normal text-slate-400"> USD</span>
                    </>
                  )}
                </div>
                {isRetainer && retainerBillingMode === "project" && (
                  <p className="m-0 mt-3 text-sm text-slate-400">
                    Share your project specifications to receive an itemized proposal and timeline.
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-400">
                  <Clock className="w-4 h-4 text-amber-400" aria-hidden="true" />
                  Target delivery
                </span>
                <span className="font-semibold">
                  {isRetainer
                    ? retainerBillingMode === "monthly"
                      ? "Rolling monthly sprints"
                      : "Milestone-based timeline"
                    : currentTypeConfig.baseWeeks}
                </span>
              </div>
            </div>

            {/* Recommended Stack */}
            <div className="flex flex-col gap-3">
              <span className="font-mono text-xs uppercase tracking-[0.08em] text-slate-400">Recommended stack</span>
              <ul className="m-0 p-0 list-none flex flex-wrap gap-2">
                {currentTypeConfig.recommendedStack.map((tech, i) => (
                  <li key={i} className="font-mono text-xs px-3 py-1.5 rounded-full border border-white/15 text-slate-200">
                    {tech}
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Highlights */}
            <ul className="m-0 p-0 list-none flex flex-col gap-2.5 text-sm text-slate-300">
              {!isRetainer && freeFeaturesCount > 0 && (
                <li className="flex gap-3 text-emerald-400 font-semibold">
                  <span aria-hidden="true">—</span>
                  {freeFeaturesCount} free premium add-on{freeFeaturesCount > 1 ? "s" : ""} included ($0)
                </li>
              )}
              <li className="flex gap-3"><span aria-hidden="true" className="text-amber-500">—</span>Full UK (GMT), US &amp; Australian (AEST) timezone overlap</li>
              <li className="flex gap-3"><span aria-hidden="true" className="text-amber-500">—</span>40–50% cost savings vs UK / US / AU agency bloat</li>
              <li className="flex gap-3"><span aria-hidden="true" className="text-amber-500">—</span>100% direct senior code quality &amp; daily comms</li>
            </ul>

            {/* Request Formal Proposal: one CTA, form revealed on demand */}
            {!showForm ? (
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="motion-btn motion-magnetic w-full min-h-[60px] px-7 rounded-full bg-amber-500 hover:bg-amber-400 text-brand-ink font-bold flex items-center justify-between gap-3 cursor-pointer"
              >
                {isRetainer
                  ? retainerBillingMode === "monthly"
                    ? "Start retainer onboarding"
                    : "Request a custom quote"
                  : "Get my itemized proposal"}
                <span className="motion-arrow" aria-hidden="true">→</span>
              </button>
            ) : (
            <div className="motion-fade flex flex-col gap-4 pt-8 border-t border-white/10">
              <h4 className="m-0 text-base font-extrabold">
                {isRetainer
                  ? retainerBillingMode === "monthly"
                    ? `Lock in a dedicated retainer (from $${MONTHLY_RETAINER_USD} USD / mo)`
                    : "Submit your project scope for a custom quote"
                  : "Lock in your proposal & call"}
              </h4>

              {errorMsg && (
                <div role="alert" className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-sm font-semibold">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmitEstimate} className="flex flex-col gap-2.5">
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

                <input
                  type="text"
                  required
                  aria-label="Your full name"
                  placeholder="Your full name *"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className={inputClass}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="email"
                    required
                    aria-label="Work email address"
                    placeholder="Work email *"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className={inputClass}
                  />
                  <input
                    type="text"
                    aria-label="Company (optional)"
                    placeholder="Company (optional)"
                    value={contactCompany}
                    onChange={(e) => setContactCompany(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="tel"
                    aria-label="Phone number (optional)"
                    placeholder="Phone (optional)"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className={inputClass}
                  />
                  <input
                    type="url"
                    aria-label="Website or repo URL (optional)"
                    placeholder="Website / repo URL (optional)"
                    value={contactWebsite}
                    onChange={(e) => setContactWebsite(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <textarea
                  rows={3}
                  aria-label="Project details"
                  placeholder={
                    isRetainer
                      ? retainerBillingMode === "project"
                        ? "Describe your project scope, features, deliverables, and timeline requirements..."
                        : "Describe your weekly/monthly backlog, preferred stack, or onboarding schedule (optional)..."
                      : "Project details or special requirements (optional)..."
                  }
                  value={contactNotes}
                  onChange={(e) => setContactNotes(e.target.value)}
                  className={`${inputClass} py-3`}
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className="motion-btn mt-2 w-full min-h-[56px] px-6 rounded-full bg-amber-500 hover:bg-amber-400 text-brand-ink font-bold flex items-center justify-between gap-3 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                      Submitting estimate request...
                    </span>
                  ) : (
                    <>
                      <span>
                        {isRetainer
                          ? retainerBillingMode === "monthly"
                            ? `Request retainer onboarding (from $${MONTHLY_RETAINER_USD}/mo)`
                            : "Submit project scope inquiry"
                          : "Get itemized proposal & scope"}
                      </span>
                      <span className="motion-arrow" aria-hidden="true">→</span>
                    </>
                  )}
                </button>
                <span className="text-xs text-slate-400 text-center">
                  Direct senior response within 24h · Zero spam · Strict NDA
                </span>
              </form>
            </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
