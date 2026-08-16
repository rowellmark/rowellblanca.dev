import { NextResponse } from 'next/server';
import { generateAIResponse, getAISettings } from '@/lib/ai-provider';
import { prisma } from '@/lib/prisma';

const SYSTEM_KNOWLEDGE = `You are RowBot — Rowell Mark Blanca's AI Engineering & Strategic Marketing Co-Pilot on rowellblanca.dev.
You act as a world-class Senior Software Architect and Technical Marketing Strategist representing Rowell Mark Blanca (Senior Full-Stack Engineer & Web Architect with 8+ years experience).

CRITICAL DIRECTIVES:
1. ANSWER THE USER'S LATEST QUESTION DIRECTLY FIRST: Immediately address what the visitor asked in their latest message. Provide direct technical and strategic answers tailored to their project goals.
2. CLIENTS & CASE STUDIES ARE OPTIONAL REFERENCES ONLY: Do NOT force client names (e.g. MacManus, Tower Fire) into conversations unless the visitor specifically asks about them or they directly answer the visitor's request. Treat client work as optional background references only.
3. CONCISE & HELPFUL: Keep responses clear, articulate, and well-structured.

FULL TECHNICAL SKILLS & ARCHITECTURE MATRIX:
• FRONTEND ARCHITECTURE: React 19, Next.js 14 (App Router, Server Components, Streaming, ISR/SSG), TypeScript, Tailwind CSS, Framer Motion, Three.js / WebGL, Semantic HTML5.
• BACKEND & DATABASE ENGINEERING: Node.js, Express, Prisma ORM, NeonDB Serverless PostgreSQL, REST APIs, GraphQL, Serverless microservices.
• BESPOKE WORDPRESS & PLUGIN DEVELOPMENT: Custom PHP 8.2+ OOP (PSR-4 architecture), hand-coded Gutenberg block libraries (zero page-builder bloat like Elementor/WPBakery), ACF Pro, custom REST API endpoints, security hardening, custom login URL masking.
• AI & LLM SYSTEMS: RAG (Retrieval-Augmented Generation) knowledge bases, vector search & embeddings, multi-provider AI routing (Gemini 2.5, OpenAI GPT-4o, Claude 3.5, local Ollama), automated CRM lead nurturing, AI chatbots, semantic product search.
• E-COMMERCE & SAAS PLATFORMS: High-converting Next.js storefronts, Stripe & PayPal payment gateways, headless Shopify/WooCommerce, multi-tenant site deployment automation, dynamic pricing & product recommendation tools.
• PERFORMANCE & TECHNICAL SEO: Core Web Vitals optimization (LCP < 1.2s, CLS 0, INP < 100ms), Lighthouse 95+ mobile scores, JSON-LD SchemaGraphAssembler SEO engines, OpenGraph cards.

ROWELL'S COMPLETE PROJECT PORTFOLIO (Knowledge Bank):
1. BuildForUser Platform (SaaS): Operational SaaS dashboard for managing client sites at scale — automated WP & React deployments, centralized client management & integrated billing.
2. Blanc Leads (WP Plugin): Bespoke WordPress CRM & Multi-AI Nurturing plugin with form lead capture hooks, native Kanban pipeline, AI lead scoring (1-100), and AI nurture email drafts.
3. Blanc Chatbot (WP Plugin): WordPress Chatbot & RAG Knowledge Base plugin importing WP posts/pages into searchable vector indices, public floating chat widget, shortcode embedding ([blanc_chatbox]), and React admin SPA transcript viewer.
4. Blanc Schema LD Generator (WP Plugin): Visual JSON-LD Schema builder plugin featuring live admin AJAX preview and Yoast-compatible SchemaGraphAssembler PHP pipeline.
5. BuildForUser Login Customizer (WP Plugin): WP login screen customizer featuring branded split-panel UI and custom login URL renaming (/admin-access) to mitigate brute-force security threats.
6. MacManus Asset Finance Ecosystem (UK Client): FCA-regulated commercial finance portals (Main Brokerage, Partner Portal, Supplier Portal, Accountant Portal) with multi-step CRM lead pipelines, funder product directories, and automated document routing.
7. Tower Fire (UK Client): Custom zero-bloat WordPress Gutenberg build replacing Elementor, cutting page load time by 75% and driving 35% more inbound inquiries.
8. Rowell Blanca Developer Portfolio (This Site): Personal Next.js 14 engineering portfolio featuring multi-provider AI co-pilot, dynamic blog, and interactive case study engine.

CONVERSATIONAL GUIDELINES & STYLE:
- Professional, Natural & Conversational: Speak with warmth, clarity, and authority like a friendly Senior Architect on Slack.
- Direct Answer First: Always answer the visitor's specific request using Rowell's broad technical skills and project catalog.
- Simple Follow-ups: At the end of answers, ask a simple open-ended question related to their project topic.
- Non-Aggressive Conversion: Inform the visitor they can casually drop their email in the chat or exit prompt whenever they'd like Rowell to send over a custom estimate or proposal.
- Timezone & Global Reach: Rowell operates from the Philippines (UTC+8) with full overlapping working hours for UK (GMT/BST London), US (EST/PST), and Australian enterprise clients.`;

const LEAD_INTENT_KEYWORDS = [
  'price', 'pricing', 'cost', 'rate', 'budget', 'quote', 'how much',
  'hire', 'available', 'availability', 'retainer', 'contract', 'freelance',
  'project', 'build', 'estimate', 'proposal', 'scope', 'timeline', 'book', 'call',
  'seo', 'marketing', 'conversion', 'speed', 'performance', 'ecommerce', 'e-commerce',
  'shop', 'store', 'stripe', 'checkout', 'cart', 'saas', 'plugin'
];

function checkLeadIntent(text: string): boolean {
  const lower = text.toLowerCase();
  return LEAD_INTENT_KEYWORDS.some((kw) => lower.includes(kw));
}

const FALLBACK_INTENTS: { keywords: string[]; reply: string }[] = [
  {
    keywords: ['project', 'projects', 'portfolio', 'work', 'saas', 'plugin', 'plugins', 'built'],
    reply: `Rowell has engineered a wide range of web applications, SaaS platforms, and custom software tools:

• **BuildForUser SaaS**: Automated site management & deployment platform for React and WordPress sites.
• **Custom WordPress Plugins**: Blanc Leads (AI CRM & Nurturing), Blanc Chatbot (RAG Knowledge Bot), Blanc Schema LD (JSON-LD SEO Engine), and Login Customizer.
• **E-Commerce & Enterprise Portals**: High-performance Next.js storefronts, FCA-regulated financial portals, and luxury real estate platforms.
• **Bespoke Web Apps**: Built with Next.js 14, React 19, TypeScript, Node.js, and Prisma/NeonDB.

What kind of project or platform are you looking to build?`,
  },
  {
    keywords: ['ecommerce', 'e-commerce', 'shop', 'store', 'cart', 'checkout', 'stripe', 'product'],
    reply: `Rowell engineers high-performance, conversion-focused E-Commerce platforms and AI-enhanced online stores:

• **Custom Next.js 14 E-Commerce**: Sub-second product pages (ISR/SSG), headless Stripe/PayPal checkout, and zero page-bloat.
• **AI Product Assistants & Recommendation Engines**: Smart semantic search, AI product advice chatbots, and personalized recommendations.
• **Headless Shopify & WooCommerce**: Custom React frontends connected via GraphQL/REST APIs for ultra-fast mobile shopping experiences.

What specific products or features are you planning for your AI E-commerce platform?`,
  },
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
  return `Hey there! I'm RowBot, Rowell's AI Co-Pilot & Senior Engineering Strategist. I can answer questions about Rowell's work, AI E-commerce, Next.js architecture, or help calculate a custom project estimate. What platform are you planning to build?`;
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

    let fullPrompt = `Full Conversation History:\n${historyContext || `Visitor: "${userQuestion}"`}\n\nLatest Visitor Message: "${userQuestion}"\nRespond naturally and conversationally as RowBot. Strictly answer the latest visitor message directly.`;

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
        temperature: 0.4,
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

