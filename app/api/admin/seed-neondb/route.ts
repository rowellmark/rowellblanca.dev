import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/auth';
import { hashPassword } from '@/lib/crypto';

const SEED_ADMIN_EMAIL = 'admin@rowellblanca.dev';
const SEED_ADMIN_PASSWORD = 'RowellAdmin2026!';

const SEED_PROJECTS = [
  {
    sitename: 'BuildForUser Platform',
    permalink: 'buildforuser',
    url: 'buildforuser.com',
    image: 'buildforuser.png',
    description: 'SaaS & website management platform enabling automated WordPress and React site deployments, client management, and billing infrastructure.',
    technologies: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Tailwind', 'Node.js'],
    featured: true,
  },
  {
    sitename: 'MacManus Asset Finance Portal',
    permalink: 'macmanus-portal',
    url: 'macmanusfd.finance',
    image: 'macmanus-portal.png',
    description: 'Enterprise asset finance portal featuring CRM lead management, funder product directories, document hub, and support ticket system.',
    technologies: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Tailwind', 'CRM Pipeline'],
    featured: true,
  },
  {
    sitename: 'Juliette Hohnen Real Estate',
    permalink: 'juliette-hohnen',
    url: 'juliettehohnen.com',
    image: 'juliettehohnen.png',
    description: 'Luxury real estate portal for top Beverly Hills & Los Angeles luxury property listings, custom galleries, and client inquiries.',
    technologies: ['WordPress', 'PHP', 'Real Estate API', 'JavaScript', 'CSS3'],
    featured: true,
  },
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
    sitename: 'MacManus Asset Finance Brokerage',
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
    // 1. Seed Admin User
    const hashedPassword = hashPassword(SEED_ADMIN_PASSWORD);
    const adminUser = await prisma.user.upsert({
      where: { email: SEED_ADMIN_EMAIL },
      update: {
        passwordHash: hashedPassword,
        name: 'Rowell Mark Blanca',
        role: 'ADMIN',
      },
      create: {
        email: SEED_ADMIN_EMAIL,
        passwordHash: hashedPassword,
        name: 'Rowell Mark Blanca',
        role: 'ADMIN',
      },
    });

    // 2. Seed Portfolio Projects
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
      message: `Successfully seeded Admin Account (${SEED_ADMIN_EMAIL}) and ${importedCount} projects into NeonDB (PostgreSQL)!`,
      adminUser: { id: adminUser.id, email: adminUser.email, name: adminUser.name },
      importedCount,
      projects: importedProjects,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error?.message || 'Failed to seed NeonDB',
    }, { status: 500 });
  }
}
