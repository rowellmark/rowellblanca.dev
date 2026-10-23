'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const CommandPalette = dynamic(() => import('./command-palette').then((m) => m.CommandPalette), { ssr: false });

// Listens for ⌘K / Ctrl+K and the header's `open-command-palette` event, and only
// downloads the palette (and framer-motion) the first time someone asks for it.
// Once mounted, the palette registers its own listeners and this one steps aside.
export function CommandPaletteLoader() {
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    if (requested) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setRequested(true);
      }
    };
    const onOpen = () => setRequested(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener('open-command-palette', onOpen);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('open-command-palette', onOpen);
    };
  }, [requested]);

  return requested ? <CommandPalette defaultOpen /> : null;
}
