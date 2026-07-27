"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  ShieldCheck,
  Star,
  CheckCircle2,
  Zap,
  ArrowRight,
  Quote,
  ChevronLeft,
  ChevronRight,
  Code2,
  Layers,
  Cpu,
  Coins,
  Building2,
  Sparkles,
} from "lucide-react";
import { ContactModal } from "@/components/ui/contact-modal";
import { LandingPageAiAssistant } from "@/components/ui/landing-page-ai-assistant";

import { PortfolioCard, PortfolioProject } from "@/components/ui/portfolio-card";

const DEFAULT_REACT_PROJECTS: PortfolioProject[] = [
  {
    id: 2,
    sitename: "MacManus Asset Finance Portal",
    permalink: "macmanus-portal",
    url: "macmanusfd.finance",
    image: "macmanus-portal.png",
    description:
      "Enterprise asset finance platform built for a regulated UK lender — end-to-end CRM lead pipeline, funder product directory, document hub, and support ticketing unified in one system.",
    technologies: ["React/Nextjs", "Prisma", "NeonDB", "TypeScript", "CRM Pipeline"],
    featured: true,
  },
  {
    id: 1,
    sitename: "BuildForUser Platform",
    permalink: "buildforuser",
    url: "buildforuser.com",
    image: "buildforuser.png",
    description:
      "SaaS platform for managing client websites at scale — automated WordPress and React deployments, centralized client management, and integrated billing.",
    technologies: ["React/Nextjs", "Prisma", "NeonDB", "TypeScript", "Node.js"],
    featured: true,
  },
];

const UK_TESTIMONIALS = [
  {
    quote:
      "Rowell delivered exceptional React and Next.js engineering for the Macmanus Portal. Communication was effortless across UK business hours and technical execution was top-notch.",
    author: "Technical Director",
    company: "Macmanus Asset Finance (UK 🇬🇧)",
    role: "Engineering Partner",
    rating: 5,
  },
  {
    quote:
      "Rowell combines deep React expertise with impressive speed. The overlap in working hours makes collaborating from London feel like working with a local senior engineer.",
    author: "Product Director",
    company: "UK Tech Agency Partner 🇬🇧",
    role: "Agency Founder",
    rating: 5,
  },
];

const WHY_UK_FEATURES = [
  {
    icon: Clock,
    title: "GMT / BST Timezone Overlap",
    description:
      "Flexible working schedule aligned with London business hours. Enjoy real-time Slack updates, quick standups, and prompt responses.",
  },
  {
    icon: Coins,
    title: "Competitive Rates & Top Quality",
    description:
      "Enterprise-grade software engineering and production quality at cost-effective rates — eliminating traditional UK agency overhead.",
  },
  {
    icon: Code2,
    title: "React & Next.js Expert",
    description:
      "Senior-level architecture covering modern frontend React, Next.js 14 App Router, TypeScript, server components, and API integrations.",
  },
  {
    icon: ShieldCheck,
    title: "Direct Senior Engineer Access",
    description:
      "No agency account managers or project fluff. Deal directly with the senior full-stack software engineer writing your code.",
  },
];

const UK_SERVICES = [
  {
    icon: Layers,
    title: "React & Next.js Web App Engineering",
    description:
      "High-speed, scalable web applications built with React, Next.js 14 App Router, TypeScript, and Tailwind CSS optimized for conversion and Core Web Vitals.",
    features: ["Server Components", "API Routes", "State Management", "SEO Optimization"],
  },
  {
    icon: Cpu,
    title: "Enterprise Web Portals & Dashboards",
    description:
      "Complex React web portals, financial dashboards, and custom web applications modeled after production platforms like the Macmanus Asset Finance Portal.",
    features: ["Financial Dashboards", "Role-Based Auth", "API Integration", "High Security"],
  },
  {
    icon: Zap,
    title: "Core Web Vitals & UK SEO Refactoring",
    description:
      "Comprehensive performance audits, lighthouse 95+ score tuning, mobile responsiveness fixes, and localized UK search engine optimization.",
    features: ["Lighthouse 95+ Score", "Schema.org Markup", "SSR Optimization", "Security Audits"],
  },
];

export function UkLandingClient() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [testimonials, setTestimonials] = useState(UK_TESTIMONIALS);
  const [projects, setProjects] = useState<PortfolioProject[]>(DEFAULT_REACT_PROJECTS);
  const [pageConfig, setPageConfig] = useState<{
    badgeText?: string;
    heroTitle?: string;
    heroSubtitle?: string;
    heroCtaText?: string;
  } | null>(null);

  React.useEffect(() => {
    async function loadData() {
      try {
        const [lpRes, tRes, pRes] = await Promise.all([
          fetch('/api/landing-pages?slug=hire-uk-react-developer'),
          fetch('/api/testimonials?target=uk-react'),
          fetch('/api/projects?target=uk-react'),
        ]);

        let assignedProjectIds: number[] = [];
        let assignedTestimonialIds: number[] = [];

        if (lpRes.ok) {
          const lpData = await lpRes.json();
          if (lpData.success && lpData.page) {
            setPageConfig(lpData.page);
            assignedProjectIds = lpData.page.projectIds || [];
            assignedTestimonialIds = lpData.page.testimonialIds || [];
          }
        }

        if (tRes.ok) {
          const tData = await tRes.json();
          if (tData.success && Array.isArray(tData.testimonials) && tData.testimonials.length > 0) {
            let filteredTestimonials = tData.testimonials;
            if (assignedTestimonialIds.length > 0) {
              filteredTestimonials = tData.testimonials.filter((t: any) => assignedTestimonialIds.includes(t.id));
            }
            if (filteredTestimonials.length > 0) {
              setTestimonials(
                filteredTestimonials.map((t: any) => ({
                  quote: t.quote,
                  author: t.name,
                  company: t.company ? `${t.company} 🇬🇧` : 'UK Client 🇬🇧',
                  role: t.role || 'Client Lead',
                  rating: t.rating || 5,
                }))
              );
            }
          }
        }

        if (pRes.ok) {
          const pData = await pRes.json();
          if (pData.success && Array.isArray(pData.projects) && pData.projects.length > 0) {
            let filteredProjects = pData.projects;
            if (assignedProjectIds.length > 0) {
              filteredProjects = pData.projects.filter((p: any) => assignedProjectIds.includes(p.id));
            }
            if (filteredProjects.length > 0) {
              setProjects(filteredProjects);
            }
          }
        }
      } catch (e) {
        console.warn('Using default UK React projects & testimonials');
      }
    }
    loadData();
  }, []);

  const handleNextTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrevTestimonial = () => {
    setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-brand-navy">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-brand-navy text-white">
        {/* Background Ambient Accents */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-brand-amber text-xs font-extrabold tracking-wider uppercase"
            >
              <span>🇬🇧</span>
              <span>{pageConfig?.badgeText || 'UK Business & Agency Engineering Partner'}</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight"
            >
              {pageConfig?.heroTitle || (
                <>
                  Hire Senior <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">React & Next.js</span> Developer for UK Businesses
                </>
              )}
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-300 font-medium leading-relaxed"
            >
              {pageConfig?.heroSubtitle || 'Partner with a senior full-stack software engineer building enterprise platforms like the Macmanus Asset Finance Portal. Top-quality code at cost-effective rates with GMT/BST overlap.'}
            </motion.p>

            {/* Hero CTAs */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-brand-amber to-amber-600 hover:from-amber-600 hover:to-brand-amber text-slate-950 font-extrabold text-base shadow-lg hover:shadow-amber-500/25 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>{pageConfig?.heroCtaText || 'Book UK Discovery Call'}</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#uk-clients"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-base transition-all flex items-center justify-center gap-2"
              >
                <span>View Macmanus Portal Proof</span>
                <ChevronRight className="h-4 w-4" />
              </a>
            </motion.div>

            {/* Trust Highlights */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-semibold"
            >
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> GMT/BST Timezone Aligned
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Direct Senior Engineer
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Competitive Rates & Top Quality
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured UK Client Proof Section */}
      <section id="uk-clients" className="py-20 bg-white border-b border-slate-200/80">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-amber bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200/80">
              Featured UK React Platform
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-brand-navy tracking-tight">
              Featured UK Client Work
            </h2>
            <p className="text-base text-brand-slate font-medium">
              Architecting production React & Next.js platforms for UK financial services and enterprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {projects.map((project, idx) => (
              <motion.div
                key={project.id || idx}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <PortfolioCard project={project} index={idx} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* "Why UK Businesses Partner With Me" Grid */}
      <section className="py-24 bg-[#F8FAFC]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-navy bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200">
              Why Partner With Me
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-brand-navy tracking-tight">
              Designed for UK Business Workflows
            </h2>
            <p className="text-base text-brand-slate font-medium">
              Combining world-class React engineering with seamless UK timezone alignment and transparent billing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_UK_FEATURES.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-4"
                >
                  <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-brand-amber flex items-center justify-center">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-navy">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* UK Testimonials Carousel */}
      <section className="py-24 bg-white border-y border-slate-200/80">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-amber bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200/80">
              Client Feedback
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-brand-navy tracking-tight">
              What UK Partners Say
            </h2>
          </div>

          <div className="relative max-w-3xl mx-auto">
            <div className="absolute top-1/2 -left-4 sm:-left-12 -translate-y-1/2 z-20">
              <button
                onClick={handlePrevTestimonial}
                className="h-11 w-11 rounded-full bg-white border border-slate-200 shadow-md hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-all hover:scale-105"
                title="Previous Testimonial"
              >
                <ChevronLeft className="h-5 w-5 text-brand-navy" />
              </button>
            </div>

            <div className="absolute top-1/2 -right-4 sm:-right-12 -translate-y-1/2 z-20">
              <button
                onClick={handleNextTestimonial}
                className="h-11 w-11 rounded-full bg-white border border-slate-200 shadow-md hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-all hover:scale-105"
                title="Next Testimonial"
              >
                <ChevronRight className="h-5 w-5 text-brand-navy" />
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIndex}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
                className="bg-[#FAFAF7] rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-lg space-y-6 relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: testimonials[testimonialIndex]?.rating || 5 }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="h-10 w-10 text-amber-200" />
                </div>

                <p className="text-base sm:text-lg text-slate-800 font-medium leading-relaxed italic">
                  "{testimonials[testimonialIndex]?.quote}"
                </p>

                <div className="pt-6 border-t border-slate-200/80 flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-extrabold text-brand-navy">
                      {testimonials[testimonialIndex]?.author}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">
                      {testimonials[testimonialIndex]?.role} ·{" "}
                      <span className="text-brand-amber font-extrabold">
                        {testimonials[testimonialIndex]?.company}
                      </span>
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-center gap-2 mt-8">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setTestimonialIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === testimonialIndex ? "w-8 bg-brand-amber" : "w-2.5 bg-slate-300"
                  }`}
                  title={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Services */}
      <section className="py-24 bg-[#FAFAF7]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-navy bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200">
              Services Offered
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-brand-navy tracking-tight">
              React & Next.js Solutions
            </h2>
            <p className="text-base text-brand-slate font-medium">
              Tailored software engineering services for UK startups, financial SMEs, and digital agencies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {UK_SERVICES.map((service, idx) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-brand-amber flex items-center justify-center">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-brand-navy">{service.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <ul className="space-y-2 pt-6 mt-6 border-t border-slate-100">
                    {service.features.map((feat, fIdx) => (
                      <li key={fIdx} className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive AI Assistant Section */}
      <section className="py-12 px-6 bg-slate-950">
        <LandingPageAiAssistant
          pageTitle={pageConfig?.heroTitle || "Senior UK React & Next.js Developer"}
          targetKeyword="UK React & Next.js Development"
          badgeText="React/Next.js Architecture"
        />
      </section>

      {/* CTA Footer Section */}
      <section className="py-20 bg-gradient-to-r from-brand-navy via-slate-900 to-brand-navy text-white text-center">
        <div className="container mx-auto px-6 max-w-4xl space-y-6">
          <Sparkles className="h-10 w-10 text-amber-400 mx-auto" />
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Ready to Build or Scale Your UK React Platform?
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-medium">
            Let's discuss your project requirement. Enjoy seamless GMT/BST communication, clean architecture, and reliable delivery.
          </p>

          <div className="pt-4 flex justify-center">
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-brand-amber to-amber-600 hover:from-amber-600 hover:to-brand-amber text-slate-950 font-extrabold text-base shadow-xl hover:shadow-amber-500/25 transition-all flex items-center gap-2 group"
            >
              <span>Get in Touch for UK React Projects</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Contact Modal Trigger */}
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </div>
  );
}
