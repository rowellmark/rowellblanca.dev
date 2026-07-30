'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Check,
  Copy,
  Sparkles,
  Search,
  Star,
  Eye,
  EyeOff,
  BookOpen,
  Calendar,
  Clock,
  Tag,
  Loader2,
} from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  category?: string;
  tags: string[];
  author?: string;
  readingTime?: string;
  featured: boolean;
  published: boolean;
  publishedAt: string;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const [showModal, setShowModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  // AI Assistant Modal State
  const [aiTopic, setAiTopic] = useState('');
  const [aiKeywords, setAiKeywords] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);

  // Form State
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    category: 'Engineering Architecture',
    tags: 'React, Next.js, WordPress',
    author: 'Rowell Mark Blanca',
    readingTime: '5 min read',
    featured: false,
    published: true,
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/blog?includeDrafts=true');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.posts)) {
          setPosts(data.posts);
        }
      }
    } catch (e) {
      console.error('Failed to fetch blog posts:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (val: string) => {
    const slugified = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setForm((prev) => ({
      ...prev,
      title: val,
      slug: prev.slug ? prev.slug : slugified,
    }));
  };

  const handleGenerateAiPost = async () => {
    if (!aiTopic.trim() || aiGenerating) return;
    setAiGenerating(true);

    try {
      const res = await fetch('/api/ai/blog-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopic,
          keywords: aiKeywords,
          action: 'generate_full_post',
        }),
      });

      const data = await res.json();
      if (data.success && data.generated) {
        const g = data.generated;
        setForm({
          title: g.title || form.title,
          slug: g.slug || form.slug,
          excerpt: g.excerpt || form.excerpt,
          content: g.content || form.content,
          coverImage: form.coverImage,
          category: g.category || form.category,
          tags: Array.isArray(g.tags) ? g.tags.join(', ') : form.tags,
          author: form.author,
          readingTime: g.readingTime || form.readingTime,
          featured: false,
          published: true,
        });
        setShowAiModal(false);
        setShowModal(true);
      } else {
        alert(data.message || 'AI article generation failed');
      }
    } catch (e) {
      alert('Error generating article with AI');
    } finally {
      setAiGenerating(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const tagArray = form.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      ...form,
      tags: tagArray,
    };

    const isEdit = Boolean(editingPost);
    const url = isEdit ? `/api/blog/${editingPost?.slug}` : '/api/blog';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setEditingPost(null);
        fetchPosts();
      } else {
        alert(data.message || 'Error saving blog post');
      }
    } catch (e) {
      alert('Failed to save article');
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      const res = await fetch(`/api/blog/${slug}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchPosts();
    } catch (e) {
      alert('Failed to delete article');
    }
  };

  const toggleStatus = async (post: BlogPost, field: 'published' | 'featured') => {
    try {
      const payload = { [field]: !post[field] };
      const res = await fetch(`/api/blog/${post.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) fetchPosts();
    } catch (e) {
      alert('Failed to update post status');
    }
  };

  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0b1a30] flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-brand-amber" />
            Blog & Article Manager ({posts.length})
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Write, manage, and AI-generate technical articles to highlight your software engineering expertise.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setAiTopic('Next.js 14 App Router vs Custom WordPress Architecture for UK Enterprises');
              setAiKeywords('Next.js 14, WordPress, PHP, React, UK Engineering');
              setShowAiModal(true);
            }}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs shadow-md hover:scale-105 transition-all cursor-pointer"
          >
            <Sparkles className="h-4 w-4" /> AI Article Generator
          </button>

          <button
            onClick={() => {
              setEditingPost(null);
              setForm({
                title: '',
                slug: '',
                excerpt: '',
                content: '',
                coverImage: '',
                category: 'Engineering Architecture',
                tags: 'React, Next.js, WordPress',
                author: 'Rowell Mark Blanca',
                readingTime: '5 min read',
                featured: false,
                published: true,
              });
              setShowModal(true);
            }}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#1d63ed] hover:bg-blue-600 text-white font-black text-xs shadow-md transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Create New Article
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles by title or topic..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto max-w-full">
          {['All', 'WordPress', 'React & Next.js', 'Gaming', 'Engineering Architecture', 'Case Studies', 'AI Engineering'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-bold text-xs flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-amber-500" /> Loading blog articles...
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-medium text-xs">
            No blog posts found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold">
                  <th className="p-4">Article Title & Slug</th>
                  <th className="p-4">Category & Tags</th>
                  <th className="p-4">Status & Featured</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 space-y-1 max-w-md">
                      <span className="font-black text-[#0b1a30] text-sm block leading-snug">{post.title}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-indigo-700 font-bold text-[11px] bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          /blog/{post.slug}
                        </span>
                        <a
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 text-slate-400 hover:text-slate-700"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                    <td className="p-4 space-y-1">
                      <span className="font-extrabold text-xs text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg inline-block">
                        {post.category || 'Engineering'}
                      </span>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {post.tags?.slice(0, 3).map((t, idx) => (
                          <span key={idx} className="text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 space-x-2">
                      <button
                        onClick={() => toggleStatus(post, 'published')}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-extrabold text-[11px] border cursor-pointer ${
                          post.published
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}
                      >
                        {post.published ? <Eye className="w-3 h-3 text-emerald-600" /> : <EyeOff className="w-3 h-3 text-slate-400" />}
                        {post.published ? 'Published' : 'Draft'}
                      </button>

                      <button
                        onClick={() => toggleStatus(post, 'featured')}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-extrabold text-[11px] border cursor-pointer ${
                          post.featured
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : 'bg-slate-50 text-slate-400 border-slate-200'
                        }`}
                      >
                        <Star className={`w-3 h-3 ${post.featured ? 'fill-amber-400 text-amber-500' : ''}`} />
                        {post.featured ? 'Featured' : 'Standard'}
                      </button>
                    </td>
                    <td className="p-4 text-xs font-mono text-slate-500">
                      {new Date(post.publishedAt || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingPost(post);
                          setForm({
                            title: post.title,
                            slug: post.slug,
                            excerpt: post.excerpt || '',
                            content: post.content,
                            coverImage: post.coverImage || '',
                            category: post.category || 'Engineering Architecture',
                            tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
                            author: post.author || 'Rowell Mark Blanca',
                            readingTime: post.readingTime || '5 min read',
                            featured: post.featured,
                            published: post.published,
                          });
                          setShowModal(true);
                        }}
                        className="p-2 rounded-lg text-slate-500 hover:text-[#1d63ed] hover:bg-slate-100"
                        title="Edit Article"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.slug)}
                        className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50"
                        title="Delete Article"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT ARTICLE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto !mt-0">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[92vh] flex flex-col my-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-[#0b1a30]">
                  {editingPost ? `Edit Article: ${editingPost.title}` : 'Write New Article'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Create rich markdown articles to publish on your website blog.
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

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto space-y-4 text-xs pr-1">
              <div>
                <label className="block text-slate-700 font-extrabold mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Building High-Speed WordPress Engines for UK Finance Companies"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 font-extrabold text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">URL Slug Path *</label>
                  <input
                    type="text"
                    required
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-bold"
                  >
                    <option value="WordPress">WordPress</option>
                    <option value="React & Next.js">React & Next.js</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Engineering Architecture">Engineering Architecture</option>
                    <option value="Case Studies">Case Studies</option>
                    <option value="AI Engineering">AI Engineering</option>
                    <option value="Frontend Performance">Frontend Performance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-extrabold mb-1">Short Excerpt (Summary)</label>
                <textarea
                  rows={2}
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  placeholder="2-sentence preview summary for article cards..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-extrabold mb-1">Article Content (Markdown) *</label>
                <textarea
                  rows={10}
                  required
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Write your article in Markdown with ### Headings, bullet points, and code blocks..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs leading-relaxed focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    placeholder="React, Next.js, WordPress, FinTech"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">Estimated Reading Time</label>
                  <input
                    type="text"
                    value={form.readingTime}
                    onChange={(e) => setForm({ ...form, readingTime: e.target.value })}
                    placeholder="e.g. 5 min read"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={form.published}
                      onChange={(e) => setForm({ ...form, published: e.target.checked })}
                      className="h-4 w-4 rounded text-[#1d63ed]"
                    />
                    <span>Publish Immediately</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                      className="h-4 w-4 rounded text-amber-500"
                    />
                    <span>Feature on Blog Hero</span>
                  </label>
                </div>

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
                    Save Article
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GEMINI AI ARTICLE ASSISTANT MODAL */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 !mt-0">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">AI Article Assistant</h3>
                  <p className="text-xs text-slate-400">Generate technical articles, outlines & tags in seconds.</p>
                </div>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Article Topic / Title Prompt *</label>
                <input
                  type="text"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="e.g. Next.js 14 App Router performance vs WordPress Gutenberg"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-white font-medium focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Target Keywords</label>
                <input
                  type="text"
                  value={aiKeywords}
                  onChange={(e) => setAiKeywords(e.target.value)}
                  placeholder="Next.js, WordPress, Custom Themes, UK Engineering"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-white font-medium focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGenerateAiPost}
                disabled={aiGenerating || !aiTopic.trim()}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs shadow-lg hover:scale-105 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {aiGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{aiGenerating ? 'AI is Writing Draft...' : '🚀 Generate Full Article Draft'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
