import React from 'react';
import Link from 'next/link';

const SERVICES = {
  react: { href: '/hire-uk-react-developer', label: 'Hire a React & Next.js developer', note: 'Web apps, SaaS portals and headless builds' },
  wordpress: { href: '/hire-uk-wordpress-developer', label: 'Hire a WordPress developer', note: 'Custom Gutenberg themes, plugins and WooCommerce' },
} as const;

/** Which service pages an article relates to, from its title, category, tags and stack. */
export function relatedServices(text: string): Array<keyof typeof SERVICES> {
  const t = text.toLowerCase();
  const wp = /wordpress|gutenberg|woocommerce|php|plugin/.test(t);
  const react = /react|next\.?js|node|typescript|saas|portal/.test(t);
  if (wp && !react) return ['wordpress'];
  if (react && !wp) return ['react'];
  return ['react', 'wordpress'];
}

/** Contextual links from articles/case studies to the matching hire pages (internal linking). */
export function ServiceLinks({ services }: { services: Array<keyof typeof SERVICES> }) {
  return (
    <nav aria-label="Related services" className="grid gap-3 sm:grid-cols-2">
      {services.map((key) => {
        const s = SERVICES[key];
        return (
          <Link
            key={key}
            href={s.href}
            className="motion-lift group rounded-[20px] border border-brand-border bg-white p-5 flex items-center justify-between gap-4"
          >
            <span className="flex flex-col gap-1">
              <span className="font-bold text-brand-navy group-hover:text-amber-700 transition-colors">{s.label}</span>
              <span className="text-sm text-brand-slate">{s.note}</span>
            </span>
            <span aria-hidden="true" className="text-xl text-brand-navy transition-transform duration-500 group-hover:translate-x-1">→</span>
          </Link>
        );
      })}
    </nav>
  );
}
