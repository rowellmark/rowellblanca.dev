import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/auth';

const FALLBACK_PROJECTS = [
  {
    id: 1,
    sitename: 'BuildForUser Platform',
    permalink: 'buildforuser',
    url: 'buildforuser.com',
    image: 'buildforuser.png',
    mobileImage: '',
    description: 'SaaS & website management platform enabling automated WordPress and React site deployments, client management, and billing infrastructure.',
    technologies: ['React/Nextjs', 'Prisma', 'NeonDB', 'TypeScript', 'Node.js'],
    featured: true,
    spotlight: false,
  },
  {
    id: 2,
    sitename: 'MacManus Asset Finance Portal',
    permalink: 'macmanus-portal',
    url: 'macmanusfd.finance',
    image: 'macmanus-portal.png',
    mobileImage: '',
    description: 'Enterprise asset finance portal featuring CRM lead management, funder product directories, document hub, and support ticket system.',
    technologies: ['React/Nextjs', 'Prisma', 'NeonDB', 'TypeScript', 'CRM Pipeline'],
    featured: true,
    spotlight: true,
  },
  {
    id: 3,
    sitename: 'Juliette Hohnen Real Estate',
    permalink: 'juliette-hohnen',
    url: 'juliettehohnen.com',
    image: 'juliettehohnen.png',
    mobileImage: '',
    description: 'Luxury real estate portal for top Beverly Hills & Los Angeles luxury property listings, custom galleries, and client inquiries.',
    technologies: ['Wordpress', 'PHP', 'Real Estate API', 'JavaScript'],
    featured: true,
    spotlight: false,
  },
  {
    id: 4,
    sitename: 'Tower Fire',
    permalink: 'tower-fire',
    url: 'towerfire.co.uk',
    image: 'towerfire.png',
    mobileImage: '',
    description: 'WordPress build with a fully custom Gutenberg block library and a bespoke Gutenberg-native blog engine — no third-party page builder.',
    technologies: ['Wordpress', 'Wordpress Plugins', 'PHP', 'Custom Gutenberg Blocks'],
    featured: true,
    spotlight: false,
  },
  {
    id: 5,
    sitename: 'MacManus Asset Finance Brokerage',
    permalink: 'macmanus-asset-finance',
    url: 'macmanusassetfinance.co.uk',
    image: 'macmanus.png',
    mobileImage: '',
    description: 'WordPress site for an FCA-regulated business finance brokerage, covering asset finance, business loans, invoice financing, and VAT loans.',
    technologies: ['Wordpress', 'Wordpress Plugins', 'PHP', 'FCA-Regulated'],
    featured: true,
    spotlight: false,
  },
  {
    id: 6,
    sitename: 'MacManus Partner Portal',
    permalink: 'macmanus-partner-portal',
    url: 'partners.macmanusassetfinance.co.uk',
    image: 'partner-portal.png',
    mobileImage: '',
    description: 'Dedicated portal for commercial finance professionals applying to become MacManus Certified Individuals.',
    technologies: ['Wordpress', 'Wordpress Plugins', 'PHP', 'Partner Portal'],
    featured: true,
    spotlight: false,
  },
  {
    id: 7,
    sitename: 'MacManus Supplier Portal',
    permalink: 'macmanus-supplier-portal',
    url: 'suppliers.macmanusassetfinance.co.uk',
    image: 'supplier-portal.png',
    mobileImage: '',
    description: 'Portal for vehicle, plant, equipment, and prestige car suppliers/dealers to offer asset financing to their customers.',
    technologies: ['Wordpress', 'Wordpress Plugins', 'PHP', 'Supplier Portal'],
    featured: true,
    spotlight: false,
  },
  {
    id: 8,
    sitename: 'MacManus Accountant Portal',
    permalink: 'macmanus-accountant-portal',
    url: 'accountants.macmanusassetfinance.co.uk',
    image: 'accountant-portal.png',
    mobileImage: '',
    description: 'Portal for accountancy firms and advisers to introduce SME clients to MacManus funding without taking on lending infrastructure.',
    technologies: ['Wordpress', 'Wordpress Plugins', 'PHP', 'Accountant Portal'],
    featured: true,
    spotlight: false,
  },
  {
    id: 9,
    sitename: 'Rowell Blanca — Developer Portfolio',
    permalink: 'rowell-blanca-dev',
    url: 'rowellblanca.dev',
    image: 'rowellbanner.png',
    mobileImage: '',
    description: 'Personal portfolio for a full-stack software engineer, covering React/Next.js frontend work, Node.js/PHP backend work, and AI/automation services.',
    technologies: ['React/Nextjs', 'Prisma', 'NeonDB', 'TypeScript', 'Tailwind'],
    featured: true,
    spotlight: false,
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const permalink = searchParams.get('permalink');
    const category = searchParams.get('category');
    const featuredOnly = searchParams.get('featured') === 'true';

    let dbProjects: any[] = [];
    try {
      if (permalink) {
        const singleProject = await prisma.project.findUnique({
          where: { permalink },
        });
        if (singleProject) {
          return NextResponse.json({ success: true, project: singleProject, projects: [singleProject] });
        }
      } else {
        const whereClause: any = {};
        if (featuredOnly) whereClause.featured = true;

        dbProjects = await prisma.project.findMany({
          where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
          orderBy: { createdAt: 'desc' },
        });
      }
    } catch (e) {
      console.warn('NeonDB query warning, serving fallback projects dataset.');
    }

    let projectsToReturn = dbProjects.length > 0 ? dbProjects : FALLBACK_PROJECTS;

    if (category && category !== 'All') {
      const lowerCat = category.toLowerCase();
      projectsToReturn = projectsToReturn.filter((p) => {
        return p.technologies && p.technologies.some((t: string) => t.toLowerCase() === lowerCat || t.toLowerCase().includes(lowerCat));
      });
    }

    if (permalink) {
      const match = projectsToReturn.find((p) => p.permalink === permalink) || projectsToReturn[0];
      return NextResponse.json({ success: true, project: match, projects: [match] });
    }

    return NextResponse.json({ success: true, projects: projectsToReturn });
  } catch (error) {
    return NextResponse.json({ success: false, projects: FALLBACK_PROJECTS });
  }
}

export async function POST(request: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { sitename, permalink, url, image, mobileImage, fullDesktopImage, fullMobileImage, description, technologies, featured, spotlight } = body;

    if (!sitename || !permalink) {
      return NextResponse.json({ success: false, message: 'Sitename and permalink are required' }, { status: 400 });
    }

    const isSpotlight = Boolean(spotlight);
    if (isSpotlight) {
      try {
        await prisma.$executeRawUnsafe(`UPDATE "Project" SET "spotlight" = false`);
      } catch (e) {
        console.warn('Raw reset failed', e);
      }
    }

    const techArray = Array.isArray(technologies)
      ? technologies
      : (technologies || '').split(',').map((t: string) => t.trim());

    const newProject = await prisma.project.create({
      data: {
        sitename,
        permalink,
        url: url || '',
        image: image || 'placeholder-portfolio.jpg',
        mobileImage: mobileImage || null,
        fullDesktopImage: fullDesktopImage || null,
        fullMobileImage: fullMobileImage || null,
        description: description || '',
        technologies: techArray,
        featured: Boolean(featured),
        spotlight: isSpotlight,
      },
    });

    return NextResponse.json({ success: true, project: newProject });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || 'Failed to create project' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, sitename, permalink, url, image, mobileImage, fullDesktopImage, fullMobileImage, description, technologies, featured, spotlight } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Project ID is required for updates' }, { status: 400 });
    }

    const isSpotlight = Boolean(spotlight);
    if (isSpotlight) {
      try {
        await prisma.$executeRawUnsafe(`UPDATE "Project" SET "spotlight" = false`);
      } catch (e) {
        console.warn('Raw reset failed', e);
      }
    }

    const techArray = Array.isArray(technologies)
      ? technologies
      : (technologies || '').split(',').map((t: string) => t.trim());

    const updatedProject = await prisma.project.upsert({
      where: { id: Number(id) },
      update: {
        sitename,
        permalink,
        url: url || '',
        image: image || 'placeholder-portfolio.jpg',
        mobileImage: mobileImage || null,
        fullDesktopImage: fullDesktopImage || null,
        fullMobileImage: fullMobileImage || null,
        description: description || '',
        technologies: techArray,
        featured: Boolean(featured),
        spotlight: isSpotlight,
      },
      create: {
        sitename,
        permalink,
        url: url || '',
        image: image || 'placeholder-portfolio.jpg',
        mobileImage: mobileImage || null,
        fullDesktopImage: fullDesktopImage || null,
        fullMobileImage: fullMobileImage || null,
        description: description || '',
        technologies: techArray,
        featured: Boolean(featured),
        spotlight: isSpotlight,
      },
    });

    return NextResponse.json({ success: true, project: updatedProject });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Project ID parameter is required' }, { status: 400 });
    }

    await prisma.project.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true, message: 'Project deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || 'Failed to delete project' }, { status: 500 });
  }
}
