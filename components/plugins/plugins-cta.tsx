import React from 'react';
import Link from 'next/link';
import { PLUGIN_NAMES } from '@/lib/plugins';
import { PluginInquiryButton } from '@/components/plugins/plugin-inquiry-button';

/** Dark call-to-action band for the plugins I build, maintain and manage (My Work, homepage). */
export function PluginsCta({ className = '' }: { className?: string }) {
  return (
    <aside
      aria-labelledby="plugins-cta"
      className={`motion-reveal relative overflow-hidden rounded-[28px] bg-brand-ink text-white p-7 sm:p-12 grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end ${className}`}
    >
      <div aria-hidden="true" className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(245,158,11,0.25),transparent)]" />
      <div className="relative flex flex-col gap-5">
        <p className="m-0 inline-flex items-center gap-2.5 font-mono text-xs sm:text-[13px] uppercase tracking-[0.08em] text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" aria-hidden="true" />
          WordPress plugins
        </p>
        <h2 id="plugins-cta" className="m-0 font-extrabold tracking-[-0.045em] leading-[1] text-[clamp(30px,3.6vw,52px)]">
          Plugins I build, maintain <span className="text-amber-500">& manage.</span>
        </h2>
        <p className="m-0 max-w-[560px] text-[17px] leading-relaxed text-slate-300">
          A growing suite of WordPress plugins I keep updated, supported and extended. Need one built, or an existing plugin
          looked after?
        </p>
        <ul className="m-0 p-0 list-none flex flex-wrap gap-2" aria-label="Plugins">
          {PLUGIN_NAMES.map((name) => (
            <li key={name} className="px-3.5 py-1.5 rounded-full border border-white/15 font-mono text-xs text-slate-200">
              {name}
            </li>
          ))}
        </ul>
      </div>
      <div className="relative flex flex-wrap gap-3 lg:justify-end">
        <Link
          href="/plugins"
          className="motion-btn motion-magnetic inline-flex items-center gap-3 min-h-[56px] px-7 rounded-full bg-white text-brand-ink hover:bg-amber-400 font-bold"
        >
          Browse plugins <span className="motion-arrow" aria-hidden="true">→</span>
        </Link>
        <PluginInquiryButton>Build or maintain mine</PluginInquiryButton>
      </div>
    </aside>
  );
}
