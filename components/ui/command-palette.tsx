'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Terminal,
  ArrowRight,
  Sparkles,
  Copy,
  Check,
  Code2,
  Database,
  Globe,
  Gamepad2,
  Calculator,
  Briefcase,
  Layers,
  Zap,
  ExternalLink,
} from 'lucide-react';
import { ContactModal } from './contact-modal';

interface CommandItem {
  id: string;
  category: string;
  title: string;
  subtitle?: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
}

export function CommandPalette() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Global keydown listener for ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => {
      setIsOpen(true);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-command-palette', handleCustomOpen);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-palette', handleCustomOpen);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setSearch('');
    }
  }, [isOpen]);

  const copyEmail = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText('rowellblanca94@gmail.com');
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const COMMANDS: CommandItem[] = [
    // Quick Actions
    {
      id: 'book-call',
      category: 'Quick Actions',
      title: 'Book Discovery Call',
      subtitle: 'Schedule a direct 1-on-1 technical consultation',
      badge: 'Priority',
      icon: Sparkles,
      action: () => {
        setIsOpen(false);
        setIsContactModalOpen(true);
      },
    },
    {
      id: 'copy-email',
      category: 'Quick Actions',
      title: 'Copy Direct Email',
      subtitle: 'rowellblanca94@gmail.com',
      badge: copiedEmail ? 'Copied!' : 'Direct',
      icon: copiedEmail ? Check : Copy,
      action: copyEmail,
    },
    {
      id: 'architecture-inspector',
      category: 'Quick Actions',
      title: 'Inspect System Architecture',
      subtitle: 'Interactive Next.js & WordPress request flow blueprint',
      badge: 'Interactive',
      icon: Layers,
      action: () => {
        setIsOpen(false);
        const el = document.getElementById('architecture-inspector');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          router.push('/#architecture-inspector');
        }
      },
    },
    {
      id: 'refactor-bench',
      category: 'Quick Actions',
      title: 'View Code & Performance Benchmark',
      subtitle: 'Side-by-side refactor metrics and zero-bloat comparison',
      badge: 'Metrics',
      icon: Zap,
      action: () => {
        setIsOpen(false);
        const el = document.getElementById('refactor-benchmark');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          router.push('/#refactor-benchmark');
        }
      },
    },
    {
      id: 'estimate-scope',
      category: 'Quick Actions',
      title: 'Estimate Project Scope & Timeline',
      subtitle: 'Interactive project scope calculator',
      icon: Calculator,
      action: () => {
        setIsOpen(false);
        const el = document.getElementById('project-estimator');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          router.push('/#project-estimator');
        }
      },
    },

    // Projects & Case Studies
    {
      id: 'macmanus-portal',
      category: 'Case Studies',
      title: 'MacManus Asset Finance Portal',
      subtitle: 'UK commercial broker engine with 98/100 Core Web Vitals',
      badge: 'Case Study',
      icon: Briefcase,
      action: () => {
        setIsOpen(false);
        router.push('/mywork/macmanus-portal');
      },
    },
    {
      id: 'buildforuser',
      category: 'Case Studies',
      title: 'BuildForUser SaaS Platform',
      subtitle: 'Multi-tenant engine engineered with Next.js & NeonDB',
      badge: 'SaaS',
      icon: Globe,
      action: () => {
        setIsOpen(false);
        router.push('/mywork/buildforuser');
      },
    },
    {
      id: 'all-case-studies',
      category: 'Case Studies',
      title: 'All Client Case Studies & ROI',
      subtitle: 'In-depth architectural breakdowns for UK & US clients',
      icon: ArrowRight,
      action: () => {
        setIsOpen(false);
        router.push('/case-studies');
      },
    },
    {
      id: 'all-projects',
      category: 'Case Studies',
      title: 'Browse Full Portfolio Directory (50+ Shipped)',
      subtitle: 'Explore active web applications and WordPress builds',
      icon: Briefcase,
      action: () => {
        setIsOpen(false);
        router.push('/mywork');
      },
    },

    // Developer Stack
    {
      id: 'stack-react',
      category: 'Tech Stack',
      title: 'React 19 & Next.js 14 App Router',
      subtitle: 'Server Components, Server Actions, Edge Rendering',
      badge: 'Frontend',
      icon: Code2,
      action: () => {
        setIsOpen(false);
        router.push('/mywork?category=nextjs');
      },
    },
    {
      id: 'stack-wordpress',
      category: 'Tech Stack',
      title: 'Custom WordPress & Gutenberg Architecture',
      subtitle: 'PSR-4 OOP PHP, bespoke block plugins, zero page builders',
      badge: 'Backend/CMS',
      icon: Layers,
      action: () => {
        setIsOpen(false);
        router.push('/mywork?category=wordpress');
      },
    },
    {
      id: 'stack-neondb',
      category: 'Tech Stack',
      title: 'Serverless PostgreSQL & Prisma ORM',
      subtitle: 'Relational data modeling, connection pooling, indexing',
      badge: 'Database',
      icon: Database,
      action: () => {
        setIsOpen(false);
        router.push('/about');
      },
    },

    // Arcade
    {
      id: 'developer-arcade',
      category: 'Arcade',
      title: 'Developer Arcade (Games & Interactive)',
      subtitle: 'Retro canvas games: Speed Racer, Cyber Pong, Code Duel',
      badge: '🎮 Fun',
      icon: Gamepad2,
      action: () => {
        setIsOpen(false);
        router.push('/arcade');
      },
    },
  ];

  // Filter commands by search term
  const filtered = COMMANDS.filter((cmd) => {
    const query = search.toLowerCase().trim();
    if (!query) return true;
    return (
      cmd.title.toLowerCase().includes(query) ||
      cmd.subtitle?.toLowerCase().includes(query) ||
      cmd.category.toLowerCase().includes(query) ||
      cmd.badge?.toLowerCase().includes(query)
    );
  });

  // Handle keyboard navigation
  const handleKeyDownList = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
      }
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 sm:pt-28 px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[80vh]"
            >
              {/* Search Bar Input */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 bg-slate-50/70">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setSelectedIndex(0);
                  }}
                  onKeyDown={handleKeyDownList}
                  placeholder="Type a command, project name, or stack..."
                  className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
                <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono text-slate-500 bg-white border border-slate-300 rounded shadow-2xs">
                  ESC
                </kbd>
              </div>

              {/* List Content */}
              <div className="overflow-y-auto p-2 divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <div className="py-12 text-center text-sm text-slate-500">
                    No matching commands found for <span className="font-mono text-slate-900">"{search}"</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filtered.map((cmd, index) => {
                      const isSelected = selectedIndex === index;
                      const Icon = cmd.icon;
                      return (
                        <button
                          key={cmd.id}
                          onClick={cmd.action}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-amber-500 text-slate-950 font-medium shadow-2xs'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`p-1.5 rounded-lg shrink-0 ${
                                isSelected ? 'bg-slate-950 text-amber-400' : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold truncate ${isSelected ? 'text-slate-950' : 'text-slate-900'}`}>
                                  {cmd.title}
                                </span>
                                {cmd.badge && (
                                  <span
                                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ${
                                      isSelected
                                        ? 'bg-slate-950 text-white'
                                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                                    }`}
                                  >
                                    {cmd.badge}
                                  </span>
                                )}
                              </div>
                              {cmd.subtitle && (
                                <p
                                  className={`text-[11px] truncate ${
                                    isSelected ? 'text-slate-800' : 'text-slate-500'
                                  }`}
                                >
                                  {cmd.subtitle}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`text-[10px] font-mono uppercase tracking-wider ${isSelected ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                              {cmd.category}
                            </span>
                            {isSelected && (
                              <kbd className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] font-mono bg-slate-950 text-white rounded">
                                ↵
                              </kbd>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Bottom Keyboard Shortcut Hint Footer */}
              <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-[11px] font-mono text-slate-500 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 bg-white border border-slate-300 rounded text-[10px]">↑</kbd>
                    <kbd className="px-1 py-0.5 bg-white border border-slate-300 rounded text-[10px]">↓</kbd>
                    <span>Navigate</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 bg-white border border-slate-300 rounded text-[10px]">↵</kbd>
                    <span>Execute</span>
                  </span>
                </div>
                <span>Rowell Mark Blanca · Senior Engineer</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </>
  );
}
