import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/auth';
import { INITIAL_BLOG_POSTS } from '@/lib/initial-blog-data';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search')?.toLowerCase();
    const featuredOnly = searchParams.get('featured') === 'true';
    const includeDrafts = searchParams.get('includeDrafts') === 'true';

    let dbPosts: any[] = [];
    try {
      const totalCount = await (prisma as any).blogPost.count();
      
      // Auto-seed NeonDB database on deployment if table is empty
      if (totalCount === 0) {
        console.log('[AUTO-SEED] Seeding enhanced initial blog articles into NeonDB database...');
        for (const postData of INITIAL_BLOG_POSTS) {
          try {
            await (prisma as any).blogPost.upsert({
              where: { slug: postData.slug },
              create: {
                title: postData.title,
                slug: postData.slug,
                excerpt: postData.excerpt,
                content: postData.content,
                coverImage: postData.coverImage,
                category: postData.category,
                tags: postData.tags,
                author: postData.author,
                readingTime: postData.readingTime,
                featured: postData.featured,
                published: postData.published,
                publishedAt: new Date(postData.publishedAt),
              },
              update: {
                title: postData.title,
                excerpt: postData.excerpt,
                content: postData.content,
                category: postData.category,
                tags: postData.tags,
                readingTime: postData.readingTime,
                featured: postData.featured,
              },
            });
          } catch (e) {
            console.warn(`[AUTO-SEED] Error seeding article ${postData.slug}:`, e);
          }
        }
      }

      const whereClause: any = {};
      if (!includeDrafts) whereClause.published = true;
      if (featuredOnly) whereClause.featured = true;
      if (category && category !== 'All') whereClause.category = category;

      dbPosts = await (prisma as any).blogPost.findMany({
        where: whereClause,
        orderBy: { publishedAt: 'desc' },
      });
    } catch (e) {
      console.warn('[GET /api/blog] Database fetch fallback to initial blog posts.');
    }

    let posts = dbPosts.length > 0 ? dbPosts : INITIAL_BLOG_POSTS;

    if (!includeDrafts) {
      posts = posts.filter((p) => p.published !== false);
    }
    if (featuredOnly) {
      posts = posts.filter((p) => p.featured === true);
    }
    if (category && category !== 'All') {
      posts = posts.filter((p) => p.category?.toLowerCase() === category.toLowerCase());
    }
    if (tag) {
      posts = posts.filter((p) => p.tags?.some((t: string) => t.toLowerCase() === tag.toLowerCase()));
    }
    if (search) {
      posts = posts.filter(
        (p) =>
          p.title?.toLowerCase().includes(search) ||
          p.excerpt?.toLowerCase().includes(search) ||
          p.content?.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({
      success: true,
      posts,
      total: posts.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch blog posts', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const auth = await isAdminAuthenticated();
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, slug, excerpt, content, coverImage, category, tags, author, readingTime, featured, published } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { success: false, message: 'Title, slug, and content are required' },
        { status: 400 }
      );
    }

    const cleanSlug = slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newPost = await (prisma as any).blogPost.create({
      data: {
        title,
        slug: cleanSlug,
        excerpt: excerpt || '',
        content,
        coverImage: coverImage || '',
        category: category || 'Engineering Architecture',
        tags: Array.isArray(tags) ? tags : [],
        author: author || 'Rowell Mark Blanca',
        readingTime: readingTime || '5 min read',
        featured: Boolean(featured),
        published: published !== false,
        publishedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, post: newPost });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to create blog post', error: error.message },
      { status: 500 }
    );
  }
}
