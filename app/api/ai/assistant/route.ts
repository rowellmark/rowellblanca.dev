import { NextResponse } from 'next/server';
import { generateAIResponse, getAISettings } from '@/lib/ai-provider';
import { prisma } from '@/lib/prisma';

const SYSTEM_KNOWLEDGE = `You are RowBot — Rowell Mark Blanca's AI Engineering Co-Pilot on rowellblanca.dev.
You speak naturally, warmly, and conversationally, as a direct partner to Rowell Mark Blanca (Senior Full-Stack Software Engineer & Web Architect with 8+ years experience).

Tone & Conversational Guidelines:
- Conversational & Human: Speak in a natural, friendly, and engaging voice. Use "I" when speaking on Rowell's behalf, or "we" when referring to Rowell's engineering approach.
- Don't repeat greetings if the conversation is already ongoing. Keep the flow natural like Slack or iMessage.
- Active Listening & Memory: Reference what the user said in earlier messages in the chat history.
- Ask Relevant Follow-ups: At the end of answers, ask a natural open question (e.g. "Are you building from scratch or upgrading an existing platform?", "What's your target launch timeline?").
- Technical Authority: When asked about tech, give clear real-world engineering insights (React 19, Next.js 14 App Router, TypeScript, custom WordPress Gutenberg block plugins, Prisma ORM, NeonDB).
- Conversational Conversion: Offer helpful next steps like *"If you have a Figma design or spec ready, feel free to request an estimate or leave your email!"*

Key Facts:
- Core Stack: React, Next.js 14, TypeScript, Node.js, Custom WordPress (PHP, Gutenberg, ACF Pro), Tailwind CSS, AI Integrations.
- Featured UK Clients: MacManus Asset Finance Portal (FCA-compliant finance broker) & Tower Fire UK (custom zero-bloat Gutenberg engine).
- Timezone & Location: Philippines (PST, UTC+8) with full UK (GMT/BST London time) and US (EST/PST) overlapping working hours.
- Direct Value: Senior software engineer quality without traditional agency overhead.`;

const LEAD_INTENT_KEYWORDS = [
  'price', 'pricing', 'cost', 'rate', 'budget', 'quote', 'how much',
  'hire', 'available', 'availability', 'retainer', 'contract', 'freelance',
  'project', 'build', 'estimate', 'proposal', 'scope', 'timeline', 'book', 'call'
];

function checkLeadIntent(text: string): boolean {
  const lower = text.toLowerCase();
  return LEAD_INTENT_KEYWORDS.some((kw) => lower.includes(kw));
}

const FALLBACK_INTENTS: { keywords: string[]; reply: string }[] = [
  {
    keywords: ['price', 'pricing', 'cost', 'rate', 'budget', 'quote', 'how much'],
    reply: `Rowell provides senior engineering work at direct developer rates — eliminating traditional agency overhead. Pricing depends on project complexity (e.g., custom Next.js web app vs a bespoke WordPress block plugin). What kind of project are you planning to build?`,
  },
  {
    keywords: ['hire', 'available', 'availability', 'retainer', 'contract', 'freelance'],
    reply: `Rowell is currently accepting select new custom web builds, Next.js/React projects, and developer retainers! Are you looking for a dedicated full-stack engineer for a new project or ongoing support?`,
  },
  {
    keywords: ['stack', 'tech', 'technology', 'react', 'next.js', 'nextjs', 'wordpress', 'php', 'node', 'typescript', 'skill'],
    reply: `Rowell's primary stack is Next.js 14 (App Router & Server Components), React, TypeScript, Node.js, and Tailwind CSS, along with bespoke WordPress plugin architecture (PHP 8+, Gutenberg, ACF Pro). What tech stack are you considering for your build?`,
  },
  {
    keywords: ['timezone', 'time zone', 'location', 'based', 'where', 'philippines', 'overlap'],
    reply: `Rowell is based in the Philippines (PST, UTC+8) and provides full overlapping working hours for UK (GMT/BST), US EST/PST, and Australian clients. What timezone are you based in?`,
  },
];

async function getInteractiveFallbackReply(question: string): Promise<string> {
  const lower = question.toLowerCase();
  for (const intent of FALLBACK_INTENTS) {
    if (intent.keywords.some((kw) => lower.includes(kw))) {
      return intent.reply;
    }
  }
  return `Hey there! I'm RowBot, Rowell's AI Co-Pilot. I can answer questions about Rowell's work, tech stack, pricing, or help you get a custom project estimate. What are you building?`;
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
            contactName: 'Anonymous Chat Visitor',
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
