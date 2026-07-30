import { Metadata } from 'next';
import Link from 'next/link';
import Banner from '@/components/banner/banner';
import { Shield, Lock, Eye, FileText, CheckCircle2, ArrowLeft, Mail, Database, Cookie, Globe2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy & UK GDPR Compliance | Rowell Mark Blanca',
  description:
    'Comprehensive Privacy Policy, UK GDPR & EU GDPR data protection standards, cookie policies, and data subjects rights for rowellblanca.dev.',
};

export default function PrivacyPolicyPage() {
  const lastUpdated = '30 July 2026';

  return (
    <div className="bg-[#FAFAF7] min-h-screen font-sans text-slate-900 selection:bg-amber-400 selection:text-slate-950">
      <Banner title="Privacy Policy" subtitle="UK GDPR & International Data Protection Standards" />

      <div className="py-12 pb-24">
        <div className="container mx-auto px-6 max-w-4xl space-y-8">
          <div className="flex items-start">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 font-extrabold text-xs uppercase tracking-wider rounded-xl bg-white border border-slate-200 text-[#0b1a30] hover:border-amber-500 hover:text-amber-600 transition-all shadow-xs"
            >
              <ArrowLeft className="mr-2 h-4 w-4 text-amber-500" /> Back to Portfolio
            </Link>
          </div>

          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-10 text-slate-700 leading-relaxed text-sm sm:text-base">
            {/* Page Header */}
            <div className="space-y-3 border-b border-slate-100 pb-8">
              <span className="text-xs font-black uppercase tracking-wider text-amber-900 bg-amber-100 px-3.5 py-1.5 rounded-full border border-amber-300 inline-block shadow-xs">
                Effective Date: {lastUpdated}
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-[#0b1a30] tracking-tight">
                Privacy Policy & Data Protection Statement
              </h1>
              <p className="text-slate-500 font-medium text-xs sm:text-sm max-w-2xl">
                Rowell Mark Blanca is committed to safeguarding your privacy in compliance with the UK General Data Protection Regulation (UK GDPR), Data Protection Act 2018, and EU GDPR.
              </p>
            </div>

            {/* Section 1: Data Controller */}
            <section className="space-y-3">
              <h2 className="text-xl font-extrabold text-[#0b1a30] flex items-center gap-2">
                <Shield className="h-5 w-5 text-amber-500" /> 1. Data Controller Information
              </h2>
              <p className="text-slate-600 font-medium leading-relaxed">
                For the purpose of applicable data protection laws, the Data Controller responsible for your personal data collected through <strong>rowellblanca.dev</strong> is:
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 space-y-1">
                <p className="font-extrabold text-sm text-[#0b1a30]">Rowell Mark Blanca</p>
                <p>Senior Full-Stack Software Engineer & WordPress Architect</p>
                <p>Website: https://www.rowellblanca.dev</p>
                <p>Email: rowellblanca94@gmail.com</p>
              </div>
            </section>

            {/* Section 2: Legal Bases for Processing */}
            <section className="space-y-3">
              <h2 className="text-xl font-extrabold text-[#0b1a30] flex items-center gap-2">
                <FileText className="h-5 w-5 text-amber-500" /> 2. Legal Bases for Data Processing (UK GDPR Art. 6)
              </h2>
              <p className="text-slate-600 font-medium leading-relaxed">
                We process your personal information under the following lawful bases:
              </p>
              <ul className="list-disc pl-6 space-y-2 font-medium text-xs sm:text-sm text-slate-700">
                <li>
                  <strong>Explicit Consent (Art. 6(1)(a)):</strong> When you voluntarily submit project inquiries, contact forms, or accept optional analytics cookies.
                </li>
                <li>
                  <strong>Contract Performance (Art. 6(1)(b)):</strong> To take pre-contractual steps or fulfill software development and engineering contracts requested by you.
                </li>
                <li>
                  <strong>Legitimate Interests (Art. 6(1)(f)):</strong> To maintain website security, prevent fraud, optimize performance, and manage CRM client communication.
                </li>
              </ul>
            </section>

            {/* Section 3: Personal Data We Collect */}
            <section className="space-y-3">
              <h2 className="text-xl font-extrabold text-[#0b1a30] flex items-center gap-2">
                <Database className="h-5 w-5 text-amber-500" /> 3. Information We Collect
              </h2>
              <p className="text-slate-600 font-medium leading-relaxed">
                Depending on how you interact with our website, we may collect the following categories of data:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="font-extrabold text-xs text-[#0b1a30] uppercase tracking-wider">A. Contact & Inquiries</h4>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4 font-medium">
                    <li>Full Name</li>
                    <li>Email Address & Phone Number</li>
                    <li>Company Name & Industry</li>
                    <li>Project Scope & Budget Details</li>
                    <li>Timestamped Consent Audit Records</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="font-extrabold text-xs text-[#0b1a30] uppercase tracking-wider">B. Technical & Analytics</h4>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4 font-medium">
                    <li>Anonymized IP Address</li>
                    <li>Browser Type & Device Specifications</li>
                    <li>Referral URLs & Session Duration</li>
                    <li>Google Analytics 4 Pageview Metrics</li>
                    <li>Essential Cookie Session Data</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 4: Cookies & Tracking Technologies */}
            <section className="space-y-3">
              <h2 className="text-xl font-extrabold text-[#0b1a30] flex items-center gap-2">
                <Cookie className="h-5 w-5 text-amber-500" /> 4. Cookies & Preference Management
              </h2>
              <p className="text-slate-600 font-medium leading-relaxed">
                We use cookies to enhance your browsing experience and measure site usage. You can manage or revoke your consent at any time via our persistent website cookie banner or your web browser settings.
              </p>
              <div className="space-y-2 pt-2">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                  <span className="font-extrabold text-xs text-[#0b1a30] bg-slate-100 px-2 py-0.5 rounded">Essential Cookies</span>
                  <p className="text-xs text-slate-600 font-medium">
                    Required for core website security, authentication state, and session routing. Cannot be disabled.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                  <span className="font-extrabold text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Analytics Cookies (GA4)</span>
                  <p className="text-xs text-slate-600 font-medium">
                    Collects anonymized traffic statistics to help us analyze visitor engagement. Loaded only after user consent.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5: Data Sharing & International Transfers */}
            <section className="space-y-3">
              <h2 className="text-xl font-extrabold text-[#0b1a30] flex items-center gap-2">
                <Globe2 className="h-5 w-5 text-amber-500" /> 5. Service Providers & Third Parties
              </h2>
              <p className="text-slate-600 font-medium leading-relaxed">
                We do NOT sell, rent, or trade your personal data. Data is shared strictly with compliant infrastructure subprocessors necessary to deliver our web platform:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 font-medium text-xs sm:text-sm text-slate-700">
                <li><strong>Hosting & Edge CDN:</strong> Vercel Inc. (Global CDN deployment with SSL encryption).</li>
                <li><strong>Database Infrastructure:</strong> Neon Inc. (Managed PostgreSQL with serverless encryption).</li>
                <li><strong>Analytics Provider:</strong> Google LLC (Google Analytics 4 with IP anonymization enabled).</li>
                <li><strong>AI Services:</strong> Google Gemini API & OpenAI API (Processed transiently for chatbot inquiries without training on user data).</li>
              </ul>
            </section>

            {/* Section 6: Data Retention & Security */}
            <section className="space-y-3">
              <h2 className="text-xl font-extrabold text-[#0b1a30] flex items-center gap-2">
                <Lock className="h-5 w-5 text-amber-500" /> 6. Data Security & Retention
              </h2>
              <p className="text-slate-600 font-medium leading-relaxed">
                We implement robust technical and organizational security measures, including HTTPS TLS encryption, database access controls, and strict RBAC privileges. Inquiry records are retained for up to 24 months for commercial communication unless erasure is requested.
              </p>
            </section>

            {/* Section 7: Your GDPR Rights */}
            <section className="space-y-3">
              <h2 className="text-xl font-extrabold text-[#0b1a30] flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" /> 7. Your Data Subject Rights
              </h2>
              <p className="text-slate-600 font-medium leading-relaxed">
                Under UK GDPR and EU GDPR, you hold the following statutory rights regarding your personal information:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <strong className="text-[#0b1a30] block font-extrabold mb-0.5">Right of Access</strong>
                  Request a copy of personal data held about you.
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <strong className="text-[#0b1a30] block font-extrabold mb-0.5">Right to Rectification</strong>
                  Request correction of inaccurate or incomplete records.
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <strong className="text-[#0b1a30] block font-extrabold mb-0.5">Right to Erasure ("To Be Forgotten")</strong>
                  Request deletion of your personal data from our CRM.
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <strong className="text-[#0b1a30] block font-extrabold mb-0.5">Right to Withdraw Consent</strong>
                  Revoke consent at any time without affecting prior lawful processing.
                </div>
              </div>
            </section>

            {/* Section 8: Contact & Supervisory Authority */}
            <section className="space-y-4 pt-4 border-t border-slate-100">
              <h2 className="text-xl font-extrabold text-[#0b1a30] flex items-center gap-2">
                <Mail className="h-5 w-5 text-amber-500" /> 8. Contact Information & Complaints
              </h2>
              <p className="text-slate-600 font-medium leading-relaxed text-xs sm:text-sm">
                To exercise any of your data protection rights or submit a Subject Access Request (SAR), please email:
              </p>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-bold flex items-center gap-3">
                <Mail className="h-5 w-5 text-amber-600 shrink-0" />
                <div>
                  <span className="block text-[#0b1a30]">Data Protection Email:</span>
                  <a href="mailto:rowellblanca94@gmail.com" className="text-indigo-600 hover:underline">
                    rowellblanca94@gmail.com
                  </a>
                </div>
              </div>

              <p className="text-xs text-slate-500 font-medium leading-relaxed pt-2">
                If you believe your data has been handled unlawfully, you also have the right to lodge a complaint with the United Kingdom supervisory authority: <strong>Information Commissioner's Office (ICO)</strong> at <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">ico.org.uk</a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
