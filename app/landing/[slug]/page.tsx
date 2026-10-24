import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DynamicLandingPageClient } from './dynamic-landing-client';
import { DEFAULT_OG_IMAGE, seoDescription, seoTitle } from '@/lib/seo';

interface DynamicLandingPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const STANDALONE_ROUTES = new Set(['hire-uk-react-developer', 'hire-uk-wordpress-developer']);

async function getLandingPageData(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.rowellblanca.dev';
    const res = await fetch(`${baseUrl}/api/landing-pages?slug=${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success && data.page ? data.page : null;
  } catch (e) {
    return null;
  }
}

export async function generateMetadata(props: DynamicLandingPageProps): Promise<Metadata> {
  const params = await props.params;
  const page = await getLandingPageData(params.slug);
  const title = page?.metaTitle || page?.heroTitle || 'Hire Senior Full-Stack Software Engineer';
  const description = page?.metaDescription || page?.heroSubtitle || 'Bespoke web development and software engineering.';

  return {
    title: seoTitle(title),
    description: seoDescription(description),
    openGraph: {
      title: seoTitle(title).absolute,
      description: seoDescription(description),
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: title }],
      type: 'website',
      url: `https://www.rowellblanca.dev/landing/${params.slug}`,
    },
    alternates: {
      // The built-in fallback pages mirror the standalone /hire-uk-* routes; credit those instead.
      canonical: STANDALONE_ROUTES.has(params.slug)
        ? `https://www.rowellblanca.dev/${params.slug}`
        : `https://www.rowellblanca.dev/landing/${params.slug}`,
    },
  };
}

export default async function DynamicLandingPage(props: DynamicLandingPageProps) {
  const params = await props.params;
  const page = await getLandingPageData(params.slug);

  if (!page) {
    return notFound();
  }

  const landingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `https://www.rowellblanca.dev/landing/${page.slug}/#service`,
    name: page.heroTitle,
    description: page.heroSubtitle || page.metaDescription,
    provider: {
      '@type': 'Person',
      name: 'Rowell Mark Blanca',
      url: 'https://www.rowellblanca.dev',
      jobTitle: 'Senior Full-Stack Engineer & WordPress Architect',
    },
    areaServed: {
      '@type': 'Country',
      name: 'United Kingdom',
    },
    serviceType: page.serviceSectionType || 'Software Engineering & Web Development',
    url: `https://www.rowellblanca.dev/landing/${page.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(landingJsonLd) }}
      />
      <DynamicLandingPageClient page={page} />
    </>
  );
}
