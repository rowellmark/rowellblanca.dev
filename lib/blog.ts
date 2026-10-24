import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { INITIAL_BLOG_POSTS } from '@/lib/initial-blog-data';

export interface BlogPostRecord {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  coverImage?: string | null;
  category?: string | null;
  tags: string[];
  author?: string | null;
  readingTime?: string | null;
  publishedAt?: string | Date | null;
  updatedAt?: string | Date | null;
}

/**
 * A post plus up to three related posts, read straight from NeonDB (same rules as
 * GET /api/blog/[slug]) with INITIAL_BLOG_POSTS as the fallback. Cached per request
 * so generateMetadata and the page share one lookup.
 */
export const getBlogPost = cache(async (slug: string) => {
  let post: BlogPostRecord | null = null;
  let others: BlogPostRecord[] = [];
  try {
    post = await (prisma as any).blogPost.findUnique({ where: { slug } });
    others = await (prisma as any).blogPost.findMany({ where: { published: true }, orderBy: { publishedAt: 'desc' }, take: 6 });
  } catch {
    // DB unreachable: use the bundled posts below.
  }
  if (!post) post = (INITIAL_BLOG_POSTS.find((p) => p.slug === slug) as BlogPostRecord | undefined) || null;
  const pool = others.length ? others : (INITIAL_BLOG_POSTS as BlogPostRecord[]);
  const sameCategory = pool.filter((p) => p.slug !== slug && post && p.category === post.category);
  const rest = pool.filter((p) => p.slug !== slug && !sameCategory.includes(p));
  return { post, related: [...sameCategory, ...rest].slice(0, 3) };
});

// Shorter search-result titles (Google shows ~60 characters) for existing posts,
// keyed by slug. The on-page headline keeps the full post title. Posts without an
// entry fall back to their title.
const SEO_TITLES: Record<string, string> = {
  'custom-wordpress-vs-nextjs-14-uk-enterprises': 'WordPress vs Next.js: Choosing the Right Stack (UK Guide)',
  'high-performance-webgl-canvas-game-engines-react': 'WebGL & Canvas Game Engines in React: A Practical Guide',
  'engineering-fca-regulated-asset-finance-portal-macmanus': 'Building an FCA-Regulated Asset Finance Portal',
  'building-custom-rag-ai-chatbots-wordpress-nextjs': 'Building RAG AI Chatbots for WordPress & Next.js',
  'optimizing-nextjs-14-server-components-core-web-vitals': 'Next.js Server Components & Core Web Vitals Guide',
  'architecting-custom-gutenberg-blocks-gaming-portals': 'Custom Gutenberg Blocks for Gaming & E-Sports Sites',
};

export function blogSeoTitle(post: Pick<BlogPostRecord, 'slug' | 'title'>) {
  return SEO_TITLES[post.slug] || post.title;
}
