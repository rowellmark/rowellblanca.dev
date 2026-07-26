import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { generateCaseStudyMetadata, generateCaseStudyJsonLd } from '@/lib/seo';
import CaseStudyView from '@/components/case-study/case-study-view';
import { PortfolioProject } from '@/components/ui/portfolio-card';

interface PageProps {
  params: { projects: string };
}

async function getProject(permalink: string): Promise<PortfolioProject | null> {
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

  // Fallback API or null check
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.rowellblanca.dev';
    const res = await fetch(`${baseUrl}/api/projects?permalink=${permalink}`, {
      next: { revalidate: 60 },
    });
    const data = await res.json();
    if (data.success && data.project) return data.project;
  } catch (e) {}

  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
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

export default async function CaseStudyPage({ params }: PageProps) {
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
