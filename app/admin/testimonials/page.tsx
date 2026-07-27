'use client';

import React, { useState, useEffect } from 'react';
import { Star, Plus, Trash2, Edit, Copy, Check, ExternalLink, ArrowUp, ArrowDown, Sparkles, Loader2, X } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  companyUrl?: string;
  quote: string;
  rating: number;
  featured?: boolean;
  order?: number;
  active: boolean;
  avatarUrl?: string;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [copied, setCopied] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [form, setForm] = useState({
    name: '',
    role: '',
    company: '',
    companyUrl: '',
    quote: '',
    rating: 5,
    featured: false,
    active: true,
    photoUrl: '',
    targetUkReact: false,
    targetUkWp: false,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials?includeInactive=true');
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

  const toggleFeatured = async (t: Testimonial) => {
    try {
      const res = await fetch('/api/testimonials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: t.id, featured: !t.featured }),
      });
      const data = await res.json();
      if (data.success) fetchTestimonials();
    } catch (e) {
      alert('Failed to update featured state');
    }
  };

  const toggleActive = async (t: Testimonial) => {
    try {
      const res = await fetch('/api/testimonials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: t.id, active: !t.active }),
      });
      const data = await res.json();
      if (data.success) fetchTestimonials();
    } catch (e) {
      alert('Failed to update status');
    }
  };

  const moveOrder = async (index: number, direction: 'up' | 'down') => {
    const newList = [...testimonials];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newList.length) return;

    const temp = newList[index];
    newList[index] = newList[targetIndex];
    newList[targetIndex] = temp;

    const reorderItems = newList.map((item, idx) => ({
      id: item.id,
      order: idx + 1,
    }));

    setTestimonials(newList);

    try {
      await fetch('/api/testimonials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reorderItems }),
      });
    } catch (e) {
      console.error('Failed to save reordered order', e);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setForm((prev) => ({ ...prev, photoUrl: data.url }));
      } else {
        alert(data.message || 'Image upload failed');
      }
    } catch (error) {
      alert('Error uploading file');
    } finally {
      setUploadingPhoto(false);
      e.target.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingItem ? 'PUT' : 'POST';

    const tags: string[] = [];
    if (form.targetUkReact) tags.push('target:uk-react');
    if (form.targetUkWp) tags.push('target:uk-wordpress');
    if (form.photoUrl.trim()) tags.push(`photo:${form.photoUrl.trim()}`);
    const avatarUrl = tags.join(',');

    const payload = editingItem
      ? { ...form, avatarUrl, id: editingItem.id }
      : { ...form, avatarUrl };

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
        setForm({
          name: '',
          role: '',
          company: '',
          companyUrl: '',
          quote: '',
          rating: 5,
          featured: false,
          active: true,
          photoUrl: '',
          targetUkReact: false,
          targetUkWp: false,
        });
        fetchTestimonials();
      } else {
        alert(data.message || 'Error saving testimonial');
      }
    } catch (e) {
      alert('Error saving testimonial');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      const res = await fetch(`/api/testimonials?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchTestimonials();
    } catch (e) {
      alert('Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-black text-[#0b1a30]">Testimonials & Reviews ({testimonials.length})</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Manage client reviews, highlight featured testimonials, and re-arrange display order on landing pages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={copyReviewLink}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-amber-300 font-extrabold text-xs transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" />
                <span className="text-emerald-700 font-extrabold">Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-amber-700" />
                <span>Copy Review Link</span>
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
              setForm({
                name: '',
                role: '',
                company: '',
                companyUrl: '',
                quote: '',
                rating: 5,
                featured: false,
                active: true,
                photoUrl: '',
                targetUkReact: true,
                targetUkWp: true,
              });
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1d63ed] hover:bg-blue-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Add Testimonial
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(Array.isArray(testimonials) ? testimonials : []).map((t, idx) => (
          <div
            key={t.id}
            className={`rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-xs relative transition-all ${
              t.featured
                ? 'bg-gradient-to-br from-amber-50/90 via-white to-amber-50/40 border-2 border-amber-400/80 shadow-md ring-2 ring-amber-400/20'
                : 'bg-white border border-slate-200'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>

                  {t.featured && (
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 flex items-center gap-1 shadow-xs">
                      <Sparkles className="w-3 h-3 fill-slate-950" /> Featured
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveOrder(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-30"
                    title="Move Up in Display Order"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveOrder(idx, 'down')}
                    disabled={idx === testimonials.length - 1}
                    className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-30"
                    title="Move Down in Display Order"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                      t.active
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse'
                    }`}
                  >
                    {t.active ? 'Published' : 'Pending'}
                  </span>

                  <button
                    type="button"
                    onClick={() => toggleFeatured(t)}
                    className={`p-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                      t.featured
                        ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300'
                        : 'bg-slate-100 text-slate-400 hover:text-amber-500 hover:bg-slate-200'
                    }`}
                    title={t.featured ? 'Remove Highlight' : 'Highlight as Featured Review'}
                  >
                    <Star className={`w-4 h-4 ${t.featured ? 'fill-amber-500 text-amber-600' : ''}`} />
                  </button>

                  <button
                    onClick={() => toggleActive(t)}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1 cursor-pointer ${
                      t.active
                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                    }`}
                    title={t.active ? 'Deactivate and hide from website' : 'Approve and publish to website'}
                  >
                    {t.active ? 'Hide' : 'Publish'}
                  </button>
                  <button
                    onClick={() => {
                      setEditingItem(t);
                      setForm({
                        name: t.name,
                        role: t.role,
                        company: t.company,
                        companyUrl: t.companyUrl || '',
                        quote: t.quote,
                        rating: t.rating,
                        featured: Boolean(t.featured),
                        active: t.active,
                        photoUrl: t.avatarUrl?.includes('photo:') ? t.avatarUrl.split('photo:')[1].split(',')[0] : '',
                        targetUkReact: Boolean(
                          t.avatarUrl?.includes('target:uk-react') || t.company?.toLowerCase().includes('macmanus')
                        ),
                        targetUkWp: Boolean(
                          t.avatarUrl?.includes('target:uk-wordpress') ||
                            t.company?.toLowerCase().includes('tower') ||
                            t.company?.toLowerCase().includes('macmanus')
                        ),
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

              <p className="text-xs text-slate-700 leading-relaxed italic">"{t.quote}"</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center font-black text-xs text-amber-700 overflow-hidden shrink-0">
                  {t.avatarUrl?.includes('photo:') ? (
                    <img
                      src={t.avatarUrl.split('photo:')[1].split(',')[0]}
                      alt={t.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{t.name?.charAt(0) || 'C'}</span>
                  )}
                </div>
                <div>
                  <span className="font-black text-[#0b1a30] text-sm block">{t.name}</span>
                  <span className="text-[11px] text-slate-500 block flex items-center gap-1">
                    {t.role}{' '}
                    {t.company && (
                      <>
                        •{' '}
                        {t.companyUrl ? (
                          <a
                            href={t.companyUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 font-extrabold hover:underline inline-flex items-center gap-0.5"
                          >
                            <span>{t.company}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ) : (
                          <span>{t.company}</span>
                        )}
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-[#0b1a30]">
                {editingItem ? 'Edit Testimonial' : 'Add Testimonial'}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-extrabold mb-1">Client Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="e.g. Giles McManus"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">Role / Title</label>
                  <input
                    type="text"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    placeholder="e.g. Managing Director"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">Company</label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    placeholder="e.g. MacManus Finance"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">Company Website URL</label>
                  <input
                    type="url"
                    value={form.companyUrl}
                    onChange={(e) => setForm({ ...form, companyUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    placeholder="https://company.co.uk"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">Profile Photo</label>
                  <div className="flex items-center gap-2">
                    {form.photoUrl && (
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-300 bg-slate-100 shrink-0">
                        <img src={form.photoUrl} alt="Profile preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, photoUrl: '' })}
                          className="absolute inset-0 flex items-center justify-center bg-slate-900/60 text-white opacity-0 hover:opacity-100 transition-opacity"
                          title="Remove photo"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="text-xs text-slate-600 min-w-0"
                    />
                    {uploadingPhoto && <Loader2 className="w-4 h-4 animate-spin text-brand-amber shrink-0" />}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-extrabold mb-1">Testimonial Quote *</label>
                <textarea
                  rows={3}
                  required
                  value={form.quote}
                  onChange={(e) => setForm({ ...form, quote: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="Enter client review quote..."
                />
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1d63ed] text-white font-extrabold hover:bg-blue-700 shadow-md"
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
