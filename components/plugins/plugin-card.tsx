import React from 'react';
import Link from 'next/link';
import type { PluginEntry } from '@/lib/plugins';
import { PluginPreviewFor } from '@/components/plugins/plugin-previews';

/** Dark plugin card in the homepage style: label, name, tagline, a UI preview, key features, link. */
export function PluginCard({ plugin, compact = false }: { plugin: PluginEntry; compact?: boolean }) {
  return (
    <article
      data-cursor="view"
      className="relative motion-reveal motion-card h-full rounded-[28px] bg-brand-ink text-white border border-white/[0.08] p-6 sm:p-9 flex flex-col gap-7"
    >
      {/* Whole-card click target, kept separate from the button */}
      <Link href={plugin.href} aria-hidden="true" tabIndex={-1} className="absolute inset-0 z-[1] rounded-[inherit]" />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="font-mono text-xs uppercase tracking-[0.08em] text-amber-400">{plugin.category}</span>
        {plugin.meta && <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-slate-400">{plugin.meta}</span>}
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="m-0 text-[clamp(26px,2.6vw,38px)] font-extrabold tracking-[-0.04em] leading-none">{plugin.name}</h3>
        <p className="m-0 text-slate-300 text-[16px] leading-relaxed">{plugin.tagline}</p>
      </div>
      {!compact && <PluginPreviewFor kind={plugin.preview} />}
      {plugin.features.length > 0 && (
        <ul className="m-0 p-0 list-none flex flex-col border-t border-white/10">
          {plugin.features.slice(0, compact ? 3 : 4).map((f) => (
            <li key={f} className="flex gap-3.5 py-3 border-b border-white/10 text-[15px] leading-snug text-slate-300">
              <span aria-hidden="true" className="text-amber-500">—</span>
              {f}
            </li>
          ))}
        </ul>
      )}
      <Link
        href={plugin.href}
        aria-label={`Know more about ${plugin.name}`}
        className="motion-btn motion-magnetic relative z-[2] mt-auto self-start inline-flex items-center gap-3 min-h-[52px] px-6 rounded-full border border-white/25 hover:border-amber-400 hover:text-amber-400 font-semibold"
      >
        Know more <span className="motion-arrow" aria-hidden="true">→</span>
      </Link>
    </article>
  );
}
