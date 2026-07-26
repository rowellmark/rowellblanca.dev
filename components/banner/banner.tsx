import React from "react";
import { RotatingText } from "@/components/ui/rotating-text";

interface BannerOption {
    title: string;
    subtitle?: string;
    rotatingTitles?: string[];
}

export default function Banner({ title, subtitle, rotatingTitles }: BannerOption) {
    return (
        <div className="relative pt-36 pb-20 bg-gradient-to-br from-slate-900 via-brand-navy to-slate-900 border-b border-slate-800 text-white overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />

            <div className="container mx-auto px-6 max-w-6xl text-center relative z-10 space-y-2">
                {subtitle && (
                    <span className="block text-brand-amber font-extrabold text-xs uppercase tracking-widest">
                        {subtitle}
                    </span>
                )}
                <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight flex items-center justify-center gap-3 flex-wrap">
                    <span>{title}</span>
                    {rotatingTitles && rotatingTitles.length > 0 && (
                        <RotatingText
                            texts={rotatingTitles}
                            badgeBg="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 px-3.5 py-0.5 rounded-xl text-3xl sm:text-5xl shadow-md border border-amber-300"
                        />
                    )}
                </h1>
            </div>
        </div>
    );
}