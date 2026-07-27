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
  Layout,
  ShoppingBag,
  Coins,
  Building2,
  Sparkles,
  Cpu,
} from "lucide-react";
import { ContactModal } from "@/components/ui/contact-modal";
import { LandingPageAiAssistant } from "@/components/ui/landing-page-ai-assistant";
import { PortfolioCard, PortfolioProject } from "@/components/ui/portfolio-card";

const DEFAULT_WP_PROJECTS: PortfolioProject[] = [
  {
    id: 4,
    sitename: "Tower Fire Solutions",
    permalink: "tower-fire",
    url: "towerfire.co.uk",
    image: "towerfire.png",
    description:
      "Custom WordPress build powered by a hand-coded Gutenberg block library and native blog engine — zero third-party page builders, 95+ Core Web Vitals score.",
    technologies: ["Wordpress", "PHP", "Custom Gutenberg Blocks"],
    featured: true,
  },
  {
    id: 5,
    sitename: "MacManus Asset Finance Brokerage",
    permalink: "macmanus-asset-finance",
    url: "macmanusassetfinance.co.uk",
    image: "macmanus.png",
    description:
      "FCA-regulated business finance brokerage site covering asset finance, business loans, invoice financing, and VAT loans built on custom WordPress.",
    technologies: ["Wordpress", "PHP", "FCA-Regulated"],
    featured: true,
  },
];

const UK_TESTIMONIALS = [
  {
    quote:
      "Rowell is a true WordPress architect. He refactored our platform, boosted our speed scores to 95+, and delivered flawless customization across our UK business hours for Towerfire.",
    author: "Technical Director",
    company: "Towerfire (UK 🇬🇧)",
    role: "Engineering Lead",
    rating: 5,
  },
  {
    quote:
      "Outstanding custom WordPress development and Headless CMS integration for Macmanus Portals. Rowell is highly responsive, reliable, and builds production-grade code.",
    author: "Operations Lead",
    company: "Macmanus Portals (UK 🇬🇧)",
    role: "Client Director",
    rating: 5,
  },
  {
    quote:
      "Rowell's expertise in Headless WordPress + Next.js is top tier. The overlap in GMT working hours makes collaborating from London seamless.",
    author: "Digital Agency Founder",
    company: "UK Web Agency 🇬🇧",
    role: "Agency Founder",
    rating: 5,
  },
];

const WHY_UK_FEATURES = [
  {
    icon: Clock,
    title: "GMT / BST Timezone Overlap",
    description:
      "Flexible schedule aligned with London business hours. Enjoy real-time Slack updates, quick standups, and prompt responses.",
  },
  {
    icon: Coins,
    title: "Competitive Rates & Top Quality",
    description:
      "Enterprise-grade software engineering and bespoke WordPress craftsmanship at cost-effective rates — eliminating traditional UK agency overhead.",
  },
  {
    icon: Layout,
    title: "Custom WordPress Architect",
    description:
      "No heavy bloatware or slow page builders. Bespoke PHP code, ACF Pro, Gutenberg blocks, and clean database structures.",
  },
  {
    icon: ShieldCheck,
    title: "Direct Senior Engineer Access",
    description:
      "No agency account managers or project fluff. Deal directly with the senior WordPress developer architecting your platform.",
  },
];

const WP_SERVICES = [
  {
    icon: Layout,
    title: "Bespoke WordPress Theme & Plugin Dev",
    description:
      "Hand-coded custom WordPress themes and custom plugins built to your exact design specifications without reliance on bloated third-party plugins.",
    features: ["Bespoke PHP Themes", "ACF Pro & Gutenberg Blocks", "Custom Plugin Development", "Clean Code Standards"],
  },
  {
    icon: Cpu,
    title: "Headless WordPress + Next.js",
    description:
      "Combine the intuitive WordPress content management experience with the lightning speed and security of a modern Next.js React frontend.",
    features: ["GraphQL & REST API", "Instant Page Loads", "Enhanced Security", "Modern React Components"],
  },
  {
    icon: ShoppingBag,
    title: "WooCommerce & E-Commerce Engineering",
    description:
      "Custom WooCommerce store builds, bespoke payment gateway integrations, custom checkout flows, and high-volume product database optimization.",
    features: ["Custom Checkout Flows", "Stripe & UK Gateways", "Speed Tuning", "Inventory Sync"],
  },
  {
    icon: Zap,
    title: "Page Speed, Core Web Vitals & UK SEO",
    description:
      "Drastic reduction of page load times, image optimization, database cleanup, script deferral, and 95+ Google Lighthouse scores for UK rankings.",
    features: ["Lighthouse 95+ Scores", "Database Optimization", "Schema.org Markup", "Security Hardening"],
  },
];

export function UkWpLandingClient() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [testimonials, setTestimonials] = useState(UK_TESTIMONIALS);
  const [allProjects, setAllProjects] = useState<PortfolioProject[]>(DEFAULT_WP_PROJECTS);
  const [projectFilter, setProjectFilter] = useState<'all' | 'website' | 'plugin'>('all');
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
          fetch('/api/landing-pages?slug=hire-uk-wordpress-developer'),
          fetch('/api/testimonials?target=uk-wordpress'),
          fetch('/api/projects?includeInactive=false'),
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
                  role: t.role || 'Client Director',
                  rating: t.rating || 5,
                }))
              );
            }
          }
        }

        if (pRes.ok) {
          const pData = await pRes.json();
          if (pData.success && Array.isArray(pData.projects) && pData.projects.length > 0) {
            let wpProjects = pData.projects;
            if (assignedProjectIds.length > 0) {
              wpProjects = pData.projects.filter((p: any) => assignedProjectIds.includes(p.id));
            } else {
              wpProjects = pData.projects.filter(
                (p: any) =>
                  p.technologies?.some((t: string) => t.toLowerCase().includes('wordpress')) ||
                  p.permalink?.includes('tower') ||
                  p.permalink?.includes('macmanus')
              );
            }
            if (wpProjects.length > 0) {
              setAllProjects(wpProjects);
            }
          }
        }
      } catch (e) {
        console.warn('Using default UK WordPress projects & testimonials');
      }
    }
    loadData();
  }, []);

  const displayedProjects = allProjects.filter((p) => {
    const isPlugin =
      p.url?.startsWith('wp-content') ||
      p.permalink?.includes('plugin') ||
      p.technologies?.some((t) => t.toLowerCase() === 'wordpress plugins');
    if (projectFilter === 'website') return !isPlugin;
    if (projectFilter === 'plugin') return isPlugin;
    return true;
  });

  const handleNextTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrevTestimonial = () => {
    setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-brand-navy">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-brand-navy text-white">
        {/* Background Ambient Accents */}
        <div className="absolute inset-0 bg-[radial-gradient(#4338ca_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* UK Flag Badge */}
            <motion.div
              initial={{ y: -15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-extrabold tracking-wider uppercase"
            >
              <span>🇬🇧</span>
              <span>{pageConfig?.badgeText || 'Custom WordPress & Headless CMS Engineering for UK'}</span>
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
                  Hire Senior <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200">WordPress Developer & Architect</span> for UK Businesses
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
              {pageConfig?.heroSubtitle || 'Bespoke WordPress theme and plugin development, Headless WordPress + Next.js, and speed optimization. Top-quality code at cost-effective rates with GMT/BST overlap.'}
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
                <span>{pageConfig?.heroCtaText || 'Book UK WordPress Call'}</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#uk-clients"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-base transition-all flex items-center justify-center gap-2"
              >
                <span>View Towerfire & Macmanus Proof</span>
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
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Custom PHP & Headless WP
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Competitive Rates & Top Quality
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* "Some UK Clients We Work With" Section */}
      <section id="uk-clients" className="py-20 bg-white border-b border-slate-200/80">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-amber bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200/80">
              Social Proof & Client History
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-brand-navy tracking-tight">
              Featured UK WordPress Clients
            </h2>
            <p className="text-base text-brand-slate font-medium">
              Architecting bespoke WordPress solutions, high-speed platforms, and Headless CMS implementations for UK brands.
            </p>
          </div>

          {/* Selectable Category Tabs (Websites vs Custom Plugins) */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            <button
              onClick={() => setProjectFilter('all')}
              className={`px-5 py-2.5 rounded-full text-xs font-black transition-all cursor-pointer border ${
                projectFilter === 'all'
                  ? 'bg-indigo-950 text-white border-indigo-900 shadow-md ring-2 ring-indigo-400/40'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              All WordPress Projects ({allProjects.length})
            </button>

            <button
              onClick={() => setProjectFilter('website')}
              className={`px-5 py-2.5 rounded-full text-xs font-black transition-all cursor-pointer border flex items-center gap-1.5 ${
                projectFilter === 'website'
                  ? 'bg-indigo-950 text-white border-indigo-900 shadow-md ring-2 ring-indigo-400/40'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              <span>🌐</span>
              <span>WordPress Websites & Portals</span>
            </button>

            <button
              onClick={() => setProjectFilter('plugin')}
              className={`px-5 py-2.5 rounded-full text-xs font-black transition-all cursor-pointer border flex items-center gap-1.5 ${
                projectFilter === 'plugin'
                  ? 'bg-gradient-to-r from-indigo-900 to-slate-900 text-white border-indigo-700 shadow-md ring-2 ring-amber-400/50'
                  : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
              }`}
            >
              <span>🧩</span>
              <span>Custom WordPress Plugins</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {displayedProjects.map((project, idx) => (
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
              Built for UK Business Workflows
            </h2>
            <p className="text-base text-brand-slate font-medium">
              Clean WordPress architecture, fast communication in GMT/BST, and direct senior-level support.
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
                  <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 flex items-center justify-center">
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

      {/* Testimonials Carousel */}
      <section className="py-24 bg-white border-y border-slate-200/80">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-amber bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200/80">
              UK Feedback
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-brand-navy tracking-tight">
              What UK Clients & Agencies Say
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
                  <Quote className="h-10 w-10 text-indigo-200" />
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
                    idx === testimonialIndex ? "w-8 bg-indigo-600" : "w-2.5 bg-slate-300"
                  }`}
                  title={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WordPress Services Offered */}
      <section className="py-24 bg-[#FAFAF7]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-navy bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200">
              WordPress Services
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-brand-navy tracking-tight">
              Bespoke WordPress Engineering
            </h2>
            <p className="text-base text-brand-slate font-medium">
              Custom theme development, headless CMS integrations, WooCommerce, and speed tuning for UK businesses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {WP_SERVICES.map((service, idx) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.12 }}
                  className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 flex items-center justify-center">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-brand-navy">{service.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <ul className="grid grid-cols-2 gap-2 pt-6 mt-6 border-t border-slate-100">
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
          pageTitle={pageConfig?.heroTitle || "Senior UK WordPress Architect"}
          targetKeyword="UK Custom WordPress Engineering"
          badgeText="Custom WordPress Blocks & ACF Pro"
        />
      </section>

      {/* CTA Footer Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-white text-center">
        <div className="container mx-auto px-6 max-w-4xl space-y-6">
          <Sparkles className="h-10 w-10 text-amber-400 mx-auto" />
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Need a Custom WordPress Architect for Your UK Business?
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-medium">
            Let's discuss your WordPress project requirement. Enjoy seamless GMT/BST communication, clean PHP/Next.js code, and reliable delivery.
          </p>

          <div className="pt-4 flex justify-center">
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-brand-amber to-amber-600 hover:from-amber-600 hover:to-brand-amber text-slate-950 font-extrabold text-base shadow-xl hover:shadow-amber-500/25 transition-all flex items-center gap-2 group"
            >
              <span>Get in Touch for UK WordPress Projects</span>
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
