import React from "react";

/** Mini SERP preview echoing the plugin's live snippet editor and pixel meter. */
export function SerpPreview() {
    return (
        <div aria-hidden="true" className="rounded-2xl bg-white text-[#202124] p-5 flex flex-col gap-4 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]">
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-slate-500">
                <span className="px-2 py-0.5 rounded-full bg-slate-900 text-white">Google</span>
                <span>Desktop preview</span>
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-xs text-[#4d5156]">yourdomain.com › services › web-development</span>
                <span className="text-lg leading-snug text-[#1a0dab]">Custom Web Development for UK Businesses | Your Brand</span>
                <span className="text-sm leading-snug text-[#4d5156]">
                    Fast, accessible websites engineered for Core Web Vitals. Book a free discovery call and get a
                    transparent quote in 24 hours.
                </span>
            </div>
            <div className="flex flex-col gap-1.5">
                <div className="flex justify-between font-mono text-[11px] text-slate-500">
                    <span>Title width</span>
                    <span>512 / 600px</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                    <div className="motion-meter h-full rounded-full bg-emerald-500" />
                </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
                {["Title", "Slug", "Meta", "Intro", "H2"].map((pill) => (
                    <span key={pill} className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        ✓ {pill}
                    </span>
                ))}
            </div>
        </div>
    );
}

/** Mini split-panel login screen echoing the Login Customizer UI. */
export function LoginPreview() {
    return (
        <div aria-hidden="true" className="rounded-2xl overflow-hidden grid grid-cols-5 min-h-[248px] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]">
            <div className="col-span-2 bg-amber-500 text-brand-ink p-5 flex flex-col justify-between">
                <span className="h-8 w-8 rounded-lg bg-brand-ink text-amber-500 grid place-items-center font-extrabold">B</span>
                <span className="font-extrabold leading-tight text-lg">Welcome back to your studio.</span>
            </div>
            <div className="col-span-3 bg-white p-5 flex flex-col justify-center gap-3">
                <span className="font-mono text-[11px] text-slate-500">yourdomain.com/admin-access</span>
                <span className="h-9 rounded-lg border border-slate-200 bg-slate-50" />
                <span className="h-9 rounded-lg border border-slate-200 bg-slate-50" />
                <span className="h-9 rounded-lg bg-brand-ink" />
                <span className="font-mono text-[11px] text-rose-600">/wp-login.php → 404</span>
            </div>
        </div>
    );
}

/** Mini chat widget echoing BuildForUser Chatbot answering from the site's own content. */
export function ChatPreview() {
    return (
        <div aria-hidden="true" className="rounded-2xl bg-white text-slate-800 p-5 flex flex-col gap-3 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.08em] text-slate-500">
                <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Site assistant</span>
                <span>RAG · 128 sources</span>
            </div>
            <span className="self-end max-w-[80%] rounded-2xl rounded-br-md bg-brand-ink text-white px-4 py-2.5 text-sm">Do you ship to Ireland?</span>
            <span className="self-start max-w-[85%] rounded-2xl rounded-bl-md bg-slate-100 px-4 py-2.5 text-sm leading-snug">
                Yes, 2–4 working days. Orders over £50 ship free.
                <span className="block mt-1.5 font-mono text-[10px] text-slate-500">Source: /delivery-information</span>
            </span>
            <span className="h-9 rounded-full border border-slate-200 bg-slate-50" />
        </div>
    );
}

/** Mini Kanban board echoing BuildForUser Leads' pipeline with an AI score. */
export function KanbanPreview() {
    const cols = [
        { name: 'New', cards: [['Acme Ltd', 82], ['J. Patel', 64]] },
        { name: 'Qualified', cards: [['Northwind', 91]] },
        { name: 'Proposal', cards: [['Globex', 77]] },
    ] as const;
    return (
        <div aria-hidden="true" className="rounded-2xl bg-white p-4 grid grid-cols-3 gap-3 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]">
            {cols.map((col) => (
                <div key={col.name} className="rounded-xl bg-slate-100 p-2.5 flex flex-col gap-2 min-h-[176px]">
                    <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-slate-500">{col.name}</span>
                    {col.cards.map(([name, score]) => (
                        <span key={name} className="rounded-lg bg-white border border-slate-200 p-2 flex flex-col gap-1.5">
                            <span className="text-xs font-semibold text-slate-800 truncate">{name}</span>
                            <span className="flex items-center justify-between font-mono text-[10px] text-slate-500">
                                AI score
                                <span className={`px-1.5 rounded ${score >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{score}</span>
                            </span>
                        </span>
                    ))}
                </div>
            ))}
        </div>
    );
}

/** Mini JSON-LD output echoing BuildForUser Schema LD's assembled @graph. */
export function SchemaPreview() {
    return (
        <pre aria-hidden="true" className="m-0 rounded-2xl bg-[#0d1117] border border-white/10 p-5 font-mono text-[12px] leading-relaxed text-slate-300 overflow-hidden shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]">
{`{
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "`}<span className="text-amber-400">Organization</span>{`", "@id": "#org" },
    { "@type": "`}<span className="text-amber-400">WebPage</span>{`", "publisher": { "@id": "#org" } },
    { "@type": "`}<span className="text-amber-400">FAQPage</span>{`", "mainEntity": [ … ] }
  ]
}`}
            <span className="mt-3 block text-emerald-400">✓ 3 nodes · 0 duplicate @id</span>
        </pre>
    );
}

export function PluginPreviewFor({ kind }: { kind: 'serp' | 'login' | 'chat' | 'kanban' | 'schema' }) {
    if (kind === 'serp') return <SerpPreview />;
    if (kind === 'login') return <LoginPreview />;
    if (kind === 'chat') return <ChatPreview />;
    if (kind === 'kanban') return <KanbanPreview />;
    return <SchemaPreview />;
}
