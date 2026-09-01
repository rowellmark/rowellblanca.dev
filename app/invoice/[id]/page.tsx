'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import logo from '@/assets/images/logo.png';
import { 
  Sparkles, 
  Printer, 
  CheckCircle2, 
  CreditCard, 
  Copy, 
  Check, 
  Loader2, 
  AlertCircle,
  ExternalLink,
  ArrowLeft,
  Phone,
  Mail,
  Globe
} from 'lucide-react';

interface InvoiceItem {
  id: number;
  description: string;
  details?: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface Invoice {
  id: number;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  clientCompany?: string;
  clientPhone?: string;
  clientAddress?: string;
  currency: string;
  subtotal: number;
  discount: number;
  taxRate: number;
  totalAmount: number;
  tagline: string;
  notes?: string;
  paymentTerms?: string;
  paymentDetails?: string;
  status: 'DRAFT' | 'SCHEDULED' | 'SENT' | 'PAID' | 'CANCELLED';
  issueDate: string;
  dueDate: string;
  sentAt?: string;
  paidAt?: string;
  items: InvoiceItem[];
}

export default function ClientInvoiceViewPage() {
  const params = useParams();
  const invoiceId = params?.id as string;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedBank, setCopiedBank] = useState(false);

  useEffect(() => {
    if (!invoiceId) return;

    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/invoices/${invoiceId}`);
        const data = await res.json();
        if (data.success && data.invoice) {
          setInvoice(data.invoice);
        } else {
          setError(data.message || 'Invoice not found');
        }
      } catch (err: any) {
        setError('Failed to load invoice. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceId]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyPayment = () => {
    if (!invoice?.paymentDetails) return;
    navigator.clipboard.writeText(invoice.paymentDetails);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2500);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const getCurrencySymbol = (currency: string = 'USD') => {
    switch (currency.toUpperCase()) {
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'PHP': return '₱';
      case 'AUD': return 'A$';
      case 'CAD': return 'C$';
      default: return '$';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#071224] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-slate-300">
          <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
          <p className="text-sm font-semibold">Loading your invoice...</p>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-[#071224] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-black text-white">Invoice Not Found</h1>
          <p className="text-xs text-slate-400">{error || 'The requested invoice could not be located.'}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to rowellblanca.dev</span>
          </Link>
        </div>
      </div>
    );
  }

  const symbol = getCurrencySymbol(invoice.currency);
  const isPaid = invoice.status === 'PAID';
  const isOverdue = !isPaid && new Date(invoice.dueDate) < new Date();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-900 font-sans py-8 sm:py-12 px-4 sm:px-6 lg:px-8 print:p-0 print:bg-white">
      
      {/* Top Action Bar (Hidden in Print) */}
      <div className="max-w-3xl mx-auto mb-6 flex items-center justify-between gap-4 print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to rowellblanca.dev</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1d63ed] hover:bg-blue-600 text-white text-xs font-extrabold shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print or Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Main Printable Invoice Card */}
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 sm:p-12 print:shadow-none print:border-none print:p-4">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-200 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative h-11 w-11 shrink-0 rounded-2xl bg-[#0b1a30] p-2 flex items-center justify-center shadow-md">
                <Image src={logo} alt="Rowell Blanca Logo" width={28} height={28} className="object-contain brightness-0 invert" priority />
              </div>
              <div>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-black uppercase tracking-wider">
                  {invoice.tagline || 'Bring your ideas in to reality.'}
                </div>
              </div>
            </div>

            <h1 className="text-3xl font-black text-[#0b1a30] tracking-tight">Rowell Mark Blanca</h1>
            <p className="text-xs text-slate-500 font-medium mt-1">Full-Stack Web Development & Software Engineering</p>
            
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

          <div className="text-left sm:text-right bg-slate-50 p-4 rounded-2xl border border-slate-200 min-w-[210px] print:bg-transparent print:border-slate-300">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Invoice Number</span>
            <span className="text-xl font-black font-mono text-[#0b1a30] block">{invoice.invoiceNumber}</span>
            <div className="mt-2.5 pt-2.5 border-t border-slate-200 text-xs space-y-1">
              <div className="text-slate-500">Issued: <strong className="text-slate-900">{formatDate(invoice.issueDate)}</strong></div>
              <div className="text-slate-500">Due: <strong className={isOverdue ? 'text-rose-600 font-bold' : 'text-slate-900 font-bold'}>{formatDate(invoice.dueDate)}</strong></div>
            </div>
          </div>
        </div>

        {/* Client & Status Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-8 border-b border-slate-200 text-xs">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">Billed To</span>
            {invoice.clientCompany && (
              <h2 className="text-base font-extrabold text-[#0b1a30]">{invoice.clientCompany}</h2>
            )}
            <div className="text-slate-800 font-bold mt-0.5">{invoice.clientName}</div>
            <div className="text-slate-500 font-mono mt-0.5">{invoice.clientEmail}</div>
            {invoice.clientPhone && (
              <div className="text-slate-500 mt-0.5">{invoice.clientPhone}</div>
            )}
            {invoice.clientAddress && (
              <div className="text-slate-400 mt-1 max-w-xs leading-relaxed">{invoice.clientAddress}</div>
            )}
          </div>

          <div className="flex flex-col justify-between sm:items-end">
            <div className="text-left sm:text-right">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">Status</span>
              {isPaid ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-black text-xs uppercase border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Paid on {formatDate(invoice.paidAt)}
                </span>
              ) : isOverdue ? (
                <span className="inline-block px-3 py-1 rounded-full bg-rose-100 text-rose-900 font-black text-xs uppercase border border-rose-300">
                  Overdue
                </span>
              ) : (
                <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-black text-xs uppercase border border-amber-300">
                  Payment Pending
                </span>
              )}
            </div>

            <div className="text-left sm:text-right mt-4 sm:mt-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Total Amount Due</span>
              <span className="text-2xl font-black text-[#1d63ed]">
                {symbol}{invoice.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} {invoice.currency}
              </span>
            </div>
          </div>
        </div>

        {/* Itemized Deliverables Table */}
        <div className="py-8 border-b border-slate-200">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b-2 border-slate-900 text-slate-900 font-black uppercase text-[10px] tracking-wider">
                <th className="pb-3">Deliverable / Job Milestone</th>
                <th className="pb-3 text-center w-16">Qty</th>
                <th className="pb-3 text-right w-24">Unit Rate</th>
                <th className="pb-3 text-right w-28">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoice.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-4 pr-4">
                    <div className="font-extrabold text-[#0b1a30] text-sm">{item.description}</div>
                    {item.details && (
                      <div className="text-xs text-slate-600 mt-1 leading-relaxed whitespace-pre-line">{item.details}</div>
                    )}
                  </td>
                  <td className="py-4 text-center font-bold text-slate-700">{item.quantity}</td>
                  <td className="py-4 text-right font-bold text-slate-700">
                    {symbol}{item.unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-4 text-right font-black text-slate-900 text-sm">
                    {symbol}{item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Payment & Totals Section */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 py-8 border-b border-slate-200 text-xs">
          <div className="sm:col-span-7 space-y-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Payment Instructions & Terms</span>
            {invoice.paymentTerms && (
              <p className="text-slate-600 leading-relaxed">{invoice.paymentTerms}</p>
            )}

            {invoice.paymentDetails ? (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 relative group print:bg-transparent print:border-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-indigo-600" /> Direct Transfer / Payment Info
                  </span>
                  <button
                    onClick={handleCopyPayment}
                    className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer print:hidden"
                  >
                    {copiedBank ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedBank ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="text-[11px] font-mono text-slate-800 whitespace-pre-line leading-relaxed">
                  {invoice.paymentDetails}
                </div>
              </div>
            ) : (
              <div className="text-slate-500 italic">
                Please contact rowellblanca94@gmail.com for wire transfer details.
              </div>
            )}

            {invoice.notes && (
              <div className="pt-2 text-[11px] text-slate-500 italic">
                <strong>Notes:</strong> {invoice.notes}
              </div>
            )}
          </div>

          <div className="sm:col-span-5 space-y-2">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-bold text-slate-900">{symbol}{invoice.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            {invoice.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount:</span>
                <span className="font-bold">-{symbol}{invoice.discount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            {invoice.taxRate > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Tax ({invoice.taxRate}%):</span>
                <span className="font-bold text-slate-900">
                  {symbol}{((invoice.subtotal - invoice.discount) * (invoice.taxRate / 100)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}
            <div className="flex justify-between pt-3 border-t-2 border-slate-900">
              <span className="font-black text-[#0b1a30] text-sm uppercase">Total Due:</span>
              <span className="font-black text-[#1d63ed] text-xl">
                {symbol}{invoice.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} {invoice.currency}
              </span>
            </div>
          </div>
        </div>

        {/* Footer with Tagline */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="font-extrabold text-slate-800">
            <span>&ldquo;{invoice.tagline || 'Bring your ideas in to reality.'}&rdquo;</span>
          </div>
          <div className="text-slate-400 text-[11px]">
            Thank you for your business! · rowellblanca.dev
          </div>
        </div>

      </div>
    </div>
  );
}
