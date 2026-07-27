import { NextResponse } from 'next/server';

const SYSTEM_KNOWLEDGE = `You are Friday, Rowell Mark Blanca's AI Assistant on rowellblanca.dev.
Always introduce yourself as Friday when appropriate (e.g. "Hi! I'm Friday, Rowell's AI Assistant.").
Your role is to answer questions from potential clients, agencies, and hiring managers with professional, concise, and enthusiastic responses.

Key Facts About Rowell Mark Blanca:
- Role: Senior Full-Stack Software Engineer & Web Architect with 8+ years of production experience.
- Specialization: React, Next.js 14 (App Router, Server Components), TypeScript, Node.js, Custom WordPress Themes/Plugins (ACF Pro, Gutenberg, PHP), Headless CMS, and AI/LLM Workflow Integrations.
- Timezone & Location: Based in the Philippines (PST - Philippine Standard Time, UTC+8 / GMT+8). Provides full afternoon & evening overlap with UK business hours (GMT/BST London time), US EST/PST, and Australia (AEST).
- Rates & Quality: Cost-effective senior engineering rates with enterprise-grade code quality — eliminating traditional agency overhead.
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
    const { messages } = await request.json();
    const userMessage = messages?.[messages.length - 1]?.content || 'Hello';

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        success: true,
        reply: `Hi! I'm Friday, Rowell's AI Assistant. Rowell is a Senior Full-Stack Software Engineer specializing in React, Next.js, and Custom WordPress engines. You can book a discovery call directly or send an inquiry using the contact form!`,
      });
    }

    // Call Gemini 2.5 Flash / 1.5 Flash with AbortSignal timeout
    const modelUrls = [
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    ];

    let reply = '';
    for (const url of modelUrls) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const promptText = `${SYSTEM_KNOWLEDGE}\n\nClient Question: "${userMessage}"\nAI Response:`;

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 500,
            },
          }),
        });

        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            reply = text.trim();
            break;
          }
        }
      } catch (err) {
        // Fallthrough to next model or fallback
      }
    }

    if (!reply) {
      reply = `Thanks for reaching out! Rowell is a Senior Full-Stack Engineer building high-performance web apps (React, Next.js, WordPress). He has full GMT/BST overlap for UK clients including Macmanus Asset Finance and Towerfire. Would you like to book a quick discovery call?`;
    }

    return NextResponse.json({
      success: true,
      reply,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: true,
      reply: `Hello! Rowell Mark Blanca is a Senior Software Engineer specializing in React, Next.js, and Custom WordPress. Feel free to use the contact form to discuss your project!`,
    });
  }
}
