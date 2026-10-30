import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { FALLBACK_PROJECTS } from '@/lib/fallback-projects';
import type { PortfolioProject } from '@/components/ui/portfolio-card';

/**
 * All active portfolio projects, newest first, read from NeonDB (same table as /api/projects)
 * with the bundled FALLBACK_PROJECTS when the DB is empty or unreachable. Cached per request.
 */
export const getActiveProjects = cache(async (): Promise<PortfolioProject[]> => {
  try {
    const rows = await prisma.project.findMany({ where: { active: true }, orderBy: { createdAt: 'desc' } });
    if (rows.length > 0) return rows as unknown as PortfolioProject[];
  } catch {
    // DB unreachable: fall back to the bundled dataset.
  }
  return FALLBACK_PROJECTS as unknown as PortfolioProject[];
});

export { isPluginProject } from '@/lib/plugins';

/** Has a written case study (challenge / solution / results) rather than just a listing. */
export function hasWriteUp(p: Pick<PortfolioProject, 'challenge' | 'solution' | 'results'>) {
  return Boolean(p.challenge?.trim() || p.solution?.trim() || p.results?.trim());
}
