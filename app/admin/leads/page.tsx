'use client';

import React, { useState, useEffect } from 'react';
import { Users, Trash2, FileText } from 'lucide-react';

interface LeadNote {
  id: number;
  content: string;
  createdAt: string;
}

interface Lead {
  id: number;
  contactName: string;
  companyName?: string;
  email: string;
  phone?: string;
  serviceInterest?: string;
  budget?: string;
  enquiryDetails: string;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'PROPOSAL_SENT' | 'WON' | 'LOST' | 'SPAM';
  notes?: LeadNote[];
  submittedAt: string;
}

const LEAD_STATUSES = ['ALL', 'NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL_SENT', 'WON', 'LOST', 'SPAM'];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newNoteContent, setNewNoteContent] = useState('');

  useEffect(() => {
    fetchLeads();
  }, [statusFilter]);

  const fetchLeads = async () => {
    try {
      const res = await fetch(`/api/crm/leads?status=${statusFilter}`);
      const data = await res.json();
      if (data.success) setLeads(data.leads || []);
    } catch (e) {
      console.error('Error fetching leads:', e);
    }
  };

  const handleLeadStatusChange = async (leadId: number, newStatus: string) => {
    try {
      const res = await fetch('/api/crm/leads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchLeads();
        if (selectedLead?.id === leadId) setSelectedLead({ ...selectedLead, status: newStatus as any });
      }
    } catch (e) {
      alert('Failed to update lead status');
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newNoteContent.trim()) return;

    try {
      const res = await fetch('/api/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: selectedLead.id, content: newNoteContent }),
      });
      const data = await res.json();
      if (data.success) {
        setNewNoteContent('');
        fetchLeads();
        if (data.note) {
          setSelectedLead({
            ...selectedLead,
            notes: [data.note, ...(selectedLead.notes || [])],
          });
        }
      }
    } catch (e) {
      alert('Failed to add note');
    }
  };

  const handleDeleteLead = async (leadId: number) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      const res = await fetch(`/api/crm/leads?id=${leadId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchLeads();
        if (selectedLead?.id === leadId) setSelectedLead(null);
      }
    } catch (e) {
      alert('Failed to delete lead');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-[#0b1a30]">
            CRM Leads Pipeline ({(Array.isArray(leads) ? leads : []).length})
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Manage leads, track status stages, and write internal notes.</p>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {LEAD_STATUSES.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                statusFilter === st
                  ? 'bg-[#1d63ed] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className={selectedLead ? 'lg:col-span-7' : 'lg:col-span-12'}>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold">
                    <th className="p-4">Contact</th>
                    <th className="p-4">Service</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Submitted</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {(!Array.isArray(leads) || leads.length === 0) ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400">
                        No CRM leads matching current status filter.
                      </td>
                    </tr>
                  ) : (
                    leads.map((lead) => (
                      <tr
                        key={lead.id}
                        className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                          selectedLead?.id === lead.id ? 'bg-amber-50/60 border-l-4 border-amber-500' : ''
                        }`}
                        onClick={() => setSelectedLead(lead)}
                      >
                        <td className="p-4">
                          <span className="font-extrabold text-[#0b1a30] block text-sm">{lead.contactName}</span>
                          <span className="text-slate-500 block font-mono text-[11px]">{lead.email}</span>
                        </td>
                        <td className="p-4 text-slate-700 font-bold">
                          {lead.serviceInterest || 'General Inquiry'}
                        </td>
                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={lead.status}
                            onChange={(e) => handleLeadStatusChange(lead.id, e.target.value)}
                            className="bg-slate-100 text-xs font-extrabold px-2.5 py-1 rounded-lg border border-slate-300 text-[#0b1a30]"
                          >
                            {LEAD_STATUSES.filter(s => s !== 'ALL').map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                        <td className="p-4 text-slate-400 font-mono">
                          {new Date(lead.submittedAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleDeleteLead(lead.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {selectedLead && (
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-lg relative">
            <button
              onClick={() => setSelectedLead(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-xs font-bold"
            >
              ✕ Close
            </button>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#1d63ed] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                {selectedLead.status}
              </span>
              <h2 className="text-xl font-black text-[#0b1a30] mt-2">{selectedLead.contactName}</h2>
              <p className="text-xs text-slate-500 font-mono">{selectedLead.email}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">Inquiry Message</span>
              <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">{selectedLead.enquiryDetails}</p>
            </div>

            <div className="space-y-3 pt-2">
              <span className="text-xs font-extrabold text-[#0b1a30] uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-[#1d63ed]" /> Internal Admin Notes ({selectedLead.notes?.length || 0})
              </span>

              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add note..."
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#1d63ed]"
                />
                <button type="submit" className="px-4 py-2 rounded-xl bg-[#1d63ed] text-white font-bold text-xs">
                  Add Note
                </button>
              </form>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedLead.notes?.map((n) => (
                  <div key={n.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <p className="text-slate-700 font-medium">{n.content}</p>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
