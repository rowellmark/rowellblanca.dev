import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CAREER, CAREER_NOW } from '@/lib/career';
import { HEADLINE_FIGURES } from '@/lib/impact';
import { stackForTech } from '@/lib/stacks';

/**
 * Career history as a vertical timeline: a rail that fills as you scroll, one stop per role
 * (oldest first) and a final "Today" stop linking to current product work.
 */
export function CareerTimeline() {
  return (
    <section aria-labelledby="career" className="px-4 sm:px-6 lg:px-10 py-24 lg:py-32 bg-brand-bg">
      <div className="mx-auto max-w-[1360px] grid gap-14 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-20">
        <div className="lg:sticky lg:top-32 self-start flex flex-col gap-5">
          <p className="m-0 font-mono text-[13px] tracking-[0.08em] uppercase text-brand-slate">Career timeline</p>
          <h2 id="career" className="m-0 font-extrabold tracking-[-0.05em] leading-[0.95] text-brand-navy text-[clamp(36px,4.4vw,64px)]">
            From PSD slices to production SaaS.
          </h2>
          <p className="m-0 text-[17px] leading-relaxed text-brand-slate max-w-[420px]">
            {HEADLINE_FIGURES[0].value} years across agencies, product companies and freelance clients, from hand-coded
            layouts to typed full-stack platforms.
          </p>
        </div>

        <ol className="motion-rail-track relative m-0 p-0 list-none flex flex-col gap-14 lg:gap-20">
          {/* Rail */}
          <span aria-hidden="true" className="absolute left-[11px] top-2 bottom-2 w-px bg-brand-border" />
          <span aria-hidden="true" className="motion-rail absolute left-[11px] top-2 bottom-2 w-px bg-amber-500" />

          {CAREER.map((role) => (
            <li key={`${role.company}-${role.start}`} className="relative pl-12 sm:pl-16">
              <span
                aria-hidden="true"
                className="motion-lit absolute left-0 top-1.5 grid place-items-center h-[23px] w-[23px] rounded-full bg-brand-bg border-2 border-amber-500"
              >
                <span className="h-2 w-2 rounded-full bg-amber-500" />
              </span>
              <div className="motion-reveal flex flex-col gap-5">
                <p className="m-0 font-mono text-sm text-amber-700 tracking-[0.04em]">
                  {role.start} — {role.end}
                </p>
                <div className="flex items-start justify-between gap-6">
                  <div className="flex flex-col gap-2 min-w-0">
                    <h3 className="m-0 text-[clamp(22px,2.2vw,30px)] font-extrabold tracking-[-0.03em] leading-tight text-brand-navy">
                      {role.title}
                    </h3>
                    <p className="m-0 text-brand-slate">
                      <a href={role.companyUrl} target="_blank" rel="noopener noreferrer" className="motion-underline font-semibold text-brand-navy">
                        {role.company}
                      </a>
                      <span aria-hidden="true"> · </span>
                      {role.location}
                    </p>
                  </div>
                  <span className="shrink-0 grid place-items-center h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-white border border-brand-border p-2.5">
                    <Image src={role.logo} alt={`${role.company} logo`} className="w-full h-auto object-contain" sizes="80px" />
                  </span>
                </div>
                <p className="m-0 text-[16px] leading-relaxed text-brand-slate max-w-[640px]">{role.description}</p>
                <ul className="m-0 p-0 list-none flex flex-wrap gap-2" aria-label="Stack">
                  {role.stacks.map((tech) => {
                    const hub = stackForTech(tech);
                    const chip = 'inline-block px-3 py-1.5 rounded-full border border-brand-border bg-white text-xs font-semibold text-brand-navy';
                    return (
                      <li key={tech}>
                        {hub ? (
                          <Link href={`/work/${hub.slug}`} className={`${chip} hover:border-amber-500 hover:text-amber-700 transition-colors`}>
                            {tech}
                          </Link>
                        ) : (
                          <span className={chip}>{tech}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </li>
          ))}

          <li className="relative pl-12 sm:pl-16">
            <span aria-hidden="true" className="motion-lit absolute left-0 top-1.5 h-[23px] w-[23px] rounded-full bg-amber-500 motion-pulse" />
            <div className="motion-reveal rounded-[28px] bg-brand-ink text-white p-7 sm:p-9 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <p className="m-0 font-mono text-sm text-amber-400 tracking-[0.04em]">Today</p>
                <h3 className="m-0 text-[clamp(22px,2.2vw,30px)] font-extrabold tracking-[-0.03em] leading-tight">Building products, not just sites.</h3>
              </div>
              <ul className="m-0 p-0 list-none grid gap-3 sm:grid-cols-3">
                {CAREER_NOW.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={'href' in item && item.href ? item.href : `/mywork/${item.permalink}`}
                      className="group h-full rounded-2xl border border-white/10 hover:border-amber-400/60 p-4 flex flex-col gap-1 transition-colors"
                    >
                      <span className="font-bold group-hover:text-amber-400 transition-colors">{item.label} →</span>
                      <span className="text-sm text-slate-400">{item.note}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/results" className="motion-underline self-start font-semibold text-amber-400">
                See the results →
              </Link>
            </div>
          </li>
        </ol>
      </div>
    </section>
  );
}
