import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/auth';
import { INITIAL_BLOG_POSTS } from '@/lib/initial-blog-data';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;

    let post: any = null;
    let dbPosts: any[] = [];

    try {
      post = await (prisma as any).blogPost.findUnique({
        where: { slug },
      });
      dbPosts = await (prisma as any).blogPost.findMany({
        where: { published: true },
        take: 6,
      });
    } catch (e) {
      console.warn('[GET /api/blog/[slug]] DB lookup fallback to INITIAL_BLOG_POSTS');
    }

    if (!post) {
      post = INITIAL_BLOG_POSTS.find((p) => p.slug === slug);
    }

    if (!post) {
      return NextResponse.json({ success: false, message: 'Article not found' }, { status: 404 });
    }

    const allPosts = dbPosts.length > 0 ? dbPosts : INITIAL_BLOG_POSTS;
    const relatedPosts = allPosts.filter((p) => p.slug !== slug).slice(0, 3);

    return NextResponse.json({
      success: true,
      post,
      relatedPosts,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Error fetching blog article', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const auth = await isAdminAuthenticated();
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const targetSlug = params.slug;
    const body = await request.json();
    const { title, slug, excerpt, content, coverImage, category, tags, author, readingTime, featured, published } = body;

    const existing = await (prisma as any).blogPost.findUnique({
      where: { slug: targetSlug },
    });

    if (!existing) {
      return NextResponse.json({ success: false, message: 'Article not found' }, { status: 404 });
    }

    const updatedPost = await (prisma as any).blogPost.update({
      where: { id: existing.id },
      data: {
        title: title || existing.title,
        slug: slug ? slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : existing.slug,
        excerpt: excerpt !== undefined ? excerpt : existing.excerpt,
        content: content || existing.content,
        coverImage: coverImage !== undefined ? coverImage : existing.coverImage,
        category: category || existing.category,
        tags: Array.isArray(tags) ? tags : existing.tags,
        author: author || existing.author,
        readingTime: readingTime || existing.readingTime,
        featured: featured !== undefined ? Boolean(featured) : existing.featured,
        published: published !== undefined ? Boolean(published) : existing.published,
      },
    });

    return NextResponse.json({ success: true, post: updatedPost });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to update article', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const auth = await isAdminAuthenticated();
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const targetSlug = params.slug;
    const existing = await (prisma as any).blogPost.findUnique({
      where: { slug: targetSlug },
    });

    if (!existing) {
      return NextResponse.json({ success: false, message: 'Article not found' }, { status: 404 });
    }

    await (prisma as any).blogPost.delete({
      where: { id: existing.id },
    });

    return NextResponse.json({ success: true, message: 'Article deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to delete article', error: error.message },
      { status: 500 }
    );
  }
}
