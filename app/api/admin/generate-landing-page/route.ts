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

    const { targetKeyword, slug, customPrompt } = await request.json();

    if (!targetKeyword?.trim() && !slug?.trim()) {
      return NextResponse.json({ success: false, message: 'Target keyword or slug is required' }, { status: 400 });
    }

    const topic = targetKeyword?.trim() || slug?.trim().replace(/-/g, ' ');

    const systemPrompt = `You are an elite SEO Landing Page Copywriter for a Senior Full-Stack Developer & Software Architect (Rowell Mark Blanca).
Your task is to generate high-converting SEO landing page copy targeting the keyword/service: "${topic}".

Route Slug Context: ${slug || 'not specified'}
User Instructions / Notes: ${customPrompt || 'Emphasize senior-level expertise, fast delivery, and direct communication.'}

Return ONLY a single valid JSON object (without any markdown formatting or extra text outside the JSON object) with the following exact keys:
{
  "badgeText": "Short punchy pill badge, max 8 words, can include a relevant flag/emoji",
  "heroTitle": "High-impact H1 headline, max 12 words, includes the target keyword naturally",
  "heroSubtitle": "1-2 sentence supporting subheadline, max 40 words, expands on the value proposition",
  "heroCtaText": "Short CTA button label, max 5 words",
  "targetKeyword": "Cleaned up SEO target keyword phrase",
  "metaTitle": "SEO <title> tag, under 60 characters, includes target keyword and 'Rowell Mark Blanca'",
  "metaDescription": "SEO meta description, under 155 characters, includes target keyword and a call to action"
}`;

    let geminiResponse;
    const modelUrls = [
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    ];

    let lastError = '';
    for (const url of modelUrls) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 7000);

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 800,
            },
          }),
        });

        clearTimeout(timeoutId);

        if (res.ok) {
          geminiResponse = await res.json();
          break;
        } else {
          const errText = await res.text();
          lastError = `Status ${res.status}: ${errText}`;
        }
      } catch (err: any) {
        lastError = err?.message || 'Network timeout calling Gemini API';
      }
    }

    if (!geminiResponse) {
      return NextResponse.json(
        { success: false, message: `Failed to generate landing page copy from Gemini API: ${lastError}` },
        { status: 500 }
      );
    }

    const rawText = geminiResponse?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      return NextResponse.json({ success: false, message: 'Empty response received from Gemini AI' }, { status: 500 });
    }

    let jsonString = rawText.trim();
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (jsonString.startsWith('```')) {
      jsonString = jsonString.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    let parsedCopy;
    try {
      parsedCopy = JSON.parse(jsonString);
    } catch (parseErr) {
      console.error('Failed to parse Gemini output as JSON:', rawText);
      return NextResponse.json({ success: false, message: 'Failed to parse Gemini AI response as JSON' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      copy: parsedCopy,
    });
  } catch (error: any) {
    console.error('Error in generate-landing-page route:', error);
    return NextResponse.json({ success: false, message: error?.message || 'Internal server error' }, { status: 500 });
  }
}
