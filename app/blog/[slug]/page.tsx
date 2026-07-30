import type { Metadata } from 'next';
import React from 'react';
import { ArticleClient } from './article-client';
import { INITIAL_BLOG_POSTS } from '@/lib/initial-blog-data';

async function getPostData(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.rowellblanca.dev';
    const res = await fetch(`${baseUrl}/api/blog/${slug}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.post) return data.post;
    }
  } catch (e) {
    // Fallback
  }
  return INITIAL_BLOG_POSTS.find((p) => p.slug === slug) || null;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostData(params.slug);
  const baseUrl = 'https://www.rowellblanca.dev';

  if (post) {
    return {
      metadataBase: new URL(baseUrl),
      title: `${post.title} | Rowell Mark Blanca`,
      description: post.excerpt || `${post.title} - Software Engineering article by Rowell Mark Blanca.`,
      keywords: post.tags || ['Rowell Mark Blanca', 'Software Engineering', 'React', 'WordPress'],
      authors: [{ name: post.author || 'Rowell Mark Blanca', url: baseUrl }],
      creator: 'Rowell Mark Blanca',
      openGraph: {
        type: 'article',
        url: `${baseUrl}/blog/${post.slug}`,
        title: post.title,
        description: post.excerpt,
        siteName: 'Rowell Mark Blanca Portfolio',
        publishedTime: post.publishedAt,
        authors: [post.author || 'Rowell Mark Blanca'],
        tags: post.tags || [],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt,
        creator: '@itsmrrowrow',
      },
      alternates: {
        canonical: `${baseUrl}/blog/${post.slug}`,
      },
    };
  }

  return {
    title: 'Technical Article | Rowell Mark Blanca',
    description: 'Read technical insights and case studies by Senior Software Engineer Rowell Mark Blanca.',
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const post = await getPostData(params.slug);

  const articleJsonLd = post
    ? {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        '@id': `https://www.rowellblanca.dev/blog/${post.slug}/#article`,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://www.rowellblanca.dev/blog/${post.slug}`,
        },
        headline: post.title,
        description: post.excerpt || post.title,
        articleBody: post.content,
        image: post.coverImage ? `https://www.rowellblanca.dev${post.coverImage}` : 'https://www.rowellblanca.dev/opengraph-image1.jpg',
        datePublished: post.publishedAt || new Date().toISOString(),
        dateModified: post.updatedAt || post.publishedAt || new Date().toISOString(),
        author: {
          '@type': 'Person',
          name: post.author || 'Rowell Mark Blanca',
          url: 'https://www.rowellblanca.dev',
        },
        publisher: {
          '@type': 'Person',
          name: 'Rowell Mark Blanca',
          url: 'https://www.rowellblanca.dev',
        },
        articleSection: post.category || 'Engineering',
        keywords: Array.isArray(post.tags) ? post.tags.join(', ') : 'Software Engineering',
        inLanguage: 'en-GB',
      }
    : null;

  return (
    <>
      {articleJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
      )}
      <ArticleClient slug={params.slug} />
    </>
  );
}
