import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/ui/page-hero';
import { StackIcon } from '@/components/work/stack-icon';
import { getActiveProjects } from '@/lib/projects';
import { STACKS, projectsForStack, stackHref } from '@/lib/stacks';
import { pageMetadata } from '@/lib/seo';

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  path: '/work',
  title: 'Work by Tech Stack: Next.js, WordPress & AI',
  description:
    'Browse Rowell Mark Blanca’s projects by technology: Next.js and React, WordPress and plugins, TypeScript, PostgreSQL with Prisma, PHP and AI integrations.',
  keywords: ['web developer portfolio by technology', 'Next.js projects', 'WordPress projects', 'AI integration projects'],
});

export default async function WorkByStackPage() {
  const projects = await getActiveProjects();
  const hubs = STACKS.map((stack) => ({ stack, matches: projectsForStack(stack, projects) })).filter((h) => h.matches.length > 0);

  return (
    <div className="bg-brand-bg min-h-screen">
      <PageHero
        label="Portfolio by technology"
        titleLines={['Work by', 'tech stack.']}
        accentLine={1}
        lead="Pick a technology to see the projects, case studies and articles behind it."
      />

      <section className="px-4 sm:px-6 lg:px-10 py-20 lg:py-28">
        <ul className="mx-auto max-w-[1360px] m-0 p-0 list-none grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {hubs.map(({ stack, matches }) => (
            <li key={stack.slug} className="motion-reveal">
              <Link
                href={stackHref(stack)}
                className="motion-lift group h-full rounded-[28px] bg-white border border-brand-border p-7 flex flex-col gap-5"
              >
                <span className="flex items-center justify-between gap-4">
                  <span className="grid place-items-center h-12 w-12 rounded-2xl bg-brand-ink text-amber-400">
                    <StackIcon icon={stack.icon} className="h-6 w-6" />
                  </span>
                  <span className="font-mono text-xs uppercase tracking-[0.08em] text-brand-slate">
                    {matches.length} {matches.length === 1 ? 'project' : 'projects'}
                  </span>
                </span>
                <span className="text-2xl font-extrabold tracking-[-0.03em] text-brand-navy group-hover:text-amber-700 transition-colors">
                  {stack.name}
                </span>
                <span className="text-[15px] leading-relaxed text-brand-slate">{stack.intro}</span>
                <span className="mt-auto pt-4 border-t border-brand-border text-sm text-brand-slate line-clamp-2">
                  {matches
                    .slice(0, 3)
                    .map((p) => p.sitename.split(' — ')[0])
                    .join(' · ')}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
