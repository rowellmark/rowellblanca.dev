import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getBlogPost } from '@/lib/blog';
import { INITIAL_BLOG_POSTS } from '@/lib/initial-blog-data';
import { renderMarkdown, readingTime } from '@/lib/markdown';
import { canOptimizeImage, resolveValidImageSrc } from '@/lib/image-utils';
import { ArticleToc } from '@/components/article/article-toc';
import { AuthorCard, ShareButtons } from '@/components/article/article-extras';

const BASE_URL = 'https://www.rowellblanca.dev';

// Rendered on the server so the article is in the HTML (SEO, first paint); refreshed every minute.
export const revalidate = 60;

// Pre-build the bundled posts; any other slug (new admin posts) renders on first visit, then caches.
export function generateStaticParams() {
  return INITIAL_BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

function formatDate(value?: string | Date | null) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const { post } = await getBlogPost(slug);

  if (!post) {
    return {
      title: 'Technical Article | Rowell Mark Blanca',
      description: 'Read technical insights and case studies by Senior Software Engineer Rowell Mark Blanca.',
    };
  }

  const published = formatDate(post.publishedAt);
  return {
    metadataBase: new URL(BASE_URL),
    title: `${post.title} | Rowell Mark Blanca`,
    description: post.excerpt || `${post.title} - Software Engineering article by Rowell Mark Blanca.`,
    keywords: post.tags?.length ? post.tags : ['Rowell Mark Blanca', 'Software Engineering', 'React', 'WordPress'],
    authors: [{ name: post.author || 'Rowell Mark Blanca', url: BASE_URL }],
    creator: 'Rowell Mark Blanca',
    openGraph: {
      type: 'article',
      url: `${BASE_URL}/blog/${post.slug}`,
      title: post.title,
      description: post.excerpt || undefined,
      siteName: 'Rowell Mark Blanca Portfolio',
      publishedTime: published?.toISOString(),
      authors: [post.author || 'Rowell Mark Blanca'],
      tags: post.tags || [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || undefined,
      creator: '@itsmrrowrow',
    },
    alternates: { canonical: `${BASE_URL}/blog/${post.slug}` },
  };
}

export default async function ArticlePage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const { post, related } = await getBlogPost(slug);
  if (!post) notFound();

  const url = `${BASE_URL}/blog/${post.slug}`;
  const { nodes, headings } = renderMarkdown(post.content || '');
  const minutes = post.readingTime || readingTime(post.content || '');
  const published = formatDate(post.publishedAt);
  const updated = formatDate(post.updatedAt) || published;
  const category = post.category || 'Engineering';
  const cover = resolveValidImageSrc(post.coverImage);
  const hasCover = cover !== '/no-image-placeholder.svg';
  const dateLabel = published?.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${url}/#article`,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        headline: post.title,
        description: post.excerpt || post.title,
        articleBody: post.content,
        image: hasCover ? (cover.startsWith('http') ? cover : `${BASE_URL}${cover}`) : `${BASE_URL}/opengraph-image1.jpg`,
        datePublished: published?.toISOString(),
        dateModified: updated?.toISOString(),
        author: { '@type': 'Person', name: post.author || 'Rowell Mark Blanca', url: BASE_URL },
        publisher: { '@type': 'Person', name: 'Rowell Mark Blanca', url: BASE_URL },
        articleSection: category,
        keywords: Array.isArray(post.tags) ? post.tags.join(', ') : 'Software Engineering',
        inLanguage: 'en-GB',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE_URL}/blog` },
          { '@type': 'ListItem', position: 3, name: post.title, item: url },
        ],
      },
    ],
  };

  return (
    <div className="bg-brand-bg min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header */}
      <header className="bg-brand-ink text-white px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1360px] pt-32 lg:pt-40 pb-14 lg:pb-20 flex flex-col gap-8">
          <nav aria-label="Breadcrumb" className="motion-fade motion-d1 flex flex-wrap items-center gap-2 font-mono text-xs text-slate-400">
            <Link href="/" className="motion-underline hover:text-white">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/blog" className="motion-underline hover:text-white">Blog</Link>
            <span aria-hidden="true">/</span>
            <span className="text-slate-200">{category}</span>
          </nav>

          <div className="flex flex-col gap-6 max-w-[1040px]">
            <p className="motion-fade motion-d1 m-0 inline-flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs sm:text-[13px] uppercase tracking-[0.08em] text-slate-400">
              <span className="inline-flex items-center gap-2.5 text-amber-400">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" aria-hidden="true" />
                {category}
              </span>
              <span aria-hidden="true">·</span>
              <span>{minutes}</span>
              {dateLabel && (
                <>
                  <span aria-hidden="true">·</span>
                  <time dateTime={published?.toISOString()}>{dateLabel}</time>
                </>
              )}
            </p>
            <h1 className="m-0 font-extrabold tracking-[-0.045em] leading-[1.02] text-[clamp(34px,5vw,76px)] text-balance">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="motion-fade motion-d3 m-0 max-w-[760px] text-[clamp(17px,1.4vw,21px)] leading-relaxed text-slate-300">{post.excerpt}</p>
            )}
          </div>

          <div className="motion-fade motion-d4 flex flex-wrap items-center gap-4 border-t border-white/10 pt-8">
            <span className="relative h-12 w-12 rounded-full overflow-hidden ring-2 ring-amber-500 shrink-0">
              <Image src="/images/hero/rowell-avatar.webp" alt="" fill sizes="48px" className="object-cover" />
            </span>
            <span className="flex flex-col leading-tight gap-1">
              <span className="font-bold">{post.author || 'Rowell Mark Blanca'}</span>
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-slate-400">Senior Full-Stack Engineer</span>
            </span>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="px-4 sm:px-6 lg:px-10 pt-12 lg:pt-20 pb-24 lg:pb-32">
        <div className="mx-auto max-w-[1360px] grid gap-10 lg:grid-cols-[240px_minmax(0,720px)] lg:justify-center lg:gap-20">
          <aside className="hidden lg:block">
            <div className="sticky top-28 flex flex-col gap-10">
              <ArticleToc items={headings} />
              <div className="flex flex-col gap-3">
                <p className="m-0 font-mono text-xs uppercase tracking-[0.08em] text-brand-slate">Share</p>
                <ShareButtons title={post.title} url={url} />
              </div>
            </div>
          </aside>

          <article className="min-w-0 flex flex-col gap-10">
            <div className="lg:hidden">
              <ArticleToc items={headings} variant="inline" />
            </div>

            {hasCover && (
              <figure className="m-0 relative aspect-[16/9] rounded-[24px] overflow-hidden border border-brand-border bg-brand-ink">
                <Image
                  src={cover}
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 1024px) 720px, 100vw"
                  unoptimized={!canOptimizeImage(cover)}
                  className="object-cover object-top"
                />
              </figure>
            )}

            <div className="case-study-content article-prose has-lede">{nodes}</div>

            {post.tags?.length > 0 && (
              <ul className="m-0 p-0 list-none flex flex-wrap gap-2 pt-2" aria-label="Tags">
                {post.tags.map((t) => (
                  <li key={t} className="px-3.5 py-2 rounded-full border border-brand-border bg-white text-sm font-medium text-brand-navy">
                    {t}
                  </li>
                ))}
              </ul>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 border-y border-brand-border py-6">
              <p className="m-0 font-semibold text-brand-navy">Found this useful? Share it.</p>
              <ShareButtons title={post.title} url={url} />
            </div>

            <AuthorCard service={`Inquiry regarding ${post.title}`} />
          </article>
        </div>
      </div>

      {/* Keep reading */}
      {related.length > 0 && (
        <section aria-labelledby="keep-reading" className="border-t border-brand-border px-4 sm:px-6 lg:px-10 py-24 lg:py-32">
          <div className="mx-auto max-w-[1360px] flex flex-col gap-12">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="flex flex-col gap-4">
                <p className="m-0 font-mono text-[13px] tracking-[0.08em] uppercase text-brand-slate">Keep reading</p>
                <h2 id="keep-reading" className="m-0 font-extrabold tracking-[-0.05em] leading-[0.95] text-brand-navy text-[clamp(34px,4.4vw,64px)]">
                  More from the blog.
                </h2>
              </div>
              <Link href="/blog" className="motion-underline font-semibold text-brand-navy inline-flex items-center min-h-[44px]">
                All articles →
              </Link>
            </div>
            <ul className="m-0 p-0 list-none grid gap-5 md:grid-cols-3">
              {related.map((r) => (
                <li key={r.slug} className="motion-reveal">
                  <Link
                    href={`/blog/${r.slug}`}
                    className="motion-lift group h-full rounded-[28px] bg-white border border-brand-border p-7 flex flex-col gap-4"
                  >
                    <span className="font-mono text-xs uppercase tracking-[0.08em] text-amber-700">{r.category || 'Engineering'}</span>
                    <span className="text-xl font-extrabold tracking-[-0.02em] leading-snug text-brand-navy group-hover:text-amber-700 transition-colors">
                      {r.title}
                    </span>
                    {r.excerpt && <span className="text-[15px] leading-relaxed text-brand-slate line-clamp-3">{r.excerpt}</span>}
                    <span className="mt-auto pt-2 flex items-center justify-between font-mono text-xs text-brand-slate">
                      {r.readingTime || readingTime(r.content || '')}
                      <span aria-hidden="true" className="text-lg text-brand-navy transition-transform duration-500 group-hover:translate-x-1">→</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}
