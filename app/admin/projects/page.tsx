'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FolderKanban, Plus, Trash2, Edit, ExternalLink, Check, Upload, Smartphone, Monitor, Loader2, Image as ImageIcon, Star, X, Images } from 'lucide-react';
import { resolveValidImageSrc } from '@/lib/image-utils';
import MediaPickerModal from '@/components/admin/media-picker-modal';

type ImageSlot = 'desktop' | 'mobile' | 'fullDesktop' | 'fullMobile';
type GalleryTarget = ImageSlot | 'screenshots';

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
  'Tailwind'
];

function resolveImgSrc(src?: string | null) {
  return resolveValidImageSrc(src);
}


export default function ProjectsManagerPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
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
    technologies: [] as string[],
    customTech: '',
    featured: true,
    spotlight: false,
    active: true,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
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
        body: JSON.stringify({ id: proj.id, active: newActive }),
      });
      const data = await res.json();
      if (data.success) {
        fetchProjects();
      }
    } catch (e) {
      alert('Failed to update project status');
    }
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: ImageSlot
  ) => {
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingProject ? 'PUT' : 'POST';
    const payload = {
      ...form,
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
          technologies: [],
          customTech: '',
          featured: true,
          spotlight: false,
          active: true,
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
    if (!confirm('Are you sure you want to delete this project?')) return;
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#0b1a30]">
            Portfolio Projects ({(Array.isArray(projects) ? projects : []).length})
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Manage project records. Click 🌟 Set Spotlight on any project to feature it in the Homepage Spotlight section.
          </p>
        </div>
        <button
          onClick={() => {
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
              technologies: ['React/Nextjs', 'Prisma', 'NeonDB'],
              customTech: '',
              featured: true,
              spotlight: false,
              active: true,
            });
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1d63ed] text-white font-extrabold text-xs shadow-md"
        >
          <Plus className="h-4 w-4" /> Add New Project
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold">
                <th className="p-4">Thumbnails</th>
                <th className="p-4">Project Name</th>
                <th className="p-4">Visibility</th>
                <th className="p-4">Homepage Spotlight</th>
                <th className="p-4">Technologies & Tabs</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {(Array.isArray(projects) ? projects : []).map((proj) => (
                <tr key={proj.id} className="hover:bg-slate-50">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-14 h-9 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 relative" title="Card Featured Image">
                        <Image
                          src={resolveImgSrc(proj.image)}
                          alt={proj.sitename || 'Project Thumbnail'}
                          fill
                          className="object-cover"
                          unoptimized
                        />

                      </div>
                      {proj.fullDesktopImage && (
                        <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[9px] font-extrabold" title="Full Page Screenshot Available">
                          Full Page
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-extrabold text-[#0b1a30] block text-sm">{proj.sitename}</span>
                    {proj.url && <span className="text-slate-400 block font-mono text-[11px]">{proj.url}</span>}
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
                      title={proj.active !== false ? 'Click to Deactivate (Hide from website)' : 'Click to Activate (Show on website)'}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${proj.active !== false ? 'bg-emerald-500' : 'bg-amber-500'}`} />
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
                      {proj.technologies?.map((tech) => (
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
                          technologies: proj.technologies || [],
                          customTech: '',
                          featured: proj.featured,
                          spotlight: proj.spotlight || false,
                          active: proj.active !== false,
                        });
                        setShowModal(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-[#1d63ed] transition-colors"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(proj.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
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

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-6 !mt-0">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <h3 className="text-lg font-black text-[#0b1a30]">
              {editingProject ? 'Edit Project Record' : 'Add New Project'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-extrabold mb-1">Project Name</label>
                <input
                  type="text"
                  value={form.sitename}
                  onChange={(e) => setForm({ ...form, sitename: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">Permalink (slug)</label>
                  <input
                    type="text"
                    value={form.permalink}
                    onChange={(e) => setForm({ ...form, permalink: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">Live URL</label>
                  <input
                    type="text"
                    value={form.url}
                    onChange={(e) => setForm({ ...form, url: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                  />
                </div>
              </div>

              {isPlugin ? (
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-800 block">
                    Plugin Screenshots ({form.screenshots.length})
                  </span>

                  {form.screenshots.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {form.screenshots.map((src, index) => (
                        <div
                          key={`${src}-${index}`}
                          className="relative w-full h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group"
                        >
                          <Image
                            src={resolveImgSrc(src)}
                            alt={`Plugin Screenshot ${index + 1}`}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveScreenshot(index)}
                            className="absolute top-1.5 right-1.5 p-1.5 rounded-lg bg-slate-900/70 text-white opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all"
                            title="Remove screenshot"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 cursor-pointer text-slate-600 font-bold">
                      {uploadingScreenshot ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1d63ed]" /> : <Upload className="w-3.5 h-3.5 text-[#1d63ed]" />}
                      <span>Add Screenshot</span>
                      <input type="file" accept="image/*" onChange={handleScreenshotUpload} disabled={uploadingScreenshot} className="hidden" />
                    </label>
                    <button
                      type="button"
                      onClick={() => setGalleryTarget('screenshots')}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold"
                      title="Choose from uploaded photos"
                    >
                      <Images className="w-3.5 h-3.5 text-[#1d63ed]" />
                    </button>
                  </div>
                </div>
              ) : (
              <>
              {/* 1. Featured Homepage Card Thumbnails (Lightweight) */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-800 block">
                  1. Homepage Card Featured Thumbnails (Lightweight)
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Card Desktop */}
                  <div className="space-y-1.5">
                    <label className="block text-slate-700 font-extrabold flex items-center gap-1.5">
                      <Monitor className="w-3.5 h-3.5 text-[#1d63ed]" /> Featured Card Image (Desktop)
                    </label>

                    {form.image && (
                      <div className="relative w-full h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group">
                        <Image
                          src={resolveImgSrc(form.image)}
                          alt="Featured Desktop"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage('desktop')}
                          className="absolute top-1.5 right-1.5 p-1.5 rounded-lg bg-slate-900/70 text-white opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all"
                          title="Remove image"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 cursor-pointer text-slate-600 font-bold">
                        {uploadingDesktop ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1d63ed]" /> : <Upload className="w-3.5 h-3.5 text-[#1d63ed]" />}
                        <span>{form.image ? 'Replace' : 'Upload'}</span>
                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'desktop')} disabled={uploadingDesktop} className="hidden" />
                      </label>
                      <button
                        type="button"
                        onClick={() => setGalleryTarget('desktop')}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold"
                        title="Choose from uploaded photos"
                      >
                        <Images className="w-3.5 h-3.5 text-[#1d63ed]" />
                      </button>
                    </div>
                  </div>

                  {/* Card Mobile */}
                  <div className="space-y-1.5">
                    <label className="block text-slate-700 font-extrabold flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-amber-500" /> Featured Card Image (Mobile)
                    </label>

                    {form.mobileImage && (
                      <div className="relative w-full h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group flex items-center justify-center">
                        <Image
                          src={resolveImgSrc(form.mobileImage)}
                          alt="Featured Mobile"
                          fill
                          className="object-contain"
                          unoptimized
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage('mobile')}
                          className="absolute top-1.5 right-1.5 p-1.5 rounded-lg bg-slate-900/70 text-white opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all"
                          title="Remove image"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-dashed border-amber-300 bg-amber-50/50 hover:bg-amber-100/50 cursor-pointer text-amber-900 font-bold">
                        {uploadingMobile ? <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" /> : <Upload className="w-3.5 h-3.5 text-amber-600" />}
                        <span>{form.mobileImage ? 'Replace' : 'Upload'}</span>
                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'mobile')} disabled={uploadingMobile} className="hidden" />
                      </label>
                      <button
                        type="button"
                        onClick={() => setGalleryTarget('mobile')}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-amber-300 bg-amber-50/50 hover:bg-amber-100/50 text-amber-900 font-bold"
                        title="Choose from uploaded photos"
                      >
                        <Images className="w-3.5 h-3.5 text-amber-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Full Page Screenshots for Detail View (Scrollable) */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#1d63ed] block">
                  2. Full Page Screenshots for Detail View (Scrollable Viewport)
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Full Desktop Screenshot */}
                  <div className="space-y-1.5">
                    <label className="block text-slate-700 font-extrabold flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-blue-600" /> Full Desktop Page Screenshot
                    </label>

                    {form.fullDesktopImage && (
                      <div className="relative w-full h-28 rounded-xl overflow-y-auto border border-blue-200 bg-slate-900 group">
                        <Image
                          src={resolveImgSrc(form.fullDesktopImage)}
                          alt="Full Desktop Page"
                          width={600}
                          height={400}
                          className="w-full h-auto object-top block"
                          unoptimized
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage('fullDesktop')}
                          className="absolute top-1.5 right-1.5 p-1.5 rounded-lg bg-slate-900/70 text-white opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all"
                          title="Remove image"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-dashed border-blue-300 bg-blue-50/50 hover:bg-blue-100/50 cursor-pointer text-blue-900 font-bold">
                        {uploadingFullDesktop ? <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" /> : <Upload className="w-3.5 h-3.5 text-blue-600" />}
                        <span>{form.fullDesktopImage ? 'Replace' : 'Upload'}</span>
                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'fullDesktop')} disabled={uploadingFullDesktop} className="hidden" />
                      </label>
                      <button
                        type="button"
                        onClick={() => setGalleryTarget('fullDesktop')}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-blue-300 bg-blue-50/50 hover:bg-blue-100/50 text-blue-900 font-bold"
                        title="Choose from uploaded photos"
                      >
                        <Images className="w-3.5 h-3.5 text-blue-600" />
                      </button>
                    </div>
                  </div>

                  {/* Full Mobile Screenshot */}
                  <div className="space-y-1.5">
                    <label className="block text-slate-700 font-extrabold flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-purple-600" /> Full Mobile Page Screenshot
                    </label>

                    {form.fullMobileImage && (
                      <div className="relative w-full h-28 rounded-xl overflow-y-auto border border-purple-200 bg-slate-900 group flex items-center justify-center">
                        <Image
                          src={resolveImgSrc(form.fullMobileImage)}
                          alt="Full Mobile Page"
                          width={400}
                          height={600}
                          className="w-full h-auto object-top block"
                          unoptimized
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage('fullMobile')}
                          className="absolute top-1.5 right-1.5 p-1.5 rounded-lg bg-slate-900/70 text-white opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all"
                          title="Remove image"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}


                    <div className="flex gap-2">
                      <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-dashed border-purple-300 bg-purple-50/50 hover:bg-purple-100/50 cursor-pointer text-purple-900 font-bold">
                        {uploadingFullMobile ? <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-600" /> : <Upload className="w-3.5 h-3.5 text-purple-600" />}
                        <span>{form.fullMobileImage ? 'Replace' : 'Upload'}</span>
                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'fullMobile')} disabled={uploadingFullMobile} className="hidden" />
                      </label>
                      <button
                        type="button"
                        onClick={() => setGalleryTarget('fullMobile')}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-purple-300 bg-purple-50/50 hover:bg-purple-100/50 text-purple-900 font-bold"
                        title="Choose from uploaded photos"
                      >
                        <Images className="w-3.5 h-3.5 text-purple-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              </>
              )}

              {/* Selectable Technologies Chips (WordPress, Wordpress Plugins, React/Nextjs, etc.) */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <label className="block text-slate-700 font-extrabold">
                  Select Technologies & Frontend Tabs (Click to Toggle)
                </label>
                <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  {PREDEFINED_TECH.map((tech) => {
                    const selected = form.technologies.includes(tech);
                    return (
                      <button
                        type="button"
                        key={tech}
                        onClick={() => toggleTechnology(tech)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                          selected
                            ? 'bg-[#1d63ed] text-white shadow-xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {selected && <Check className="w-3 h-3 text-white" />}
                        {tech}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Add Custom Tech Tag */}
              <div className="space-y-1">
                <label className="block text-slate-700 font-extrabold">Add Custom Tech Tag</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.customTech}
                    onChange={(e) => setForm({ ...form, customTech: e.target.value })}
                    onKeyDown={addCustomTech}
                    placeholder="Type custom tech tag & press Enter..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={addCustomTech}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Selected Tags Display */}
              {form.technologies.length > 0 && (
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Selected Pills</span>
                  <div className="flex flex-wrap gap-1">
                    {form.technologies.map((t) => (
                      <span
                        key={t}
                        onClick={() => toggleTechnology(t)}
                        className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 font-extrabold text-[11px] cursor-pointer hover:bg-amber-100 transition-colors flex items-center gap-1"
                        title="Click to remove"
                      >
                        {t} ✕
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-6 pt-2 pb-1 bg-amber-50/60 p-3 rounded-2xl border border-amber-200/80">
                <label className="flex items-center gap-2 cursor-pointer font-extrabold text-amber-950">
                  <input
                    type="checkbox"
                    checked={form.spotlight}
                    onChange={(e) => setForm({ ...form, spotlight: e.target.checked })}
                    className="h-4 w-4 rounded text-amber-500 focus:ring-amber-400"
                  />
                  <span>🌟 Set as Homepage Spotlight Project</span>
                </label>
              </div>

              <div>
                <label className="block text-slate-700 font-extrabold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
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
                  disabled={uploadingDesktop || uploadingMobile || uploadingFullDesktop || uploadingFullMobile}
                  className="px-5 py-2 rounded-xl bg-[#1d63ed] text-white font-extrabold shadow-xs"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <MediaPickerModal
        open={galleryTarget !== null}
        onClose={() => setGalleryTarget(null)}
        onSelect={handleGallerySelect}
      />
    </div>
  );
}
