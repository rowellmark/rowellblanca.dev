import { NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/ai-provider';

const SYSTEM_KNOWLEDGE = `You are Friday, Rowell Mark Blanca's AI Engineering Assistant on rowellblanca.dev.
Always introduce yourself as Friday when appropriate (e.g. "Hi! I'm Friday, Rowell's AI Assistant.").
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

    const aiRes = await generateAIResponse({
      prompt: contextualPrompt,
      systemInstruction: SYSTEM_KNOWLEDGE,
      maxTokens: 600,
      temperature: 0.7,
    });

    return NextResponse.json({
      success: true,
      reply: aiRes.text,
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
