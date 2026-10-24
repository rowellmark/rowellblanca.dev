import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { generateCaseStudyMetadata, generateCaseStudyJsonLd } from '@/lib/seo';
import CaseStudyView from '@/components/case-study/case-study-view';
import { PortfolioProject } from '@/components/ui/portfolio-card';

import { FALLBACK_PROJECTS } from '@/lib/fallback-projects';

// Refresh at most every minute so admin edits show up without a redeploy.
export const revalidate = 60;

// Pre-build the bundled projects; other permalinks render on first visit, then cache.
export function generateStaticParams() {
  return FALLBACK_PROJECTS.map((p) => ({ projects: p.permalink }));
}

interface PageProps {
  params: Promise<{ projects: string }>;
}

// One lookup per request, shared by generateMetadata and the page. Reads NeonDB
// directly (the /api/projects route reads the same table), then the bundled fallback.
const getProject = cache(async (permalink: string): Promise<PortfolioProject | null> => {
  try {
    const dbProject = await prisma.project.findUnique({
      where: { permalink },
    });
    if (dbProject && dbProject.active !== false) {
      return dbProject as any;
    }
  } catch (error) {
    console.warn('Prisma lookup failed in case study route:', error);
  }

  const fallback = FALLBACK_PROJECTS.find((p) => p.permalink === permalink);
  return (fallback as any) || null;
});

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const project = await getProject(params.projects);

  if (!project) {
    return {
      title: 'Case Study Not Found',
      description: 'The requested case study could not be found.',
    };
  }

  return generateCaseStudyMetadata({
    title: project.sitename,
    description: project.challenge || project.description || `Case study for ${project.sitename}`,
    permalink: project.permalink,
    image: project.image,
    category: project.category,
    technologies: project.technologies,
  });
}

export default async function CaseStudyPage(props: PageProps) {
  const params = await props.params;
  const project = await getProject(params.projects);

  if (!project) {
    notFound();
  }

  const jsonLd = generateCaseStudyJsonLd({
    title: project.sitename,
    description: project.challenge || project.description || `Case study for ${project.sitename}`,
    permalink: project.permalink,
    image: project.image,
    category: project.category,
    technologies: project.technologies,
  });

  return (
    <>
      {/* Schema.org JSON-LD Structured Data for Google Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CaseStudyView project={project} />
    </>
  );
}
