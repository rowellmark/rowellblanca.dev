'use client';

import React, { useState } from 'react';
import { ContactModal } from '@/components/ui/contact-modal';

/** Amber pill that opens the contact popup pre-set to custom plugin work. */
export function PluginInquiryButton({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="motion-btn motion-magnetic inline-flex items-center gap-3 min-h-[56px] px-7 rounded-full bg-amber-500 hover:bg-amber-400 text-brand-ink font-bold cursor-pointer"
            >
                {children} <span className="motion-arrow" aria-hidden="true">→</span>
            </button>
            <ContactModal isOpen={open} onClose={() => setOpen(false)} defaultService="Custom WordPress Engine / Plugin" />
        </>
    );
}
