"use client";

import React, { useState } from "react";
import { ContactModal } from "@/components/ui/contact-modal";
import { SplitText } from "@/components/ui/split-text";

const MODELS = [
  {
    tag: "A — Project",
    title: "Fixed-scope build",
    service: "Fixed-Scope Project Sprint",
    cta: "Scope your project",
    featured: false,
    points: [
      "Fixed upfront pricing & clear delivery timeline",
      "Full architecture design, UI integration & QA",
      "98+ Core Web Vitals performance guarantee",
      "30 days post-launch warranty & bug-free handover",
    ],
  },
  {
    tag: "B — Retainer",
    title: "Fractional developer",
    service: "Fractional Senior Engineer Retainer",
    cta: "Hire fractional dev",
    featured: true,
    points: [
      "Direct Slack / Teams access & daily standups",
      "Full UK (GMT), US & Australian (AEST) timezone overlap",
      "Continuous PR reviews, CI/CD, and fast shipping",
      "No recruitment fees, payroll taxes, or agency bloat",
    ],
  },
  {
    tag: "C — Audit",
    title: "Speed & security audit",
    service: "Codebase Rescue & Speed Audit",
    cta: "Request speed audit",
    featured: false,
    points: [
      "Comprehensive Core Web Vitals bottleneck audit",
      "Database query optimization & asset minification",
      "Security patches & plugin bloat cleanup",
      "Detailed before/after speed benchmarking report",
    ],
  },
];

export function EngagementModels() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  const handleSelectPackage = (packageName: string) => {
    setSelectedService(packageName);
    setIsModalOpen(true);
  };

  return (
    <section id="services" className="px-4 sm:px-6 lg:px-10 pb-24 lg:pb-40">
      <div className="mx-auto max-w-[1360px] flex flex-col gap-16">
        <div className="motion-reveal flex flex-wrap items-end justify-between gap-8">
          <div className="flex flex-col gap-5">
            <p className="m-0 font-mono text-[13px] tracking-[0.08em] uppercase text-brand-slate">(04) — Ways to work together</p>
            <h2 data-inview className="m-0 font-extrabold tracking-[-0.05em] leading-[0.95] text-brand-navy text-[clamp(44px,6.4vw,104px)]">
              <SplitText lines={["Pick your", "engagement."]} />
            </h2>
          </div>
          <p className="m-0 max-w-[420px] text-brand-slate text-[17px] leading-relaxed">
            Fixed-scope builds, an embedded fractional engineer, or a focused speed audit. No recruitment fees, payroll
            taxes or agency bloat.
          </p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5">
          {MODELS.map((model) => (
            <div
              key={model.service}
              className={`motion-lift motion-reveal rounded-[28px] p-9 flex flex-col gap-7 ${
                model.featured ? "bg-brand-ink text-white" : "bg-white border border-brand-border text-brand-navy"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className={`font-mono text-[13px] ${model.featured ? "text-slate-400" : "text-brand-slate"}`}>{model.tag}</span>
                {model.featured && (
                  <span className="font-mono text-[11px] tracking-[0.08em] uppercase px-2.5 py-1.5 rounded-full bg-amber-500 text-brand-ink">
                    Most popular
                  </span>
                )}
              </div>
              <h3 className="m-0 text-[32px] font-extrabold tracking-[-0.03em] leading-[1.05]">{model.title}</h3>
              <ul className={`m-0 p-0 list-none flex flex-col gap-3.5 text-base leading-normal ${model.featured ? "text-slate-300" : "text-slate-700"}`}>
                {model.points.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span aria-hidden="true" className={model.featured ? "text-amber-500" : "text-brand-navy"}>—</span>
                    {point}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => handleSelectPackage(model.service)}
                className={`motion-btn motion-magnetic mt-auto inline-flex items-center justify-between min-h-[56px] px-6 rounded-full font-bold cursor-pointer ${
                  model.featured
                    ? "bg-amber-500 hover:bg-amber-400 text-brand-ink"
                    : model.tag.startsWith("A")
                      ? "bg-brand-navy hover:bg-brand-ink text-white"
                      : "border border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white"
                }`}
              >
                {model.cta} <span className="motion-arrow" aria-hidden="true">→</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultService={selectedService}
      />
    </section>
  );
}
