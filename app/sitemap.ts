import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { INITIAL_BLOG_POSTS } from '@/lib/initial-blog-data';
import { FALLBACK_PROJECTS } from '@/lib/fallback-projects';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.rowellblanca.dev';

  // 1. Core public pages
  const staticRoutes = [
    '',
    '/about',
    '/mywork',
    '/case-studies',
    '/blog',
    '/contact',
    '/review',
    '/hire-uk-react-developer',
    '/hire-uk-wordpress-developer',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.9,
  }));

  // 2. Automatically query all active projects created via Admin Dashboard
  let projectEntries = FALLBACK_PROJECTS.map((p) => ({
    permalink: p.permalink,
    updatedAt: new Date(),
  }));

  try {
    const dbProjects = await prisma.project.findMany({
      where: { active: true },
      select: { permalink: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    if (dbProjects.length > 0) {
      projectEntries = dbProjects.map((p) => ({
        permalink: p.permalink,
        updatedAt: p.createdAt || new Date(),
      }));
    }
  } catch (error) {
    console.warn('Sitemap live database fetch fallback (using initial projects):', error);
  }

  const projectRoutes = projectEntries.map((item) => ({
    url: `${baseUrl}/mywork/${item.permalink}`,
    lastModified: item.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // 3. Query all published blog posts (with initial blog posts fallback)
  let blogRoutes: MetadataRoute.Sitemap = INITIAL_BLOG_POSTS.filter((p) => p.published).map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt || Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  try {
    const dbPosts = await (prisma as any).blogPost.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true, publishedAt: true },
      orderBy: { publishedAt: 'desc' },
    });
    if (dbPosts.length > 0) {
      blogRoutes = dbPosts.map((post: any) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt || post.publishedAt || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.warn('Sitemap live blog posts DB fetch fallback (using initial blog posts):', error);
  }

  return [...staticRoutes, ...projectRoutes, ...blogRoutes];
}


