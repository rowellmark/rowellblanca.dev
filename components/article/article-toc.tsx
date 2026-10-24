'use client';

import React, { useEffect, useState } from 'react';

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

/**
 * "On this page" navigation. Pass `items` when the headings are known on the
 * server (blog Markdown); otherwise pass `scope` and the h2s inside it are
 * collected (and given ids) after mount — used for case-study HTML.
 * The heading currently being read is highlighted.
 */
export function ArticleToc({ items: initial, scope, variant = 'rail' }: { items?: TocItem[]; scope?: string; variant?: 'rail' | 'inline' }) {
  const [items, setItems] = useState<TocItem[]>(initial || []);
  const [active, setActive] = useState<string>(initial?.[0]?.id || '');

  useEffect(() => {
    if (initial?.length || !scope) return;
    const root = document.querySelector(scope);
    if (!root) return;
    const found: TocItem[] = [];
    root.querySelectorAll('h2').forEach((h, i) => {
      if (!h.id) h.id = `section-${i + 1}-${(h.textContent || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50)}`;
      found.push({ id: h.id, text: h.textContent || '', level: 2 });
    });
    setItems(found);
    if (found[0]) setActive(found[0].id);
  }, [initial, scope]);

  // Active = the last heading that has scrolled past the fixed header.
  useEffect(() => {
    if (!items.length) return;
    const els = items.map((it) => document.getElementById(it.id)).filter(Boolean) as HTMLElement[];
    let raf = 0;
    const update = () => {
      raf = 0;
      let current = els[0]?.id || '';
      for (const el of els) {
        if (el.getBoundingClientRect().top <= 140) current = el.id;
        else break;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [items]);

  // Scroll so the heading sits just under the fixed header. Handled here rather than by
  // Lenis' anchor handling, which double-counts scroll-margin and can stop short.
  const jumpTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    e.stopPropagation();
    const top = el.getBoundingClientRect().top + window.scrollY - 96;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
    history.replaceState(null, '', `#${id}`);
    setActive(id);
  };

  if (items.length < 2) return null;

  const list = (
    <ol className="m-0 p-0 list-none flex flex-col border-l border-brand-border">
      {items.map((it) => (
        <li key={it.id}>
          <a
            href={`#${it.id}`}
            onClick={(e) => jumpTo(e, it.id)}
            aria-current={active === it.id ? 'location' : undefined}
            className={`-ml-px block border-l-2 py-2 text-[15px] leading-snug transition-colors ${it.level === 3 ? 'pl-7' : 'pl-4'} ${
              active === it.id ? 'border-amber-500 text-brand-navy font-semibold' : 'border-transparent text-brand-slate hover:text-brand-navy'
            }`}
          >
            {it.text}
          </a>
        </li>
      ))}
    </ol>
  );

  if (variant === 'inline') {
    return (
      <details className="group rounded-2xl border border-brand-border bg-white open:pb-3">
        <summary className="flex items-center justify-between gap-4 min-h-[52px] px-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden font-mono text-xs uppercase tracking-[0.08em] text-brand-slate">
          On this page
          <span aria-hidden="true" className="text-lg leading-none text-brand-navy transition-transform duration-300 group-open:rotate-45">+</span>
        </summary>
        <nav aria-label="On this page" className="px-5">{list}</nav>
      </details>
    );
  }

  return (
    <nav aria-label="On this page" className="flex flex-col gap-4">
      <p className="m-0 font-mono text-xs uppercase tracking-[0.08em] text-brand-slate">On this page</p>
      {list}
    </nav>
  );
}
