'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import logo from '@/assets/images/logo.png';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  MessageSquare,
  Star,
  LogOut,
  X,
  Menu,
  Headphones,
  Sparkles,
  ExternalLink,
  Globe,
  BookOpen,
  Cpu,
} from 'lucide-react';
import NotificationBell from '@/components/admin/notification-bell';


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Exclude auth check layout styling for login page
  const isLoginPage = pathname === '/admin/login';

  const checkAuth = React.useCallback(async () => {
    try {
      const res = await fetch('/api/crm/leads');
      if (res.status === 401) {
        setIsAuthenticated(false);
        router.push('/admin/login');
      } else {
        setIsAuthenticated(true);
      }
    } catch {
      setIsAuthenticated(false);
      router.push('/admin/login');
    }
  }, [router]);

  useEffect(() => {
    if (!isLoginPage) {
      checkAuth();
    }
  }, [isLoginPage, checkAuth]);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isAuthenticated !== true) {
    return null;
  }

  const navSections = [
    {
      title: 'CORE NAVIGATION',
      items: [
        { title: 'Dashboard', href: '/admin', icon: LayoutDashboard, external: false },
        { title: 'Blog Articles', href: '/admin/blog', icon: BookOpen, external: false },
        { title: 'AI API Settings', href: '/admin/ai-settings', icon: Cpu, external: false },
        { title: 'Landing Pages', href: '/admin/landing-pages', icon: Globe, external: false },
        { title: 'Projects', href: '/admin/projects', icon: FolderKanban, external: false },
        { title: 'Leads', href: '/admin/leads', icon: Users, external: false },
        { title: 'Testimonials', href: '/admin/testimonials', icon: Star, external: false },
        { title: 'Messages', href: '/admin/messages', icon: MessageSquare, external: false },
      ],
    },
    {
      title: 'PORTFOLIO LINKS',
      items: [
        { title: 'View Live Portfolio', href: '/', icon: ExternalLink, external: true },
        { title: 'View Case Studies Hub', href: '/case-studies', icon: ExternalLink, external: true },
        { title: 'View Blog Hub', href: '/blog', icon: ExternalLink, external: true },
        { title: 'View All Projects', href: '/mywork', icon: ExternalLink, external: true },
      ],
    },
  ];

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-900 overflow-hidden font-sans">
      
      {/* ── MacManus Style Dark Navy Sidebar (#0b1a30) ────────────────────── */}
      <aside
        className={`bg-[#0b1a30] text-slate-300 w-64 flex flex-col justify-between shrink-0 select-none border-r border-slate-800 h-full ${
          mobileMenuOpen ? 'fixed inset-y-0 left-0 z-50 shadow-2xl' : 'hidden lg:flex'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="relative h-8 w-8 shrink-0">
                <Image src={logo} alt="Rowell Blanca" fill sizes="32px" className="object-contain brightness-0 invert" priority />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-white text-sm tracking-tight leading-none">Rowell Blanca</span>
              </div>

            </Link>

            {/* Mobile Close */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-280px)]">
            {navSections.map((section, idx) => (
              <div key={idx} className="space-y-1">
                {section.title && (
                  <h3 className="px-3 text-[10px] font-extrabold tracking-wider text-slate-400 uppercase mb-2">
                    {section.title}
                  </h3>
                )}
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));

                  return item.external ? (
                    <a
                      key={item.title}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800/60 hover:text-white transition-all"
                    >
                      <Icon className="w-4 h-4 text-slate-400" />
                      <span className="truncate flex-1">{item.title}</span>
                    </a>
                  ) : (
                    <Link
                      key={item.title}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-[#1d63ed] text-white shadow-md shadow-[#1d63ed]/30'
                          : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate flex-1">{item.title}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Support Panel */}
        <div className="p-4 space-y-3 border-t border-slate-800/80 bg-[#071224]/60">
          <div className="bg-[#0f2442] p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-extrabold text-white uppercase tracking-wider">
              <Headphones className="w-3.5 h-3.5 text-amber-400" />
              <span>Developer Support</span>
            </div>
            <p className="text-[11px] text-slate-400">Rowell Blanca Portfolio CRM</p>
            <div className="text-[11px] text-amber-400 font-mono pt-1">
              rowellblanca94@gmail.com
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-extrabold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Session</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ──────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 shadow-xs z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#0b1a30] tracking-tight leading-none">
                Welcome back, Rowell
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-1 hidden sm:block">
                Portfolio Admin Dashboard & CRM Control Panel
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <NotificationBell />

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5 text-brand-amber" /> Live Site
            </Link>

            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>



        {/* Page Children Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-[#f8fafc]">
          {children}
        </main>
      </div>

    </div>
  );
}
