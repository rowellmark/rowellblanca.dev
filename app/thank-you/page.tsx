import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { GlitchText } from "@/components/ui/glitch-text";
import {
  Sparkles,
  Heart,
  Rocket,
  Coffee,
  CheckCircle2,
  ArrowRight,
  Home,
  Briefcase,
  Clock,
  ShieldCheck,
  UserCheck,
  Mail,
  MapPin,
} from "lucide-react";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandFacebook,
  IconBrandInstagram,
} from "@tabler/icons-react";
import Banner from "@/components/banner/banner";

export const metadata: Metadata = {
  title: "Thank You | Rowell Mark Blanca",
  description: "Thank you for getting in touch! Rowell Mark Blanca will review your message and reply within 24 hours.",
  robots: {
    index: false,
    follow: true,
  },
};

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/rowellmark", icon: IconBrandGithub, color: "hover:bg-slate-900 hover:text-white" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/rowell-blanca/", icon: IconBrandLinkedin, color: "hover:bg-blue-600 hover:text-white" },
  { label: "Facebook", href: "https://www.facebook.com/itsmrrowrow", icon: IconBrandFacebook, color: "hover:bg-blue-700 hover:text-white" },
  { label: "Instagram", href: "https://www.instagram.com/its.mr.row/", icon: IconBrandInstagram, color: "hover:bg-rose-600 hover:text-white" },
];

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-brand-bg relative overflow-hidden flex flex-col">
      <Banner
        title="Thank You!"
        subtitle="Inquiry Received"
      />

      <section className="py-14 sm:py-20 relative flex-1 flex items-center justify-center">
        {/* Subtle Ambient Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
        <div className="absolute top-1/4 left-10 w-72 h-72 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-indigo-400/10 blur-3xl pointer-events-none" />

        <div className="container mx-auto px-6 max-w-3xl relative z-10 text-center">
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/80 shadow-2xl space-y-8 relative overflow-hidden">
            
            {/* Cute Animated Floating Icons & Badge */}
            <div className="relative inline-flex items-center justify-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-amber-400 via-amber-500 to-orange-500 text-slate-950 flex items-center justify-center shadow-xl shadow-amber-500/25">
                <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 animate-pulse" />
              </div>
              
              {/* Cute Orbiting Badges */}
              <div className="absolute -top-2 -right-3 p-2 rounded-2xl bg-amber-100 border border-amber-300 text-amber-700 shadow-md animate-bounce">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="absolute -bottom-2 -left-3 p-2 rounded-2xl bg-indigo-100 border border-indigo-300 text-indigo-700 shadow-md">
                <Rocket className="w-5 h-5" />
              </div>
              <div className="absolute -top-3 -left-4 p-2 rounded-2xl bg-rose-100 border border-rose-300 text-rose-600 shadow-md">
                <Heart className="w-4 h-4 fill-rose-500" />
              </div>
            </div>

            {/* Friendly & Professional Glitch Headline */}
            <div className="space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-brand-amber bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200/80 inline-flex items-center gap-1.5 shadow-xs">
                <UserCheck className="w-3.5 h-3.5 text-amber-500" /> Message Received
              </span>
              
              <div className="text-3xl sm:text-5xl font-black text-brand-navy tracking-tight">
                <GlitchText>Thank You for Reaching Out!</GlitchText>
              </div>
              
              <p className="text-slate-600 font-medium text-base sm:text-lg max-w-lg mx-auto leading-relaxed pt-1">
                Your message has been delivered directly to my inbox. I review every project inquiry personally and will get back to you within <span className="font-bold text-slate-900">24 hours</span>.
              </p>
            </div>

            {/* Professional Assurance Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-left pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">Delivered</h4>
                  <p className="text-xs font-medium text-slate-600">Logged in CRM pipeline</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">Fast SLA</h4>
                  <p className="text-xs font-medium text-slate-600">Response within 24h</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-500 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">Privacy First</h4>
                  <p className="text-xs font-medium text-slate-600">GDPR & 100% confidential</p>
                </div>
              </div>
            </div>

            {/* Direct Contact Info Strip */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 text-left">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 text-center sm:text-left">
                Direct Contact Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-semibold text-slate-800">
                <a
                  href="mailto:rowellblanca94@gmail.com"
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:text-amber-600 transition-colors group shadow-2xs"
                >
                  <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="truncate">rowellblanca94@gmail.com</span>
                </a>

                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-2xs">
                  <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span className="truncate">Metro Manila, Philippines (UTC+8)</span>
                </div>
              </div>
            </div>

            {/* Social Connect Channels & Signature */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-brand-navy to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 text-left shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-sm shrink-0">
                  RM
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white">Rowell Mark Blanca</h4>
                  <p className="text-xs text-amber-400 font-medium">Full-Stack Software Engineer</p>
                </div>
              </div>

              {/* Social Channels Icons */}
              <div className="flex items-center gap-2">
                {SOCIAL_LINKS.map(({ label, href, icon: Icon, color }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`w-9 h-9 rounded-xl bg-white/10 border border-white/15 text-slate-200 flex items-center justify-center transition-all duration-300 ${color}`}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Next Action Navigation Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-slate-900 hover:bg-brand-amber text-white hover:text-slate-950 font-extrabold text-sm shadow-md hover:shadow-xl transition-all duration-300 group"
              >
                <Home className="w-4 h-4" />
                <span>Return to Homepage</span>
              </Link>

              <Link
                href="/mywork"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-extrabold text-sm border border-slate-200 transition-all duration-300 group"
              >
                <Briefcase className="w-4 h-4 text-slate-600 group-hover:text-slate-900" />
                <span>Explore Featured Work</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
