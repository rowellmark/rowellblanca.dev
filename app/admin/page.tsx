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
} from 'lucide-react';

export default function DashboardHome() {
  const [projectsCount, setProjectsCount] = useState(0);
  const [leads, setLeads] = useState<any[]>([]);
  const [testimonialsCount, setTestimonialsCount] = useState(0);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [projRes, leadRes, testRes, msgRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/crm/leads'),
        fetch('/api/testimonials'),
        fetch('/api/crm/messages'),
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
    } catch (e) {
      console.error('Error fetching dashboard stats:', e);
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

    </div>
  );
}
