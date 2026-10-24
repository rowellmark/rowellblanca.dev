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
