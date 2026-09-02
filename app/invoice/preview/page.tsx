'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import logo from '@/assets/images/logo.png';
import { 
  Sparkles, 
  Printer, 
  Mail, 
  FileText, 
  CreditCard,
  Phone,
  Globe
} from 'lucide-react';

export default function InvoicePreviewPage() {
  const [viewMode, setViewMode] = useState<'email' | 'web'>('email');

  const sampleInvoice = {
    invoiceNumber: 'INV-2026-001',
    status: 'SCHEDULED',
    scheduledSendDate: '2026-09-05T09:00',
    issueDate: 'Sep 02, 2026',
    dueDate: 'Sep 16, 2026',
    tagline: 'Bring your ideas in to reality.',
    client: {
      name: 'Sarah Jenkins',
      company: 'Apex Digital Solutions Ltd.',
      email: 's.jenkins@apexdigital.io',
      phone: '+1 (555) 382-9102',
      address: '742 Evergreen Terrace, Suite 400, San Francisco, CA 94107',
    },
    items: [
      {
        id: 1,
        title: 'Full-Stack Next.js 14 Custom Web Platform',
        details: 'High-performance Next.js App Router architecture, responsive UI components, Tailwind CSS styling, dynamic page routing, and SEO optimization.',
        qty: 1,
        rate: 3500,
        amount: 3500,
      },
      {
        id: 2,
        title: 'PostgreSQL Database & Custom CRM Lead Engine',
        details: 'Prisma ORM schema design, NeonDB connection pooling, automated lead capture pipeline, spam protection, and admin API webhooks.',
        qty: 1,
        rate: 1200,
        amount: 1200,
      },
      {
        id: 3,
        title: 'Cloud Edge Deployment & Performance Tuning',
        details: 'Vercel Edge CDN setup, automated SSL security, image optimization pipeline, and 99+ Google Core Web Vitals audit score.',
        qty: 1,
        rate: 500,
        amount: 500,
      },
    ],
    currency: 'USD',
    currencySymbol: '$',
    subtotal: 5200,
    discount: 0,
    tax: 0,
    total: 5200,
    paymentTerms: 'Payment due within 14 days of invoice issue date. Direct bank wire, Wise, Stripe, or PayPal accepted.',
    bankDetails: {
      bankName: 'Silicon Valley Bank / Wise USD',
      accountName: 'Rowell Mark Blanca',
      accountNumber: '**** **** 8392',
      routingNumber: '021000021',
      swift: 'WISEUS33XXX',
      paypal: 'rowellblanca94@gmail.com',
    },
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Controller Bar */}
      <div className="max-w-4xl mx-auto mb-8 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl backdrop-blur-md shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-base tracking-tight">Invoice Visual Preview</span>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Interactive Preview
              </span>
            </div>
            <p className="text-xs text-slate-400">Toggle between the client email look and the full printable web view</p>
          </div>
        </div>

        {/* View Switcher & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('email')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'email'
                  ? 'bg-[#1d63ed] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email Template Look</span>
            </button>
            <button
              onClick={() => setViewMode('web')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'web'
                  ? 'bg-[#1d63ed] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Printable Web / PDF Look</span>
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-700 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. EMAIL CLIENT SIMULATION CONTAINER */}
      {/* ───────────────────────────────────────────────────────────── */}
      {viewMode === 'email' ? (
        <div className="max-w-2xl mx-auto">
          {/* Mock Email Client Header */}
          <div className="bg-slate-900 border border-slate-800 border-b-0 rounded-t-2xl p-4 text-xs text-slate-400 space-y-1.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-slate-300">From: Rowell Mark Blanca &lt;billing@rowellblanca.dev&gt;</span>
              <span className="text-[11px] font-mono text-slate-500">Auto-Scheduled Delivery</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-300">To: {sampleInvoice.client.name} &lt;{sampleInvoice.client.email}&gt;</span>
              <span className="text-[10px] uppercase font-black text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                PDF Attached 📎
              </span>
            </div>
            <div className="font-bold text-white pt-1 text-sm">
              Subject: 📄 Invoice #{sampleInvoice.invoiceNumber} for {sampleInvoice.client.company} — Rowell Mark Blanca
            </div>
          </div>

          {/* Actual Email Body Container */}
          <div className="bg-[#f8fafc] text-slate-900 rounded-b-2xl border border-slate-800 p-4 sm:p-8 shadow-2xl overflow-hidden">
            <div className="max-w-xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
              
              {/* Email Hero & Tagline */}
              <div className="bg-gradient-to-br from-[#071224] via-[#0b1a30] to-[#153e75] p-6 sm:p-8 text-white relative overflow-hidden">
                {/* Background glow element */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-start justify-between gap-4 relative z-10">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative h-10 w-10 shrink-0 rounded-xl bg-white/10 p-1.5 flex items-center justify-center border border-white/20">
                        <Image src={logo} alt="Rowell Blanca Logo" width={24} height={24} className="object-contain brightness-0 invert" priority />
                      </div>
                      <span className="inline-block px-3 py-1 bg-amber-500/20 border border-amber-400/30 rounded-full text-amber-300 text-[10px] font-black uppercase tracking-widest">
                        Official Invoice
                      </span>
                    </div>

                    <h1 className="text-2xl font-black tracking-tight text-white">Rowell Mark Blanca</h1>
                    <p className="text-xs text-slate-300 font-medium mt-0.5">Full-Stack Web Development & Engineering</p>

                    {/* Contact & Phone with Icons */}
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-[11px] text-slate-300 mt-2.5">
                      <a href="tel:+639688900418" className="inline-flex items-center gap-1 text-amber-300 font-bold hover:underline">
                        <Phone className="w-3 h-3 text-amber-400" />
                        <span>+63 968 890 0418</span>
                      </a>
                      <span className="text-slate-400">•</span>
                      <a href="mailto:rowellblanca94@gmail.com" className="inline-flex items-center gap-1 text-slate-300 hover:text-white">
                        <Mail className="w-3 h-3 text-blue-400" />
                        <span>rowellblanca94@gmail.com</span>
                      </a>
                      <span className="text-slate-400">•</span>
                      <a href="https://rowellblanca.dev" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-emerald-300 hover:text-white">
                        <Globe className="w-3 h-3 text-emerald-400" />
                        <span>rowellblanca.dev</span>
                      </a>
                    </div>
                  </div>
                  <div className="text-right bg-white/10 backdrop-blur-md border border-white/10 px-3.5 py-2 rounded-xl">
                    <span className="text-[9px] uppercase font-extrabold text-slate-300 block tracking-wider">Invoice No.</span>
                    <span className="font-mono font-black text-white text-sm">{sampleInvoice.invoiceNumber}</span>
                  </div>
                </div>

                {/* THE REQUESTED TAGLINE BANNER */}
                <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-blue-600/30 via-indigo-600/30 to-amber-500/20 border-l-4 border-amber-400 backdrop-blur-sm">
                  <div className="text-white font-extrabold text-sm tracking-wide">
                    <span>&ldquo;{sampleInvoice.tagline}&rdquo;</span>
                  </div>
                </div>
              </div>

              {/* Email Body Content */}
              <div className="p-6 sm:p-8 space-y-6">
                
                {/* Greeting & Quick Notice */}
                <div className="text-xs text-slate-600 leading-relaxed">
                  Hi <strong className="text-slate-900">{sampleInvoice.client.name}</strong>,<br />
                  Thank you for your business! Below is your itemized invoice for the completed milestones and development deliverables.
                </div>

                {/* Meta Details Grid */}
                <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider block mb-1">Billed To</span>
                    <div className="font-bold text-slate-900">{sampleInvoice.client.company}</div>
                    <div className="text-slate-600">{sampleInvoice.client.name}</div>
                    <div className="text-slate-500 font-mono text-[11px]">{sampleInvoice.client.email}</div>
                  </div>
                  <div className="space-y-1 text-right">
                    <div>
                      <span className="text-slate-500">Issue Date: </span>
                      <strong className="text-slate-900">{sampleInvoice.issueDate}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Due Date: </span>
                      <strong className="text-rose-600 font-bold">{sampleInvoice.dueDate}</strong>
                    </div>
                    <div className="pt-1">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-black text-[10px] uppercase border border-amber-200">
                        Payment Pending
                      </span>
                    </div>
                  </div>
                </div>

                {/* Multiple Jobs / Line Items Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-500 font-black uppercase text-[10px] tracking-wider">
                        <th className="p-3">Job / Deliverable</th>
                        <th className="p-3 text-center w-12">Qty</th>
                        <th className="p-3 text-right w-20">Rate</th>
                        <th className="p-3 text-right w-24">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sampleInvoice.items.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50">
                          <td className="p-3.5">
                            <div className="font-extrabold text-slate-900 text-xs">{item.title}</div>
                            <div className="text-[11px] text-slate-500 mt-1 leading-snug">{item.details}</div>
                          </td>
                          <td className="p-3.5 text-center font-bold text-slate-600">{item.qty}</td>
                          <td className="p-3.5 text-right font-bold text-slate-600">${item.rate.toLocaleString()}</td>
                          <td className="p-3.5 text-right font-black text-slate-900">${item.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Financial Summary */}
                <div className="flex justify-end pt-2">
                  <div className="w-64 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal:</span>
                      <span className="font-bold text-slate-900">${sampleInvoice.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Discount:</span>
                      <span className="font-bold text-slate-900">$0.00</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Tax / VAT (0%):</span>
                      <span className="font-bold text-slate-900">$0.00</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t-2 border-slate-900 text-sm">
                      <span className="font-black text-slate-900 uppercase">Total Due:</span>
                      <span className="font-black text-[#1d63ed] text-base">${sampleInvoice.total.toLocaleString()} USD</span>
                    </div>
                  </div>
                </div>

                {/* Payment Instructions Box */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="font-extrabold text-slate-800 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-indigo-600" /> Payment Methods & Instructions
                  </div>
                  <p className="text-[11px] text-slate-600">{sampleInvoice.paymentTerms}</p>
                  <div className="pt-2 font-mono text-[11px] text-slate-700 space-y-1 bg-white p-3 rounded-lg border border-slate-200">
                    <div><strong>Bank:</strong> {sampleInvoice.bankDetails.bankName}</div>
                    <div><strong>Beneficiary:</strong> {sampleInvoice.bankDetails.accountName}</div>
                    <div><strong>Account / SWIFT:</strong> {sampleInvoice.bankDetails.accountNumber} ({sampleInvoice.bankDetails.swift})</div>
                    <div><strong>PayPal / Wise:</strong> {sampleInvoice.bankDetails.paypal}</div>
                  </div>
                </div>

                {/* Action CTA Button */}
                <div className="text-center pt-2 space-y-3">
                  <button
                    onClick={() => setViewMode('web')}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#0b1a30] to-[#1d63ed] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl hover:opacity-95 transition-all cursor-pointer"
                  >
                    <span>💳 View Interactive Invoice & Pay Online →</span>
                  </button>
                  <div className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
                    <span>📎 Attached:</span>
                    <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      Invoice-{sampleInvoice.invoiceNumber}.pdf
                    </span>
                  </div>
                </div>

              </div>

              {/* Email Footer */}
              <div className="bg-slate-900 p-6 text-center text-slate-400 text-xs border-t border-slate-800">
                <div className="font-bold text-white mb-1">Rowell Mark Blanca · Full-Stack Web Developer</div>
                <div className="text-[11px] space-x-2">
                  <a href="https://rowellblanca.dev" className="text-blue-400 hover:underline">rowellblanca.dev</a>
                  <span>·</span>
                  <a href="mailto:rowellblanca94@gmail.com" className="text-blue-400 hover:underline">rowellblanca94@gmail.com</a>
                </div>
              </div>

            </div>
          </div>
        </div>
      ) : (
        /* ───────────────────────────────────────────────────────────── */
        /* 2. PRINTABLE WEB & PDF INVOICE VIEW */
        /* ───────────────────────────────────────────────────────────── */
        <div className="max-w-3xl mx-auto bg-white text-slate-900 p-8 sm:p-12 rounded-3xl shadow-2xl border border-slate-200">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-200 pb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative h-11 w-11 shrink-0 rounded-2xl bg-[#0b1a30] p-2 flex items-center justify-center shadow-md">
                  <Image src={logo} alt="Rowell Blanca Logo" width={28} height={28} className="object-contain brightness-0 invert" priority />
                </div>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-black uppercase tracking-wider">
                  {sampleInvoice.tagline}
                </div>
              </div>

              <h1 className="text-3xl font-black text-[#0b1a30] tracking-tight">Rowell Mark Blanca</h1>
              <p className="text-xs text-slate-500 font-medium mt-1">Full-Stack Web Development & Engineering</p>
              
              {/* Contact Details with Icons */}
              <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-slate-600 mt-3 pt-1 font-medium">
                <a href="tel:+639688900418" className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-bold hover:underline">
                  <Phone className="w-3.5 h-3.5 text-amber-500" />
                  <span>+63 968 890 0418</span>
                </a>
                <a href="mailto:rowellblanca94@gmail.com" className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900">
                  <Mail className="w-3.5 h-3.5 text-blue-500" />
                  <span>rowellblanca94@gmail.com</span>
                </a>
                <a href="https://rowellblanca.dev" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900">
                  <Globe className="w-3.5 h-3.5 text-emerald-500" />
                  <span>rowellblanca.dev</span>
                </a>
              </div>
            </div>

            <div className="text-left sm:text-right bg-slate-50 p-4 rounded-2xl border border-slate-200 min-w-[200px]">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Invoice</span>
              <span className="text-xl font-black font-mono text-[#0b1a30] block">{sampleInvoice.invoiceNumber}</span>
              <div className="mt-2 pt-2 border-t border-slate-200 text-xs space-y-1">
                <div className="text-slate-500">Date: <strong className="text-slate-900">{sampleInvoice.issueDate}</strong></div>
                <div className="text-slate-500">Due: <strong className="text-rose-600 font-bold">{sampleInvoice.dueDate}</strong></div>
              </div>
            </div>
          </div>

          {/* Client Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-8 border-b border-slate-200 text-xs">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">Billed To</span>
              <h2 className="text-base font-extrabold text-[#0b1a30]">{sampleInvoice.client.company}</h2>
              <div className="text-slate-700 font-medium mt-1">{sampleInvoice.client.name}</div>
              <div className="text-slate-500 font-mono mt-0.5">{sampleInvoice.client.email}</div>
              <div className="text-slate-500 mt-0.5">{sampleInvoice.client.phone}</div>
              <div className="text-slate-400 mt-1 max-w-xs">{sampleInvoice.client.address}</div>
            </div>
            <div className="flex flex-col justify-between sm:items-end">
              <div className="text-left sm:text-right">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">Payment Status</span>
                <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-black text-xs uppercase border border-amber-300">
                  Pending Payment
                </span>
              </div>
              <div className="text-left sm:text-right mt-4 sm:mt-0">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Total Amount Due</span>
                <span className="text-2xl font-black text-[#1d63ed]">${sampleInvoice.total.toLocaleString()} USD</span>
              </div>
            </div>
          </div>

          {/* Jobs Table */}
          <div className="py-8 border-b border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b-2 border-slate-900 text-slate-900 font-black uppercase text-[10px] tracking-wider">
                  <th className="pb-3">Description / Job Deliverables</th>
                  <th className="pb-3 text-center w-16">Qty</th>
                  <th className="pb-3 text-right w-24">Unit Rate</th>
                  <th className="pb-3 text-right w-28">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sampleInvoice.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-4 pr-4">
                      <div className="font-extrabold text-[#0b1a30] text-sm">{item.title}</div>
                      <div className="text-xs text-slate-600 mt-1 leading-relaxed">{item.details}</div>
                    </td>
                    <td className="py-4 text-center font-bold text-slate-700">{item.qty}</td>
                    <td className="py-4 text-right font-bold text-slate-700">${item.rate.toLocaleString()}</td>
                    <td className="py-4 text-right font-black text-slate-900 text-sm">${item.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 py-8 border-b border-slate-200 text-xs">
            <div className="sm:col-span-7 space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Payment Details</span>
              <p className="text-slate-600 leading-relaxed">{sampleInvoice.paymentTerms}</p>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-[11px] font-mono space-y-1">
                <div>Bank: <strong>{sampleInvoice.bankDetails.bankName}</strong></div>
                <div>Account Name: <strong>{sampleInvoice.bankDetails.accountName}</strong></div>
                <div>Account / SWIFT: <strong>{sampleInvoice.bankDetails.accountNumber} ({sampleInvoice.bankDetails.swift})</strong></div>
                <div>PayPal: <strong>{sampleInvoice.bankDetails.paypal}</strong></div>
              </div>
            </div>

            <div className="sm:col-span-5 space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-bold text-slate-900">${sampleInvoice.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Discount:</span>
                <span className="font-bold text-slate-900">$0.00</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax (0%):</span>
                <span className="font-bold text-slate-900">$0.00</span>
              </div>
              <div className="flex justify-between pt-3 border-t-2 border-slate-900">
                <span className="font-black text-[#0b1a30] text-sm uppercase">Amount Due:</span>
                <span className="font-black text-[#1d63ed] text-xl">${sampleInvoice.total.toLocaleString()} USD</span>
              </div>
            </div>
          </div>

          {/* Footer with Tagline */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <div className="font-bold text-slate-700">
              <span>&ldquo;{sampleInvoice.tagline}&rdquo;</span>
            </div>
            <div className="text-slate-400 text-[11px]">
              Thank you for your business! · rowellblanca.dev
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
