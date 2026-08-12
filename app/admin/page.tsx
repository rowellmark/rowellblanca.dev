'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users, FolderKanban, MessageSquare, Star, Eye, TrendingUp, ArrowRight,
  Clock, CheckCircle2, Plus, Bell, Sparkles, Globe, BarChart3, ExternalLink,
  FileText, Tag, Settings, X, Save, Check, Loader2, Upload, Image as ImageIcon,
  Activity, Zap, Target, PieChart, LineChart, Calendar, RefreshCw, ChevronUp,
  ChevronDown, Minus,
} from 'lucide-react';
import Image from 'next/image';
import { resolveValidImageSrc } from '@/lib/image-utils';
import {
  AreaChart, Area, BarChart, Bar, PieChart as RechartsPie, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

// ─── helpers ─────────────────────────────────────────────────────────────────

function generateMonthlyData(leads: any[], messages: any[]) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const m = d.getMonth();
    const y = d.getFullYear();
    const lCount = leads.filter(l => {
      const ld = new Date(l.submittedAt || l.createdAt);
      return ld.getMonth() === m && ld.getFullYear() === y;
    }).length;
    const mCount = messages.filter(msg => {
      const md = new Date(msg.createdAt || msg.submittedAt);
      return md.getMonth() === m && md.getFullYear() === y;
    }).length;
    return { month: months[m], leads: lCount, messages: mCount };
  });
}

function generateLeadStatusData(leads: any[]) {
  const statuses: Record<string, number> = {};
  leads.forEach(l => { statuses[l.status] = (statuses[l.status] || 0) + 1; });
  const colors: Record<string, string> = {
    NEW: '#f59e0b', CONTACTED: '#3b82f6', QUALIFIED: '#8b5cf6',
    PROPOSAL: '#06b6d4', WON: '#10b981', LOST: '#ef4444',
  };
  return Object.entries(statuses).map(([name, value]) => ({
    name, value, color: colors[name] || '#94a3b8',
  }));
}

const STAT_COLORS = ['#1d63ed', '#f59e0b', '#10b981', '#8b5cf6'];

// ─── custom tooltip ──────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-xl text-xs">
      <p className="font-black text-[#0b1a30] mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="font-bold" style={{ color: p.color }}>
          {p.name}: <span className="text-[#0b1a30]">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

// ─── stat card ───────────────────────────────────────────────────────────────
function StatCard({
  label, value, sub, subUp, icon: Icon, color, href,
}: {
  label: string; value: string | number; sub: string; subUp?: boolean | null;
  icon: any; color: string; href?: string;
}) {
  const inner = (
    <div className={`bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all group ${href ? 'cursor-pointer' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-0.5">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">{label}</span>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`} style={{ backgroundColor: `${color}15`, color }}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-4">
        <span className="text-4xl font-black text-[#0b1a30] tabular-nums">{value}</span>
      </div>
      <div className="mt-2 flex items-center gap-1 text-xs font-bold">
        {subUp === true && <ChevronUp className="w-3.5 h-3.5 text-emerald-500" />}
        {subUp === false && <ChevronDown className="w-3.5 h-3.5 text-red-400" />}
        {subUp === null && <Minus className="w-3.5 h-3.5 text-slate-400" />}
        <span className={subUp === true ? 'text-emerald-600' : subUp === false ? 'text-red-500' : 'text-slate-500'}>{sub}</span>
      </div>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

// ─── main dashboard ───────────────────────────────────────────────────────────
export default function DashboardHome() {
  const [projectsCount, setProjectsCount] = useState(0);
  const [leads, setLeads] = useState<any[]>([]);
  const [testimonialsCount, setTestimonialsCount] = useState(0);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  // Settings modal state
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [gaId, setGaId] = useState('G-XWQVTC4XWZ');
  const [gtmId, setGtmId] = useState('');
  const [googleVerification, setGoogleVerification] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [uploadingOgImage, setUploadingOgImage] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState('');

  useEffect(() => { fetchDashboardStats(); }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const [projRes, leadRes, testRes, msgRes, settingsRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/crm/leads'),
        fetch('/api/testimonials'),
        fetch('/api/crm/messages'),
        fetch('/api/admin/settings'),
      ]);

      const projData = await projRes.json();
      if (projData.success && Array.isArray(projData.projects)) setProjectsCount(projData.projects.length);

      const leadData = await leadRes.json();
      if (leadData.success && Array.isArray(leadData.leads)) setLeads(leadData.leads);

      const testData = await testRes.json();
      if (testData.success && Array.isArray(testData.testimonials)) setTestimonialsCount(testData.testimonials.length);

      const msgData = await msgRes.json();
      if (msgData.success && Array.isArray(msgData.messages)) setMessages(msgData.messages);

      const settingsData = await settingsRes.json();
      if (settingsData.success && settingsData.settings) {
        if (settingsData.settings.gaId) setGaId(settingsData.settings.gaId);
        if (settingsData.settings.gtmId) setGtmId(settingsData.settings.gtmId);
        if (settingsData.settings.googleVerification) setGoogleVerification(settingsData.settings.googleVerification);
        if (settingsData.settings.metaTitle) setMetaTitle(settingsData.settings.metaTitle);
        if (settingsData.settings.metaDescription) setMetaDescription(settingsData.settings.metaDescription);
        if (settingsData.settings.ogImage) setOgImage(settingsData.settings.ogImage);
      }
    } catch (e) {
      console.error('Dashboard fetch error:', e);
    } finally {
      setLoading(false);
      setLastRefreshed(new Date());
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSuccess('');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gaId, gtmId, googleVerification, metaTitle, metaDescription, ogImage }),
      });
      const data = await res.json();
      if (data.success) {
        setSettingsSuccess('Settings saved!');
        setTimeout(() => { setIsSettingsModalOpen(false); setSettingsSuccess(''); }, 1500);
      }
    } catch {}
    finally { setSavingSettings(false); }
  };

  const handleOgImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingOgImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success && data.url) setOgImage(data.url);
      else alert(data.message || 'Upload failed');
    } catch { alert('Upload error'); }
    finally { setUploadingOgImage(false); e.target.value = ''; }
  };

  // Derived data
  const unreadMessages = messages.filter(m => m.status === 'UNREAD');
  const newLeads = leads.filter(l => l.status === 'NEW');
  const totalNotifications = unreadMessages.length + newLeads.length;
  const monthlyData = generateMonthlyData(leads, messages);
  const leadStatusData = generateLeadStatusData(leads);

  // Lead conversion rate (WON / total)
  const wonLeads = leads.filter(l => l.status === 'WON').length;
  const conversionRate = leads.length > 0 ? Math.round((wonLeads / leads.length) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans pb-12">

      {/* ── HEADER ROW ───────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#0b1a30]">Dashboard Overview</h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Last updated: {lastRefreshed.toLocaleTimeString()}
          </p>
        </div>
        <button
          onClick={fetchDashboardStats}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-extrabold text-slate-600 hover:bg-slate-50 hover:border-[#1d63ed] transition-all shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#1d63ed]' : ''}`} />
          Refresh
        </button>
      </div>

      {/* ── NOTIFICATION BANNER ──────────────────────────── */}
      {totalNotifications > 0 ? (
        <div className="bg-gradient-to-r from-blue-900 via-[#0b1a30] to-indigo-950 text-white rounded-2xl p-5 border border-blue-800/80 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="relative p-2.5 rounded-xl bg-blue-600/30 text-blue-300 border border-blue-500/40 shrink-0 mt-0.5">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </div>
            <div>
              <h2 className="text-base font-black text-white">{totalNotifications} New Notification{totalNotifications > 1 ? 's' : ''}</h2>
              <p className="text-xs text-slate-300 mt-1">
                {unreadMessages.length} unread chat message{unreadMessages.length !== 1 ? 's' : ''} · {newLeads.length} new CRM lead{newLeads.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            {unreadMessages.length > 0 && (
              <Link href="/admin/messages" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" /> Messages ({unreadMessages.length})
              </Link>
            )}
            {newLeads.length > 0 && (
              <Link href="/admin/leads" className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> Leads ({newLeads.length})
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between text-xs text-slate-600 shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="font-bold text-[#0b1a30]">All caught up!</span>
            <span className="text-slate-400">No unread inquiries or pending leads.</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider font-mono bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">System Active</span>
        </div>
      )}

      {/* ── KPI STAT CARDS ───────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Projects" value={projectsCount} sub="Active records" subUp={null} icon={FolderKanban} color="#1d63ed" href="/admin/projects" />
        <StatCard label="CRM Leads" value={leads.length} sub={`${newLeads.length} new this cycle`} subUp={newLeads.length > 0} icon={Users} color="#f59e0b" href="/admin/leads" />
        <StatCard label="Testimonials" value={testimonialsCount} sub="5★ verified reviews" subUp={null} icon={Star} color="#10b981" href="/admin/testimonials" />
        <StatCard label="Messages" value={messages.length} sub={`${unreadMessages.length} unread`} subUp={unreadMessages.length > 0 ? false : null} icon={MessageSquare} color="#8b5cf6" href="/admin/messages" />
      </div>

      {/* ── SECONDARY METRIC CARDS ────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-[#0b1a30] to-indigo-950 rounded-2xl p-5 text-white border border-indigo-900/50 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Lead Conversion</span>
            <Target className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-5xl font-black text-white tabular-nums">{conversionRate}<span className="text-2xl text-amber-400">%</span></div>
          <div className="mt-2 text-xs text-slate-400 font-medium">{wonLeads} won out of {leads.length} total</div>
          <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-1000" style={{ width: `${conversionRate}%` }} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Pipeline Status</span>
            <Activity className="w-4 h-4 text-[#1d63ed]" />
          </div>
          <div className="space-y-2 mt-1">
            {['NEW', 'CONTACTED', 'QUALIFIED', 'WON'].map((status) => {
              const count = leads.filter(l => l.status === status).length;
              const pct = leads.length > 0 ? Math.round((count / leads.length) * 100) : 0;
              const colors: Record<string, string> = { NEW: 'bg-amber-400', CONTACTED: 'bg-blue-500', QUALIFIED: 'bg-violet-500', WON: 'bg-emerald-500' };
              return (
                <div key={status}>
                  <div className="flex items-center justify-between text-xs mb-0.5">
                    <span className="font-bold text-slate-600 capitalize">{status.toLowerCase()}</span>
                    <span className="font-extrabold text-[#0b1a30] tabular-nums">{count}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${colors[status]} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Quick Actions</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="space-y-2">
            {[
              { label: 'Add New Project', href: '/admin/projects', color: 'text-[#1d63ed]', bg: 'bg-blue-50 border-blue-200 hover:bg-blue-100' },
              { label: 'View Lead Pipeline', href: '/admin/leads', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200 hover:bg-amber-100' },
              { label: 'Manage Testimonials', href: '/admin/testimonials', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100' },
              { label: 'SEO & GTM Settings', href: '#', color: 'text-violet-700', bg: 'bg-violet-50 border-violet-200 hover:bg-violet-100' },
            ].map(({ label, href, color, bg }) => (
              <Link key={label} href={href} onClick={label.includes('SEO') ? (e) => { e.preventDefault(); setIsSettingsModalOpen(true); } : undefined}
                className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-extrabold ${color} ${bg} transition-all`}>
                <span>{label}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── CHARTS ROW ───────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Area Chart — 6-month activity */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-black text-[#0b1a30]">Activity Overview</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Leads & messages — last 6 months</p>
            </div>
            <LineChart className="w-5 h-5 text-slate-400" />
          </div>
          {monthlyData.every(d => d.leads === 0 && d.messages === 0) ? (
            <div className="h-52 flex flex-col items-center justify-center text-slate-400 gap-2">
              <BarChart3 className="w-10 h-10 text-slate-200" />
              <p className="text-xs font-bold">No activity data yet — submit a lead to see the graph</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={210}>
              <AreaChart data={monthlyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1d63ed" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#1d63ed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, fontWeight: 700, paddingTop: 12 }} />
                <Area type="monotone" dataKey="leads" name="Leads" stroke="#f59e0b" strokeWidth={2.5} fill="url(#colorLeads)" dot={{ r: 4, fill: '#f59e0b', strokeWidth: 0 }} />
                <Area type="monotone" dataKey="messages" name="Messages" stroke="#1d63ed" strokeWidth={2.5} fill="url(#colorMessages)" dot={{ r: 4, fill: '#1d63ed', strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie Chart — Lead status breakdown */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-black text-[#0b1a30]">Lead Breakdown</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">By pipeline status</p>
            </div>
            <PieChart className="w-5 h-5 text-slate-400" />
          </div>
          {leadStatusData.length === 0 ? (
            <div className="h-52 flex flex-col items-center justify-center text-slate-400 gap-2">
              <Users className="w-10 h-10 text-slate-200" />
              <p className="text-xs font-bold text-center">No leads yet</p>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <RechartsPie>
                  <Pie data={leadStatusData} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                    dataKey="value" paddingAngle={3} strokeWidth={0}>
                    {leadStatusData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </RechartsPie>
              </ResponsiveContainer>
              <div className="mt-3 space-y-1.5">
                {leadStatusData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="font-bold text-slate-600 capitalize">{item.name.toLowerCase()}</span>
                    </div>
                    <span className="font-extrabold text-[#0b1a30]">{item.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── CORE MODULES ─────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-[11px] font-extrabold tracking-wider uppercase text-slate-400">Core Portal Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { href: '/admin/projects', icon: FolderKanban, label: 'Projects', desc: 'Manage portfolio project records, permalinks, and tech stack pills.', cta: 'Manage Projects', color: '#1d63ed', bg: 'bg-blue-50', textColor: 'text-[#1d63ed]', border: 'hover:border-[#1d63ed]' },
            { href: '/admin/leads', icon: Users, label: 'Leads & CRM', desc: 'Track pipeline leads, update status stages, and add internal notes.', cta: 'View Lead Pipeline', color: '#f59e0b', bg: 'bg-amber-50', textColor: 'text-amber-600', border: 'hover:border-amber-500' },
            { href: '/admin/testimonials', icon: Star, label: 'Testimonials', desc: 'Manage client recommendations, star ratings, and display quotes.', cta: 'Manage Reviews', color: '#10b981', bg: 'bg-emerald-50', textColor: 'text-emerald-600', border: 'hover:border-emerald-500' },
            { href: '/admin/messages', icon: MessageSquare, label: 'Messages', desc: 'View contact form submissions and Mailtrap email log alerts.', cta: 'View Messages', color: '#8b5cf6', bg: 'bg-purple-50', textColor: 'text-purple-600', border: 'hover:border-purple-500' },
          ].map(({ href, icon: Icon, label, desc, cta, color, bg, textColor, border }) => (
            <Link key={href} href={href} className={`bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between ${border} hover:shadow-lg transition-all group`}>
              <div className="space-y-3">
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`} style={{ color }}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`font-extrabold text-base text-[#0b1a30] group-hover:${textColor} transition-colors`}>{label}</h3>
                  <p className="text-xs text-slate-500 mt-1">{desc}</p>
                </div>
              </div>
              <div className={`pt-4 flex items-center gap-1.5 text-xs font-extrabold ${textColor}`}>
                <span>{cta}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── SEO & SITEMAP ────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-[11px] font-extrabold tracking-wider uppercase text-slate-400">SEO, Analytics & Indexing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2"><BarChart3 className="w-5 h-5 text-emerald-600" /><h3 className="font-extrabold text-sm text-[#0b1a30]">Google Analytics & GTM</h3></div>
                <p className="text-xs text-slate-500">GA4 gtag.js & Tag Manager tracking.</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">Active</span>
            </div>
            <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
              <div className="flex justify-between"><span className="text-slate-500">GA4 ID:</span><span className="font-mono font-extrabold text-[#0b1a30]">{gaId || 'G-XWQVTC4XWZ'}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">GTM ID:</span><span className="font-mono font-extrabold text-slate-600">{gtmId || 'Not Set'}</span></div>
            </div>
            <button onClick={() => setIsSettingsModalOpen(true)} className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold transition-all">
              <Settings className="w-3.5 h-3.5 text-amber-400" /> Configure GTM & SEO Keys
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2"><Globe className="w-5 h-5 text-blue-600" /><h3 className="font-extrabold text-sm text-[#0b1a30]">XML Sitemap</h3></div>
                <p className="text-xs text-slate-500">Dynamic sitemap for Google & Bing.</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-blue-50 text-blue-700 border border-blue-200">Dynamic</span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Indexes <strong className="text-[#0b1a30]">{5 + projectsCount}</strong> pages</span>
              <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-extrabold border border-blue-200 transition-all">
                View sitemap.xml <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2"><FileText className="w-5 h-5 text-amber-600" /><h3 className="font-extrabold text-sm text-[#0b1a30]">Robots.txt Rules</h3></div>
                <p className="text-xs text-slate-500">Blocks /admin & /api from crawlers.</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-50 text-amber-700 border border-amber-200">Configured</span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Crawler rules active</span>
              <a href="/robots.txt" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-extrabold border border-amber-200 transition-all">
                View robots.txt <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── RECENT LEADS TABLE ───────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-[#0b1a30] flex items-center gap-2">
            <Users className="h-5 w-5 text-amber-500" /> Recent CRM Leads ({leads.length})
          </h2>
          <Link href="/admin/leads" className="text-xs font-extrabold text-[#1d63ed] hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold">
                  <th className="p-4">Contact</th>
                  <th className="p-4">Service</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-10 text-center text-slate-400">
                      <Users className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                      No CRM leads yet. Submit a form on the contact page to test!
                    </td>
                  </tr>
                ) : (
                  leads.slice(0, 6).map((lead) => {
                    const statusColors: Record<string, string> = {
                      NEW: 'bg-amber-50 text-amber-700 border-amber-200',
                      CONTACTED: 'bg-blue-50 text-blue-700 border-blue-200',
                      QUALIFIED: 'bg-violet-50 text-violet-700 border-violet-200',
                      WON: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                      LOST: 'bg-red-50 text-red-700 border-red-200',
                    };
                    return (
                      <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-4">
                          <span className="font-extrabold text-[#0b1a30] block">{lead.contactName}</span>
                          <span className="text-slate-400 font-mono text-[11px]">{lead.email}</span>
                        </td>
                        <td className="p-4 text-slate-700 font-bold">{lead.serviceInterest || 'General Inquiry'}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase border ${statusColors[lead.status] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="p-4 text-slate-400 font-mono">{new Date(lead.submittedAt).toLocaleDateString()}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── SEO SETTINGS MODAL ───────────────────────────── */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150 !mt-0">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-slate-900 text-amber-400"><Settings className="w-5 h-5" /></div>
                <div>
                  <h3 className="text-lg font-black text-[#0b1a30]">Site Meta & SEO Settings</h3>
                  <p className="text-xs text-slate-500 font-medium">GTM, Search Console, OG image</p>
                </div>
              </div>
              <button onClick={() => setIsSettingsModalOpen(false)} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {settingsSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" /> {settingsSuccess}
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4">
              {[
                { label: 'Meta Title', value: metaTitle, setter: setMetaTitle, placeholder: 'Full-Stack Software Engineer | Rowell Mark Blanca', hint: 'Overrides default site title.' },
                { label: 'Meta Description', value: metaDescription, setter: setMetaDescription, placeholder: 'Short description for search results', hint: 'Overrides default meta description.', textarea: true },
              ].map(({ label, value, setter, placeholder, hint, textarea }) => (
                <div key={label} className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">{label}</label>
                  {textarea ? (
                    <textarea rows={3} value={value} onChange={(e) => setter(e.target.value)} placeholder={placeholder}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-[#0b1a30] focus:outline-none focus:border-blue-600 transition-all resize-none" />
                  ) : (
                    <input type="text" value={value} onChange={(e) => setter(e.target.value)} placeholder={placeholder}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-[#0b1a30] focus:outline-none focus:border-blue-600 transition-all" />
                  )}
                  <p className="text-[11px] text-slate-400">{hint}</p>
                </div>
              ))}

              {/* OG Image */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#1d63ed]" /> Open Graph Image
                </label>
                {ogImage && (
                  <div className="relative w-full h-28 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group">
                    <Image src={resolveValidImageSrc(ogImage)} alt="OG" fill sizes="(max-width: 768px) 100vw, 500px" className="object-cover" unoptimized />
                    <button type="button" onClick={() => setOgImage('')} className="absolute top-1.5 right-1.5 p-1.5 rounded-lg bg-slate-900/70 text-white opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                <label className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 cursor-pointer text-slate-600 font-bold text-xs">
                  {uploadingOgImage ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1d63ed]" /> : <Upload className="w-3.5 h-3.5 text-[#1d63ed]" />}
                  <span>{ogImage ? 'Replace Image' : 'Upload Image'}</span>
                  <input type="file" accept="image/*" onChange={handleOgImageUpload} disabled={uploadingOgImage} className="hidden" />
                </label>
              </div>

              {/* GA4 / GTM */}
              {[
                { label: 'GA4 Measurement ID', value: gaId, setter: setGaId, placeholder: 'G-XWQVTC4XWZ' },
                { label: 'GTM Container ID', value: gtmId, setter: setGtmId, placeholder: 'GTM-N89XYZ' },
                { label: 'Google Search Console Verification', value: googleVerification, setter: setGoogleVerification, placeholder: 'verification_code_string' },
              ].map(({ label, value, setter, placeholder }) => (
                <div key={label} className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">{label}</label>
                  <input type="text" value={value} onChange={(e) => setter(e.target.value)} placeholder={placeholder}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono text-[#0b1a30] focus:outline-none focus:border-blue-600 transition-all" />
                </div>
              ))}

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsSettingsModalOpen(false)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-extrabold hover:bg-slate-50 transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={savingSettings} className="px-5 py-2.5 rounded-xl bg-[#1d63ed] hover:bg-blue-600 text-white text-xs font-extrabold shadow-md flex items-center gap-2 transition-all">
                  {savingSettings ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Settings</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
