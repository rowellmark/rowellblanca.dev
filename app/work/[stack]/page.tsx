import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { PageHero } from '@/components/ui/page-hero';
import { PortfolioCard } from '@/components/ui/portfolio-card';
import { ServiceLinks } from '@/components/article/service-links';
import { StackIcon } from '@/components/work/stack-icon';
import { getActiveProjects, hasWriteUp } from '@/lib/projects';
import { getPublishedPosts } from '@/lib/blog';
import { readingTime } from '@/lib/markdown';
import { STACKS, getStack, projectsForStack, stackHref } from '@/lib/stacks';
import { SITE_URL, pageMetadata } from '@/lib/seo';

// Project lists come from the admin; refresh hourly without a redeploy.
export const revalidate = 3600;

export function generateStaticParams() {
  return STACKS.filter((s) => !s.href).map((s) => ({ stack: s.slug }));
}

export async function generateMetadata(props: { params: Promise<{ stack: string }> }): Promise<Metadata> {
  const { stack: slug } = await props.params;
  const stack = getStack(slug);
  if (!stack) return {};
  return pageMetadata({
    path: `/work/${stack.slug}`,
    title: stack.seoTitle,
    description: stack.seoDescription,
    keywords: stack.keywords,
  });
}

export default async function StackPage(props: { params: Promise<{ stack: string }> }) {
  const { stack: slug } = await props.params;
  const stack = getStack(slug);
  if (!stack) notFound();
  if (stack.href) permanentRedirect(stack.href);

  const [projects, posts] = await Promise.all([getActiveProjects(), getPublishedPosts()]);
  const matches = projectsForStack(stack, projects);
  if (matches.length === 0) notFound();

  const articles = posts
    .filter((p) => stack.articles.test(`${p.title} ${p.category || ''} ${(p.tags || []).join(' ')}`))
    .slice(0, 3);
  const writeUps = matches.filter(hasWriteUp).length;
  const otherStacks = STACKS.filter((s) => s.slug !== stack.slug && projectsForStack(s, projects).length > 0);
  const url = `${SITE_URL}/work/${stack.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${url}/#page`,
        url,
        name: stack.seoTitle,
        description: stack.seoDescription,
        about: stack.name,
        author: { '@type': 'Person', name: 'Rowell Mark Blanca', url: SITE_URL },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: matches.length,
          itemListElement: matches.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: p.sitename,
            url: `${SITE_URL}/mywork/${p.permalink}`,
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Work by stack', item: `${SITE_URL}/work` },
          { '@type': 'ListItem', position: 3, name: stack.name, item: url },
        ],
      },
    ],
  };

  return (
    <div className="bg-brand-bg min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero label={`Tech stack · ${stack.name}`} titleLines={[stack.name, 'in production.']} accentLine={1} lead={stack.intro}>
        <div className="flex flex-wrap items-center justify-between gap-6">
          <dl className="m-0 flex flex-wrap gap-x-10 gap-y-4">
            <div className="flex flex-col-reverse gap-1">
              <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-slate-400">Projects</dt>
              <dd className="m-0 text-3xl font-extrabold tracking-[-0.04em]">{matches.length}</dd>
            </div>
            {writeUps > 0 && (
              <div className="flex flex-col-reverse gap-1">
                <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-slate-400">Case studies</dt>
                <dd className="m-0 text-3xl font-extrabold tracking-[-0.04em]">{writeUps}</dd>
              </div>
            )}
            {articles.length > 0 && (
              <div className="flex flex-col-reverse gap-1">
                <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-slate-400">Articles</dt>
                <dd className="m-0 text-3xl font-extrabold tracking-[-0.04em]">{articles.length}</dd>
              </div>
            )}
          </dl>
          <span className="grid place-items-center h-16 w-16 rounded-2xl border border-white/15 bg-white/[0.04] text-amber-400">
            <StackIcon icon={stack.icon} className="h-8 w-8" />
          </span>
        </div>
      </PageHero>

      {/* What I build with it */}
      <section aria-labelledby="capabilities" className="px-4 sm:px-6 lg:px-10 pt-20 lg:pt-28">
        <div className="mx-auto max-w-[1360px] flex flex-col gap-10">
          <h2 id="capabilities" className="m-0 font-extrabold tracking-[-0.05em] leading-[0.95] text-brand-navy text-[clamp(32px,4vw,56px)]">
            What I build with {stack.name}.
          </h2>
          <ul className="m-0 p-0 list-none grid gap-5 md:grid-cols-3">
            {stack.capabilities.map((c, i) => (
              <li key={c.title} className="motion-reveal rounded-[28px] bg-white border border-brand-border p-7 flex flex-col gap-3">
                <span className="font-mono text-xs text-amber-700">0{i + 1}</span>
                <h3 className="m-0 text-xl font-extrabold tracking-[-0.02em] text-brand-navy">{c.title}</h3>
                <p className="m-0 text-[15px] leading-relaxed text-brand-slate">{c.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Projects */}
      <section aria-labelledby="projects" className="px-4 sm:px-6 lg:px-10 pt-24 lg:pt-32">
        <div className="mx-auto max-w-[1360px] flex flex-col gap-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 id="projects" className="m-0 font-extrabold tracking-[-0.05em] leading-[0.95] text-brand-navy text-[clamp(32px,4vw,56px)]">
              {stack.name} projects.
            </h2>
            <Link href="/mywork" className="motion-underline font-semibold text-brand-navy inline-flex items-center min-h-[44px]">
              All projects →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((project, i) => (
              <PortfolioCard key={project.permalink} project={project} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Articles */}
      {articles.length > 0 && (
        <section aria-labelledby="articles" className="px-4 sm:px-6 lg:px-10 pt-24 lg:pt-32">
          <div className="mx-auto max-w-[1360px] flex flex-col gap-10">
            <h2 id="articles" className="m-0 font-extrabold tracking-[-0.05em] leading-[0.95] text-brand-navy text-[clamp(32px,4vw,56px)]">
              Notes on {stack.name}.
            </h2>
            <ul className="m-0 p-0 list-none grid gap-5 md:grid-cols-3">
              {articles.map((a) => (
                <li key={a.slug} className="motion-reveal">
                  <Link
                    href={`/blog/${a.slug}`}
                    className="motion-lift group h-full rounded-[28px] bg-white border border-brand-border p-7 flex flex-col gap-4"
                  >
                    <span className="font-mono text-xs uppercase tracking-[0.08em] text-amber-700">{a.category || 'Engineering'}</span>
                    <span className="text-xl font-extrabold tracking-[-0.02em] leading-snug text-brand-navy group-hover:text-amber-700 transition-colors">
                      {a.title}
                    </span>
                    {a.excerpt && <span className="text-[15px] leading-relaxed text-brand-slate line-clamp-3">{a.excerpt}</span>}
                    <span className="mt-auto pt-2 font-mono text-xs text-brand-slate">{a.readingTime || readingTime(a.content || '')}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Other stacks + hire */}
      <section aria-labelledby="more" className="px-4 sm:px-6 lg:px-10 py-24 lg:py-32">
        <div className="mx-auto max-w-[1360px] grid gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <h2 id="more" className="m-0 font-extrabold tracking-[-0.04em] text-brand-navy text-[clamp(26px,2.6vw,36px)]">
              Explore other stacks
            </h2>
            <ul className="m-0 p-0 list-none flex flex-wrap gap-3">
              {otherStacks.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={stackHref(s)}
                    className="motion-btn inline-flex items-center gap-2.5 min-h-[48px] px-5 rounded-full border border-brand-border bg-white text-brand-navy font-semibold hover:border-brand-navy"
                  >
                    <StackIcon icon={s.icon} className="h-4 w-4" />
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-6">
            <h2 className="m-0 font-extrabold tracking-[-0.04em] text-brand-navy text-[clamp(26px,2.6vw,36px)]">Need this for your project?</h2>
            <ServiceLinks services={[stack.service]} />
          </div>
        </div>
      </section>
    </div>
  );
}
