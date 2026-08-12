import { NextResponse } from 'next/server';
import { generateAIResponse, getAISettings } from '@/lib/ai-provider';
import { prisma } from '@/lib/prisma';

const SYSTEM_KNOWLEDGE = `You are RowBot — Rowell Mark Blanca's AI Engineering & Strategic Marketing Co-Pilot on rowellblanca.dev.
You act as a world-class Senior Software Architect and Technical Marketing Strategist representing Rowell Mark Blanca (Senior Full-Stack Engineer & Web Architect with 8+ years experience).

CORE IDENTITY & DUAL EXPERTISE:
1. SENIOR SOFTWARE ARCHITECT:
   - Deep expertise in React 19, Next.js 14 (App Router, Server Components, Streaming, ISR/SSG), TypeScript, Node.js, Prisma ORM, NeonDB PostgreSQL, and Tailwind CSS.
   - Bespoke WordPress Architecture: Custom PHP 8.2+ OOP (PSR-4), hand-coded Gutenberg block libraries (zero page-builder bloat like Elementor/WPBakery), SchemaGraphAssembler JSON-LD SEO engines, custom REST API endpoints, and WP security hardening.
   - AI & LLM Systems: RAG (Retrieval-Augmented Generation) pipelines, multi-provider routing (Gemini 2.5, OpenAI GPT-4o, Claude 3.5, local Ollama), vector knowledge embeddings, and human-in-the-loop lead nurturing workflows.
   - Core Web Vitals Optimization: Sub-second Largest Contentful Paint (LCP < 1.2s), zero cumulative layout shift (CLS), INP < 100ms, and Lighthouse 95+ mobile scores.

2. TECHNICAL MARKETING & BUSINESS STRATEGIST:
   - CRO (Conversion Rate Optimization): Explains how performance engineering (sub-second load speeds, frictionless UX, dynamic CTAs) directly increases lead conversion rates and sales pipeline yield.
   - Technical SEO & Authority: Dynamic JSON-LD structured data graphs, OpenGraph cards, semantic HTML5, and automated sitemap indexing to rank top on Google & Bing.
   - Value & ROI positioning: Explains why partnering directly with a Senior Engineer saves 40-50% compared to traditional UK/US agency pricing while delivering higher code quality, faster iteration cycles, and zero middle-management overhead.
   - Real-World Case Studies:
     * MacManus Asset Finance Portal (UK): FCA-regulated commercial finance portal, multi-step lead CRM pipeline, funder directory, and automated document routing.
     * Tower Fire UK: Custom zero-bloat Gutenberg theme replacing bloated Elementor page builder, cutting page load time by 75% and driving 35% more inbound inquiries.
     * BuildForUser SaaS & WP Plugins: Automated platform management, native CRM Kanban pipelines, and RAG chatbot plugins.

CONVERSATIONAL GUIDELINES & STYLE:
- Professional, Natural & Conversational: Speak with warmth, clarity, and authority like a friendly Senior Architect on Slack. Keep the dialogue light and engaging — NEVER push for heavy form filling or aggressive sales pitches.
- Smooth Flow: Give direct, articulate engineering and marketing answers first. Build genuine trust.
- Simple Follow-ups: At the end of answers, ask a simple open-ended question (e.g. "What kind of project are you planning?", "Have you picked a tech stack yet?").
- Non-Aggressive Conversion: Inform the visitor they can casually drop their email in the chat or exit prompt whenever they'd like Rowell to send over a custom estimate or case study.
- Timezone & Global Reach: Rowell operates from the Philippines (UTC+8) with full overlapping working hours for UK (GMT/BST London), US (EST/PST), and Australian enterprise clients.`;

const LEAD_INTENT_KEYWORDS = [
  'price', 'pricing', 'cost', 'rate', 'budget', 'quote', 'how much',
  'hire', 'available', 'availability', 'retainer', 'contract', 'freelance',
  'project', 'build', 'estimate', 'proposal', 'scope', 'timeline', 'book', 'call',
  'seo', 'marketing', 'conversion', 'speed', 'performance'
];

function checkLeadIntent(text: string): boolean {
  const lower = text.toLowerCase();
  return LEAD_INTENT_KEYWORDS.some((kw) => lower.includes(kw));
}

const FALLBACK_INTENTS: { keywords: string[]; reply: string }[] = [
  {
    keywords: ['price', 'pricing', 'cost', 'rate', 'budget', 'quote', 'how much'],
    reply: `Rowell delivers enterprise-grade software architecture at direct senior developer rates — saving clients 40–50% compared to traditional UK/US agency pricing while eliminating middle-management bloat.

Projects are scoped transparently based on deliverables:
• **Custom React/Next.js Web Apps & Portals**: High-performance, scalable platforms with serverless DBs & AI integrations.
• **Bespoke WordPress & Gutenberg Plugins**: Clean, hand-coded PHP 8+ themes with Lighthouse 95+ performance scores.
• **Developer Retainers**: Flexible ongoing engineering & conversion optimization support.

What is the main scope or deadline for your project? I can help calculate a custom estimate!`,
  },
  {
    keywords: ['hire', 'available', 'availability', 'retainer', 'contract', 'freelance'],
    reply: `Rowell is currently accepting select custom web builds, Next.js/React engineering projects, and monthly developer retainers.

Why clients partner with Rowell:
• **Full UK (GMT/BST) & US (EST/PST) Overlap**: Real-time communication via Slack/Teams.
• **Full-Stack Execution**: End-to-end delivery from database schema & API design to polished UI & conversion optimization.
• **Enterprise Quality**: Proven track record with FCA-regulated UK financial institutions & enterprise web builds.

Are you looking for a full build from scratch or ongoing senior developer support?`,
  },
  {
    keywords: ['stack', 'tech', 'technology', 'react', 'next.js', 'nextjs', 'wordpress', 'php', 'node', 'typescript', 'skill'],
    reply: `Rowell's engineering stack combines cutting-edge frontend frameworks with robust backend systems:

• **Frontend & App Router**: Next.js 14, React 19, TypeScript, Tailwind CSS, Framer Motion, Three.js / WebGL.
• **WordPress Architecture**: Custom PHP 8.2+ OOP, hand-coded Gutenberg blocks, ACF Pro, Yoast SchemaGraphAssembler engines (zero page-builder bloat).
• **Backend & Databases**: Node.js, Prisma ORM, NeonDB Serverless PostgreSQL, REST & GraphQL APIs.
• **AI Integrations**: RAG chatbots, vector embeddings, Gemini 2.5 Flash, OpenAI GPT-4o, Claude 3.5, local Ollama.

What stack are you currently using or evaluating for your project?`,
  },
  {
    keywords: ['seo', 'marketing', 'conversion', 'cro', 'performance', 'lighthouse', 'speed'],
    reply: `Performance IS marketing! Rowell engineers platforms built specifically to maximize Google rankings and lead conversion rates:

• **Sub-Second Core Web Vitals**: LCP < 1.2s & CLS 0 — cutting bounce rates and boosting lead conversions by 20–30%.
• **Automated Structured Data**: Custom JSON-LD schema graphs so Google displays rich search snippets.
• **Clean Code Architecture**: Zero third-party page-builder bloat, yielding 95+ mobile Lighthouse scores.

Are you looking to improve an existing site's page speed & SEO, or build a new high-converting platform?`,
  },
  {
    keywords: ['timezone', 'time zone', 'location', 'based', 'where', 'philippines', 'overlap', 'uk', 'london', 'us'],
    reply: `Rowell is based in the Philippines (PST, UTC+8) and maintains dedicated overlapping working hours for **UK (GMT/BST London time)**, **US (EST/PST)**, and **Australian** enterprise clients.

This allows real-time daily syncs, rapid pull request reviews, and seamless team integration. What timezone is your team operating in?`,
  },
];

async function getInteractiveFallbackReply(question: string): Promise<string> {
  const lower = question.toLowerCase();
  for (const intent of FALLBACK_INTENTS) {
    if (intent.keywords.some((kw) => lower.includes(kw))) {
      return intent.reply;
    }
  }
  return `Hey there! I'm RowBot, Rowell's AI Co-Pilot & Senior Engineering Strategist. I can answer questions about Rowell's work, technical stack, conversion rate optimization, or help calculate a custom project estimate. What platform are you planning to build?`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, messages, context, sessionId } = body;

    let userQuestion = message;
    let historyContext = '';

    if (Array.isArray(messages) && messages.length > 0) {
      userQuestion = messages[messages.length - 1]?.content || messages[messages.length - 1]?.text || message;
      // Build conversation history for natural multi-turn context
      historyContext = messages
        .map((m: any) => `${m.role === 'user' ? 'Visitor' : 'RowBot'}: ${m.content || m.text}`)
        .join('\n');
    }

    if (!userQuestion) userQuestion = 'Hello';

    const isLeadIntent = checkLeadIntent(userQuestion);

    let fullPrompt = `Full Conversation History:\n${historyContext || `Visitor: "${userQuestion}"`}\n\nLatest Visitor Message: "${userQuestion}"\nRespond naturally and conversationally as RowBot.`;

    if (context && typeof context === 'object') {
      fullPrompt = `Page Context: Title: ${context.title || 'N/A'}, Tech: ${Array.isArray(context.technologies) ? context.technologies.join(', ') : 'N/A'}
${fullPrompt}`;
    }

    const aiConfig = await getAISettings();

    let reply = '';
    let provider = 'gemini';
    let model = 'gemini-1.5-flash';

    if (aiConfig.noAiMode) {
      reply = await getInteractiveFallbackReply(userQuestion);
      provider = 'content-only';
      model = 'static';
    } else {
      const aiRes = await generateAIResponse({
        prompt: fullPrompt,
        systemInstruction: SYSTEM_KNOWLEDGE,
        maxTokens: 650,
        temperature: 0.75, // Slightly higher temperature for warmer, conversational dialogue
      });

      reply = aiRes.provider === 'fallback' ? await getInteractiveFallbackReply(userQuestion) : aiRes.text;
      provider = aiRes.provider;
      model = aiRes.model;
    }

    // ── Real-time Visitor Session Lead Auto-Logger ──────────────────────
    if (sessionId) {
      try {
        await prisma.contactMessage.create({
          data: {
            sessionId,
            name: 'Anonymous Chat Visitor',
            email: `session_${sessionId.slice(-8)}@visitor.local`,
            subject: `[RowBot Conversation] ${userQuestion.slice(0, 40)}...`,
            message: `Visitor: "${userQuestion}"\n\nRowBot Reply: "${reply}"`,
            status: 'UNREAD',
          },
        });
      } catch (logErr) {}
    }

    return NextResponse.json({
      success: true,
      reply,
      isLeadIntent,
      provider,
      model,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: true,
      reply: `Hey! I'm RowBot, Rowell's AI Co-Pilot. Leave your email or project ideas below and Rowell will connect with you!`,
      isLeadIntent: true,
      provider: 'fallback',
      model: 'static',
    });
  }
}
