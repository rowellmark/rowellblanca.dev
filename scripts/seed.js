const { PrismaClient } = require('../lib/generated/client');
require('dotenv').config();

const prisma = new PrismaClient();

const SEED_PROJECTS = [
  {
    sitename: 'BuildForUser Platform',
    permalink: 'buildforuser',
    url: 'buildforuser.com',
    image: 'buildforuser.png',
    description: 'SaaS & website management platform enabling automated WordPress and React site deployments, client management, and billing infrastructure.',
    technologies: ['React/Nextjs', 'Prisma', 'NeonDB', 'TypeScript', 'Node.js'],
    featured: true,
  },
  {
    sitename: 'MacManus Asset Finance Portal',
    permalink: 'macmanus-portal',
    url: 'macmanusfd.finance',
    image: 'macmanus-portal.png',
    description: 'Enterprise asset finance portal featuring CRM lead management, funder product directories, document hub, and support ticket system.',
    technologies: ['React/Nextjs', 'Prisma', 'NeonDB', 'TypeScript', 'CRM Pipeline'],
    featured: true,
  },
  {
    sitename: 'Juliette Hohnen Real Estate',
    permalink: 'juliette-hohnen',
    url: 'juliettehohnen.com',
    image: 'juliettehohnen.png',
    description: 'Luxury real estate portal for top Beverly Hills & Los Angeles luxury property listings, custom galleries, and client inquiries.',
    technologies: ['Wordpress', 'PHP', 'Real Estate API', 'JavaScript'],
    featured: true,
  },
  {
    sitename: 'Tower Fire',
    permalink: 'tower-fire',
    url: 'towerfire.co.uk',
    image: 'towerfire.png',
    description: 'WordPress build with a fully custom Gutenberg block library and a bespoke Gutenberg-native blog engine — no third-party page builder.',
    technologies: ['Wordpress', 'Wordpress Plugins', 'PHP', 'Custom Gutenberg Blocks'],
    featured: true,
  },
  {
    sitename: 'MacManus Asset Finance Brokerage',
    permalink: 'macmanus-asset-finance',
    url: 'macmanusassetfinance.co.uk',
    image: 'macmanus.png',
    description: 'WordPress site for an FCA-regulated business finance brokerage, covering asset finance, business loans, invoice financing, and VAT loans.',
    technologies: ['Wordpress', 'Wordpress Plugins', 'PHP', 'FCA-Regulated'],
    featured: true,
  },
  {
    sitename: 'MacManus Partner Portal',
    permalink: 'macmanus-partner-portal',
    url: 'partners.macmanusassetfinance.co.uk',
    image: 'partner-portal.png',
    description: 'Dedicated portal for commercial finance professionals applying to become MacManus Certified Individuals.',
    technologies: ['Wordpress', 'Wordpress Plugins', 'PHP', 'Partner Portal'],
    featured: true,
  },
  {
    sitename: 'MacManus Supplier Portal',
    permalink: 'macmanus-supplier-portal',
    url: 'suppliers.macmanusassetfinance.co.uk',
    image: 'supplier-portal.png',
    description: 'Portal for vehicle, plant, equipment, and prestige car suppliers/dealers to offer asset financing to their customers.',
    technologies: ['Wordpress', 'Wordpress Plugins', 'PHP', 'Supplier Portal'],
    featured: true,
  },
  {
    sitename: 'MacManus Accountant Portal',
    permalink: 'macmanus-accountant-portal',
    url: 'accountants.macmanusassetfinance.co.uk',
    image: 'accountant-portal.png',
    description: 'Portal for accountancy firms and advisers to introduce SME clients to MacManus funding without taking on lending infrastructure.',
    technologies: ['Wordpress', 'Wordpress Plugins', 'PHP', 'Accountant Portal'],
    featured: true,
  },
  {
    sitename: 'Rowell Blanca — Developer Portfolio',
    permalink: 'rowell-blanca-dev',
    url: 'rowellblanca.dev',
    image: 'rowellbanner.png',
    description: 'Personal portfolio for a software engineer, covering React/Next.js frontend work, Node.js/PHP backend work, and AI/automation services.',
    technologies: ['React/Nextjs', 'Prisma', 'NeonDB', 'TypeScript', 'Tailwind'],
    featured: true,
  },
];

async function main() {
  const isReset = process.argv.includes('--reset');
  console.log(`⚡ Starting NeonDB (PostgreSQL) Seeding Script ${isReset ? '(RESET MODE)' : ''}...`);

  if (isReset) {
    console.log('🧹 Purging existing project records...');
    await prisma.project.deleteMany({});
    console.log('✓ Purged existing projects.');
  }

  let count = 0;
  for (const proj of SEED_PROJECTS) {
    await prisma.project.upsert({
      where: { permalink: proj.permalink },
      update: {
        sitename: proj.sitename,
        url: proj.url,
        image: proj.image,
        description: proj.description,
        technologies: proj.technologies,
        featured: proj.featured,
      },
      create: {
        sitename: proj.sitename,
        permalink: proj.permalink,
        url: proj.url,
        image: proj.image,
        description: proj.description,
        technologies: proj.technologies,
        featured: proj.featured,
      },
    });
    count++;
  }

  console.log(`✓ ${count} Portfolio Projects with selected technologies successfully imported into NeonDB!`);

  // Seed Sample CRM Leads
  const SAMPLE_LEADS = [
    {
      contactName: 'Sarah Jenkins',
      email: 'sarah@apexfinance.co.uk',
      companyName: 'Apex Commercial Capital',
      serviceInterest: 'Next.js & CRM Portal Development',
      budget: '$5,000 - $10,000',
      enquiryDetails: 'Looking to build a custom Next.js portal with CRM lead tracking and funder integration similar to MacManus Asset Finance.',
      status: 'NEW',
    },
    {
      contactName: 'David Miller',
      email: 'd.miller@tower-fire.co.uk',
      companyName: 'Tower Fire Solutions',
      serviceInterest: 'Custom WordPress Gutenberg Engine',
      budget: '$3,000 - $5,000',
      enquiryDetails: 'Need custom Gutenberg block development for our WordPress agency client without relying on third-party page builders.',
      status: 'QUALIFIED',
    },
    {
      contactName: 'Elena Rostova',
      email: 'elena@luxuryrealestate.la',
      companyName: 'Beverly Hills Real Estate Group',
      serviceInterest: 'Full-Stack Web App Development',
      budget: '$10,000+',
      enquiryDetails: 'Interested in a luxury real estate web application built with Next.js and Tailwind with interactive property maps.',
      status: 'CONTACTED',
    },
  ];

  let leadCount = 0;
  for (const lead of SAMPLE_LEADS) {
    const existing = await prisma.lead.findFirst({ where: { email: lead.email } });
    if (!existing) {
      await prisma.lead.create({ data: lead });
      leadCount++;
    }
  }
  console.log(`✓ ${leadCount} Sample CRM Leads imported into NeonDB!`);

  // Seed Client Testimonials
  const SEED_TESTIMONIALS = [
    {
      name: 'Giles McManus',
      role: 'Managing Director',
      company: 'MacManus Asset Finance',
      quote: 'Rowell engineered our entire broker, partner, supplier, and accountant portals with exceptional speed and precision. His expertise in full-stack web architecture transformed our operational workflow.',
      rating: 5,
      active: true,
    },
    {
      name: 'Tower Fire Solutions',
      role: 'Operations Team',
      company: 'Tower Fire UK',
      quote: 'The bespoke WordPress Gutenberg block engine Rowell built for our site allows us to publish clean, custom pages effortlessly without relying on slow page builders.',
      rating: 5,
      active: true,
    },
    {
      name: 'Juliette Hohnen',
      role: 'Principal Partner',
      company: 'Juliette Hohnen Real Estate',
      quote: 'Rowell created a sleek, high-performing luxury real estate portal that showcases Beverly Hills properties with high visual excellence.',
      rating: 5,
      active: true,
    },
  ];

  let testimonialCount = 0;
  for (const t of SEED_TESTIMONIALS) {
    const existing = await prisma.testimonial.findFirst({ where: { name: t.name, company: t.company } });
    if (!existing) {
      await prisma.testimonial.create({ data: t });
      testimonialCount++;
    }
  }
  console.log(`✓ ${testimonialCount} Client Testimonials imported into NeonDB!`);
}

main()
  .catch((e) => {
    console.error('✗ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
