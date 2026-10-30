'use client';

import React, { useState } from 'react';
import type { PluginCategory, PluginEntry } from '@/lib/plugins';
import { PluginCard } from '@/components/plugins/plugin-card';

/** Plugin grid with category filter chips (only categories that have plugins are shown). */
export function PluginCatalog({ plugins }: { plugins: PluginEntry[] }) {
  const categories = Array.from(new Set(plugins.map((p) => p.category))) as PluginCategory[];
  const [active, setActive] = useState<PluginCategory | 'All'>('All');
  const shown = active === 'All' ? plugins : plugins.filter((p) => p.category === active);

  return (
    <div className="flex flex-col gap-10">
      {categories.length > 1 && (
        <div role="group" aria-label="Filter plugins by category" className="flex flex-wrap gap-2.5">
          {(['All', ...categories] as const).map((c) => {
            const count = c === 'All' ? plugins.length : plugins.filter((p) => p.category === c).length;
            const on = active === c;
            return (
              <button
                key={c}
                type="button"
                aria-pressed={on}
                onClick={() => setActive(c)}
                className={`motion-btn min-h-[44px] px-5 rounded-full text-sm font-semibold border transition-colors ${
                  on ? 'bg-brand-ink text-white border-brand-ink' : 'bg-white text-brand-navy border-brand-border hover:border-brand-navy'
                }`}
              >
                {c} <span className={on ? 'text-amber-400' : 'text-brand-slate'}>{count}</span>
              </button>
            );
          })}
        </div>
      )}
      <ul className="m-0 p-0 list-none grid grid-cols-1 lg:grid-cols-2 gap-5">
        {shown.map((plugin) => (
          <li key={plugin.key}>
            <PluginCard plugin={plugin} />
          </li>
        ))}
      </ul>
    </div>
  );
}
