'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/assets/images/logo.png';
import {
  Receipt,
  Plus,
  Send,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Search,
  Sparkles,
  Trash2,
  Edit,
  Eye,
  ExternalLink,
  Copy,
  Loader2,
  X,
  CreditCard,
  Building2,
  Mail,
  User,
  RefreshCw,
  Zap,
  Layers,
  ArrowRight,
  Phone,
  Globe
} from 'lucide-react';

interface InvoiceItem {
  id?: number;
  description: string;
  details?: string;
  quantity: number;
  unitPrice: number;
  amount?: number;
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
  scheduledSendDate?: string;
  sentAt?: string;
  paidAt?: string;
  items: InvoiceItem[];
  createdAt: string;
}

interface Lead {
  id: number;
  contactName: string;
  companyName?: string;
  email: string;
  phone?: string;
}

const DEFAULT_TAGLINE = 'Bring your ideas in to reality.';
const DEFAULT_TERMS = 'Payment due within 14 days of issue date. Bank transfer, Wise, Stripe, or PayPal are accepted.';
const DEFAULT_PAYMENT_DETAILS = `Bank: Silicon Valley Bank / Wise USD
Beneficiary: Rowell Mark Blanca
Account Number: **** **** 8392
SWIFT / BIC: WISEUS33XXX
PayPal / Wise: rowellblanca94@gmail.com`;

const JOB_PRESETS = [
  { title: 'Full-Stack Next.js 14 Custom Web App', price: 3500, details: 'App Router architecture, responsive UI components, Tailwind CSS styling, dynamic page routing, and SEO optimization.' },
  { title: 'PostgreSQL Database & CRM Backend Integration', price: 1200, details: 'Prisma ORM schema design, NeonDB connection pooling, automated lead intake pipeline, and custom API webhooks.' },
  { title: 'UI/UX Design & Figma High-Fidelity Prototype', price: 1000, details: 'Modern visual aesthetics, wireframing, dark/light theme tokens, and interactive prototype.' },
  { title: 'Cloud Infrastructure & Performance Tuning', price: 500, details: 'Edge CDN deployment, automated SSL security, image optimization, and 99+ Google Lighthouse score.' },
  { title: 'Monthly Maintenance & Engineering Retainer', price: 800, details: 'Bug fixes, performance monitoring, server maintenance, priority feature enhancements, and backups.' },
];

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({});
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvoiceId, setEditingInvoiceId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);
  const [sendingInvoiceId, setSendingInvoiceId] = useState<number | null>(null);
  const [isProcessingDue, setIsProcessingDue] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    clientName: '',
    clientEmail: '',
    clientCompany: '',
    clientPhone: '',
    clientAddress: '',
    currency: 'USD',
    tagline: DEFAULT_TAGLINE,
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    sendOption: 'schedule', // 'immediate' | 'schedule' | 'draft'
    scheduledSendDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    discount: 0,
    taxRate: 0,
    paymentTerms: DEFAULT_TERMS,
    paymentDetails: DEFAULT_PAYMENT_DETAILS,
    notes: '',
    items: [
      {
        description: 'Full-Stack Next.js 14 Web Application',
        details: 'Modern App Router, responsive UI components, Tailwind CSS styling, dynamic page routing, and SEO optimization.',
        quantity: 1,
        unitPrice: 3500,
      },
    ],
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const fetchInvoices = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/invoices?status=${statusFilter}&search=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.success) {
        setInvoices(data.invoices || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching invoices:', err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery]);

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/crm/leads');
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads || []);
      }
    } catch (e) {
      console.error('Error loading CRM leads:', e);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleOpenCreateModal = () => {
    const year = new Date().getFullYear();
    const count = invoices.length + 1;
    const generatedNum = `INV-${year}-${String(count).padStart(3, '0')}`;

    setEditingInvoiceId(null);
    setFormData({
      invoiceNumber: generatedNum,
      clientName: '',
      clientEmail: '',
      clientCompany: '',
      clientPhone: '',
      clientAddress: '',
      currency: 'USD',
      tagline: DEFAULT_TAGLINE,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      sendOption: 'schedule',
      scheduledSendDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      discount: 0,
      taxRate: 0,
      paymentTerms: DEFAULT_TERMS,
      paymentDetails: DEFAULT_PAYMENT_DETAILS,
      notes: '',
      items: [
        {
          description: 'Full-Stack Next.js 14 Custom Web Platform',
          details: 'High-performance Next.js App Router architecture, responsive UI components, Tailwind CSS styling, dynamic page routing, and SEO optimization.',
          quantity: 1,
          unitPrice: 3500,
        },
      ],
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (inv: Invoice) => {
    setEditingInvoiceId(inv.id);
    setFormData({
      invoiceNumber: inv.invoiceNumber,
      clientName: inv.clientName,
      clientEmail: inv.clientEmail,
      clientCompany: inv.clientCompany || '',
      clientPhone: inv.clientPhone || '',
      clientAddress: inv.clientAddress || '',
      currency: inv.currency || 'USD',
      tagline: inv.tagline || DEFAULT_TAGLINE,
      issueDate: new Date(inv.issueDate).toISOString().split('T')[0],
      dueDate: new Date(inv.dueDate).toISOString().split('T')[0],
      sendOption: inv.status === 'SCHEDULED' ? 'schedule' : inv.status === 'SENT' ? 'immediate' : 'draft',
      scheduledSendDate: inv.scheduledSendDate
        ? new Date(inv.scheduledSendDate).toISOString().slice(0, 16)
        : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      discount: inv.discount || 0,
      taxRate: inv.taxRate || 0,
      paymentTerms: inv.paymentTerms || DEFAULT_TERMS,
      paymentDetails: inv.paymentDetails || DEFAULT_PAYMENT_DETAILS,
      notes: inv.notes || '',
      items: inv.items.map((it) => ({
        description: it.description,
        details: it.details || '',
        quantity: it.quantity,
        unitPrice: it.unitPrice,
      })),
    });
    setIsModalOpen(true);
  };

  const handleSelectLead = (leadId: string) => {
    if (!leadId) return;
    const selected = leads.find((l) => String(l.id) === leadId);
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        clientName: selected.contactName,
        clientEmail: selected.email,
        clientCompany: selected.companyName || prev.clientCompany,
        clientPhone: selected.phone || prev.clientPhone,
      }));
    }
  };

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          description: 'New Job Milestone',
          details: '',
          quantity: 1,
          unitPrice: 500,
        },
      ],
    }));
  };

  const handleAddPreset = (preset: typeof JOB_PRESETS[0]) => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          description: preset.title,
          details: preset.details,
          quantity: 1,
          unitPrice: preset.price,
        },
      ],
    }));
  };

  const handleRemoveItem = (index: number) => {
    if (formData.items.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    setFormData((prev) => {
      const updated = [...prev.items];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, items: updated };
    });
  };

  // Form financial calculation
  const computedSubtotal = useMemo(() => {
    return formData.items.reduce((acc, it) => acc + (Number(it.quantity || 0) * Number(it.unitPrice || 0)), 0);
  }, [formData.items]);

  const computedTotal = useMemo(() => {
    const disc = Math.max(0, Number(formData.discount || 0));
    const tax = Math.max(0, Number(formData.taxRate || 0));
    const taxable = Math.max(0, computedSubtotal - disc);
    const taxAmount = taxable * (tax / 100);
    return Number((taxable + taxAmount).toFixed(2));
  }, [computedSubtotal, formData.discount, formData.taxRate]);

  const handleSubmitInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName.trim() || !formData.clientEmail.trim()) {
      alert('Client Name and Email are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      const isEditing = Boolean(editingInvoiceId);

      const payload = {
        ...(isEditing ? { id: editingInvoiceId } : {}),
        invoiceNumber: formData.invoiceNumber,
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        clientCompany: formData.clientCompany,
        clientPhone: formData.clientPhone,
        clientAddress: formData.clientAddress,
        currency: formData.currency,
        tagline: formData.tagline,
        issueDate: formData.issueDate,
        dueDate: formData.dueDate,
        scheduledSendDate: formData.sendOption === 'schedule' ? formData.scheduledSendDate : null,
        sendNow: formData.sendOption === 'immediate',
        status: formData.sendOption === 'immediate' ? 'SENT' : formData.sendOption === 'schedule' ? 'SCHEDULED' : 'DRAFT',
        discount: Number(formData.discount),
        taxRate: Number(formData.taxRate),
        paymentTerms: formData.paymentTerms,
        paymentDetails: formData.paymentDetails,
        notes: formData.notes,
        items: formData.items,
      };

      const res = await fetch('/api/admin/invoices', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        showToast(isEditing ? 'Invoice updated successfully!' : data.message || 'Invoice created successfully!');
        fetchInvoices();
      } else {
        alert(data.message || 'Failed to save invoice');
      }
    } catch (err: any) {
      alert('Error saving invoice: ' + err?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendNow = async (invoice: Invoice) => {
    if (!confirm(`Are you sure you want to send invoice #${invoice.invoiceNumber} immediately to ${invoice.clientEmail}?`)) return;

    try {
      setSendingInvoiceId(invoice.id);
      const res = await fetch(`/api/admin/invoices/${invoice.id}/send`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast(`⚡ Invoice #${invoice.invoiceNumber} sent successfully!`);
        fetchInvoices();
      } else {
        alert(data.message || 'Failed to send invoice email');
      }
    } catch (e) {
      alert('Error sending invoice email');
    } finally {
      setSendingInvoiceId(null);
    }
  };

  const handleUpdateStatus = async (invoiceId: number, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/invoices', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: invoiceId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Status updated to ${newStatus}`);
        fetchInvoices();
      }
    } catch (e) {
      alert('Failed to update status');
    }
  };

  const handleDeleteInvoice = async (invoiceId: number, num: string) => {
    if (!confirm(`Are you sure you want to delete invoice #${num}? This action cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/admin/invoices?id=${invoiceId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast(`Invoice #${num} deleted.`);
        fetchInvoices();
      }
    } catch (e) {
      alert('Failed to delete invoice');
    }
  };

  const handleProcessDueInvoices = async () => {
    try {
      setIsProcessingDue(true);
      const res = await fetch('/api/admin/invoices/process-scheduled', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'Auto-send check completed!');
        fetchInvoices();
      } else {
        alert(data.message || 'Failed to process scheduled invoices');
      }
    } catch (e) {
      alert('Error triggering auto-send process');
    } finally {
      setIsProcessingDue(false);
    }
  };

  const formatDate = (d?: string) => {
    if (!d) return '—';
    try {
      return new Date(d).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      });
    } catch {
      return d;
    }
  };

  const formatCurrency = (val: number, curr = 'USD') => {
    const symbol = curr === 'EUR' ? '€' : curr === 'GBP' ? '£' : curr === 'PHP' ? '₱' : '$';
    return `${symbol}${Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0b1a30] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-amber-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white text-xs ml-2">✕</button>
        </div>
      )}

      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-[#0b1a30] tracking-tight">
              Invoices & Auto-Send Center
            </h1>
            <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600" /> Multi-Job & Auto-Schedule
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Create multi-job client invoices with tagline <strong className="text-slate-700">&ldquo;Bring your ideas in to reality.&rdquo;</strong>, scheduled auto-delivery, and payment tracking.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleProcessDueInvoices}
            disabled={isProcessingDue}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-extrabold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Scan and send any scheduled invoices that have reached their delivery date"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isProcessingDue ? 'animate-spin' : ''}`} />
            <span>{isProcessingDue ? 'Checking Queue...' : 'Trigger Due Auto-Send'}</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0b1a30] to-[#1d63ed] text-white text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Invoiced</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-[#0b1a30]">
            ${Number(stats.totalInvoiced || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-slate-500 block font-medium">{stats.countTotal || 0} Total Invoices</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Paid Invoices</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600">
            ${Number(stats.totalPaid || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-slate-500 block font-medium">{stats.countPaid || 0} Settled Invoices</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Scheduled Delivery</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600">
            {stats.countScheduled || 0} Queued
          </div>
          <span className="text-[10px] text-slate-500 block font-medium">Auto-dispatch at target date</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Sent / Pending</span>
            <Send className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-[#1d63ed]">
            ${Number(stats.totalPending || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-slate-500 block font-medium">{stats.countSent || 0} Awaiting Payment</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by invoice number, client name, email, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#1d63ed] font-medium"
          />
        </div>

        <div className="flex items-center gap-1 flex-wrap">
          {['ALL', 'SCHEDULED', 'SENT', 'PAID', 'DRAFT'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#0b1a30] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold">
                <th className="p-4">Invoice #</th>
                <th className="p-4">Client & Jobs</th>
                <th className="p-4">Delivery & Due Date</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                    Loading invoices...
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400">
                    <Receipt className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-slate-600 text-sm">No Invoices Found</p>
                    <p className="text-xs text-slate-400 mt-1">Create your first client invoice with auto-schedule delivery.</p>
                    <button
                      onClick={handleOpenCreateModal}
                      className="mt-4 px-4 py-2 rounded-xl bg-[#1d63ed] text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Create Invoice Now
                    </button>
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => {
                  const isSendingThis = sendingInvoiceId === inv.id;
                  const isPaid = inv.status === 'PAID';
                  const isScheduled = inv.status === 'SCHEDULED';
                  const isSent = inv.status === 'SENT';

                  return (
                    <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                      {/* Invoice Number */}
                      <td className="p-4">
                        <div className="font-mono font-black text-slate-900 text-sm">{inv.invoiceNumber}</div>
                        <span className="text-[10px] text-slate-400 block font-mono">ID #{inv.id}</span>
                      </td>

                      {/* Client & Jobs Summary */}
                      <td className="p-4">
                        <div className="font-extrabold text-[#0b1a30] text-sm">{inv.clientName}</div>
                        <div className="text-slate-500 font-mono text-[11px]">{inv.clientEmail}</div>
                        {inv.clientCompany && (
                          <span className="text-slate-400 text-[10px] block">{inv.clientCompany}</span>
                        )}
                        <div className="mt-1 flex items-center gap-1 flex-wrap">
                          <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                            {inv.items?.length || 0} Job Item(s)
                          </span>
                        </div>
                      </td>

                      {/* Dates */}
                      <td className="p-4">
                        <div className="space-y-1">
                          {isScheduled && inv.scheduledSendDate ? (
                            <div className="flex items-center gap-1 text-amber-700 font-bold text-[11px]">
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span>Auto-Send: {new Date(inv.scheduledSendDate).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          ) : inv.sentAt ? (
                            <div className="text-slate-500 text-[11px]">
                              Sent: <strong className="text-slate-700">{formatDate(inv.sentAt)}</strong>
                            </div>
                          ) : (
                            <div className="text-slate-400 text-[11px]">Not scheduled yet</div>
                          )}
                          <div className="text-slate-500 text-[11px]">
                            Due: <strong className="text-slate-900">{formatDate(inv.dueDate)}</strong>
                          </div>
                        </div>
                      </td>

                      {/* Total Amount */}
                      <td className="p-4">
                        <div className="font-black text-slate-900 text-sm">
                          {formatCurrency(inv.totalAmount, inv.currency)}
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{inv.currency}</span>
                      </td>

                      {/* Status Selector */}
                      <td className="p-4">
                        <select
                          value={inv.status}
                          onChange={(e) => handleUpdateStatus(inv.id, e.target.value)}
                          className={`text-xs font-extrabold px-2.5 py-1 rounded-lg border cursor-pointer ${
                            isPaid
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                              : isScheduled
                              ? 'bg-amber-50 border-amber-300 text-amber-800'
                              : isSent
                              ? 'bg-blue-50 border-blue-300 text-blue-800'
                              : 'bg-slate-100 border-slate-300 text-slate-700'
                          }`}
                        >
                          <option value="DRAFT">DRAFT</option>
                          <option value="SCHEDULED">SCHEDULED</option>
                          <option value="SENT">SENT</option>
                          <option value="PAID">PAID</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Send Now Button */}
                          <button
                            onClick={() => handleSendNow(inv)}
                            disabled={isSendingThis}
                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Send Invoice Email Now"
                          >
                            {isSendingThis ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                          </button>

                          {/* Preview Modal */}
                          <button
                            onClick={() => setPreviewInvoice(inv)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Preview Invoice"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Public Link */}
                          <Link
                            href={`/invoice/${inv.invoiceNumber}`}
                            target="_blank"
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                            title="View Public Printable Page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          {/* Edit */}
                          <button
                            onClick={() => handleOpenEditModal(inv)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Edit Invoice"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteInvoice(inv.id, inv.invoiceNumber)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Invoice"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* CREATE / EDIT INVOICE MODAL */}
      {/* ───────────────────────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full my-8 max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-6 py-5 bg-[#0b1a30] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/20 border border-amber-400/30 rounded-xl text-amber-400">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black">{editingInvoiceId ? 'Edit Invoice' : 'Create New Client Invoice'}</h2>
                  <p className="text-xs text-slate-300">Set multi-job billing, price, recipient, and auto-send schedule.</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Form */}
            <form onSubmit={handleSubmitInvoice} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              
              {/* Quick Lead Autofill & Invoice Meta */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-600" /> Client Information & CRM Autofill
                  </span>
                  {leads.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500">Quick Fill from CRM:</span>
                      <select
                        onChange={(e) => handleSelectLead(e.target.value)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 font-bold text-slate-800 cursor-pointer"
                        defaultValue=""
                      >
                        <option value="" disabled>Select Lead...</option>
                        {leads.map((l) => (
                          <option key={l.id} value={l.id}>
                            {l.contactName} ({l.email})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Client Contact Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 font-medium text-slate-900 focus:outline-none focus:border-[#1d63ed]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Client Email (For Auto-Send) *</label>
                    <input
                      type="email"
                      required
                      placeholder="client@company.com"
                      value={formData.clientEmail}
                      onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 font-mono text-slate-900 focus:outline-none focus:border-[#1d63ed]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Company / Organization</label>
                    <input
                      type="text"
                      placeholder="e.g. Acme Corp Ltd"
                      value={formData.clientCompany}
                      onChange={(e) => setFormData({ ...formData, clientCompany: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 font-medium text-slate-900 focus:outline-none focus:border-[#1d63ed]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Client Phone</label>
                    <input
                      type="text"
                      placeholder="+1 (555) 000-0000"
                      value={formData.clientPhone}
                      onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 font-medium text-slate-900 focus:outline-none focus:border-[#1d63ed]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Client Billing Address</label>
                    <input
                      type="text"
                      placeholder="Street, City, State, Country"
                      value={formData.clientAddress}
                      onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 font-medium text-slate-900 focus:outline-none focus:border-[#1d63ed]"
                    />
                  </div>
                </div>
              </div>

              {/* Invoice Numbers & Schedule Options */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-amber-50/50 border border-amber-200">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Invoice Number</label>
                  <input
                    type="text"
                    required
                    value={formData.invoiceNumber}
                    onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 font-mono font-bold text-slate-900 focus:outline-none focus:border-[#1d63ed]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Issue Date</label>
                  <input
                    type="date"
                    required
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 font-medium text-slate-900 focus:outline-none focus:border-[#1d63ed]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Payment Due Date</label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 font-medium text-slate-900 focus:outline-none focus:border-[#1d63ed]"
                  />
                </div>

                {/* Auto Send Schedule Control */}
                <div className="sm:col-span-3 pt-2 border-t border-amber-200 space-y-2">
                  <span className="text-[11px] font-black uppercase text-amber-900 tracking-wider block">
                    ⚡ Auto-Send & Delivery Timing
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                      formData.sendOption === 'schedule' ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold' : 'bg-white border-slate-200 text-slate-700'
                    }`}>
                      <input
                        type="radio"
                        name="sendOption"
                        value="schedule"
                        checked={formData.sendOption === 'schedule'}
                        onChange={(e) => setFormData({ ...formData, sendOption: e.target.value })}
                      />
                      <span>⏰ Schedule Auto-Send Date</span>
                    </label>

                    <label className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                      formData.sendOption === 'immediate' ? 'bg-blue-100 border-blue-400 text-blue-950 font-bold' : 'bg-white border-slate-200 text-slate-700'
                    }`}>
                      <input
                        type="radio"
                        name="sendOption"
                        value="immediate"
                        checked={formData.sendOption === 'immediate'}
                        onChange={(e) => setFormData({ ...formData, sendOption: e.target.value })}
                      />
                      <span>⚡ Send Immediately</span>
                    </label>

                    <label className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                      formData.sendOption === 'draft' ? 'bg-slate-200 border-slate-400 text-slate-900 font-bold' : 'bg-white border-slate-200 text-slate-700'
                    }`}>
                      <input
                        type="radio"
                        name="sendOption"
                        value="draft"
                        checked={formData.sendOption === 'draft'}
                        onChange={(e) => setFormData({ ...formData, sendOption: e.target.value })}
                      />
                      <span>📝 Save as Draft (No Send)</span>
                    </label>
                  </div>

                  {formData.sendOption === 'schedule' && (
                    <div className="pt-2 flex items-center gap-3">
                      <span className="text-xs font-bold text-amber-900">Select Date & Time to Auto-Send:</span>
                      <input
                        type="datetime-local"
                        value={formData.scheduledSendDate}
                        onChange={(e) => setFormData({ ...formData, scheduledSendDate: e.target.value })}
                        className="px-3 py-1.5 rounded-xl bg-white border border-amber-300 font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Tagline & Currency */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Invoice Tagline (Featured on Email & Web)
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 font-bold text-slate-900 focus:outline-none focus:border-[#1d63ed]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 font-bold text-slate-900 cursor-pointer"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="AUD">AUD (A$)</option>
                    <option value="CAD">CAD (C$)</option>
                    <option value="PHP">PHP (₱)</option>
                  </select>
                </div>
              </div>

              {/* Multi-Job Line Items Builder */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="text-[11px] font-black uppercase text-[#0b1a30] tracking-wider flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-blue-600" /> Multiple Jobs & Deliverable Breakdown ({formData.items.length})
                    </span>
                    <p className="text-[11px] text-slate-500">Add individual jobs, milestones, and unit rates.</p>
                  </div>

                  {/* Preset quick buttons */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold text-slate-400">Presets:</span>
                    {JOB_PRESETS.slice(0, 3).map((preset) => (
                      <button
                        key={preset.title}
                        type="button"
                        onClick={() => handleAddPreset(preset)}
                        className="px-2 py-1 rounded-lg bg-white hover:bg-slate-200 border border-slate-300 text-[10px] font-bold text-slate-700 cursor-pointer"
                      >
                        + {preset.title.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  {formData.items.map((item, idx) => {
                    const lineTotal = Number(item.quantity || 0) * Number(item.unitPrice || 0);

                    return (
                      <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 space-y-2 relative group shadow-xs">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-black uppercase text-slate-400">Job Item #{idx + 1}</span>
                          {formData.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(idx)}
                              className="text-slate-400 hover:text-red-500 text-xs font-bold"
                              title="Remove Job"
                            >
                              ✕ Remove
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                          <div className="sm:col-span-6">
                            <input
                              type="text"
                              required
                              placeholder="Job Title / Service Description"
                              value={item.description}
                              onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-bold text-slate-900 text-xs"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <input
                              type="number"
                              min="0.1"
                              step="0.1"
                              required
                              placeholder="Qty"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-bold text-slate-900 text-xs text-center"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              required
                              placeholder="Unit Price"
                              value={item.unitPrice}
                              onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-bold text-slate-900 text-xs text-right"
                            />
                          </div>
                          <div className="sm:col-span-2 flex items-center justify-end font-black text-slate-900 text-xs pr-1">
                            ${lineTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </div>
                        </div>

                        <div>
                          <input
                            type="text"
                            placeholder="Optional deliverable scope notes, bullet points, or specifications"
                            value={item.details || ''}
                            onChange={(e) => handleItemChange(idx, 'details', e.target.value)}
                            className="w-full px-3 py-1 rounded-lg border border-slate-200 text-slate-600 text-[11px]"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={handleAddItem}
                  className="w-full py-2 rounded-xl bg-white hover:bg-slate-100 border border-dashed border-slate-300 text-blue-600 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Another Job Item
                </button>
              </div>

              {/* Financial Calculations & Totals */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Payment Instructions & Bank/Wise Details</label>
                    <textarea
                      rows={3}
                      value={formData.paymentDetails}
                      onChange={(e) => setFormData({ ...formData, paymentDetails: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-white border border-slate-300 font-mono text-[11px] text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Custom Notes for Client</label>
                    <input
                      type="text"
                      placeholder="e.g. Thanks for your partnership!"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-800"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-bold text-slate-900">${computedSubtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-600">
                    <span>Discount ($):</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: Math.max(0, Number(e.target.value)) })}
                      className="w-24 px-2 py-1 rounded-lg border border-slate-300 text-right font-bold text-slate-900"
                    />
                  </div>

                  <div className="flex justify-between items-center text-slate-600">
                    <span>Tax Rate (%):</span>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.taxRate}
                      onChange={(e) => setFormData({ ...formData, taxRate: Math.max(0, Number(e.target.value)) })}
                      className="w-24 px-2 py-1 rounded-lg border border-slate-300 text-right font-bold text-slate-900"
                    />
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t-2 border-slate-900 text-sm">
                    <span className="font-black text-[#0b1a30] uppercase">Total Amount:</span>
                    <span className="font-black text-[#1d63ed] text-lg">
                      ${computedTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })} {formData.currency}
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Footer Submit */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#1d63ed] hover:bg-blue-600 text-white font-black text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Invoice...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{editingInvoiceId ? 'Save Changes' : formData.sendOption === 'immediate' ? 'Create & Send Email Now' : 'Save Invoice'}</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* PREVIEW INVOICE MODAL */}
      {/* ───────────────────────────────────────────────────────────── */}
      {previewInvoice && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full my-8 max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            
            <div className="px-6 py-4 bg-[#0b1a30] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-sm">Invoice #{previewInvoice.invoiceNumber} Preview</span>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/invoice/${previewInvoice.invoiceNumber}`}
                  target="_blank"
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold text-white flex items-center gap-1"
                >
                  <span>Open Web View</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
                <button
                  onClick={() => setPreviewInvoice(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-8 overflow-y-auto space-y-6 text-xs bg-slate-50 flex-1">
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                
                {/* Tagline Callout */}
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 shrink-0 rounded-2xl bg-[#0b1a30] p-1.5 flex items-center justify-center shadow-md">
                    <Image src={logo} alt="Rowell Blanca Logo" width={24} height={24} className="object-contain brightness-0 invert" priority />
                  </div>
                  <div className="p-2.5 px-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-bold text-xs">
                    <span>&ldquo;{previewInvoice.tagline}&rdquo;</span>
                  </div>
                </div>

                <div className="flex justify-between items-start pt-1">
                  <div>
                    <h2 className="text-xl font-black text-[#0b1a30]">Rowell Mark Blanca</h2>
                    <p className="text-slate-500">Full-Stack Web Development & Engineering</p>
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-[11px] text-slate-600 mt-2 font-medium">
                      <a href="tel:+639688900418" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold">
                        <Phone className="w-3 h-3 text-amber-500" />
                        <span>+63 968 890 0418</span>
                      </a>
                      <span className="text-slate-300">•</span>
                      <span className="inline-flex items-center gap-1 text-slate-600">
                        <Mail className="w-3 h-3 text-blue-500" />
                        <span>rowellblanca94@gmail.com</span>
                      </span>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-sm font-black text-slate-900 block">{previewInvoice.invoiceNumber}</span>
                    <span className="text-slate-500 text-[11px]">Due: {formatDate(previewInvoice.dueDate)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Billed To</span>
                    <div className="font-bold text-slate-900">{previewInvoice.clientName}</div>
                    <div className="text-slate-600 font-mono text-[11px]">{previewInvoice.clientEmail}</div>
                    {previewInvoice.clientCompany && <div className="text-slate-500">{previewInvoice.clientCompany}</div>}
                  </div>
                  <div className="text-right space-y-1">
                    <div>Status: <strong className="uppercase">{previewInvoice.status}</strong></div>
                    <div>Issued: {formatDate(previewInvoice.issueDate)}</div>
                  </div>
                </div>

                {/* Items */}
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b text-slate-400 font-bold uppercase text-[10px]">
                      <th className="pb-2">Job Description</th>
                      <th className="pb-2 text-center">Qty</th>
                      <th className="pb-2 text-right">Rate</th>
                      <th className="pb-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {previewInvoice.items.map((it, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 font-bold text-slate-900">
                          {it.description}
                          {it.details && <div className="text-[11px] text-slate-500 font-normal">{it.details}</div>}
                        </td>
                        <td className="py-2.5 text-center">{it.quantity}</td>
                        <td className="py-2.5 text-right">{formatCurrency(it.unitPrice, previewInvoice.currency)}</td>
                        <td className="py-2.5 text-right font-black text-slate-900">{formatCurrency(it.amount || it.quantity * it.unitPrice, previewInvoice.currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totals */}
                <div className="flex justify-end pt-3 border-t">
                  <div className="w-56 space-y-1">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal:</span>
                      <span className="font-bold text-slate-900">{formatCurrency(previewInvoice.subtotal, previewInvoice.currency)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t text-sm font-black text-slate-900">
                      <span>Total Due:</span>
                      <span className="text-blue-600">{formatCurrency(previewInvoice.totalAmount, previewInvoice.currency)}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div className="p-4 bg-white border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setPreviewInvoice(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Close Preview
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
