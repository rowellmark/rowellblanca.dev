import { Metadata } from 'next';
import Link from 'next/link';
import Banner from '@/components/banner/banner';
import { Shield, Lock, Eye, FileText, CheckCircle2, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy & GDPR Compliance',
  description: 'Privacy Policy, cookie usage, data protection practices, and GDPR compliance details for rowellblanca.dev.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-brand-bg min-h-screen">
      <Banner title="Privacy Policy" subtitle="GDPR & Data Protection" />

      <div className="py-12 pb-24">
        <div className="container mx-auto px-6 max-w-4xl space-y-8">
          
          <div className="flex items-start">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 uppercase font-extrabold text-xs tracking-wider rounded-xl bg-white border border-slate-200 text-brand-navy hover:border-brand-amber transition-all shadow-xs"
            >
              <ArrowLeft className="mr-2 h-4 w-4 text-brand-amber" /> Back to Home
            </Link>
          </div>

          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
            
            <div className="space-y-2 border-b border-slate-100 pb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-amber bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60 inline-block">
                Last Updated: July 2026
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-brand-navy tracking-tight">
                Privacy Policy & GDPR Information
              </h1>
              <p className="text-slate-500 font-medium text-xs sm:text-sm">
                Your privacy and data protection rights are essential to us.
              </p>
            </div>

            <section className="space-y-3">
              <h2 className="text-xl font-extrabold text-brand-navy flex items-center gap-2">
                <Shield className="h-5 w-5 text-brand-amber" /> 1. Data Controller
              </h2>
              <p>
                Rowell Mark Blanca operates rowellblanca.dev ("we", "our", or "us"). For the purpose of the General Data Protection Regulation (GDPR) and data protection laws, Rowell Mark Blanca is the data controller responsible for personal data collected through this website.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-extrabold text-brand-navy flex items-center gap-2">
                <FileText className="h-5 w-5 text-brand-amber" /> 2. Personal Data We Collect
              </h2>
              <p>When you interact with our website or contact form, we may collect:</p>
              <ul className="list-disc pl-6 space-y-1.5 font-medium">
                <li><strong>Contact Information:</strong> Your name, email address, phone number, and company name provided when submitting project inquiries.</li>
                <li><strong>GDPR Consent Records:</strong> Timestamped records of your explicit consent when submitting the contact form.</li>
                <li><strong>Technical & Analytics Data:</strong> IP address, browser type, device information, and pages visited via Google Analytics 4 (when analytics cookies are accepted).</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-extrabold text-brand-navy flex items-center gap-2">
                <Lock className="h-5 w-5 text-brand-amber" /> 3. How We Use Your Data
              </h2>
              <p>Your personal data is strictly processed to:</p>
              <ul className="list-disc pl-6 space-y-1.5 font-medium">
                <li>Respond to your project inquiries and business requests.</li>
                <li>Manage CRM lead pipelines and client communications securely.</li>
                <li>Improve website performance and user experience using aggregated analytics.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-extrabold text-brand-navy flex items-center gap-2">
                <Eye className="h-5 w-5 text-brand-amber" /> 4. Cookies & Analytics
              </h2>
              <p>
                We use essential cookies required for website navigation and security. Optional Google Analytics (GA4) cookies are loaded only if you explicitly choose to accept analytics cookies via our cookie banner.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-extrabold text-brand-navy flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" /> 5. Your GDPR Data Rights
              </h2>
              <p>Under GDPR, you have the right to access, rectify, request erasure ("right to be forgotten"), or restrict processing of your personal data at any time by contacting us at <strong>rowellblanca94@gmail.com</strong>.</p>
            </section>

          </div>

        </div>
      </div>
    </div>
  );
}
