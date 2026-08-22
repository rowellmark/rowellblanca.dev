'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Trash2,
  FileText,
  ShieldCheck,
  ShieldAlert,
  ExternalLink,
  Globe,
  Phone,
  Building2,
  DollarSign,
  Sparkles,
  Loader2,
  Bot,
  CheckCircle2,
  AlertTriangle,
  Zap,
  RefreshCw,
} from 'lucide-react';

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
  sourceUrl?: string;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'PROPOSAL_SENT' | 'WON' | 'LOST' | 'SPAM';
  notes?: LeadNote[];
  submittedAt: string;
}

interface ParsedAiAnalysis {
  hasAnalysis: boolean;
  classification?: 'HIGH_INTENT' | 'VALID_LEAD' | 'LOW_QUALITY' | 'PROBE' | 'SPAM';
  score?: number;
  isSpam?: boolean;
  spamReason?: string;
  intent?: string;
  summary?: string;
  suggestedNextAction?: string;
}

const LEAD_STATUSES = ['ALL', 'NEW', 'QUALIFIED', 'CONTACTED', 'PROPOSAL_SENT', 'WON', 'LOST', 'SPAM'];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sourceFilter, setSourceFilter] = useState<'ALL' | 'LIVE_CHAT' | 'WEB_FORM'>('ALL');
  const [aiFilter, setAiFilter] = useState<'ALL' | 'HIGH_INTENT' | 'VALID' | 'SPAM' | 'UNSCANNED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isScanningAll, setIsScanningAll] = useState(false);
  const [scanningLeadId, setScanningLeadId] = useState<number | null>(null);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  const fetchLeads = React.useCallback(async () => {
    try {
      const res = await fetch(`/api/crm/leads?status=${statusFilter}`);
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads || []);
        if (selectedLead) {
          const updatedSelected = (data.leads || []).find((l: Lead) => l.id === selectedLead.id);
          if (updatedSelected) setSelectedLead(updatedSelected);
        }
      }
    } catch (e) {
      console.error('Error fetching leads:', e);
    }
  }, [statusFilter, selectedLead]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const parseAiNote = (notes?: LeadNote[]): ParsedAiAnalysis => {
    if (!notes || notes.length === 0) return { hasAnalysis: false };
    const aiNote = notes.find((n) => n.content.includes('[AI SPAM & INTENT ANALYSIS]'));
    if (!aiNote) return { hasAnalysis: false };

    const content = aiNote.content;

    const classificationMatch = content.match(/Classification:\s*([A-Z_]+)/i);
    const scoreMatch = content.match(/Score:\s*(\d+)\/100/i);
    const isSpamMatch = content.match(/Is Spam:\s*YES\s*(?:\(([^)]+)\))?/i);
    const intentMatch = content.match(/Intent:\s*([^\n]+)/i);
    const summaryMatch = content.match(/Summary:\s*([^\n]+)/i);
    const nextActionMatch = content.match(/Suggested Next Action:\s*([^\n]+)/i);

    const classification = (classificationMatch ? classificationMatch[1].toUpperCase() : 'VALID_LEAD') as any;
    const score = scoreMatch ? parseInt(scoreMatch[1], 10) : undefined;
    const isSpam = Boolean(isSpamMatch) || classification === 'SPAM' || classification === 'PROBE';
    const spamReason = isSpamMatch ? isSpamMatch[1] : undefined;

    return {
      hasAnalysis: true,
      classification,
      score,
      isSpam,
      spamReason,
      intent: intentMatch ? intentMatch[1].trim() : undefined,
      summary: summaryMatch ? summaryMatch[1].trim() : undefined,
      suggestedNextAction: nextActionMatch ? nextActionMatch[1].trim() : undefined,
    };
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

  const handleRunAiScanOnLead = async (leadId: number) => {
    setScanningLeadId(leadId);
    try {
      const res = await fetch('/api/crm/leads/ai-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId }),
      });
      const data = await res.json();
      if (data.success) {
        setScanMessage(`Lead analyzed: ${data.analysis?.classification || 'Analyzed'} (Score: ${data.analysis?.leadQualityScore}/100)`);
        setTimeout(() => setScanMessage(null), 4000);
        await fetchLeads();
      } else {
        alert(data.message || 'AI scan failed');
      }
    } catch (e) {
      alert('Error communicating with AI scan endpoint');
    } finally {
      setScanningLeadId(null);
    }
  };

  const handleScanAllLeads = async () => {
    setIsScanningAll(true);
    setScanMessage('AI is scanning and classifying leads...');
    try {
      const res = await fetch('/api/crm/leads/ai-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scanAll: true, forceReScan: false }),
      });
      const data = await res.json();
      if (data.success) {
        setScanMessage(data.message || `Analyzed leads with AI!`);
        setTimeout(() => setScanMessage(null), 5000);
        await fetchLeads();
      } else {
        alert(data.message || 'Batch AI scan failed');
      }
    } catch (e) {
      alert('Batch AI scan request failed');
    } finally {
      setIsScanningAll(false);
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

  const filteredLeads = (Array.isArray(leads) ? leads : []).filter((lead: Lead) => {
    const isLiveChat = lead.sourceUrl?.includes('Live Chat') || lead.serviceInterest?.includes('[Live Chat]');
    if (sourceFilter === 'LIVE_CHAT' && !isLiveChat) return false;
    if (sourceFilter === 'WEB_FORM' && isLiveChat) return false;

    const ai = parseAiNote(lead.notes);
    if (aiFilter === 'HIGH_INTENT' && ai.classification !== 'HIGH_INTENT') return false;
    if (aiFilter === 'VALID' && (ai.isSpam || ai.classification === 'SPAM' || ai.classification === 'PROBE')) return false;
    if (aiFilter === 'SPAM' && (!ai.isSpam && lead.status !== 'SPAM' && ai.classification !== 'SPAM' && ai.classification !== 'PROBE')) return false;
    if (aiFilter === 'UNSCANNED' && ai.hasAnalysis) return false;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchName = lead.contactName?.toLowerCase().includes(query);
      const matchEmail = lead.email?.toLowerCase().includes(query);
      const matchSource = lead.sourceUrl?.toLowerCase().includes(query);
      const matchService = lead.serviceInterest?.toLowerCase().includes(query);
      const matchDetails = lead.enquiryDetails?.toLowerCase().includes(query);
      return matchName || matchEmail || matchSource || matchService || matchDetails;
    }

    return true;
  });

  const getSourceHref = (sourceUrl?: string) => {
    if (!sourceUrl) return null;
    const match = sourceUrl.match(/\(([^)]+)\)/);
    const rawPath = match ? match[1] : sourceUrl;
    if (rawPath.startsWith('/')) return rawPath;
    if (rawPath.startsWith('http')) return rawPath;
    return null;
  };

  const selectedLeadAi = selectedLead ? parseAiNote(selectedLead.notes) : null;

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans">
      {/* Header Banner */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-[#0b1a30]">
              CRM Leads Pipeline ({filteredLeads.length})
            </h1>
            <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600" /> AI Spam & Intent Shield
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Automatic spam detection, AI lead scoring (1-100), intent classification, and origin attribution.
          </p>
        </div>

        {/* Global AI Scan Action */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleScanAllLeads}
            disabled={isScanningAll}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isScanningAll ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>AI Scanning Leads...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Scan & Auto-Tag Leads</span>
              </>
            )}
          </button>
        </div>
      </div>

      {scanMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{scanMessage}</span>
          </div>
          <button onClick={() => setScanMessage(null)} className="text-slate-400 hover:text-slate-700">✕</button>
        </div>
      )}

      {/* Filter Row */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        {/* AI Intent & Spam Quick Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">AI Filter:</span>
          {[
            { id: 'ALL', label: 'All Leads' },
            { id: 'HIGH_INTENT', label: '⚡ High Intent' },
            { id: 'VALID', label: '🎯 Valid Leads' },
            { id: 'SPAM', label: '🔴 Spam / Bots' },
            { id: 'UNSCANNED', label: '⚪ Unscanned' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setAiFilter(tab.id as any)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                aiFilter === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Channel Sources Filter */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setSourceFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              sourceFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All Sources
          </button>
          <button
            type="button"
            onClick={() => setSourceFilter('LIVE_CHAT')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              sourceFilter === 'LIVE_CHAT' ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>💬 Live Chat</span>
          </button>
          <button
            type="button"
            onClick={() => setSourceFilter('WEB_FORM')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              sourceFilter === 'WEB_FORM' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>📩 Web Forms</span>
          </button>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search by contact name, email, service, or lead source page..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#1d63ed] shadow-xs font-medium"
        />

        <div className="flex items-center gap-1 flex-wrap">
          {LEAD_STATUSES.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
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

      {/* Main Grid: Leads Table + Details Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className={selectedLead ? 'lg:col-span-7' : 'lg:col-span-12'}>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold">
                    <th className="p-4">Contact</th>
                    <th className="p-4">AI Score & Intent</th>
                    <th className="p-4">Source & Service</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400">
                        No CRM leads matching current status and AI filters.
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead: Lead) => {
                      const isLiveChat = lead.sourceUrl?.includes('Live Chat') || lead.serviceInterest?.includes('[Live Chat]');
                      const sourceHref = getSourceHref(lead.sourceUrl);
                      const ai = parseAiNote(lead.notes);
                      const isScanningThis = scanningLeadId === lead.id;

                      return (
                        <tr
                          key={lead.id}
                          className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                            selectedLead?.id === lead.id ? 'bg-amber-50/60 border-l-4 border-amber-500' : ''
                          }`}
                          onClick={() => setSelectedLead(lead)}
                        >
                          {/* Contact Info */}
                          <td className="p-4">
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-[#0b1a30] text-sm">{lead.contactName}</span>
                              {ai.isSpam && (
                                <span className="text-[9px] font-black uppercase text-rose-700 bg-rose-100 border border-rose-200 px-1.5 py-0.2 rounded">
                                  SPAM
                                </span>
                              )}
                            </div>
                            <span className="text-slate-500 block font-mono text-[11px]">{lead.email}</span>
                            {lead.companyName && (
                              <span className="text-slate-400 block text-[10px]">{lead.companyName}</span>
                            )}
                          </td>

                          {/* AI Intent & Quality Score Badge */}
                          <td className="p-4">
                            {ai.hasAnalysis ? (
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  {ai.classification === 'HIGH_INTENT' && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] font-black">
                                      ⚡ High Intent ({ai.score}/100)
                                    </span>
                                  )}
                                  {ai.classification === 'VALID_LEAD' && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-100 border border-blue-300 text-blue-800 text-[10px] font-black">
                                      🎯 Valid Lead ({ai.score}/100)
                                    </span>
                                  )}
                                  {ai.classification === 'LOW_QUALITY' && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 border border-amber-300 text-amber-800 text-[10px] font-black">
                                      🟡 Low Quality ({ai.score}/100)
                                    </span>
                                  )}
                                  {(ai.classification === 'SPAM' || ai.classification === 'PROBE') && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-100 border border-rose-300 text-rose-800 text-[10px] font-black">
                                      🔴 AI SPAM ({ai.score}/100)
                                    </span>
                                  )}
                                </div>
                                {ai.intent && (
                                  <p className="text-[11px] text-slate-600 font-medium truncate max-w-[170px]" title={ai.intent}>
                                    {ai.intent}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRunAiScanOnLead(lead.id);
                                }}
                                disabled={isScanningThis}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 hover:bg-amber-100 border border-slate-200 hover:border-amber-300 text-slate-600 hover:text-amber-800 text-[10px] font-bold transition-all cursor-pointer"
                                title="Run instant AI spam & intent analysis"
                              >
                                {isScanningThis ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Sparkles className="w-3 h-3 text-amber-500" />
                                )}
                                <span>AI Scan</span>
                              </button>
                            )}
                          </td>

                          {/* Source & Service */}
                          <td className="p-4 text-slate-700 font-bold">
                            <div className="truncate max-w-[160px]">{lead.serviceInterest || 'General Inquiry'}</div>
                            <div className="flex items-center gap-1.5 flex-wrap mt-1">
                              {isLiveChat ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-50 border border-cyan-200 text-cyan-800 text-[10px] font-extrabold">
                                  💬 Live Chat
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-800 text-[10px] font-extrabold">
                                  📩 Web Form
                                </span>
                              )}

                              {lead.sourceUrl && (
                                sourceHref ? (
                                  <a
                                    href={sourceHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-[10px] font-bold hover:text-[#1d63ed] transition-colors"
                                    title={`View conversion page: ${sourceHref}`}
                                  >
                                    <Globe className="h-2.5 w-2.5" />
                                    <span className="max-w-[120px] truncate">{lead.sourceUrl}</span>
                                    <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                                  </a>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-medium max-w-[120px] truncate">
                                    {lead.sourceUrl}
                                  </span>
                                )
                              )}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="p-4" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={lead.status}
                              onChange={(e) => handleLeadStatusChange(lead.id, e.target.value)}
                              className={`text-xs font-extrabold px-2.5 py-1 rounded-lg border cursor-pointer ${
                                lead.status === 'SPAM'
                                  ? 'bg-rose-50 border-rose-300 text-rose-800'
                                  : lead.status === 'QUALIFIED' || lead.status === 'WON'
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                  : 'bg-slate-100 border-slate-300 text-[#0b1a30]'
                              }`}
                            >
                              {LEAD_STATUSES.filter((s) => s !== 'ALL').map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          </td>

                          {/* Actions */}
                          <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleRunAiScanOnLead(lead.id)}
                                disabled={isScanningThis}
                                className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                                title="Run AI Spam & Intent Scan"
                              >
                                <Sparkles className="h-4 w-4" />
                              </button>
                              {lead.status !== 'SPAM' && (
                                <button
                                  onClick={() => handleLeadStatusChange(lead.id, 'SPAM')}
                                  className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                                  title="Mark as SPAM"
                                >
                                  <ShieldAlert className="h-4 w-4" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteLead(lead.id)}
                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Delete Lead"
                              >
                                <Trash2 className="h-4 w-4" />
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
        </div>

        {/* Selected Lead Drawer */}
        {selectedLead && (
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-lg relative">
            <button
              onClick={() => setSelectedLead(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-xs font-bold cursor-pointer"
            >
              ✕ Close
            </button>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md border ${
                  selectedLead.status === 'SPAM'
                    ? 'bg-rose-50 border-rose-200 text-rose-800'
                    : 'bg-blue-50 border-blue-200 text-[#1d63ed]'
                }`}>
                  Status: {selectedLead.status}
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-emerald-600" /> Spam Protected
                </span>
              </div>
              <h2 className="text-xl font-black text-[#0b1a30] mt-2">{selectedLead.contactName}</h2>
              <p className="text-xs text-slate-500 font-mono">{selectedLead.email}</p>
            </div>

            {/* AI INTEL & SPAM ANALYSIS CARD */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white space-y-3 shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Lead Intelligence
                </span>
                <button
                  type="button"
                  onClick={() => handleRunAiScanOnLead(selectedLead.id)}
                  disabled={scanningLeadId === selectedLead.id}
                  className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-slate-200 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${scanningLeadId === selectedLead.id ? 'animate-spin' : ''}`} />
                  <span>Re-Scan</span>
                </button>
              </div>

              {selectedLeadAi?.hasAnalysis ? (
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Classification</span>
                      <span className={`text-xs font-black ${
                        selectedLeadAi.classification === 'HIGH_INTENT'
                          ? 'text-emerald-400'
                          : selectedLeadAi.isSpam
                          ? 'text-rose-400'
                          : 'text-amber-300'
                      }`}>
                        {selectedLeadAi.classification}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Quality Score</span>
                      <span className="text-sm font-black text-white">{selectedLeadAi.score ?? '—'}/100</span>
                    </div>
                  </div>

                  {selectedLeadAi.isSpam && selectedLeadAi.spamReason && (
                    <div className="p-2 rounded-lg bg-rose-950/80 border border-rose-500/30 text-[11px] text-rose-200">
                      <strong>Spam Reason:</strong> {selectedLeadAi.spamReason}
                    </div>
                  )}

                  {selectedLeadAi.summary && (
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Summary</span>
                      <p className="text-[11px] text-slate-200 leading-snug">{selectedLeadAi.summary}</p>
                    </div>
                  )}

                  {selectedLeadAi.suggestedNextAction && (
                    <div className="pt-1">
                      <span className="text-[10px] text-amber-400 block uppercase font-bold">Recommended Action</span>
                      <p className="text-[11px] text-amber-200 font-medium">{selectedLeadAi.suggestedNextAction}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2 text-center py-2">
                  <p className="text-xs text-slate-300">This lead hasn't been scanned with AI yet.</p>
                  <button
                    onClick={() => handleRunAiScanOnLead(selectedLead.id)}
                    className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs cursor-pointer shadow-sm"
                  >
                    Run AI Spam & Quality Analysis
                  </button>
                </div>
              )}
            </div>

            {/* Quick Status Toggles */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleLeadStatusChange(selectedLead.id, 'QUALIFIED')}
                className="flex-1 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Mark Qualified</span>
              </button>
              <button
                type="button"
                onClick={() => handleLeadStatusChange(selectedLead.id, selectedLead.status === 'SPAM' ? 'NEW' : 'SPAM')}
                className={`flex-1 py-2 rounded-xl border text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  selectedLead.status === 'SPAM'
                    ? 'bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-800'
                    : 'bg-rose-50 hover:bg-rose-100 border-rose-300 text-rose-800'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{selectedLead.status === 'SPAM' ? 'Unmark SPAM' : 'Mark as SPAM'}</span>
              </button>
            </div>

            {/* Lead Metadata Grid */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-bold flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-indigo-500" /> Lead Source / Page:
                </span>
                {selectedLead.sourceUrl ? (
                  getSourceHref(selectedLead.sourceUrl) ? (
                    <a
                      href={getSourceHref(selectedLead.sourceUrl)!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-extrabold text-[#1d63ed] hover:underline inline-flex items-center gap-1 max-w-[200px] truncate"
                    >
                      <span>{selectedLead.sourceUrl}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="font-extrabold text-slate-800">{selectedLead.sourceUrl}</span>
                  )
                ) : (
                  <span className="text-slate-400">Web Contact Form</span>
                )}
              </div>

              {selectedLead.companyName && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-bold flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-amber-500" /> Company:
                  </span>
                  <span className="font-extrabold text-slate-800">{selectedLead.companyName}</span>
                </div>
              )}

              {selectedLead.phone && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-bold flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-emerald-500" /> Phone:
                  </span>
                  <a href={`tel:${selectedLead.phone}`} className="font-extrabold text-[#1d63ed] hover:underline">
                    {selectedLead.phone}
                  </a>
                </div>
              )}

              {selectedLead.budget && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-bold flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5 text-emerald-600" /> Budget:
                  </span>
                  <span className="font-extrabold text-emerald-700">{selectedLead.budget}</span>
                </div>
              )}
            </div>

            {/* Inquiry Message */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">Inquiry Message</span>
              <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">{selectedLead.enquiryDetails}</p>
            </div>

            {/* Internal Notes */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-extrabold text-[#0b1a30] uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-[#1d63ed]" /> Internal Admin & AI Notes ({selectedLead.notes?.length || 0})
              </span>

              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add note..."
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#1d63ed]"
                />
                <button type="submit" className="px-4 py-2 rounded-xl bg-[#1d63ed] text-white font-bold text-xs cursor-pointer">
                  Add Note
                </button>
              </form>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {selectedLead.notes?.map((n) => (
                  <div key={n.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <p className="text-slate-700 font-medium whitespace-pre-line">{n.content}</p>
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
