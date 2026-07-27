'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  FolderKanban,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Check,
  Upload,
  Smartphone,
  Monitor,
  Loader2,
  Image as ImageIcon,
  Star,
  X,
  Images,
  Sparkles,
  Eye,
  BookOpen,
  FileText,
  Layers,
  Wrench,
  SparkleIcon,
} from 'lucide-react';
import { resolveValidImageSrc } from '@/lib/image-utils';
import MediaPickerModal from '@/components/admin/media-picker-modal';
import RichTextEditor from '@/components/admin/rich-text-editor';
import GeminiGeneratorModal from '@/components/admin/gemini-generator-modal';

type ImageSlot = 'desktop' | 'mobile' | 'fullDesktop' | 'fullMobile';
type GalleryTarget = ImageSlot | 'screenshots' | 'richText';

interface Project {
  id: number;
  sitename: string;
  permalink: string;
  url?: string;
  image: string;
  mobileImage?: string;
  fullDesktopImage?: string;
  fullMobileImage?: string;
  screenshots?: string[];
  description?: string;
  content?: string;
  client?: string;
  role?: string;
  duration?: string;
  category?: string;
  challenge?: string;
  solution?: string;
  results?: string;
  technologies: string[];
  featured: boolean;
  spotlight?: boolean;
  active?: boolean;
}

const PREDEFINED_TECH = [
  'Wordpress',
  'Wordpress Plugins',
  'React/Nextjs',
  'Prisma',
  'NeonDB',
  'PHP',
  'TypeScript',
  'Node.js',
  'Tailwind',
];

function resolveImgSrc(src?: string | null) {
  return resolveValidImageSrc(src);
}

export default function ProjectsManagerPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [activeTab, setActiveTab] = useState<'basic' | 'media' | 'summary' | 'blog' | 'tech'>('basic');
  const [showGeminiModal, setShowGeminiModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const [uploadingDesktop, setUploadingDesktop] = useState(false);
  const [uploadingMobile, setUploadingMobile] = useState(false);
  const [uploadingFullDesktop, setUploadingFullDesktop] = useState(false);
  const [uploadingFullMobile, setUploadingFullMobile] = useState(false);
  const [updatingSpotlightId, setUpdatingSpotlightId] = useState<number | null>(null);
  const [galleryTarget, setGalleryTarget] = useState<GalleryTarget | null>(null);
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false);

  const [form, setForm] = useState({
    sitename: '',
    permalink: '',
    url: '',
    image: '',
    mobileImage: '',
    fullDesktopImage: '',
    fullMobileImage: '',
    screenshots: [] as string[],
    description: '',
    content: '',
    client: '',
    role: '',
    duration: '',
    category: '',
    challenge: '',
    solution: '',
    results: '',
    technologies: [] as string[],
    customTech: '',
    featured: true,
    spotlight: false,
    active: true,
    targetUkReact: true,
    targetUkWp: true,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects?includeInactive=true');
      const data = await res.json();
      if (data.success && Array.isArray(data.projects)) {
        setProjects(data.projects);
      }
    } catch (e) {
      console.error('Failed to fetch projects:', e);
    }
  };

  const setProjectAsSpotlight = async (proj: Project) => {
    setUpdatingSpotlightId(proj.id);
    try {
      const res = await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...proj,
          spotlight: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchProjects();
      } else {
        alert(data.message || 'Failed to update spotlight project');
      }
    } catch (e) {
      alert('Error setting spotlight project');
    } finally {
      setUpdatingSpotlightId(null);
    }
  };

  const toggleProjectActive = async (proj: Project) => {
    const newActive = proj.active === false ? true : false;
    try {
      const res = await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: proj.id,
          active: newActive,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchProjects();
      }
    } catch (e) {
      console.error('Error toggling active state:', e);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: ImageSlot) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'desktop') setUploadingDesktop(true);
    else if (type === 'mobile') setUploadingMobile(true);
    else if (type === 'fullDesktop') setUploadingFullDesktop(true);
    else if (type === 'fullMobile') setUploadingFullMobile(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        if (type === 'desktop') setForm((prev) => ({ ...prev, image: data.url }));
        else if (type === 'mobile') setForm((prev) => ({ ...prev, mobileImage: data.url }));
        else if (type === 'fullDesktop') setForm((prev) => ({ ...prev, fullDesktopImage: data.url }));
        else if (type === 'fullMobile') setForm((prev) => ({ ...prev, fullMobileImage: data.url }));
      } else {
        alert(data.message || 'Image upload failed');
      }
    } catch (error) {
      alert('Error uploading file');
    } finally {
      if (type === 'desktop') setUploadingDesktop(false);
      else if (type === 'mobile') setUploadingMobile(false);
      else if (type === 'fullDesktop') setUploadingFullDesktop(false);
      else if (type === 'fullMobile') setUploadingFullMobile(false);
    }
  };

  const handleRemoveImage = (type: ImageSlot) => {
    if (type === 'desktop') setForm((prev) => ({ ...prev, image: '' }));
    else if (type === 'mobile') setForm((prev) => ({ ...prev, mobileImage: '' }));
    else if (type === 'fullDesktop') setForm((prev) => ({ ...prev, fullDesktopImage: '' }));
    else if (type === 'fullMobile') setForm((prev) => ({ ...prev, fullMobileImage: '' }));
  };

  const handleGallerySelect = (url: string) => {
    const type = galleryTarget;
    if (type === 'desktop') setForm((prev) => ({ ...prev, image: url }));
    else if (type === 'mobile') setForm((prev) => ({ ...prev, mobileImage: url }));
    else if (type === 'fullDesktop') setForm((prev) => ({ ...prev, fullDesktopImage: url }));
    else if (type === 'fullMobile') setForm((prev) => ({ ...prev, fullMobileImage: url }));
    else if (type === 'screenshots') setForm((prev) => ({ ...prev, screenshots: [...prev.screenshots, url] }));
    else if (type === 'richText') {
      const imgHtml = `<p><img src="${url}" alt="Case study screenshot" className="rounded-2xl border border-slate-200 my-4 max-w-full h-auto shadow-md" /></p>`;
      setForm((prev) => ({ ...prev, content: (prev.content || '') + imgHtml }));
    }
  };

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingScreenshot(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setForm((prev) => ({ ...prev, screenshots: [...prev.screenshots, data.url] }));
      } else {
        alert(data.message || 'Image upload failed');
      }
    } catch (error) {
      alert('Error uploading file');
    } finally {
      setUploadingScreenshot(false);
      e.target.value = '';
    }
  };

  const handleRemoveScreenshot = (index: number) => {
    setForm((prev) => ({ ...prev, screenshots: prev.screenshots.filter((_, i) => i !== index) }));
  };

  const toggleTechnology = (tech: string) => {
    setForm((prev) => {
      const exists = prev.technologies.includes(tech);
      if (exists) {
        return { ...prev, technologies: prev.technologies.filter((t) => t !== tech) };
      } else {
        return { ...prev, technologies: [...prev.technologies, tech] };
      }
    });
  };

  const addCustomTech = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (!form.customTech.trim()) return;

    const newTag = form.customTech.trim();
    if (!form.technologies.includes(newTag)) {
      setForm((prev) => ({
        ...prev,
        technologies: [...prev.technologies, newTag],
        customTech: '',
      }));
    } else {
      setForm((prev) => ({ ...prev, customTech: '' }));
    }
  };

  const handleSitenameChange = (val: string) => {
    setForm((prev) => {
      // Auto slugify if permalink hasn't been manually typed or matches previous slugified title
      const slugified = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      return {
        ...prev,
        sitename: val,
        permalink: prev.permalink === '' || editingProject === null ? slugified : prev.permalink,
      };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingProject ? 'PUT' : 'POST';

    let techList = Array.from(new Set(form.technologies.filter(t => !t.startsWith('target:'))));
    if (form.targetUkReact) techList.push('target:uk-react');
    if (form.targetUkWp) techList.push('target:uk-wordpress');

    const payload = {
      ...form,
      technologies: techList,
      image: (isPlugin ? form.screenshots[0] : form.image) || form.image || 'placeholder-portfolio.jpg',
      id: editingProject ? editingProject.id : undefined,
    };

    try {
      const res = await fetch('/api/projects', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setEditingProject(null);
        setForm({
          sitename: '',
          permalink: '',
          url: '',
          image: '',
          mobileImage: '',
          fullDesktopImage: '',
          fullMobileImage: '',
          screenshots: [],
          description: '',
          content: '',
          client: '',
          role: '',
          duration: '',
          category: '',
          challenge: '',
          solution: '',
          results: '',
          technologies: [],
          customTech: '',
          featured: true,
          spotlight: false,
          active: true,
          targetUkReact: true,
          targetUkWp: true,
        });
        fetchProjects();
      } else {
        alert(data.message || 'Error saving project');
      }
    } catch (e) {
      alert('Failed to save project');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project record?')) return;
    try {
      const res = await fetch(`/api/projects?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchProjects();
    } catch (e) {
      alert('Failed to delete project');
    }
  };

  const isPlugin = form.technologies.includes('Wordpress Plugins');

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0b1a30] flex items-center gap-2">
            Case Studies & Projects ({ (Array.isArray(projects) ? projects : []).length })
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Manage portfolio projects, write long-form case studies, and auto-generate content using Gemini AI.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingProject(null);
            setActiveTab('basic');
            setForm({
              sitename: '',
              permalink: '',
              url: '',
              image: '',
              mobileImage: '',
              fullDesktopImage: '',
              fullMobileImage: '',
              screenshots: [],
              description: '',
              content: '',
              client: '',
              role: '',
              duration: '',
              category: 'SaaS Web App',
              challenge: '',
              solution: '',
              results: '',
              technologies: ['React/Nextjs', 'Prisma', 'NeonDB'],
              customTech: '',
              featured: true,
              spotlight: false,
              active: true,
              targetUkReact: true,
              targetUkWp: true,
            });
            setShowModal(true);
          }}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#1d63ed] hover:bg-blue-600 text-white font-black text-xs shadow-md transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Add New Case Study Project
        </button>
      </div>

      {/* Projects List Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold">
                <th className="p-4">Thumbnails</th>
                <th className="p-4">Project Name & Category</th>
                <th className="p-4">Status</th>
                <th className="p-4">Spotlight</th>
                <th className="p-4">Tech Stack</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {(Array.isArray(projects) ? projects : []).map((proj) => (
                <tr key={proj.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="relative w-14 h-10 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                        {proj.image ? (
                          <Image
                            src={resolveImgSrc(proj.image)}
                            alt={proj.sitename}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      {proj.content && (
                        <span
                          className="px-2 py-0.5 rounded-md bg-amber-500/10 text-brand-amber font-extrabold text-[10px] border border-amber-300/40"
                          title="Has Case Study Blog Post"
                        >
                          Blog Post
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-black text-[#0b1a30] block text-sm">{proj.sitename}</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      {proj.category && (
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {proj.category}
                        </span>
                      )}
                      {proj.url && <span className="text-slate-400 font-mono text-[11px]">{proj.url}</span>}
                    </div>
                  </td>
                  <td className="p-4">
                    <button
                      type="button"
                      onClick={() => toggleProjectActive(proj)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-extrabold text-[11px] border cursor-pointer transition-all ${
                        proj.active !== false
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                      }`}
                      title={
                        proj.active !== false ? 'Click to Deactivate (Hide from website)' : 'Click to Activate'
                      }
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          proj.active !== false ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                      />
                      {proj.active !== false ? 'Active' : 'Deactivated'}
                    </button>
                  </td>
                  <td className="p-4">
                    {proj.spotlight ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-[11px] shadow-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> Active Spotlight
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setProjectAsSpotlight(proj)}
                        disabled={updatingSpotlightId === proj.id}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-50 text-slate-600 hover:text-amber-800 border border-slate-200 hover:border-amber-300 font-bold text-[11px] transition-colors"
                      >
                        {updatingSpotlightId === proj.id ? (
                          <Loader2 className="w-3 h-3 animate-spin text-amber-500" />
                        ) : (
                          <Star className="w-3 h-3 text-slate-400" />
                        )}
                        Set Spotlight
                      </button>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {proj.technologies?.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            PREDEFINED_TECH.includes(tech)
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => {
                        setEditingProject(proj);
                        setActiveTab('basic');
                        setForm({
                          sitename: proj.sitename,
                          permalink: proj.permalink,
                          url: proj.url || '',
                          image: proj.image || '',
                          mobileImage: proj.mobileImage || '',
                          fullDesktopImage: proj.fullDesktopImage || '',
                          fullMobileImage: proj.fullMobileImage || '',
                          screenshots: proj.screenshots || [],
                          description: proj.description || '',
                          content: proj.content || '',
                          client: proj.client || '',
                          role: proj.role || '',
                          duration: proj.duration || '',
                          category: proj.category || '',
                          challenge: proj.challenge || '',
                          solution: proj.solution || '',
                          results: proj.results || '',
                          technologies: proj.technologies || [],
                          customTech: '',
                          featured: proj.featured,
                          spotlight: proj.spotlight || false,
                          active: proj.active !== false,
                          targetUkReact: Boolean(
                            proj.technologies?.includes('target:uk-react') ||
                            proj.permalink?.includes('macmanus-portal') ||
                            proj.technologies?.some((t: string) => t.toLowerCase().includes('react'))
                          ),
                          targetUkWp: Boolean(
                            proj.technologies?.includes('target:uk-wordpress') ||
                            proj.permalink?.includes('tower') ||
                            proj.permalink?.includes('macmanus') ||
                            proj.technologies?.some((t: string) => t.toLowerCase().includes('wordpress'))
                          ),
                        });
                        setShowModal(true);
                      }}
                      className="p-2 rounded-lg text-slate-500 hover:text-[#1d63ed] hover:bg-slate-100 transition-colors"
                      title="Edit Case Study & Media"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(proj.id)}
                      className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modern Add / Edit Case Study Modal with Tabs */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto !mt-0">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[92vh] flex flex-col my-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-[#0b1a30]">
                  {editingProject ? `Edit Case Study: ${editingProject.sitename}` : 'Add New Case Study Project'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Fill in project details, executive summaries, or auto-generate with Gemini AI.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowGeminiModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md hover:scale-105 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" /> ✨ Gemini AI Assistant
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-xl text-slate-400 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 gap-1 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('basic')}
                className={`px-4 py-2.5 text-xs font-extrabold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'basic'
                    ? 'border-[#1d63ed] text-[#1d63ed]'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Layers className="w-4 h-4" /> 1. General & Links
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('media')}
                className={`px-4 py-2.5 text-xs font-extrabold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'media'
                    ? 'border-[#1d63ed] text-[#1d63ed]'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <ImageIcon className="w-4 h-4" /> 2. Media & Screenshots
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('summary')}
                className={`px-4 py-2.5 text-xs font-extrabold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'summary'
                    ? 'border-[#1d63ed] text-[#1d63ed]'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <FileText className="w-4 h-4" /> 3. Executive Breakdown
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('blog')}
                className={`px-4 py-2.5 text-xs font-extrabold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'blog'
                    ? 'border-[#1d63ed] text-[#1d63ed]'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-4 h-4" /> 4. Long-form Blog Content
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('tech')}
                className={`px-4 py-2.5 text-xs font-extrabold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'tech'
                    ? 'border-[#1d63ed] text-[#1d63ed]'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Wrench className="w-4 h-4" /> 5. Tech Stack ({form.technologies.length})
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto pr-1 space-y-6 text-xs">
              {/* TAB 1: GENERAL INFO */}
              {activeTab === 'basic' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-700 font-extrabold mb-1">Project / Case Study Title *</label>
                    <input
                      type="text"
                      value={form.sitename}
                      onChange={(e) => handleSitenameChange(e.target.value)}
                      required
                      placeholder="e.g. BuildForUser SaaS Platform"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-extrabold mb-1">Permalink / Slug *</label>
                      <input
                        type="text"
                        value={form.permalink}
                        onChange={(e) => setForm({ ...form, permalink: e.target.value })}
                        required
                        placeholder="buildforuser-platform"
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-extrabold mb-1">Target Live URL</label>
                      <input
                        type="text"
                        value={form.url}
                        onChange={(e) => setForm({ ...form, url: e.target.value })}
                        placeholder="https://buildforuser.com"
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-slate-700 font-extrabold mb-1">Client Name</label>
                      <input
                        type="text"
                        value={form.client}
                        onChange={(e) => setForm({ ...form, client: e.target.value })}
                        placeholder="e.g. MacManus Asset Finance"
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-extrabold mb-1">Your Role / Responsibility</label>
                      <input
                        type="text"
                        value={form.role}
                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                        placeholder="e.g. Lead Full-Stack Architect"
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-extrabold mb-1">Duration / Timeline</label>
                      <input
                        type="text"
                        value={form.duration}
                        onChange={(e) => setForm({ ...form, duration: e.target.value })}
                        placeholder="e.g. 3 Months"
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-extrabold mb-1">Project Category</label>
                    <input
                      type="text"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      placeholder="e.g. SaaS Web Platform, FinTech Portal, WordPress Solution"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900"
                    />
                  </div>

                  {/* Status Toggles */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-wrap items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                      <input
                        type="checkbox"
                        checked={form.active}
                        onChange={(e) => setForm({ ...form, active: e.target.checked })}
                        className="h-4 w-4 rounded text-[#1d63ed]"
                      />
                      Active (Visible on public site)
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                      <input
                        type="checkbox"
                        checked={form.featured}
                        onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                        className="h-4 w-4 rounded text-[#1d63ed]"
                      />
                      Featured in Portfolio Grid
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-amber-900">
                      <input
                        type="checkbox"
                        checked={form.spotlight}
                        onChange={(e) => setForm({ ...form, spotlight: e.target.checked })}
                        className="h-4 w-4 rounded text-amber-500"
                      />
                      Set as Primary Homepage Spotlight
                    </label>
                  </div>

                  {/* Target Landing Page Display Settings */}
                  <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-2">
                    <label className="block text-amber-900 font-black text-xs uppercase tracking-wider">
                      🎯 Target Landing Pages Settings (Assign Landing Page Display)
                    </label>
                    <p className="text-xs text-slate-600">Select which landing page(s) will render this project:</p>

                    <div className="flex flex-wrap items-center gap-6 pt-1">
                      <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 text-xs">
                        <input
                          type="checkbox"
                          checked={form.targetUkReact}
                          onChange={(e) => setForm({ ...form, targetUkReact: e.target.checked })}
                          className="h-4 w-4 rounded text-[#1d63ed]"
                        />
                        <span>🇬🇧 UK React Developer Page (/hire-uk-react-developer)</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 text-xs">
                        <input
                          type="checkbox"
                          checked={form.targetUkWp}
                          onChange={(e) => setForm({ ...form, targetUkWp: e.target.checked })}
                          className="h-4 w-4 rounded text-indigo-600"
                        />
                        <span>🇬🇧 UK WordPress Developer Page (/hire-uk-wordpress-developer)</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MEDIA & SCREENSHOTS */}
              {activeTab === 'media' && (
                <div className="space-y-6">
                  {/* Desktop Thumbnail */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="font-extrabold text-slate-800 flex items-center gap-1.5">
                        <Monitor className="w-4 h-4 text-brand-amber" /> Primary Desktop Thumbnail / Cover Image
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setGalleryTarget('desktop');
                        }}
                        className="text-xs font-bold text-[#1d63ed] hover:underline"
                      >
                        Pick from uploaded files
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      {form.image && (
                        <div className="relative w-28 h-16 rounded-xl overflow-hidden border border-slate-300 bg-slate-100 shrink-0">
                          <Image src={resolveImgSrc(form.image)} alt="Desktop preview" fill className="object-cover" unoptimized />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage('desktop')}
                            className="absolute top-1 right-1 p-1 rounded-md bg-slate-900/80 text-white hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'desktop')}
                        className="text-xs text-slate-600"
                      />
                      {uploadingDesktop && <Loader2 className="w-4 h-4 animate-spin text-brand-amber" />}
                    </div>
                  </div>

                  {/* Multi Screenshot Gallery */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="font-extrabold text-slate-800 flex items-center gap-1.5">
                        <Images className="w-4 h-4 text-amber-500" /> Case Study Image Gallery ({form.screenshots.length})
                      </label>
                      <button
                        type="button"
                        onClick={() => setGalleryTarget('screenshots')}
                        className="text-xs font-bold text-[#1d63ed] hover:underline"
                      >
                        Pick from uploaded photos
                      </button>
                    </div>

                    {form.screenshots.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {form.screenshots.map((src, idx) => (
                          <div key={idx} className="relative h-20 rounded-xl overflow-hidden border border-slate-200 bg-white group">
                            <Image src={resolveImgSrc(src)} alt="Screenshot" fill className="object-cover" unoptimized />
                            <button
                              type="button"
                              onClick={() => handleRemoveScreenshot(idx)}
                              className="absolute top-1 right-1 p-1 rounded-md bg-slate-900/80 text-white hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-3 pt-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleScreenshotUpload}
                        className="text-xs text-slate-600"
                      />
                      {uploadingScreenshot && <Loader2 className="w-4 h-4 animate-spin text-brand-amber" />}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: EXECUTIVE BREAKDOWN */}
              {activeTab === 'summary' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-amber-50 border border-amber-200 p-4 rounded-2xl">
                    <div>
                      <h4 className="font-black text-[#0b1a30]">Executive Summary Breakdown</h4>
                      <p className="text-[11px] text-slate-600 font-medium">
                        Used for fast-reading executive cards: Challenge vs. Solution vs. Impact Results.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowGeminiModal(true)}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md"
                    >
                      <Sparkles className="w-4 h-4" /> AI Auto-Fill
                    </button>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-extrabold mb-1">Short Description / Catchphrase</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="High-level 1-2 sentence overview..."
                      className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-extrabold mb-1">The Challenge</label>
                    <textarea
                      value={form.challenge}
                      onChange={(e) => setForm({ ...form, challenge: e.target.value })}
                      placeholder="What was the client's main problem or technical bottleneck?"
                      className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-extrabold mb-1">The Solution & Architecture</label>
                    <textarea
                      value={form.solution}
                      onChange={(e) => setForm({ ...form, solution: e.target.value })}
                      placeholder="How did you solve it technically? Architecture, stack, workflows built..."
                      className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-extrabold mb-1">Key Results & Business Impact</label>
                    <textarea
                      value={form.results}
                      onChange={(e) => setForm({ ...form, results: e.target.value })}
                      placeholder="Quantitative metrics, speed improvements, conversions, user growth..."
                      className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900"
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: LONG-FORM BLOG CONTENT EDITOR */}
              {activeTab === 'blog' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-slate-800 font-black text-sm">Long-Form Case Study Blog Post</label>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Write long-form markdown/HTML content with headings, lists, code snippets, and embedded images.
                      </p>
                    </div>
                  </div>

                  <RichTextEditor
                    value={form.content}
                    onChange={(val) => setForm((prev) => ({ ...prev, content: val }))}
                    onOpenMediaPicker={() => setGalleryTarget('richText')}
                    onOpenGeminiAI={() => setShowGeminiModal(true)}
                  />
                </div>
              )}

              {/* TAB 5: TECH STACK */}
              {activeTab === 'tech' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-800 font-black mb-2">Select Tech Stack Badges</label>
                    <div className="flex flex-wrap gap-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                      {PREDEFINED_TECH.map((tech) => {
                        const selected = form.technologies.includes(tech);
                        return (
                          <button
                            key={tech}
                            type="button"
                            onClick={() => toggleTechnology(tech)}
                            className={`px-3 py-1.5 rounded-xl font-extrabold text-xs border transition-all cursor-pointer ${
                              selected
                                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {selected ? '✓ ' : '+ '} {tech}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-800 font-extrabold mb-1">Add Custom Technology</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={form.customTech}
                        onChange={(e) => setForm({ ...form, customTech: e.target.value })}
                        onKeyDown={addCustomTech}
                        placeholder="e.g. GraphQL, Redis, Docker"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={addCustomTech}
                        className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-extrabold text-xs shrink-0"
                      >
                        Add Tag
                      </button>
                    </div>
                  </div>

                  {form.technologies.length > 0 && (
                    <div>
                      <span className="block text-slate-600 font-bold mb-1">Active Selected Stack:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {form.technologies.map((t) => (
                          <span
                            key={t}
                            className="px-3 py-1 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs flex items-center gap-1"
                          >
                            {t}
                            <button
                              type="button"
                              onClick={() => toggleTechnology(t)}
                              className="text-amber-700 hover:text-red-600"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="border-t border-slate-100 pt-5 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setShowPreviewModal(true)}
                  className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-brand-amber" /> Preview Case Study
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2.5 rounded-2xl text-slate-500 hover:bg-slate-100 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-2xl bg-[#1d63ed] hover:bg-blue-600 text-white text-xs font-black uppercase tracking-wider shadow-lg transition-all cursor-pointer"
                  >
                    {editingProject ? 'Update Case Study' : 'Save New Case Study'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      <MediaPickerModal
        open={galleryTarget !== null}
        onClose={() => setGalleryTarget(null)}
        onSelect={(url) => {
          handleGallerySelect(url);
          setGalleryTarget(null);
        }}
      />

      {/* Gemini AI Generator Modal */}
      <GeminiGeneratorModal
        open={showGeminiModal}
        onClose={() => setShowGeminiModal(false)}
        initialData={{
          sitename: form.sitename,
          technologies: form.technologies,
          description: form.description,
          client: form.client,
          role: form.role,
        }}
        onApply={(generated) => {
          setForm((prev) => ({
            ...prev,
            category: generated.category || prev.category,
            role: generated.role || prev.role,
            duration: generated.duration || prev.duration,
            challenge: generated.challenge || prev.challenge,
            solution: generated.solution || prev.solution,
            results: generated.results || prev.results,
            content: generated.content || prev.content,
          }));
          setActiveTab('summary');
        }}
      />

      {/* Live Case Study Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-[80] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-[#FAFAF7] border border-slate-200 rounded-3xl max-w-4xl w-full p-6 sm:p-10 space-y-6 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto text-brand-navy">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <span className="text-xs font-black uppercase tracking-widest text-brand-amber flex items-center gap-1.5">
                <Eye className="w-4 h-4" /> Case Study Live Preview
              </span>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preview Banner */}
            <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-3">
              {form.category && (
                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/20 text-brand-amber border border-amber-500/30">
                  {form.category}
                </span>
              )}
              <h1 className="text-3xl font-black text-white">{form.sitename || 'Untitled Case Study'}</h1>
              {form.client && <p className="text-xs text-amber-400 font-bold">Client: {form.client}</p>}
            </div>

            {/* Executive Summary Cards */}
            {(form.challenge || form.solution || form.results) && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {form.challenge && (
                  <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-xs">
                    <h4 className="font-extrabold text-[#0b1a30] text-xs uppercase tracking-wider">The Challenge</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{form.challenge}</p>
                  </div>
                )}
                {form.solution && (
                  <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-xs">
                    <h4 className="font-extrabold text-[#0b1a30] text-xs uppercase tracking-wider">The Solution</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{form.solution}</p>
                  </div>
                )}
                {form.results && (
                  <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-xs">
                    <h4 className="font-extrabold text-[#0b1a30] text-xs uppercase tracking-wider">Key Impact</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{form.results}</p>
                  </div>
                )}
              </div>
            )}

            {/* Blog Post Preview */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-lg font-black text-[#0b1a30]">Full Case Study Article</h3>
              {form.content ? (
                <div
                  className="prose max-w-none text-slate-700 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: form.content }}
                />
              ) : (
                <p className="text-xs text-slate-400 italic">No blog post content written yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
