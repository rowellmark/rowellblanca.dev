'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatedLogo } from '@/components/ui/animated-logo';
import { buttonClass } from '@/components/admin/ui';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  MessageSquare,
  Star,
  LogOut,
  X,
  Menu,
  ExternalLink,
  Globe,
  BookOpen,
  Cpu,
  Receipt,
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
      title: 'Workspace',
      items: [
        { title: 'Dashboard', href: '/admin', icon: LayoutDashboard, external: false },
        { title: 'Leads', href: '/admin/leads', icon: Users, external: false },
        { title: 'Messages', href: '/admin/messages', icon: MessageSquare, external: false },
        { title: 'Invoices & Billing', href: '/admin/invoices', icon: Receipt, external: false },
      ],
    },
    {
      title: 'Content',
      items: [
        { title: 'Projects', href: '/admin/projects', icon: FolderKanban, external: false },
        { title: 'Testimonials', href: '/admin/testimonials', icon: Star, external: false },
        { title: 'Blog Articles', href: '/admin/blog', icon: BookOpen, external: false },
        { title: 'Landing Pages', href: '/admin/landing-pages', icon: Globe, external: false },
        { title: 'AI API Settings', href: '/admin/ai-settings', icon: Cpu, external: false },
      ],
    },
    {
      title: 'Live site',
      items: [
        { title: 'Portfolio', href: '/', icon: ExternalLink, external: true },
        { title: 'Case Studies', href: '/case-studies', icon: ExternalLink, external: true },
        { title: 'Blog', href: '/blog', icon: ExternalLink, external: true },
        { title: 'My Work', href: '/mywork', icon: ExternalLink, external: true },
      ],
    },
  ];

  const allItems = navSections.flatMap((section) => section.items);
  const currentItem =
    allItems.find((item) => !item.external && item.href !== '/admin' && pathname.startsWith(item.href)) ||
    allItems.find((item) => item.href === '/admin');

  const sidebar = (
    <div className="flex h-full flex-col bg-zinc-50">
      {/* Brand */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-zinc-200">
        <Link href="/admin" className="flex items-center gap-2.5" onClick={() => setMobileMenuOpen(false)}>
          <AnimatedLogo className="h-8 w-8" title="Rowell Mark Blanca" />
          <span className="flex flex-col leading-none gap-1">
            <span className="text-sm font-semibold text-zinc-950">Rowell Blanca</span>
            <span className="text-xs text-zinc-500">Portfolio CRM</span>
          </span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close menu"
          className="lg:hidden h-9 w-9 rounded-lg flex items-center justify-center text-zinc-500 hover:bg-zinc-200/60 hover:text-zinc-950"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-6" aria-label="Admin">
        {navSections.map((section) => (
          <div key={section.title} className="flex flex-col gap-0.5">
            <p className="px-3 pb-1.5 text-xs font-medium text-zinc-500">{section.title}</p>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = !item.external && (pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href)));
              const cls = `flex items-center gap-2.5 h-9 px-3 rounded-lg text-sm transition-colors ${
                isActive ? 'bg-white text-zinc-950 font-medium shadow-sm ring-1 ring-zinc-200' : 'text-zinc-600 hover:bg-zinc-200/60 hover:text-zinc-950'
              }`;
              return item.external ? (
                <a key={item.title} href={item.href} target="_blank" rel="noopener noreferrer" className={cls}>
                  <Icon className="w-4 h-4 shrink-0 text-zinc-400" />
                  <span className="truncate flex-1">{item.title}</span>
                </a>
              ) : (
                <Link key={item.title} href={item.href} onClick={() => setMobileMenuOpen(false)} className={cls} aria-current={isActive ? 'page' : undefined}>
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-zinc-950' : 'text-zinc-500'}`} />
                  <span className="truncate flex-1">{item.title}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Account */}
      <div className="p-3 border-t border-zinc-200">
        <div className="flex items-center gap-3 rounded-lg p-2">
          <span className="h-9 w-9 shrink-0 rounded-full bg-zinc-950 text-white text-sm font-semibold flex items-center justify-center">R</span>
          <span className="flex-1 min-w-0 flex flex-col leading-tight">
            <span className="text-sm font-medium text-zinc-950 truncate">Rowell Blanca</span>
            <span className="text-xs text-zinc-500 truncate">hello@rowellblanca.dev</span>
          </span>
          <button
            onClick={handleLogout}
            aria-label="Log out"
            title="Log out"
            className="h-9 w-9 rounded-lg flex items-center justify-center text-zinc-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-white text-zinc-950 overflow-hidden font-sans">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 border-r border-zinc-200">{sidebar}</aside>

      {/* Mobile sheet */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <button aria-label="Close menu" className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] border-r border-zinc-200 shadow-xl">{sidebar}</aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 shrink-0 border-b border-zinc-200 bg-white/80 backdrop-blur px-4 sm:px-6 flex items-center justify-between gap-4 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              className="lg:hidden h-9 w-9 rounded-lg flex items-center justify-center text-zinc-600 hover:bg-zinc-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm min-w-0">
              <span className="text-zinc-500 hidden sm:inline">Admin</span>
              <span className="text-zinc-300 hidden sm:inline" aria-hidden="true">/</span>
              <span className="font-medium text-zinc-950 truncate">{currentItem?.title ?? 'Dashboard'}</span>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <NotificationBell />
            <a href="/" target="_blank" rel="noopener noreferrer" className={buttonClass('outline', 'sm', 'h-9')}>
              <ExternalLink className="h-3.5 w-3.5" /> <span className="hidden sm:inline">View site</span>
            </a>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-zinc-50/60 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
