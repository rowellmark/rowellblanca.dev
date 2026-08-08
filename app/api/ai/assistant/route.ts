import { NextResponse } from 'next/server';
import { generateAIResponse, getAISettings } from '@/lib/ai-provider';
import { prisma } from '@/lib/prisma';

const SYSTEM_KNOWLEDGE = `You are Rowell's AI Assistant, Rowell Mark Blanca's AI Engineering Assistant on rowellblanca.dev.
Always introduce yourself as Rowell's AI Assistant when appropriate (e.g. "Hi! I'm Rowell's AI Assistant.").
Your role is to answer questions from potential clients, agencies, and hiring managers with professional, concise, and technical responses.

Key Facts About Rowell Mark Blanca:
- Role: Senior Full-Stack Software Engineer & Web Architect with 8+ years of production experience.
- Specialization: React, Next.js 14 (App Router, Server Components), TypeScript, Node.js, Custom WordPress Themes/Plugins (ACF Pro, Gutenberg, PHP), Headless CMS, and AI/LLM Workflow Integrations.
- Timezone & Location: Based in the Philippines (PST - Philippine Standard Time, UTC+8 / GMT+8). Provides full afternoon & evening overlap with UK business hours (GMT/BST London time), US EST/PST, and Australia (AEST).
- Rates & Quality: Cost-effective senior engineering rates with enterprise-grade code quality — eliminating traditional agency overhead.
- Featured Technical Blog & Articles:
  Rowell publishes technical articles at /blog covering Next.js vs Custom WordPress, FCA-regulated FinTech portals, and custom RAG AI plugin engineering.
- Featured UK Client Work:
  1. Macmanus Asset Finance Portal (UK 🇬🇧): Enterprise asset finance broker & client portal handling automated lead pipelines, status tracking, and finance applications.
  2. Tower Fire UK (UK 🇬🇧): Bespoke WordPress Gutenberg block engine built for zero bloat, high security, and Lighthouse 95+ speed performance.
  3. Juliette Hohnen Real Estate: High-converting luxury real estate portal showcasing Beverly Hills properties.
- Availability: Open for custom web application builds, Next.js/WordPress projects, and ongoing developer retainer engagements.

Guidelines:
1. Keep answers concise (2-4 sentences max), friendly, and structured with bullet points where helpful.
2. If asked about pricing or booking a project, encourage them to click the "Book Discovery Call" or "Get in Touch" button on the page.
3. Be professional, technical when needed, but clear and accessible.`;

const FALLBACK_INTENTS: { keywords: string[]; reply: string }[] = [
  {
    keywords: ['price', 'pricing', 'cost', 'rate', 'budget', 'quote', 'how much'],
    reply: `Rowell offers cost-effective senior engineering rates with enterprise-grade code quality — no agency overhead. Exact pricing depends on project scope, so the fastest way to get a number is to click "Book Discovery Call" or "Get in Touch" on this page.`,
  },
  {
    keywords: ['hire', 'available', 'availability', 'retainer', 'contract', 'freelance'],
    reply: `Rowell is currently open for custom web application builds, Next.js/WordPress projects, and ongoing developer retainer engagements. Use the "Book Discovery Call" or "Get in Touch" button to check current availability.`,
  },
  {
    keywords: ['stack', 'tech', 'technology', 'react', 'next.js', 'nextjs', 'wordpress', 'php', 'node', 'typescript', 'skill'],
    reply: `Rowell specializes in React, Next.js 14 (App Router, Server Components), TypeScript, Node.js, and custom WordPress theme/plugin development (ACF Pro, Gutenberg, PHP), plus headless CMS and AI/LLM workflow integrations.`,
  },
  {
    keywords: ['timezone', 'time zone', 'location', 'based', 'where', 'philippines', 'overlap'],
    reply: `Rowell is based in the Philippines (PST, UTC+8) and provides full afternoon/evening overlap with UK business hours (GMT/BST), US EST/PST, and Australia (AEST).`,
  },
  {
    keywords: ['project', 'portfolio', 'work', 'case stud', 'client', 'built', 'macmanus', 'tower fire', 'juliette'],
    reply: `Featured UK client work includes the MacManus Asset Finance Portal (lead pipelines, application tracking), Tower Fire UK (a bespoke Gutenberg block engine), and a luxury real estate platform for Juliette Hohnen. See more under "My Work" on this site.`,
  },
  {
    keywords: ['blog', 'article', 'write', 'writing'],
    reply: `Rowell publishes technical articles at /blog covering Next.js vs Custom WordPress, FCA-regulated FinTech portals, and custom RAG AI plugin engineering.`,
  },
  {
    keywords: ['contact', 'email', 'reach', 'talk', 'call', 'book', 'discovery'],
    reply: `You can reach Rowell directly by clicking "Book Discovery Call" or "Get in Touch" on this page — both go straight to his inbox.`,
  },
];

const PROJECT_KEYWORDS = ['project', 'portfolio', 'work', 'case stud', 'client', 'built', 'macmanus', 'tower fire', 'juliette'];

async function getInteractiveFallbackReply(question: string): Promise<string> {
  const lower = question.toLowerCase();

  if (PROJECT_KEYWORDS.some((kw) => lower.includes(kw))) {
    try {
      const projects = await prisma.project.findMany({
        where: { featured: true, active: true },
        orderBy: { createdAt: 'desc' },
        take: 4,
      });
      if (projects.length > 0) {
        const list = projects.map((p: any) => p.sitename).join(', ');
        return `Recent featured work includes: ${list}. See more under "My Work" on this site.`;
      }
    } catch (e) {
      // DB unavailable — fall through to the static list below
    }
  }

  for (const intent of FALLBACK_INTENTS) {
    if (intent.keywords.some((kw) => lower.includes(kw))) {
      return intent.reply;
    }
  }
  return `Hi! I'm Rowell's AI Assistant. Rowell Mark Blanca is a Senior Full-Stack Engineer & Architect specializing in React, Next.js, and Custom WordPress. Ask me about his tech stack, availability, or past projects — or click "Book Discovery Call" to reach him directly.`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, messages, context } = body;

    let userQuestion = message;
    if (!userQuestion && Array.isArray(messages) && messages.length > 0) {
      userQuestion = messages[messages.length - 1]?.content || messages[messages.length - 1]?.text;
    }

    if (!userQuestion) {
      userQuestion = 'Hello';
    }

    let contextualPrompt = `Question: "${userQuestion}"`;
    if (context && typeof context === 'object') {
      contextualPrompt = `Project Context:
- Title: ${context.title || 'N/A'}
- Category: ${context.category || 'N/A'}
- Tech Stack: ${Array.isArray(context.technologies) ? context.technologies.join(', ') : 'N/A'}
- Description: ${context.description || ''}
- Challenge: ${context.challenge || ''}
- Solution: ${context.solution || ''}
- Results: ${context.results || ''}

User Question: "${userQuestion}"`;
    }

    const aiConfig = await getAISettings();

    if (aiConfig.noAiMode) {
      const reply = await getInteractiveFallbackReply(userQuestion);
      return NextResponse.json({
        success: true,
        reply,
        provider: 'content-only',
        model: 'static',
      });
    }

    const aiRes = await generateAIResponse({
      prompt: contextualPrompt,
      systemInstruction: SYSTEM_KNOWLEDGE,
      maxTokens: 600,
      temperature: 0.7,
    });

    const reply = aiRes.provider === 'fallback' ? await getInteractiveFallbackReply(userQuestion) : aiRes.text;

    return NextResponse.json({
      success: true,
      reply,
      provider: aiRes.provider,
      model: aiRes.model,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: true,
      reply: `Hello! Rowell Mark Blanca is a Senior Software Engineer specializing in React, Next.js, and Custom WordPress. Feel free to use the contact form to discuss your project!`,
      provider: 'fallback',
      model: 'static',
    });
  }
}
