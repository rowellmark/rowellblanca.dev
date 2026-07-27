'use client';

import React, { useState, useEffect } from 'react';
import {
  Layout,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Check,
  Copy,
  CheckCircle2,
  Sparkles,
  Layers,
  FileText,
  Star,
  FolderKanban,
  Search,
  Globe,
} from 'lucide-react';

interface Project {
  id: number;
  sitename: string;
  permalink: string;
  category?: string;
}

interface Testimonial {
  id: number;
  name: string;
  company: string;
  quote: string;
}

interface LandingPageItem {
  id: number;
  slug: string;
  badgeText?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCtaText?: string;
  targetKeyword?: string;
  metaTitle?: string;
  metaDescription?: string;
  projectIds: number[];
  testimonialIds: number[];
  active: boolean;
}

export default function LandingPagesManagerPage() {
  const [landingPages, setLandingPages] = useState<LandingPageItem[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [allTestimonials, setAllTestimonials] = useState<Testimonial[]>([]);
  
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<LandingPageItem | null>(null);
  const [activeTab, setActiveTab] = useState<'hero' | 'seo' | 'projects' | 'testimonials'>('hero');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const [form, setForm] = useState({
    slug: '',
    badgeText: '',
    heroTitle: '',
    heroSubtitle: '',
    heroCtaText: 'Book Discovery Call',
    targetKeyword: '',
    metaTitle: '',
    metaDescription: '',
    projectIds: [] as number[],
    testimonialIds: [] as number[],
    active: true,
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [lpRes, pRes, tRes] = await Promise.all([
        fetch('/api/landing-pages?includeInactive=true'),
        fetch('/api/projects?includeInactive=true'),
        fetch('/api/testimonials?includeInactive=true'),
      ]);

      if (lpRes.ok) {
        const data = await lpRes.json();
        if (data.success && Array.isArray(data.landingPages)) {
          setLandingPages(data.landingPages);
        }
      }

      if (pRes.ok) {
        const pData = await pRes.json();
        if (pData.success && Array.isArray(pData.projects)) {
          setAllProjects(pData.projects);
        }
      }

      if (tRes.ok) {
        const tData = await tRes.json();
        if (tData.success && Array.isArray(tData.testimonials)) {
          setAllTestimonials(tData.testimonials);
        }
      }
    } catch (e) {
      console.error('Error fetching landing pages data:', e);
    }
  };

  const copyPageLink = (slug: string) => {
    const isUkRoute = slug.startsWith('hire-');
    const path = isUkRoute ? `/${slug}` : `/landing/${slug}`;
    const link = `${window.location.origin}${path}`;
    navigator.clipboard.writeText(link);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 3000);
  };

  const handleSlugChange = (val: string) => {
    const slugified = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setForm((prev) => ({ ...prev, slug: slugified }));
  };

  const toggleProjectId = (id: number) => {
    setForm((prev) => {
      const exists = prev.projectIds.includes(id);
      return {
        ...prev,
        projectIds: exists ? prev.projectIds.filter((pId) => pId !== id) : [...prev.projectIds, id],
      };
    });
  };

  const toggleTestimonialId = (id: number) => {
    setForm((prev) => {
      const exists = prev.testimonialIds.includes(id);
      return {
        ...prev,
        testimonialIds: exists ? prev.testimonialIds.filter((tId) => tId !== id) : [...prev.testimonialIds, id],
      };
    });
  };

  const togglePageActive = async (item: LandingPageItem) => {
    try {
      const res = await fetch('/api/landing-pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, active: !item.active }),
      });
      const data = await res.json();
      if (data.success) fetchInitialData();
    } catch (e) {
      alert('Failed to update status');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingItem ? 'PUT' : 'POST';
    const payload = editingItem ? { ...form, id: editingItem.id } : form;

    try {
      const res = await fetch('/api/landing-pages', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setEditingItem(null);
        setForm({
          slug: '',
          badgeText: '',
          heroTitle: '',
          heroSubtitle: '',
          heroCtaText: 'Book Discovery Call',
          targetKeyword: '',
          metaTitle: '',
          metaDescription: '',
          projectIds: [],
          testimonialIds: [],
          active: true,
        });
        fetchInitialData();
      } else {
        alert(data.message || 'Error saving landing page');
      }
    } catch (e) {
      alert('Failed to save landing page');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this landing page?')) return;
    try {
      const res = await fetch(`/api/landing-pages?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchInitialData();
    } catch (e) {
      alert('Failed to delete landing page');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0b1a30] flex items-center gap-2">
            <Globe className="h-6 w-6 text-brand-amber" />
            Dynamic Landing Pages ({landingPages.length})
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Create, edit, and assign targeted SEO landing pages with custom hero headlines, projects, and testimonials.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingItem(null);
            setActiveTab('hero');
            setForm({
              slug: 'hire-new-service',
              badgeText: '🇬🇧 UK Business Engineering Partner',
              heroTitle: 'Hire Senior Developer for UK Businesses',
              heroSubtitle: 'Enterprise-grade software engineering at cost-effective rates with GMT/BST overlap.',
              heroCtaText: 'Book Discovery Call',
              targetKeyword: 'Senior Developer UK',
              metaTitle: 'Hire Senior Developer UK | Rowell Mark Blanca',
              metaDescription: 'Senior full-stack software engineer building enterprise platforms for UK companies.',
              projectIds: allProjects.map((p) => p.id),
              testimonialIds: allTestimonials.map((t) => t.id),
              active: true,
            });
            setShowModal(true);
          }}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#1d63ed] hover:bg-blue-600 text-white font-black text-xs shadow-md transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Create New Landing Page
        </button>
      </div>

      {/* Landing Pages Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold">
                <th className="p-4">Route URL & Badge</th>
                <th className="p-4">Hero Headline & Target Keyword</th>
                <th className="p-4">Assigned Content</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {landingPages.map((page) => {
                const isUkRoute = page.slug.startsWith('hire-');
                const path = isUkRoute ? `/${page.slug}` : `/landing/${page.slug}`;

                return (
                  <tr key={page.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-indigo-700 font-extrabold bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200 text-xs">
                          {path}
                        </span>
                        <button
                          onClick={() => copyPageLink(page.slug)}
                          className="p-1 text-slate-400 hover:text-slate-700"
                          title="Copy Full Page URL"
                        >
                          {copiedSlug === page.slug ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <a
                          href={path}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 text-slate-400 hover:text-slate-700"
                          title="Open Page Preview"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                      {page.badgeText && (
                        <p className="text-[10px] font-bold text-slate-500 truncate max-w-[200px]">
                          {page.badgeText}
                        </p>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="font-black text-[#0b1a30] block text-sm">{page.heroTitle}</span>
                      {page.targetKeyword && (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded inline-block mt-1">
                          🎯 {page.targetKeyword}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3 text-slate-600 font-bold text-xs">
                        <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg">
                          <FolderKanban className="w-3.5 h-3.5 text-indigo-600" />
                          {page.projectIds?.length || 0} Projects
                        </span>
                        <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                          {page.testimonialIds?.length || 0} Reviews
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => togglePageActive(page)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-extrabold text-[11px] border cursor-pointer transition-all ${
                          page.active
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${page.active ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {page.active ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingItem(page);
                          setActiveTab('hero');
                          setForm({
                            slug: page.slug,
                            badgeText: page.badgeText || '',
                            heroTitle: page.heroTitle,
                            heroSubtitle: page.heroSubtitle,
                            heroCtaText: page.heroCtaText || 'Book Discovery Call',
                            targetKeyword: page.targetKeyword || '',
                            metaTitle: page.metaTitle || '',
                            metaDescription: page.metaDescription || '',
                            projectIds: page.projectIds || [],
                            testimonialIds: page.testimonialIds || [],
                            active: page.active !== false,
                          });
                          setShowModal(true);
                        }}
                        className="p-2 rounded-lg text-slate-500 hover:text-[#1d63ed] hover:bg-slate-100 transition-colors"
                        title="Edit Landing Page"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(page.id)}
                        className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete Landing Page"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Builder Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto !mt-0">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[92vh] flex flex-col my-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-[#0b1a30]">
                  {editingItem ? `Edit Landing Page: /${editingItem.slug}` : 'Create Dynamic Landing Page'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Configure custom hero copy, SEO metadata, and assigned projects & testimonials.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex border-b border-slate-200 gap-1 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('hero')}
                className={`px-4 py-2.5 text-xs font-extrabold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'hero'
                    ? 'border-[#1d63ed] text-[#1d63ed]'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Layers className="w-4 h-4" /> 1. Hero & Branding
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('seo')}
                className={`px-4 py-2.5 text-xs font-extrabold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'seo'
                    ? 'border-[#1d63ed] text-[#1d63ed]'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <FileText className="w-4 h-4" /> 2. SEO & Keywords
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('projects')}
                className={`px-4 py-2.5 text-xs font-extrabold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'projects'
                    ? 'border-[#1d63ed] text-[#1d63ed]'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <FolderKanban className="w-4 h-4" /> 3. Selected Projects ({form.projectIds.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('testimonials')}
                className={`px-4 py-2.5 text-xs font-extrabold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'testimonials'
                    ? 'border-[#1d63ed] text-[#1d63ed]'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Star className="w-4 h-4" /> 4. Selected Testimonials ({form.testimonialIds.length})
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto pr-1 space-y-6 text-xs">
              {/* TAB 1: HERO & BRANDING */}
              {activeTab === 'hero' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-700 font-extrabold mb-1">Route Slug / URL Path *</label>
                    <input
                      type="text"
                      value={form.slug}
                      onChange={(e) => handleSlugChange(e.target.value)}
                      required
                      placeholder="e.g. hire-uk-react-developer"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 font-mono font-bold"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      URL will be accessible at: <code className="text-indigo-600 font-mono">/hire-[slug]</code> or <code className="text-indigo-600 font-mono">/landing/[slug]</code>
                    </p>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-extrabold mb-1">Hero Flag / Pill Badge</label>
                    <input
                      type="text"
                      value={form.badgeText}
                      onChange={(e) => setForm({ ...form, badgeText: e.target.value })}
                      placeholder="e.g. 🇬🇧 UK Business & Agency Engineering Partner"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-extrabold mb-1">Hero Main Title (H1) *</label>
                    <input
                      type="text"
                      value={form.heroTitle}
                      onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
                      required
                      placeholder="e.g. Hire Senior React & Next.js Developer for UK Businesses"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 font-extrabold text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-extrabold mb-1">Hero Subtitle Paragraph *</label>
                    <textarea
                      rows={3}
                      value={form.heroSubtitle}
                      onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })}
                      required
                      placeholder="e.g. Partner with a senior full-stack software engineer building enterprise platforms like the Macmanus Asset Finance Portal..."
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-extrabold mb-1">Primary CTA Button Label</label>
                    <input
                      type="text"
                      value={form.heroCtaText}
                      onChange={(e) => setForm({ ...form, heroCtaText: e.target.value })}
                      placeholder="e.g. Book UK Discovery Call"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 font-bold"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: SEO & KEYWORDS */}
              {activeTab === 'seo' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-700 font-extrabold mb-1">Target Keyword Focus</label>
                    <input
                      type="text"
                      value={form.targetKeyword}
                      onChange={(e) => setForm({ ...form, targetKeyword: e.target.value })}
                      placeholder="e.g. React Developer UK"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-extrabold mb-1">Meta Title Tag (&lt;title&gt;)</label>
                    <input
                      type="text"
                      value={form.metaTitle}
                      onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                      placeholder="e.g. Hire Senior React & Next.js Developer UK | Rowell Mark Blanca"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-extrabold mb-1">Meta Description Tag</label>
                    <textarea
                      rows={3}
                      value={form.metaDescription}
                      onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                      placeholder="e.g. Senior React & Next.js developer for UK businesses and web agencies. Full GMT/BST timezone overlap..."
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: SELECTED PROJECTS */}
              {activeTab === 'projects' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="font-extrabold text-slate-800">
                      Select which project screenshot cards render on this landing page:
                    </p>
                    <span className="text-xs font-mono font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
                      {form.projectIds.length} Selected
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto p-1">
                    {allProjects.map((proj) => {
                      const selected = form.projectIds.includes(proj.id);
                      return (
                        <div
                          key={proj.id}
                          onClick={() => toggleProjectId(proj.id)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            selected
                              ? 'bg-indigo-50/80 border-indigo-400 shadow-xs'
                              : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="space-y-0.5">
                            <span className="font-black text-[#0b1a30] text-xs block">{proj.sitename}</span>
                            {proj.category && (
                              <span className="text-[10px] font-bold text-slate-500">{proj.category}</span>
                            )}
                          </div>
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => {}}
                            className="h-4 w-4 rounded text-[#1d63ed]"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 4: SELECTED TESTIMONIALS */}
              {activeTab === 'testimonials' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="font-extrabold text-slate-800">
                      Select which client review testimonials render on this landing page:
                    </p>
                    <span className="text-xs font-mono font-extrabold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                      {form.testimonialIds.length} Selected
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto p-1">
                    {allTestimonials.map((t) => {
                      const selected = form.testimonialIds.includes(t.id);
                      return (
                        <div
                          key={t.id}
                          onClick={() => toggleTestimonialId(t.id)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            selected
                              ? 'bg-amber-50/80 border-amber-400 shadow-xs'
                              : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="space-y-0.5">
                            <span className="font-black text-[#0b1a30] text-xs block">{t.name}</span>
                            <span className="text-[10px] font-bold text-slate-500 block truncate max-w-[200px]">
                              {t.company || t.quote}
                            </span>
                          </div>
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => {}}
                            className="h-4 w-4 rounded text-amber-600"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Footer Save */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => setForm({ ...form, active: e.target.checked })}
                    className="h-4 w-4 rounded text-[#1d63ed]"
                  />
                  <span>Active & Published</span>
                </label>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#1d63ed] text-white font-extrabold shadow-md hover:bg-blue-600 transition-all"
                  >
                    Save Landing Page
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
