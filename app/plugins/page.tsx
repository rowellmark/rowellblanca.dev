import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/ui/page-hero';
import { PluginCatalog } from '@/components/plugins/plugin-catalog';
import { PluginInquiryButton } from '@/components/plugins/plugin-inquiry-button';
import { getActiveProjects } from '@/lib/projects';
import { pluginsFromProjects } from '@/lib/plugins';
import { SITE_URL, pageMetadata } from '@/lib/seo';

// New plugin projects from the admin show up within the hour.
export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  path: '/plugins',
  title: 'WordPress Plugins by Rowell Mark Blanca',
  description:
    'WordPress plugins built and maintained by Rowell Mark Blanca: SEO, JSON-LD schema, an AI chatbot with RAG, a lead CRM and a secure login customizer.',
  keywords: ['WordPress plugin developer', 'custom WordPress plugins', 'AI WordPress plugin', 'WordPress SEO plugin', 'WordPress CRM plugin'],
});

const PRINCIPLES = [
  { title: 'Lean, modern PHP', body: 'Namespaced, PSR-4 autoloaded classes on WordPress hooks and the REST API, with no bundled page builders or heavy frameworks.' },
  { title: 'Every feature unlocked', body: 'No paywalls, licence gates or upsell banners inside the admin.' },
  { title: 'Modern admin screens', body: 'Settings and dashboards built as React interfaces where they help, in a shared BuildForUser admin shell.' },
  { title: 'AI with a human in the loop', body: 'AI features keep keys server-side, work with several providers, and leave the final send to a person.' },
];

export default async function PluginsPage() {
  const plugins = pluginsFromProjects(await getActiveProjects());
  const categories = new Set(plugins.map((p) => p.category)).size;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'WordPress plugins by Rowell Mark Blanca',
    url: `${SITE_URL}/plugins`,
    numberOfItems: plugins.length,
    itemListElement: plugins.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: p.name,
        description: p.tagline,
        applicationCategory: 'WordPress plugin',
        operatingSystem: 'WordPress',
        url: `${SITE_URL}${p.href}`,
        author: { '@type': 'Person', name: 'Rowell Mark Blanca', url: SITE_URL },
      },
    })),
  };

  return (
    <div className="bg-brand-bg min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        label="WordPress plugins"
        titleLines={['Plugins I', 'build & maintain.']}
        accentLine={1}
        lead="Hand-coded WordPress plugins for SEO, AI, lead management and security: fast, dependency-light, and with every feature unlocked."
      >
        <div className="flex flex-wrap items-center justify-between gap-6">
          <dl className="m-0 flex flex-wrap gap-x-10 gap-y-4">
            {[
              { label: 'Plugins', value: plugins.length },
              { label: 'Categories', value: categories },
            ].map((s) => (
              <div key={s.label} className="flex flex-col-reverse gap-1">
                <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-slate-400">{s.label}</dt>
                <dd className="m-0 text-3xl font-extrabold tracking-[-0.04em]">{s.value}</dd>
              </div>
            ))}
          </dl>
          <PluginInquiryButton>Need a custom plugin?</PluginInquiryButton>
        </div>
      </PageHero>

      <section aria-label="Plugin catalogue" className="px-4 sm:px-6 lg:px-10 pt-16 lg:pt-24">
        <div className="mx-auto max-w-[1360px]">
          <PluginCatalog plugins={plugins} />
        </div>
      </section>

      <section aria-labelledby="principles" className="px-4 sm:px-6 lg:px-10 py-24 lg:py-32">
        <div className="mx-auto max-w-[1360px] flex flex-col gap-10">
          <h2 id="principles" className="m-0 font-extrabold tracking-[-0.05em] leading-[0.95] text-brand-navy text-[clamp(32px,4vw,56px)]">
            How every plugin is built.
          </h2>
          <ul className="m-0 p-0 list-none grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PRINCIPLES.map((p, i) => (
              <li key={p.title} className="motion-reveal rounded-[28px] bg-white border border-brand-border p-7 flex flex-col gap-3">
                <span className="font-mono text-xs text-amber-700">0{i + 1}</span>
                <h3 className="m-0 text-xl font-extrabold tracking-[-0.02em] text-brand-navy">{p.title}</h3>
                <p className="m-0 text-[15px] leading-relaxed text-brand-slate">{p.body}</p>
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-[28px] bg-brand-ink text-white p-8 sm:p-12 flex flex-wrap items-center justify-between gap-8">
            <div className="flex flex-col gap-3 max-w-[640px]">
              <h2 className="m-0 font-extrabold tracking-[-0.04em] text-[clamp(26px,3vw,40px)] leading-tight">Have a plugin idea or a feature WordPress is missing?</h2>
              <p className="m-0 text-slate-300 leading-relaxed">
                Custom plugins, integrations with your CRM or APIs, and rescue work on existing plugins.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <PluginInquiryButton>Discuss a plugin</PluginInquiryButton>
              <Link href="/hire-uk-wordpress-developer" className="motion-btn inline-flex items-center min-h-[56px] px-7 rounded-full border border-white/25 hover:border-white/60 font-semibold">
                WordPress services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
