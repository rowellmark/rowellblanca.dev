'use client';

import React, { useState, useEffect } from 'react';
import { Star, Plus, Trash2, Edit, CheckCircle2, Copy, Check, ExternalLink } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  active: boolean;
  avatarUrl?: string;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({
    name: '',
    role: '',
    company: '',
    quote: '',
    rating: 5,
    active: true,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials');
      const data = await res.json();
      if (data.success && Array.isArray(data.testimonials)) {
        setTestimonials(data.testimonials);
      }
    } catch (e) {
      console.error('Error fetching testimonials:', e);
    }
  };

  const copyReviewLink = () => {
    const link = `${window.location.origin}/review`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingItem ? 'PUT' : 'POST';
    const payload = editingItem ? { ...form, id: editingItem.id } : form;

    try {
      const res = await fetch('/api/testimonials', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setEditingItem(null);
        setForm({ name: '', role: '', company: '', quote: '', rating: 5, active: true });
        fetchTestimonials();
      } else {
        alert(data.message || 'Error saving testimonial');
      }
    } catch (e) {
      alert('Failed to save testimonial');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      const res = await fetch(`/api/testimonials?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchTestimonials();
    } catch (e) {
      alert('Failed to delete testimonial');
    }
  };

  const toggleActive = async (item: Testimonial) => {
    try {
      const res = await fetch('/api/testimonials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, active: !item.active }),
      });
      const data = await res.json();
      if (data.success) {
        fetchTestimonials();
      }
    } catch (e) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0b1a30]">
            Client Testimonials ({(Array.isArray(testimonials) ? testimonials : []).length})
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Manage client recommendations, star ratings, and review quotes.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={copyReviewLink}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-300 font-bold text-xs shadow-xs hover:bg-amber-100 transition-all cursor-pointer"
            title="Copy link to send to clients for review submission"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" />
                <span className="text-emerald-700 font-extrabold">Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-amber-700" />
                <span>Copy Review Link for Clients</span>
              </>
            )}
          </button>

          <a
            href="/review"
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-all border border-slate-200"
            title="Open Review Page in New Tab"
          >
            <ExternalLink className="h-4 w-4" />
          </a>

          <button
            onClick={() => {
              setEditingItem(null);
              setForm({ name: '', role: '', company: '', quote: '', rating: 5, active: true });
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1d63ed] hover:bg-blue-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Add Testimonial
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(Array.isArray(testimonials) ? testimonials : []).map((t) => (
          <div key={t.id} className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-xs relative">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${
                  t.active 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse'
                }`}>
                  {t.active ? 'Published' : 'Pending Approval'}
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed italic">"{t.quote}"</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-black text-[#0b1a30] text-sm block">{t.name}</span>
                <span className="text-[11px] text-slate-500 block">{t.role} {t.company && `• ${t.company}`}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => toggleActive(t)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all flex items-center gap-1 cursor-pointer ${
                    t.active
                      ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                  }`}
                  title={t.active ? 'Deactivate and hide from website' : 'Approve and publish to website'}
                >
                  {t.active ? (
                    'Deactivate'
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      <span>Approve & Publish</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setEditingItem(t);
                    setForm({
                      name: t.name,
                      role: t.role,
                      company: t.company,
                      quote: t.quote,
                      rating: t.rating,
                      active: t.active,
                    });
                    setShowModal(true);
                  }}
                  className="p-1.5 text-slate-400 hover:text-[#1d63ed]"
                  title="Edit Testimonial"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(t.id)} className="p-1.5 text-slate-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-6">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <h3 className="text-lg font-black text-[#0b1a30]">
              {editingItem ? 'Edit Testimonial' : 'Add Testimonial'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-extrabold mb-1">Client Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">Role / Position</label>
                  <input
                    type="text"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">Company</label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-extrabold mb-1">Testimonial Quote</label>
                <textarea
                  rows={4}
                  value={form.quote}
                  onChange={(e) => setForm({ ...form, quote: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1d63ed] text-white font-extrabold shadow-xs"
                >
                  Save Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
