import type { Metadata } from 'next';

export const SITE_URL = 'https://www.rowellblanca.dev';
export const DEFAULT_AUTHOR = 'Rowell Mark Blanca';

export interface CaseStudySeoProps {
  title: string;
  description: string;
  permalink: string;
  image?: string;
  publishedAt?: string;
  category?: string;
  technologies?: string[];
}

/**
 * Generates Next.js 14 App Router Metadata object for Case Studies & Blog Posts
 */
export function generateCaseStudyMetadata({
  title,
  description,
  permalink,
  image,
  publishedAt,
  category,
  technologies = [],
}: CaseStudySeoProps): Metadata {
  const url = `${SITE_URL}/mywork/${permalink}`;
  const ogImageUrl = image
    ? image.startsWith('http')
      ? image
      : `${SITE_URL}/${image.replace(/^\/+/, '')}`
    : `${SITE_URL}/opengraph-image1.jpg`;

  const metaTitle = `${title} | Case Study`;
  const metaDescription =
    description ||
    `Explore the architecture, technical breakdown, and key metrics for ${title} built by ${DEFAULT_AUTHOR}.`;

  return {
    metadataBase: new URL(SITE_URL),
    title: metaTitle,
    description: metaDescription,
    keywords: [
      title,
      category || 'Case Study',
      ...technologies,
      'Full-Stack Case Study',
      'Rowell Mark Blanca',
      'React Next.js Portfolio',
      'WordPress Developer UK',
      'UK Web Engineering',
    ],
    authors: [{ name: DEFAULT_AUTHOR, url: SITE_URL }],
    creator: DEFAULT_AUTHOR,
    publisher: DEFAULT_AUTHOR,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url,
      siteName: 'Rowell Mark Blanca Portfolio',
      locale: 'en_GB',
      type: 'article',
      publishedTime: publishedAt || new Date().toISOString(),
      authors: [DEFAULT_AUTHOR],
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${title} Case Study Preview`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      creator: '@its_mr_row',
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  };
}

/**
 * Generates Schema.org JSON-LD Structured Data for Case Study Articles
 */
export function generateCaseStudyJsonLd({
  title,
  description,
  permalink,
  image,
  publishedAt,
  category,
  technologies = [],
}: CaseStudySeoProps) {
  const url = `${SITE_URL}/mywork/${permalink}`;
  const ogImageUrl = image
    ? image.startsWith('http')
      ? image
      : `${SITE_URL}/${image.replace(/^\/+/, '')}`
    : `${SITE_URL}/opengraph-image1.jpg`;

  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    description: description,
    url: url,
    image: [ogImageUrl],
    datePublished: publishedAt || new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: DEFAULT_AUTHOR,
      url: SITE_URL,
      jobTitle: 'Senior Full-Stack Software Engineer',
    },
    publisher: {
      '@type': 'Organization',
      name: DEFAULT_AUTHOR,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/icon.png`,
      },
    },
    articleSection: category || 'Web Development',
    keywords: technologies.join(', '),
  };
}

export interface TestimonialSchemaItem {
  id?: number;
  name: string;
  role?: string;
  company?: string;
  quote: string;
  rating?: number;
}

/**
 * Generates Schema.org JSON-LD Structured Data for Client Testimonials & Star Ratings
 */
export function generateTestimonialsJsonLd(testimonials: TestimonialSchemaItem[]) {
  if (!testimonials || testimonials.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Rowell Mark Blanca - Senior Software Engineering Services',
    url: SITE_URL,
    image: `${SITE_URL}/opengraph-image1.jpg`,
    priceRange: '$$',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: testimonials.length.toString(),
      bestRating: '5',
      worstRating: '1',
    },
    review: testimonials.map((t) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: t.name,
        jobTitle: t.role || undefined,
        worksFor: t.company ? { '@type': 'Organization', name: t.company } : undefined,
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: (t.rating || 5).toString(),
        bestRating: '5',
        worstRating: '1',
      },
      reviewBody: t.quote,
    })),
  };
}
