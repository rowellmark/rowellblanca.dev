'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  FolderKanban,
  MessageSquare,
  Star,
  Eye,
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle2,
  Plus,
  Bell,
  Sparkles,
  Globe,
  BarChart3,
  ExternalLink,
  FileText,
  Tag,
  Settings,
  X,
  Save,
  Check,
  Loader2,
} from 'lucide-react';

export default function DashboardHome() {
  const [projectsCount, setProjectsCount] = useState(0);
  const [leads, setLeads] = useState<any[]>([]);
  const [testimonialsCount, setTestimonialsCount] = useState(0);
  const [messages, setMessages] = useState<any[]>([]);

  // SEO & GTM Settings State
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [gaId, setGaId] = useState('G-XWQVTC4XWZ');
  const [gtmId, setGtmId] = useState('');
  const [googleVerification, setGoogleVerification] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [projRes, leadRes, testRes, msgRes, settingsRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/crm/leads'),
        fetch('/api/testimonials'),
        fetch('/api/crm/messages'),
        fetch('/api/admin/settings'),
      ]);

      const projData = await projRes.json();
      if (projData.success && Array.isArray(projData.projects)) {
        setProjectsCount(projData.projects.length);
      }

      const leadData = await leadRes.json();
      if (leadData.success && Array.isArray(leadData.leads)) {
        setLeads(leadData.leads);
      }

      const testData = await testRes.json();
      if (testData.success && Array.isArray(testData.testimonials)) {
        setTestimonialsCount(testData.testimonials.length);
      }

      const msgData = await msgRes.json();
      if (msgData.success && Array.isArray(msgData.messages)) {
        setMessages(msgData.messages);
      }

      const settingsData = await settingsRes.json();
      if (settingsData.success && settingsData.settings) {
        if (settingsData.settings.gaId) setGaId(settingsData.settings.gaId);
        if (settingsData.settings.gtmId) setGtmId(settingsData.settings.gtmId);
        if (settingsData.settings.googleVerification) setGoogleVerification(settingsData.settings.googleVerification);
      }
    } catch (e) {
      console.error('Error fetching dashboard stats:', e);
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
        body: JSON.stringify({ gaId, gtmId, googleVerification }),
      });
      const data = await res.json();
      if (data.success) {
        setSettingsSuccess('GTM & SEO Settings updated successfully!');
        setTimeout(() => {
          setIsSettingsModalOpen(false);
          setSettingsSuccess('');
        }, 1500);
      }
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setSavingSettings(false);
    }
  };

  const unreadMessages = messages.filter((m) => m.status === 'UNREAD');
  const newLeads = leads.filter((l) => l.status === 'NEW');
  const totalNotifications = unreadMessages.length + newLeads.length;

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans">
      
      {/* ── NOTIFICATION ALERT BANNER ───────────────────────────────────────── */}
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
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black tracking-tight text-white">
                  {totalNotifications} New Notification{totalNotifications > 1 ? 's' : ''} Requiring Attention
                </h2>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-blue-500/20 text-cyan-300 border border-cyan-400/30 px-2 py-0.5 rounded-full">
                  Live CRM Alert
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium mt-1">
                You have {unreadMessages.length} unread live chat inquiry message{unreadMessages.length !== 1 ? 's' : ''} and {newLeads.length} new CRM lead submission{newLeads.length !== 1 ? 's' : ''}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {unreadMessages.length > 0 && (
              <Link
                href="/admin/messages"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Reply to Messages ({unreadMessages.length})</span>
              </Link>
            )}

            {newLeads.length > 0 && (
              <Link
                href="/admin/leads"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Review Leads ({newLeads.length})</span>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between text-xs text-slate-600 shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="font-bold text-[#0b1a30]">All caught up!</span>
            <span className="text-slate-400">No unread chat inquiries or pending CRM leads.</span>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">System Active</span>
        </div>
      )}

      
      {/* ── TOP STATS GRID (Views, Projects, Leads, Messages) ────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Stat 1: Site Stats / Views */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-[#1d63ed] transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Total Site Views</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1d63ed] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Eye className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#0b1a30]">1,482</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> +14.2%
            </span>
          </div>
        </div>

        {/* Stat 2: Total Projects */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-[#1d63ed] transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Total Projects</span>
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FolderKanban className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#0b1a30]">{projectsCount}</span>
            <span className="text-xs font-bold text-emerald-600">Active Records</span>
          </div>
        </div>

        {/* Stat 3: CRM Leads */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-amber-500 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">CRM Leads</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#0b1a30]">{leads.length}</span>
            <span className="text-xs font-bold text-amber-600">In Pipeline</span>
          </div>
        </div>

        {/* Stat 4: Testimonials & Feedback */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-emerald-500 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Testimonials</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Star className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#0b1a30]">{testimonialsCount}</span>
            <span className="text-xs font-bold text-emerald-600">5 ★ Reviews</span>
          </div>
        </div>

      </div>

      {/* ── CORE MODULES QUICK NAVIGATION ─────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-[11px] font-extrabold tracking-wider uppercase text-slate-400">
          CORE PORTAL MODULES
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <Link
            href="/admin/projects"
            className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:border-[#1d63ed] hover:shadow-lg transition-all group"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1d63ed] flex items-center justify-center">
                <FolderKanban className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#0b1a30] group-hover:text-[#1d63ed] transition-colors">
                  Projects
                </h3>
                <p className="text-xs text-slate-500 mt-1">Manage portfolio project records, permalinks, and tech stack pills.</p>
              </div>
            </div>
            <div className="pt-4 flex items-center gap-1.5 text-xs font-extrabold text-[#1d63ed]">
              <span>Manage Projects</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/admin/leads"
            className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:border-amber-500 hover:shadow-lg transition-all group"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#0b1a30] group-hover:text-amber-600 transition-colors">
                  Leads & CRM
                </h3>
                <p className="text-xs text-slate-500 mt-1">Track pipeline leads, update status stages, and add internal notes.</p>
              </div>
            </div>
            <div className="pt-4 flex items-center gap-1.5 text-xs font-extrabold text-amber-600">
              <span>View Lead Pipeline</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/admin/testimonials"
            className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:border-emerald-500 hover:shadow-lg transition-all group"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#0b1a30] group-hover:text-emerald-600 transition-colors">
                  Testimonials
                </h3>
                <p className="text-xs text-slate-500 mt-1">Manage client recommendations, star ratings, and display quotes.</p>
              </div>
            </div>
            <div className="pt-4 flex items-center gap-1.5 text-xs font-extrabold text-emerald-600">
              <span>Manage Reviews</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/admin/messages"
            className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:border-purple-500 hover:shadow-lg transition-all group"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#0b1a30] group-hover:text-purple-600 transition-colors">
                  Messages
                </h3>
                <p className="text-xs text-slate-500 mt-1">View contact form submissions and Mailtrap email log alerts.</p>
              </div>
            </div>
            <div className="pt-4 flex items-center gap-1.5 text-xs font-extrabold text-purple-600">
              <span>View Messages</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

        </div>
      </section>

      {/* ── SEO, GOOGLE ANALYTICS (GTM) & SITEMAP CONTROL PANEL ───────────── */}
      <section className="space-y-4">
        <h2 className="text-[11px] font-extrabold tracking-wider uppercase text-slate-400">
          SEO, ANALYTICS & INDEXING STATUS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: Google Analytics (GA4) & GTM Status */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-extrabold text-sm text-[#0b1a30]">Google Analytics & GTM</h3>
                </div>
                <p className="text-xs text-slate-500">GA4 gtag.js & Tag Manager event tracking scripts.</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                Active
              </span>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">GA4 ID:</span>
                <span className="font-mono font-extrabold text-[#0b1a30]">
                  {gaId || 'G-XWQVTC4XWZ'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">GTM ID:</span>
                <span className="font-mono font-extrabold text-slate-600">
                  {gtmId || 'Not Set'}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(true)}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold transition-all shadow-xs"
              >
                <Settings className="w-3.5 h-3.5 text-amber-400" />
                <span>Configure GTM & SEO Keys</span>
              </button>
            </div>
          </div>

          {/* Card 2: Live XML Sitemap */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <h3 className="font-extrabold text-sm text-[#0b1a30]">XML Sitemap</h3>
                </div>
                <p className="text-xs text-slate-500">Dynamic sitemap for Google & Bing web crawlers.</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                Dynamic
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                Indexes <strong className="text-[#0b1a30] font-extrabold">{5 + projectsCount}</strong> pages
              </span>
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-extrabold transition-all border border-blue-200"
              >
                <span>View sitemap.xml</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Card 3: Robots.txt & Crawler Directives */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-600" />
                  <h3 className="font-extrabold text-sm text-[#0b1a30]">Robots.txt Rules</h3>
                </div>
                <p className="text-xs text-slate-500">Blocks /admin & /api while allowing public pages.</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                Configured
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Search Engine Crawler Rules</span>
              <a
                href="/robots.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-extrabold transition-all border border-amber-200"
              >
                <span>View robots.txt</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* ── RECENT CRM LEADS OVERVIEW ───────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-[#0b1a30] flex items-center gap-2">
            <Users className="h-5 w-5 text-amber-500" /> Recent CRM Leads ({leads.length})
          </h2>
          <Link
            href="/admin/leads"
            className="text-xs font-extrabold text-[#1d63ed] hover:underline flex items-center gap-1"
          >
            View All Leads <ArrowRight className="w-3.5 h-3.5" />
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
                    <td colSpan={4} className="p-8 text-center text-slate-400">
                      No CRM leads submitted yet. Test form on contact page!
                    </td>
                  </tr>
                ) : (
                  leads.slice(0, 5).map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50">
                      <td className="p-4">
                        <span className="font-extrabold text-[#0b1a30] block text-sm">{lead.contactName}</span>
                        <span className="text-slate-500 block font-mono text-[11px]">{lead.email}</span>
                      </td>
                      <td className="p-4 text-slate-700 font-bold">
                        {lead.serviceInterest || 'General Inquiry'}
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                          {lead.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400 font-mono">
                        {new Date(lead.submittedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── GTM & SEO CONFIGURATION MODAL ────────────────────────────────────── */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 relative">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-slate-900 text-amber-400">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#0b1a30]">GTM & SEO Settings</h3>
                  <p className="text-xs text-slate-500 font-medium">Manage Google Tag Manager & Search Console keys</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {settingsSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{settingsSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4">
              
              {/* GA4 ID */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Google Analytics GA4 Measurement ID
                </label>
                <input
                  type="text"
                  value={gaId}
                  onChange={(e) => setGaId(e.target.value)}
                  placeholder="G-XWQVTC4XWZ"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono text-[#0b1a30] focus:outline-none focus:border-blue-600 transition-all"
                />
                <p className="text-[11px] text-slate-400">Your Google Analytics 4 ID (e.g. G-XXXXXXXXXX)</p>
              </div>

              {/* GTM ID */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Google Tag Manager Container ID (GTM)
                </label>
                <input
                  type="text"
                  value={gtmId}
                  onChange={(e) => setGtmId(e.target.value)}
                  placeholder="GTM-N89XYZ"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono text-[#0b1a30] focus:outline-none focus:border-blue-600 transition-all"
                />
                <p className="text-[11px] text-slate-400">Your Google Tag Manager Container ID (e.g. GTM-XXXXXXX)</p>
              </div>

              {/* Search Console Meta Verification */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Google Search Console Meta Verification String
                </label>
                <input
                  type="text"
                  value={googleVerification}
                  onChange={(e) => setGoogleVerification(e.target.value)}
                  placeholder="verification_code_string_from_google"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono text-[#0b1a30] focus:outline-none focus:border-blue-600 transition-all"
                />
                <p className="text-[11px] text-slate-400">Content string for google-site-verification meta tag</p>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSettingsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-extrabold hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="px-5 py-2.5 rounded-xl bg-[#1d63ed] hover:bg-blue-600 text-white text-xs font-extrabold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  {savingSettings ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Settings</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

