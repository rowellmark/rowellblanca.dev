import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const FALLBACK_PROJECTS = [
  { permalink: 'buildforuser', updatedAt: new Date() },
  { permalink: 'macmanus-portal', updatedAt: new Date() },
  { permalink: 'juliette-hohnen', updatedAt: new Date() },
  { permalink: 'tower-fire', updatedAt: new Date() },
  { permalink: 'macmanus-asset-finance', updatedAt: new Date() },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.rowellblanca.dev';

  // 1. Core public pages
  const staticRoutes = [
    '',
    '/about',
    '/mywork',
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
  let projectEntries = FALLBACK_PROJECTS;
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
    console.error('Sitemap live database fetch fallback:', error);
  }

  const projectRoutes = projectEntries.map((item) => ({
    url: `${baseUrl}/mywork/${item.permalink}`,
    lastModified: item.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...projectRoutes];
}


