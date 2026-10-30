import React from 'react';
import { siNextdotjs, siPhp, siPostgresql, siTypescript, siWordpress } from 'simple-icons';
import { Sparkles } from 'lucide-react';
import type { StackDef } from '@/lib/stacks';

const ICONS = { nextjs: siNextdotjs, wordpress: siWordpress, typescript: siTypescript, postgresql: siPostgresql, php: siPhp };

/** Brand mark for a stack hub; drawn in currentColor so it fits light and dark surfaces. */
export function StackIcon({ icon, className = 'h-6 w-6' }: { icon: StackDef['icon']; className?: string }) {
  if (icon === 'ai') return <Sparkles className={className} aria-hidden="true" />;
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d={ICONS[icon].path} />
    </svg>
  );
}
