'use client';

import { IconDownload } from "@tabler/icons-react";
import { trackDownloadCV } from "@/lib/analytics";

export function CVDownloadButton({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <a
      href="/rowell-resume.pdf"
      download
      onClick={() => trackDownloadCV()}
      className={`motion-btn motion-magnetic inline-flex items-center justify-center gap-2.5 min-h-[52px] px-6 rounded-full font-semibold ${
        tone === "dark"
          ? "border border-white/25 hover:border-white/60 text-white"
          : "bg-brand-navy hover:bg-brand-ink text-white"
      }`}
    >
      <IconDownload size="18" className="text-amber-500" aria-hidden="true" />
      Download CV
    </a>
  );
}
