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
    description: 'SaaS platform for managing client websites at scale — automated WordPress and React deployments, centralized client management, and integrated billing, replacing manual agency ops with a single operational dashboard.',
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
    description: 'Enterprise asset finance platform built for a regulated UK lender — end-to-end CRM lead pipeline, funder product directory, document hub, and support ticketing unified in one system.',
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
    description: 'Luxury real estate platform for one of Beverly Hills\' top-producing agents — custom property galleries, curated listings, and a streamlined inquiry flow built to convert high-value buyers.',
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
    description: 'Custom WordPress build powered by a hand-coded Gutenberg block library and a native Gutenberg blog engine — zero third-party page builders, full editorial control for the client\'s team.',
    technologies: ['Wordpress', 'PHP', 'Custom Gutenberg Blocks'],
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
    description: 'FCA-regulated business finance brokerage site covering asset finance, business loans, invoice financing, and VAT loans — built for compliance-first content and lead capture.',
    technologies: ['Wordpress', 'PHP', 'FCA-Regulated'],
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
    description: 'Application and onboarding portal for commercial finance professionals pursuing MacManus Certified Individual status, streamlining a previously manual approval process.',
    technologies: ['Wordpress', 'PHP', 'Partner Portal'],
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
    description: 'Finance-enablement portal for vehicle, plant, equipment, and prestige car suppliers to offer point-of-sale asset financing directly to their customers.',
    technologies: ['Wordpress', 'PHP', 'Supplier Portal'],
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
    description: 'Referral portal for accountancy firms and advisers to introduce SME clients to MacManus funding without taking on lending infrastructure themselves.',
    technologies: ['Wordpress', 'PHP', 'Accountant Portal'],
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
    description: 'Personal portfolio showcasing full-stack engineering work across React/Next.js and Node.js/PHP backends, custom WordPress builds, and AI-driven automation workflows.',
    technologies: ['React/Nextjs', 'Prisma', 'NeonDB', 'TypeScript', 'Tailwind'],
    featured: true,
    spotlight: false,
  },
  {
    id: 10,
    sitename: 'Blanc Leads — WordPress CRM & Multi-AI Nurturing Plugin',
    permalink: 'blanc-leads-plugin',
    url: 'wp-content/plugins/buildforuser-leads',
    image: 'buildforuser.png',
    mobileImage: '',
    description: 'Bespoke WordPress CRM & AI Nurturing plugin capturing form submissions, lead pipelines, Kanban boards, and multi-provider AI nurturing.\n\nHOW IT WORKS:\n1. Form Lead Capture: Listens to WordPress form hooks (Kadence, WPForms, Contact Form 7), logging lead data, referrer, URL source, and user-agent.\n2. Native WP CRM: Manages lead records inside custom WP database tables with a Kanban board (New, Contacted, Qualified, Proposal Sent, Won, Lost), notes, tasks with due dates, and WP user owner assignments.\n3. Multi-Provider AI Nurturing: Connects to OpenAI, Claude, Gemini, DeepSeek, OpenRouter, or local Ollama to generate AI Lead Summaries, Suggested Next Actions, Context-Aware Email Drafts, 1-100 Lead Scoring, and Multi-Step Nurture Plans.\n4. Human-in-the-Loop Safety: AI creates drafts and insights, but all emails require human review before sending.',
    technologies: ['Wordpress Plugins', 'PHP', 'AI Integration', 'REST API', 'JavaScript'],
    featured: true,
    spotlight: false,
  },
  {
    id: 11,
    sitename: 'Blanc Schema LD Generator — WordPress SEO Plugin',
    permalink: 'blanc-schema-ld-generator',
    url: 'wp-content/plugins/buildforuser-schema-ld-generator',
    image: 'towerfire.png',
    mobileImage: '',
    description: 'Bespoke JSON-LD Structured Data & Schema Builder WordPress plugin featuring visual block editing, live AJAX previewing, and Yoast SEO graph assembly compatibility.\n\nHOW IT WORKS:\n1. Visual Schema Builder: Build and edit JSON-LD schema blocks directly inside the WordPress Gutenberg / Classic editor and site-wide global admin dashboard.\n2. SchemaGraphAssembler Engine: Modular PHP (PSR-4) pipeline merges global site schemas, per-post schemas, and defaults, deduplicating @id tags into a single valid @graph JSON-LD script.\n3. Live Admin AJAX Preview: Generates instant live previews of the exact JSON-LD script output directly within the admin dashboard without reloading.\n4. Yoast SEO Gate Coordination: Coordinates output with Yoast SEO or All in One SEO using YoastSchemaGate to prevent duplicate schema markup conflicts.',
    technologies: ['Wordpress Plugins', 'PHP', 'JSON-LD', 'SEO', 'JavaScript'],
    featured: true,
    spotlight: false,
  },
  {
    id: 12,
    sitename: 'Blanc Chatbot — WordPress AI Widget & RAG Knowledge Base Plugin',
    permalink: 'blanc-chatbot-plugin',
    url: 'wp-content/plugins/buildforuser-chatbox',
    image: 'buildforuser.png',
    mobileImage: '',
    description: 'Bespoke WordPress Chatbot & RAG Knowledge Base plugin featuring sitewide floating chat, shortcode embedding, WP post/page RAG import, FAQ builder, conversation history logging, and configurable LLM backends (OpenAI & local Ollama).\n\nHOW IT WORKS:\n1. RAG Knowledge Import: Imports published WordPress pages, posts, uploaded documents, or FAQs into a searchable local vector/knowledge chunk index.\n2. Configurable LLM Backend: Connects to OpenAI (GPT-4o) or local Ollama endpoints with customizable system prompts and company persona controls.\n3. Public Widget & Shortcode: Renders as a floating public widget or inline shortcode ([blanc_chatbox]) with contact details collection and instant streaming responses.\n4. Admin SPA & Transcripts: Full React/TypeScript Admin SPA to inspect visitor conversation logs, transcript summaries, and email notification alerts.',
    technologies: ['Wordpress Plugins', 'PHP', 'AI Integration', 'REST API', 'RAG Knowledge Base'],
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
    const includeInactive = searchParams.get('includeInactive') === 'true' && isAdminAuthenticated();

    let dbProjects: any[] = [];
    try {
      if (permalink) {
        const singleProject = await prisma.project.findUnique({
          where: { permalink },
        });
        if (singleProject) {
          if (!includeInactive && (singleProject as any).active === false) {
            return NextResponse.json({ success: false, message: 'Project not found' }, { status: 404 });
          }
          return NextResponse.json({ success: true, project: singleProject, projects: [singleProject] });
        }
      } else {
        const whereClause: any = {};
        if (featuredOnly) whereClause.featured = true;
        if (!includeInactive) whereClause.active = true;

        dbProjects = await prisma.project.findMany({
          where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
          orderBy: { createdAt: 'desc' },
        });
      }
    } catch (e) {
      console.warn('NeonDB query warning, serving fallback projects dataset.');
    }

    let projectsToReturn = dbProjects.length > 0 ? dbProjects : FALLBACK_PROJECTS;

    if (!includeInactive) {
      projectsToReturn = projectsToReturn.filter((p: any) => p.active !== false);
    }

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

function cleanImg(img?: string | null) {
  if (!img) return null;
  let cleaned = img.trim();
  if (cleaned.startsWith('//')) {
    cleaned = '/' + cleaned.replace(/^\/+/, '');
  }
  return cleaned;
}

export async function POST(request: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { sitename, permalink, url, image, mobileImage, fullDesktopImage, fullMobileImage, screenshots, description, technologies, featured, spotlight, active } = body;

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
        image: cleanImg(image) || 'placeholder-portfolio.jpg',
        mobileImage: cleanImg(mobileImage),
        fullDesktopImage: cleanImg(fullDesktopImage),
        fullMobileImage: cleanImg(fullMobileImage),
        screenshots: Array.isArray(screenshots) ? screenshots.map((s: string) => cleanImg(s)).filter((s): s is string => Boolean(s)) : [],
        description: description || '',
        technologies: techArray,
        featured: Boolean(featured),
        spotlight: isSpotlight,
        active: active !== undefined ? Boolean(active) : true,
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
    const { id, sitename, permalink, url, image, mobileImage, fullDesktopImage, fullMobileImage, screenshots, description, technologies, featured, spotlight, active } = body;

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

    // If only toggling active status or updating specific fields
    const updateData: any = {};
    if (sitename !== undefined) updateData.sitename = sitename;
    if (permalink !== undefined) updateData.permalink = permalink;
    if (url !== undefined) updateData.url = url || '';
    if (image !== undefined) updateData.image = cleanImg(image) || 'placeholder-portfolio.jpg';
    if (mobileImage !== undefined) updateData.mobileImage = cleanImg(mobileImage);
    if (fullDesktopImage !== undefined) updateData.fullDesktopImage = cleanImg(fullDesktopImage);
    if (fullMobileImage !== undefined) updateData.fullMobileImage = cleanImg(fullMobileImage);
    if (screenshots !== undefined) {
      updateData.screenshots = Array.isArray(screenshots)
        ? screenshots.map((s: string) => cleanImg(s)).filter((s): s is string => Boolean(s))
        : [];
    }
    if (description !== undefined) updateData.description = description || '';
    if (technologies !== undefined) updateData.technologies = techArray;
    if (featured !== undefined) updateData.featured = Boolean(featured);
    if (spotlight !== undefined) updateData.spotlight = isSpotlight;
    if (active !== undefined) updateData.active = Boolean(active);

    const updatedProject = await prisma.project.update({
      where: { id: Number(id) },
      data: updateData,
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
