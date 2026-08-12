import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/auth';
import { FALLBACK_PROJECTS } from '@/lib/fallback-projects';

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

    const target = searchParams.get('target');
    const type = searchParams.get('type'); // 'website' | 'plugin'

    let projectsToReturn = dbProjects.length > 0 ? dbProjects : FALLBACK_PROJECTS;

    if (!includeInactive) {
      projectsToReturn = projectsToReturn.filter((p: any) => p.active !== false);
    }

    if (target === 'uk-react') {
      projectsToReturn = projectsToReturn.filter((p: any) =>
        (p.technologies && p.technologies.includes('target:uk-react')) ||
        p.permalink?.includes('macmanus-portal') ||
        p.sitename?.toLowerCase().includes('macmanus asset finance portal') ||
        (p.technologies && p.technologies.some((t: string) => t.toLowerCase().includes('react')))
      );
    } else if (target === 'uk-wordpress') {
      projectsToReturn = projectsToReturn.filter((p: any) =>
        (p.technologies && p.technologies.includes('target:uk-wordpress')) ||
        p.permalink?.includes('tower-fire') ||
        p.permalink?.includes('macmanus') ||
        p.sitename?.toLowerCase().includes('tower fire') ||
        p.sitename?.toLowerCase().includes('macmanus') ||
        (p.technologies && p.technologies.some((t: string) => t.toLowerCase().includes('wordpress')))
      );
    } else if (category && category !== 'All') {
      const lowerCat = category.toLowerCase();
      projectsToReturn = projectsToReturn.filter((p) => {
        return p.technologies && p.technologies.some((t: string) => t.toLowerCase() === lowerCat || t.toLowerCase().includes(lowerCat));
      });
    }

    if (type === 'website') {
      projectsToReturn = projectsToReturn.filter((p: any) => {
        const isPlugin =
          p.url?.startsWith('wp-content') ||
          p.permalink?.includes('plugin') ||
          p.technologies?.some((t: string) => t.toLowerCase() === 'wordpress plugins');
        return !isPlugin;
      });
    } else if (type === 'plugin') {
      projectsToReturn = projectsToReturn.filter((p: any) => {
        const isPlugin =
          p.url?.startsWith('wp-content') ||
          p.permalink?.includes('plugin') ||
          p.technologies?.some((t: string) => t.toLowerCase() === 'wordpress plugins');
        return isPlugin;
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
    const {
      sitename,
      permalink,
      url,
      image,
      mobileImage,
      fullDesktopImage,
      fullMobileImage,
      screenshots,
      description,
      content,
      client,
      role,
      duration,
      category,
      challenge,
      solution,
      results,
      technologies,
      featured,
      spotlight,
      active,
    } = body;

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
        content: content || '',
        client: client || '',
        role: role || '',
        duration: duration || '',
        category: category || '',
        challenge: challenge || '',
        solution: solution || '',
        results: results || '',
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
    const {
      id,
      sitename,
      permalink,
      url,
      image,
      mobileImage,
      fullDesktopImage,
      fullMobileImage,
      screenshots,
      description,
      content,
      client,
      role,
      duration,
      category,
      challenge,
      solution,
      results,
      technologies,
      featured,
      spotlight,
      active,
    } = body;

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
    if (content !== undefined) updateData.content = content || '';
    if (client !== undefined) updateData.client = client || '';
    if (role !== undefined) updateData.role = role || '';
    if (duration !== undefined) updateData.duration = duration || '';
    if (category !== undefined) updateData.category = category || '';
    if (challenge !== undefined) updateData.challenge = challenge || '';
    if (solution !== undefined) updateData.solution = solution || '';
    if (results !== undefined) updateData.results = results || '';
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
