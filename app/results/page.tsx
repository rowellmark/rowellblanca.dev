import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/ui/page-hero';
import { TestimonialsSection } from '@/components/homepage/testimonials';
import { getActiveProjects, hasWriteUp, isPluginProject } from '@/lib/projects';
import { HEADLINE_FIGURES, PROJECT_METRICS } from '@/lib/impact';
import { STACKS, projectsForStack } from '@/lib/stacks';
import { pageMetadata } from '@/lib/seo';

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  path: '/results',
  title: 'Results & Client Outcomes',
  description:
    'What Rowell Mark Blanca’s work delivers: 12+ years, 50+ production builds, 100% Upwork job success, plus project outcomes and client feedback.',
  keywords: ['web developer results', 'Next.js developer reviews', 'WordPress developer case studies', 'freelance developer track record'],
});

function firstParagraph(text?: string) {
  return (text || '').split(/\n\s*\n/)[0]?.trim() || '';
}

export default async function ResultsPage() {
  const projects = await getActiveProjects();

  const plugins = projects.filter(isPluginProject).length;
  const writeUps = projects.filter(hasWriteUp);
  const technologies = new Set(projects.flatMap((p) => p.technologies || []).map((t) => t.toLowerCase())).size;
  const stacks = STACKS.filter((s) => projectsForStack(s, projects).length > 0).length;

  const live = [
    { value: projects.length, label: 'Projects in this portfolio' },
    { value: plugins, label: 'WordPress plugins built' },
    { value: writeUps.length, label: 'Written case studies' },
    { value: technologies, label: 'Technologies in use' },
  ].filter((f) => f.value > 0);

  const measured = Object.entries(PROJECT_METRICS)
    .map(([permalink, metrics]) => ({ project: projects.find((p) => p.permalink === permalink), metrics }))
    .filter((m) => m.project && m.metrics.length > 0);

  // Projects with a written outcome first, then featured builds (described by what shipped).
  const outcomes = [
    ...writeUps.filter((p) => p.results?.trim()).map((p) => ({ project: p, kind: 'Outcome', text: firstParagraph(p.results) })),
    ...projects
      .filter((p) => !p.results?.trim() && p.featured)
      .map((p) => ({ project: p, kind: 'Delivered', text: firstParagraph(p.description) })),
  ].slice(0, 6);

  return (
    <div className="bg-brand-bg min-h-screen">
      <PageHero
        label="Track record"
        titleLines={['Results, not just', 'screenshots.']}
        accentLine={1}
        lead="The numbers behind the work, the outcomes of individual projects, and what clients say about working together."
      >
        <dl className="m-0 grid grid-cols-2 lg:grid-cols-4 gap-y-8">
          {HEADLINE_FIGURES.map((f, i) => (
            <div key={f.label} className={`flex flex-col-reverse gap-2 pr-4 ${i % 2 === 1 ? 'pl-6 border-l border-white/10' : ''} ${i === 2 ? 'lg:pl-6 lg:border-l lg:border-white/10' : ''}`}>
              <dt className="flex flex-col gap-1">
                <span className="font-semibold text-white">{f.label}</span>
                <span className="text-sm text-slate-400">{f.note}</span>
              </dt>
              <dd className="m-0 font-extrabold tracking-[-0.05em] leading-none text-amber-400 text-[clamp(32px,4.2vw,64px)]">{f.value}</dd>
            </div>
          ))}
        </dl>
      </PageHero>

      {/* Portfolio in numbers, counted live from the project database */}
      {live.length > 0 && (
        <section aria-labelledby="numbers" className="px-4 sm:px-6 lg:px-10 pt-20 lg:pt-28">
          <div className="mx-auto max-w-[1360px] flex flex-col gap-10">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <h2 id="numbers" className="m-0 font-extrabold tracking-[-0.05em] leading-[0.95] text-brand-navy text-[clamp(32px,4vw,56px)]">
                The portfolio in numbers.
              </h2>
              <Link href="/work" className="motion-underline font-semibold text-brand-navy inline-flex items-center min-h-[44px]">
                Browse {stacks} tech stacks →
              </Link>
            </div>
            <dl className={`m-0 grid gap-5 grid-cols-2 ${live.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
              {live.map((f) => (
                <div key={f.label} className="motion-reveal rounded-[28px] bg-white border border-brand-border p-6 sm:p-8 flex flex-col-reverse gap-3">
                  <dt className="text-brand-slate">{f.label}</dt>
                  <dd className="m-0 font-extrabold tracking-[-0.05em] leading-none text-brand-navy text-[clamp(40px,5vw,72px)]">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {/* Before / after, only for figures that have been measured */}
      {measured.length > 0 && (
        <section aria-labelledby="measured" className="px-4 sm:px-6 lg:px-10 pt-24 lg:pt-32">
          <div className="mx-auto max-w-[1360px] flex flex-col gap-10">
            <h2 id="measured" className="m-0 font-extrabold tracking-[-0.05em] leading-[0.95] text-brand-navy text-[clamp(32px,4vw,56px)]">
              Measured improvements.
            </h2>
            <ul className="m-0 p-0 list-none grid gap-5 md:grid-cols-2">
              {measured.map(({ project, metrics }) => (
                <li key={project!.permalink} className="motion-reveal rounded-[28px] bg-brand-ink text-white p-7 sm:p-9 flex flex-col gap-6">
                  <Link href={`/mywork/${project!.permalink}`} className="motion-underline self-start text-xl font-extrabold tracking-[-0.02em]">
                    {project!.sitename}
                  </Link>
                  <dl className="m-0 flex flex-col divide-y divide-white/10">
                    {metrics.map((m) => (
                      <div key={m.label} className="flex flex-wrap items-baseline justify-between gap-3 py-3">
                        <dt className="text-slate-300">
                          {m.label}
                          {m.source && <span className="block font-mono text-[11px] text-slate-500">{m.source}</span>}
                        </dt>
                        <dd className="m-0 font-mono text-lg">
                          {m.before && <span className="text-slate-500 line-through decoration-rose-400/70 mr-2">{m.before}</span>}
                          <span className="font-bold text-emerald-400">{m.after}</span>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Project outcomes */}
      {outcomes.length > 0 && (
        <section aria-labelledby="outcomes" className="px-4 sm:px-6 lg:px-10 pt-24 lg:pt-32">
          <div className="mx-auto max-w-[1360px] flex flex-col gap-10">
            <h2 id="outcomes" className="m-0 font-extrabold tracking-[-0.05em] leading-[0.95] text-brand-navy text-[clamp(32px,4vw,56px)]">
              What the projects delivered.
            </h2>
            <ul className="m-0 p-0 list-none grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {outcomes.map(({ project, kind, text }) => (
                <li key={project.permalink} className="motion-reveal">
                  <Link
                    href={`/mywork/${project.permalink}`}
                    className="motion-lift group h-full rounded-[28px] bg-white border border-brand-border p-7 flex flex-col gap-4"
                  >
                    <span className="font-mono text-xs uppercase tracking-[0.08em] text-amber-700">
                      {kind} · {project.category || project.technologies?.[0] || 'Web platform'}
                    </span>
                    <span className="text-xl font-extrabold tracking-[-0.02em] leading-snug text-brand-navy group-hover:text-amber-700 transition-colors">
                      {project.sitename}
                    </span>
                    <span className="text-[15px] leading-relaxed text-brand-slate line-clamp-5">{text}</span>
                    <span className="mt-auto pt-2 font-semibold text-brand-navy">Read the case study →</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <div className="pt-24 lg:pt-32">
        <TestimonialsSection dark badge="Client feedback" title="What clients say" subtitle="In their own words, from founders, agency partners and in-house teams." />
      </div>

      <section className="px-4 sm:px-6 lg:px-10 py-24 lg:py-32">
        <div className="mx-auto max-w-[1360px] flex flex-wrap items-center justify-between gap-8">
          <h2 className="m-0 font-extrabold tracking-[-0.05em] leading-[0.95] text-brand-navy text-[clamp(32px,4vw,56px)]">
            Want results like these?
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className="motion-btn motion-magnetic inline-flex items-center min-h-[56px] px-7 rounded-full bg-amber-500 hover:bg-amber-400 text-brand-ink font-bold">
              Start a project
            </Link>
            <Link href="/mywork" className="motion-btn inline-flex items-center min-h-[56px] px-7 rounded-full border border-brand-border bg-white text-brand-navy font-semibold hover:border-brand-navy">
              See all work
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
