import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';

export async function POST(request: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          message: 'GEMINI_API_KEY environment variable is missing. Please add GEMINI_API_KEY to your .env file.',
        },
        { status: 400 }
      );
    }

    const { sitename, technologies, description, client, role, customPrompt } = await request.json();

    if (!sitename) {
      return NextResponse.json({ success: false, message: 'Project title (sitename) is required' }, { status: 400 });
    }

    const techString = Array.isArray(technologies) ? technologies.join(', ') : technologies || 'React, Next.js, Node.js, TypeScript';

    const systemPrompt = `You are an elite Tech Case Study Writer and Portfolio Strategist for a Senior Full-Stack Developer & Software Architect (Rowell Mark Blanca).
Your task is to generate a compelling, professional, high-converting portfolio case study blog post for the project named "${sitename}".

Project Context:
- Project Name: ${sitename}
- Client/Company: ${client || 'Client Project'}
- Technologies Used: ${techString}
- Short Description / Context: ${description || 'Custom web application built with high performance, sleek UI/UX, and robust architecture.'}
- User Instructions / Notes: ${customPrompt || 'Highlight the architecture, key technical challenges overcome, and business value delivered.'}

Return ONLY a single valid JSON object (without any markdown formatting or extra text outside the JSON object) with the following exact keys:
{
  "category": "Recommended project category e.g. SaaS Web App, FinTech Portal, Enterprise Dashboard, WordPress Solution, E-commerce",
  "role": "Recommended developer role e.g. Lead Full-Stack Architect, Full-Stack Developer",
  "duration": "Suggested duration e.g. 2 Months, 3 Months",
  "challenge": "A concise 2-3 sentence executive summary of the problem, operational pain points, or client goals before the project was built.",
  "solution": "A 3-4 sentence breakdown of the technical strategy, architecture design, and core features built to solve the challenge.",
  "results": "3-4 bullet metrics or sentence highlighting business impact, conversion gains, speed improvement, or workflow automation.",
  "content": "A long-form, beautifully structured HTML blog post (approx 400-600 words) using clean semantic HTML elements (<h2>, <h3>, <p>, <ul>, <li>, <blockquote>, <code>, <pre>). Include sections like Overview, Technical Architecture, Core Features, Key Challenges & Breakthroughs, and Business Impact. Do NOT wrap in <html> or <body> tags."
}`;

    // Use Gemini 2.0 Flash, 1.5 Flash, 1.5 Pro with fallbacks
    let geminiResponse;
    const modelUrls = [
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    ];

    let lastError = '';
    for (const url of modelUrls) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2500,
            },
          }),
        });

        if (res.ok) {
          geminiResponse = await res.json();
          break;
        } else {
          const errText = await res.text();
          lastError = `Status ${res.status}: ${errText}`;
        }
      } catch (err: any) {
        lastError = err?.message || 'Network error calling Gemini API';
      }
    }

    if (!geminiResponse) {
      return NextResponse.json(
        { success: false, message: `Failed to generate case study from Gemini API: ${lastError}` },
        { status: 500 }
      );
    }

    const rawText = geminiResponse?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      return NextResponse.json({ success: false, message: 'Empty response received from Gemini AI' }, { status: 500 });
    }

    // Clean JSON markdown blocks if present (```json ... ```)
    let jsonString = rawText.trim();
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (jsonString.startsWith('```')) {
      jsonString = jsonString.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    let parsedCaseStudy;
    try {
      parsedCaseStudy = JSON.parse(jsonString);
    } catch (parseErr) {
      console.error('Failed to parse Gemini output as JSON:', rawText);
      parsedCaseStudy = {
        category: 'Web Application',
        role: role || 'Lead Developer',
        duration: '2 Months',
        challenge: description || 'Building a modern, high-performance web platform.',
        solution: `Implemented a robust architecture using ${techString}.`,
        results: 'Delivered a fast, scalable web application on schedule.',
        content: `<h2>Project Overview</h2><p>${description || 'Comprehensive web build.'}</p><div>${rawText}</div>`,
      };
    }

    return NextResponse.json({
      success: true,
      caseStudy: parsedCaseStudy,
    });
  } catch (error: any) {
    console.error('Error in generate-case-study route:', error);
    return NextResponse.json({ success: false, message: error?.message || 'Internal server error' }, { status: 500 });
  }
}
