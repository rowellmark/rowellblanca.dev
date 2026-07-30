import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { generateAIResponse } from '@/lib/ai-provider';

export async function POST(request: Request) {
  try {
    const auth = await isAdminAuthenticated();
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { prompt, topic, keywords, action, provider } = await request.json();

    const systemInstruction = `You are a Senior Full-Stack Software Engineer & Tech Blogger writing for Rowell Mark Blanca's portfolio (rowellblanca.dev).
Rowell specializes in React, Next.js 14 App Router, TypeScript, Node.js, Custom WordPress Themes/Plugins, Headless CMS, and AI Integrations for UK and global companies.

Task: Generate a high-quality, engaging technical blog post based on the given topic and keywords.

Return ONLY a raw JSON object (no markdown code fences) with the exact keys:
{
  "title": "Catchy professional technical title",
  "slug": "url-friendly-kebab-case-slug",
  "excerpt": "Compelling 2-sentence summary of the post",
  "content": "Full markdown formatted article body with headings (###), bullet points, and code snippets where relevant",
  "category": "Gaming | WordPress | React & Next.js | Engineering Architecture | Case Studies | AI Engineering | Frontend Performance",
  "tags": ["Tag1", "Tag2", "Tag3"],
  "readingTime": "5 min read"
}`;

    const userPrompt = `Topic: "${topic || prompt || 'Next.js 14 vs WordPress for UK Enterprises'}"
Keywords: "${keywords || 'React, Next.js, WordPress, UK Tech, Architecture'}"
Action: ${action || 'generate_full_post'}`;

    const aiRes = await generateAIResponse({
      prompt: userPrompt,
      systemInstruction,
      temperature: 0.7,
      maxTokens: 1500,
      overrideProvider: provider,
    });

    let aiOutput = null;
    try {
      const cleanJson = aiRes.text.replace(/```json/g, '').replace(/```/g, '').trim();
      aiOutput = JSON.parse(cleanJson);
    } catch (e) {
      aiOutput = {
        title: `Building Scalable Platforms with ${topic || 'React & Next.js'}`,
        slug: (topic || 'scalable-platforms-react').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        excerpt: `A deep dive into high-performance web development and clean architecture.`,
        content: aiRes.text || `### Scalable Software Architecture\n\nBuilding enterprise solutions requires robust frameworks, type safety, and efficient deployment pipelines.`,
        category: 'Engineering Architecture',
        tags: ['React', 'Next.js', 'Engineering'],
        readingTime: '5 min read',
      };
    }

    return NextResponse.json({ success: true, generated: aiOutput, provider: aiRes.provider, model: aiRes.model });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'AI Blog Assistant failed', error: error.message },
      { status: 500 }
    );
  }
}
