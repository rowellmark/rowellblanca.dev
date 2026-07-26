'use client';

import { IconDownload } from "@tabler/icons-react";
import { trackDownloadCV } from "@/lib/analytics";

export function CVDownloadButton() {
  return (
    <a
      href="/resume.pdf"
      download
      onClick={() => trackDownloadCV()}
      className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-brand-navy hover:bg-slate-800 text-white font-extrabold text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
    >
      <IconDownload size="18" className="text-brand-amber" />
      Download Curriculum Vitae (CV)
    </a>
  );
}
