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
import GeminiLandingModal from '@/components/admin/gemini-landing-modal';

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
  serviceSectionType?: string;
  ctaTitle?: string;
  ctaSubtitle?: string;
  active: boolean;
}

export default function LandingPagesManagerPage() {
  const [landingPages, setLandingPages] = useState<LandingPageItem[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [allTestimonials, setAllTestimonials] = useState<Testimonial[]>([]);
  
  const [showModal, setShowModal] = useState(false);
  const [showGeminiModal, setShowGeminiModal] = useState(false);
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
    serviceSectionType: 'wordpress',
    ctaTitle: 'Need a Custom WordPress Architect for Your UK Business?',
    ctaSubtitle: "Let's discuss your WordPress project requirement. Enjoy seamless GMT/BST communication, clean PHP/Next.js code, and reliable delivery.",
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
          serviceSectionType: 'wordpress',
          ctaTitle: 'Need a Custom WordPress Architect for Your UK Business?',
          ctaSubtitle: "Let's discuss your WordPress project requirement. Enjoy seamless GMT/BST communication, clean PHP/Next.js code, and reliable delivery.",
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
          <h1 className="text-2xl font-semibold text-zinc-950 flex items-center gap-2">
            <Globe className="h-6 w-6 text-brand-amber" />
            Dynamic Landing Pages ({landingPages.length})
          </h1>
          <p className="text-xs text-zinc-500 font-medium mt-1">
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
              serviceSectionType: 'wordpress',
              ctaTitle: 'Need a Custom WordPress Architect for Your UK Business?',
              ctaSubtitle: "Let's discuss your WordPress project requirement. Enjoy seamless GMT/BST communication, clean PHP/Next.js code, and reliable delivery.",
              active: true,
            });
            setShowModal(true);
          }}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Create New Landing Page
        </button>
      </div>

      {/* Landing Pages Table */}
      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase tracking-wider font-semibold">
                <th className="p-4">Route URL & Badge</th>
                <th className="p-4">Hero Headline & Target Keyword</th>
                <th className="p-4">Assigned Content</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-700 font-medium">
              {landingPages.map((page) => {
                const isUkRoute = page.slug.startsWith('hire-');
                const path = isUkRoute ? `/${page.slug}` : `/landing/${page.slug}`;

                return (
                  <tr key={page.id} className="hover:bg-zinc-50/70 transition-colors">
                    <td className="p-4 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-indigo-700 font-semibold bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200 text-xs">
                          {path}
                        </span>
                        <button
                          onClick={() => copyPageLink(page.slug)}
                          className="p-1 text-zinc-400 hover:text-zinc-700"
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
                          className="p-1 text-zinc-400 hover:text-zinc-700"
                          title="Open Page Preview"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                      {page.badgeText && (
                        <p className="text-[11px] font-bold text-zinc-500 truncate max-w-[200px]">
                          {page.badgeText}
                        </p>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-zinc-950 block text-sm">{page.heroTitle}</span>
                      {page.targetKeyword && (
                        <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded inline-block mt-1">
                          🎯 {page.targetKeyword}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3 text-zinc-600 font-bold text-xs">
                        <span className="flex items-center gap-1 bg-zinc-100 px-2.5 py-1 rounded-lg">
                          <FolderKanban className="w-3.5 h-3.5 text-indigo-600" />
                          {page.projectIds?.length || 0} Projects
                        </span>
                        <span className="flex items-center gap-1 bg-zinc-100 px-2.5 py-1 rounded-lg">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                          {page.testimonialIds?.length || 0} Reviews
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => togglePageActive(page)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold text-[11px] border cursor-pointer transition-all ${
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
                            serviceSectionType: page.serviceSectionType || 'wordpress',
                            ctaTitle: page.ctaTitle || 'Need a Custom WordPress Architect for Your UK Business?',
                            ctaSubtitle: page.ctaSubtitle || "Let's discuss your WordPress project requirement. Enjoy seamless GMT/BST communication, clean PHP/Next.js code, and reliable delivery.",
                            active: page.active !== false,
                          });
                          setShowModal(true);
                        }}
                        className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                        title="Edit Landing Page"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(page.id)}
                        className="p-2 rounded-lg text-zinc-500 hover:text-red-600 hover:bg-red-50 transition-colors"
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
        <div className="fixed inset-0 z-50 bg-zinc-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto !mt-0">
          <div className="bg-white border border-zinc-200 rounded-xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-sm relative max-h-[92vh] flex flex-col my-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div>
                <h3 className="text-xl font-semibold text-zinc-950">
                  {editingItem ? `Edit Landing Page: /${editingItem.slug}` : 'Create Dynamic Landing Page'}
                </h3>
                <p className="text-xs text-zinc-500 font-medium">
                  Configure custom hero copy, SEO metadata, and assigned projects & testimonials.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowGeminiModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 text-zinc-950 text-xs font-semibold flex items-center gap-1.5 shadow-md hover:scale-105 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" /> ✨ Gemini AI Assistant
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-xl text-zinc-400 hover:bg-zinc-100"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex border-b border-zinc-200 gap-1 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('hero')}
                className={`px-4 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'hero'
                    ? 'border-zinc-900 text-zinc-900'
                    : 'border-transparent text-zinc-500 hover:text-zinc-900'
                }`}
              >
                <Layers className="w-4 h-4" /> 1. Hero & Branding
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('seo')}
                className={`px-4 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'seo'
                    ? 'border-zinc-900 text-zinc-900'
                    : 'border-transparent text-zinc-500 hover:text-zinc-900'
                }`}
              >
                <FileText className="w-4 h-4" /> 2. SEO & Keywords
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('projects')}
                className={`px-4 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'projects'
                    ? 'border-zinc-900 text-zinc-900'
                    : 'border-transparent text-zinc-500 hover:text-zinc-900'
                }`}
              >
                <FolderKanban className="w-4 h-4" /> 3. Selected Projects ({form.projectIds.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('testimonials')}
                className={`px-4 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'testimonials'
                    ? 'border-zinc-900 text-zinc-900'
                    : 'border-transparent text-zinc-500 hover:text-zinc-900'
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
                    <label className="block text-zinc-700 font-semibold mb-1">Route Slug / URL Path *</label>
                    <input
                      type="text"
                      value={form.slug}
                      onChange={(e) => handleSlugChange(e.target.value)}
                      required
                      placeholder="e.g. hire-uk-react-developer"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 text-zinc-900 font-mono font-bold"
                    />
                    <p className="text-[11px] text-zinc-400 mt-1">
                      URL will be accessible at: <code className="text-indigo-600 font-mono">/hire-[slug]</code> or <code className="text-indigo-600 font-mono">/landing/[slug]</code>
                    </p>
                  </div>

                  <div>
                    <label className="block text-zinc-700 font-semibold mb-1">Hero Flag / Pill Badge</label>
                    <input
                      type="text"
                      value={form.badgeText}
                      onChange={(e) => setForm({ ...form, badgeText: e.target.value })}
                      placeholder="e.g. 🇬🇧 UK Business & Agency Engineering Partner"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 text-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-700 font-semibold mb-1">Hero Main Title (H1) *</label>
                    <input
                      type="text"
                      value={form.heroTitle}
                      onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
                      required
                      placeholder="e.g. Hire Senior React & Next.js Developer for UK Businesses"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 text-zinc-900 font-semibold text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-700 font-semibold mb-1">Hero Subtitle Paragraph *</label>
                    <textarea
                      rows={3}
                      value={form.heroSubtitle}
                      onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })}
                      required
                      placeholder="e.g. Partner with a senior full-stack software engineer building enterprise platforms like the Macmanus Asset Finance Portal..."
                      className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 text-zinc-900 leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-700 font-semibold mb-1">Primary CTA Button Label</label>
                    <input
                      type="text"
                      value={form.heroCtaText}
                      onChange={(e) => setForm({ ...form, heroCtaText: e.target.value })}
                      placeholder="e.g. Book UK Discovery Call"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 text-zinc-900 font-bold"
                    />
                  </div>

                  <div className="pt-4 border-t border-zinc-200 space-y-4">
                    <h4 className="font-semibold text-zinc-950 text-xs uppercase tracking-wider">
                      Services Grid & Pitch Section Settings
                    </h4>

                    <div>
                      <label className="block text-zinc-700 font-semibold mb-1">Services Section Type</label>
                      <select
                        value={form.serviceSectionType || 'wordpress'}
                        onChange={(e) => setForm({ ...form, serviceSectionType: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 text-zinc-900 font-semibold text-xs"
                      >
                        <option value="wordpress">WordPress Services (Themes, Plugins, Headless, Core Web Vitals)</option>
                        <option value="react">React & Next.js Services (Next.js 14, TypeScript, APIs, AI Engines)</option>
                        <option value="both">Both WordPress & React Service Grids</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-zinc-700 font-semibold mb-1">CTA Pitch Section Title</label>
                      <input
                        type="text"
                        value={form.ctaTitle}
                        onChange={(e) => setForm({ ...form, ctaTitle: e.target.value })}
                        placeholder="e.g. Need a Custom WordPress Architect for Your UK Business?"
                        className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 text-zinc-900 font-semibold text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-700 font-semibold mb-1">CTA Pitch Subtitle</label>
                      <textarea
                        rows={2}
                        value={form.ctaSubtitle}
                        onChange={(e) => setForm({ ...form, ctaSubtitle: e.target.value })}
                        placeholder="Let's discuss your project requirement..."
                        className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 text-zinc-900 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SEO & KEYWORDS */}
              {activeTab === 'seo' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-zinc-700 font-semibold mb-1">Target Keyword Focus</label>
                    <input
                      type="text"
                      value={form.targetKeyword}
                      onChange={(e) => setForm({ ...form, targetKeyword: e.target.value })}
                      placeholder="e.g. React Developer UK"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 text-zinc-900 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-700 font-semibold mb-1">Meta Title Tag (&lt;title&gt;)</label>
                    <input
                      type="text"
                      value={form.metaTitle}
                      onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                      placeholder="e.g. Hire Senior React & Next.js Developer UK | Rowell Mark Blanca"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 text-zinc-900 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-700 font-semibold mb-1">Meta Description Tag</label>
                    <textarea
                      rows={3}
                      value={form.metaDescription}
                      onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                      placeholder="e.g. Senior React & Next.js developer for UK businesses and web agencies. Full GMT/BST timezone overlap..."
                      className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 text-zinc-900"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: SELECTED PROJECTS */}
              {activeTab === 'projects' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-zinc-800">
                      Select which project screenshot cards render on this landing page:
                    </p>
                    <span className="text-xs font-mono font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
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
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            selected
                              ? 'bg-indigo-50/80 border-indigo-400 shadow-sm'
                              : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300'
                          }`}
                        >
                          <div className="space-y-0.5">
                            <span className="font-semibold text-zinc-950 text-xs block">{proj.sitename}</span>
                            {proj.category && (
                              <span className="text-[11px] font-bold text-zinc-500">{proj.category}</span>
                            )}
                          </div>
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => {}}
                            className="h-4 w-4 rounded text-zinc-900"
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
                    <p className="font-semibold text-zinc-800">
                      Select which client review testimonials render on this landing page:
                    </p>
                    <span className="text-xs font-mono font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
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
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            selected
                              ? 'bg-amber-50/80 border-amber-400 shadow-sm'
                              : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300'
                          }`}
                        >
                          <div className="space-y-0.5">
                            <span className="font-semibold text-zinc-950 text-xs block">{t.name}</span>
                            <span className="text-[11px] font-bold text-zinc-500 block truncate max-w-[200px]">
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
              <div className="flex items-center justify-between pt-4 border-t border-zinc-200">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-zinc-800">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => setForm({ ...form, active: e.target.checked })}
                    className="h-4 w-4 rounded text-zinc-900"
                  />
                  <span>Active & Published</span>
                </label>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 rounded-xl bg-zinc-100 text-zinc-700 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-zinc-900 text-white font-semibold shadow-md hover:bg-zinc-800 transition-all"
                  >
                    Save Landing Page
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gemini AI Landing Page Copy Generator */}
      <GeminiLandingModal
        open={showGeminiModal}
        onClose={() => setShowGeminiModal(false)}
        initialData={{
          slug: form.slug,
          targetKeyword: form.targetKeyword,
        }}
        onApply={(generated) => {
          setForm((prev) => ({
            ...prev,
            badgeText: generated.badgeText || prev.badgeText,
            heroTitle: generated.heroTitle || prev.heroTitle,
            heroSubtitle: generated.heroSubtitle || prev.heroSubtitle,
            heroCtaText: generated.heroCtaText || prev.heroCtaText,
            targetKeyword: generated.targetKeyword || prev.targetKeyword,
            metaTitle: generated.metaTitle || prev.metaTitle,
            metaDescription: generated.metaDescription || prev.metaDescription,
          }));
          setActiveTab('hero');
        }}
      />
    </div>
  );
}
