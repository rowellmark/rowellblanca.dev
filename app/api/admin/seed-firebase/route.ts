import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/auth';

const SEED_PROJECTS = [
  {
    sitename: 'Tower Fire',
    permalink: 'tower-fire',
    url: 'towerfire.co.uk',
    image: 'towerfire.png',
    description: 'WordPress build with a fully custom Gutenberg block library and a bespoke Gutenberg-native blog engine — no third-party page builder.',
    technologies: ['WordPress', 'Custom Gutenberg Blocks', 'Custom Blog Engine', 'PHP'],
    featured: true,
  },
  {
    sitename: 'MacManus Asset Finance',
    permalink: 'macmanus-asset-finance',
    url: 'macmanusassetfinance.co.uk',
    image: 'macmanus.png',
    description: 'WordPress site for an FCA-regulated business finance brokerage, covering asset finance, business loans, invoice financing, and VAT loans.',
    technologies: ['WordPress', 'FCA-Regulated', 'Lead Forms', 'PHP', 'MySQL'],
    featured: true,
  },
  {
    sitename: 'MacManus Partner Portal',
    permalink: 'macmanus-partner-portal',
    url: 'partners.macmanusassetfinance.co.uk',
    image: 'partner-portal.png',
    description: 'Dedicated portal for commercial finance professionals applying to become MacManus Certified Individuals.',
    technologies: ['WordPress', 'Partner Portal', 'Application Forms', 'PHP'],
    featured: true,
  },
  {
    sitename: 'MacManus Supplier Portal',
    permalink: 'macmanus-supplier-portal',
    url: 'suppliers.macmanusassetfinance.co.uk',
    image: 'supplier-portal.png',
    description: 'Portal for vehicle, plant, equipment, and prestige car suppliers/dealers to offer asset financing to their customers.',
    technologies: ['WordPress', 'Supplier Portal', 'PHP'],
    featured: true,
  },
  {
    sitename: 'MacManus Accountant Portal',
    permalink: 'macmanus-accountant-portal',
    url: 'accountants.macmanusassetfinance.co.uk',
    image: 'accountant-portal.png',
    description: 'Portal for accountancy firms and advisers to introduce SME clients to MacManus funding without taking on lending infrastructure.',
    technologies: ['WordPress', 'Accountant Portal', 'PHP'],
    featured: true,
  },
  {
    sitename: 'Rowell Blanca — Developer Portfolio',
    permalink: 'rowell-blanca-dev',
    url: 'rowellblanca.dev',
    image: 'rowellbanner.png',
    description: 'Personal portfolio for a full-stack software engineer, covering React/Next.js frontend work, Node.js/PHP backend work, and AI/automation services.',
    technologies: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Prisma', 'Tailwind'],
    featured: true,
  },
];

export async function POST() {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    let importedCount = 0;
    const importedProjects: any[] = [];

    for (const data of SEED_PROJECTS) {
      const project = await prisma.project.upsert({
        where: { permalink: data.permalink },
        update: {
          sitename: data.sitename,
          url: data.url,
          image: data.image,
          description: data.description,
          technologies: data.technologies,
          featured: data.featured,
        },
        create: {
          sitename: data.sitename,
          permalink: data.permalink,
          url: data.url,
          image: data.image,
          description: data.description,
          technologies: data.technologies,
          featured: data.featured,
        },
      });

      importedProjects.push(project);
      importedCount++;
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${importedCount} real projects into NeonDB (PostgreSQL)!`,
      importedCount,
      projects: importedProjects,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error?.message || 'Failed to seed projects into NeonDB',
    }, { status: 500 });
  }
}
