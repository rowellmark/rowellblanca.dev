import { generateAIResponse } from '@/lib/ai-provider';
import { isGibberishString, isDisposableEmail } from '@/lib/anti-spam';

export interface AILeadClassification {
  isSpam: boolean;
  classification: 'HIGH_INTENT' | 'VALID_LEAD' | 'LOW_QUALITY' | 'PROBE' | 'SPAM';
  leadQualityScore: number; // 0 to 100
  confidence: number; // 0.0 to 1.0
  spamReason?: string;
  keyIntent: string;
  summary: string;
  suggestedNextAction: string;
  analyzedAt: string;
}

interface LeadInput {
  id?: number;
  contactName: string;
  companyName?: string | null;
  email: string;
  phone?: string | null;
  serviceInterest?: string | null;
  budget?: string | null;
  enquiryDetails: string;
  sourceUrl?: string | null;
}

export async function classifyLeadWithAI(lead: LeadInput): Promise<AILeadClassification> {
  const name = (lead.contactName || '').trim();
  const email = (lead.email || '').trim().toLowerCase();
  const company = (lead.companyName || '').trim();
  const details = (lead.enquiryDetails || '').trim();
  const service = (lead.serviceInterest || '').trim();
  const source = (lead.sourceUrl || '').trim();
  const phone = (lead.phone || '').trim();

  // Tier 1: Fast Heuristic Checks
  const nameGibberish = isGibberishString(name);
  const detailsGibberish = isGibberishString(details);
  const disposableEmail = isDisposableEmail(email);

  if (nameGibberish || detailsGibberish || disposableEmail) {
    const reasons: string[] = [];
    if (nameGibberish) reasons.push('Gibberish/bot string detected in contact name');
    if (detailsGibberish) reasons.push('Gibberish token cluster detected in message');
    if (disposableEmail) reasons.push('Temporary/disposable email address domain');

    return {
      isSpam: true,
      classification: 'SPAM',
      leadQualityScore: 5,
      confidence: 0.98,
      spamReason: reasons.join('; '),
      keyIntent: 'Automated Bot Probe',
      summary: `Automated spam submission detected via heuristic rules (${reasons.join(', ')}).`,
      suggestedNextAction: 'Delete or leave in SPAM filter',
      analyzedAt: new Date().toISOString(),
    };
  }

  // Common SEO / Crypto / Marketing outreach bots
  const lowerDetails = details.toLowerCase();
  const commonSpamPatterns = [
    'guest post',
    'backlink',
    'seo ranking',
    'crypto investment',
    'forex trading',
    'first page of google',
    'viagra',
    'casino',
    'whatsapp me at +',
  ];

  const matchedPattern = commonSpamPatterns.find((p) => lowerDetails.includes(p));
  if (matchedPattern) {
    return {
      isSpam: true,
      classification: 'SPAM',
      leadQualityScore: 10,
      confidence: 0.95,
      spamReason: `Unsolicited spam pitch keyword: "${matchedPattern}"`,
      keyIntent: 'Unsolicited Marketing / Link Pitch',
      summary: `Detected generic marketing outreach or backlink spam.`,
      suggestedNextAction: 'Keep marked as SPAM',
      analyzedAt: new Date().toISOString(),
    };
  }

  // Tier 2: Generative LLM Analysis
  const prompt = `Analyze this inbound client lead for Senior Full-Stack Engineer Rowell Mark Blanca (services: React/Next.js web apps, bespoke WordPress plugins, full-stack retainers, AI systems).

LEAD DATA:
- Contact Name: ${name || 'N/A'}
- Email: ${email || 'N/A'}
- Company: ${company || 'N/A'}
- Phone: ${phone || 'N/A'}
- Service Interest: ${service || 'N/A'}
- Budget: ${lead.budget || 'N/A'}
- Enquiry Details: ${details || 'N/A'}
- Source Page: ${source || 'N/A'}

TASK:
Determine if this submission is a legitimate commercial client lead, a low-quality inquiry, or spam/bot probe.
Evaluate lead intent, quality score (0-100), and recommended next steps.

Return ONLY a valid, raw JSON object (no markdown, no code fences):
{
  "isSpam": boolean,
  "classification": "HIGH_INTENT" | "VALID_LEAD" | "LOW_QUALITY" | "PROBE" | "SPAM",
  "leadQualityScore": number,
  "confidence": number,
  "spamReason": string,
  "keyIntent": string,
  "summary": string,
  "suggestedNextAction": string
}`;

  try {
    const aiResponse = await generateAIResponse({
      prompt,
      systemInstruction: 'You are an expert CRM Lead Intelligence & Anti-Spam Classification AI system. Output strict JSON only.',
      temperature: 0.2,
      maxTokens: 500,
    });

    const cleanText = aiResponse.text
      .replace(/^```json/i, '')
      .replace(/^```/i, '')
      .replace(/```$/i, '')
      .trim();

    const parsed = JSON.parse(cleanText);

    return {
      isSpam: Boolean(parsed.isSpam),
      classification: parsed.classification || (parsed.isSpam ? 'SPAM' : 'VALID_LEAD'),
      leadQualityScore: typeof parsed.leadQualityScore === 'number' ? Math.max(0, Math.min(100, parsed.leadQualityScore)) : (parsed.isSpam ? 10 : 80),
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.9,
      spamReason: parsed.spamReason || (parsed.isSpam ? 'AI classified as unsolicited spam or non-commercial probe' : undefined),
      keyIntent: parsed.keyIntent || service || 'Web Development Inquiry',
      summary: parsed.summary || 'Inbound project inquiry for engineering services.',
      suggestedNextAction: parsed.suggestedNextAction || 'Review requirements and reply via email.',
      analyzedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.warn('[classifyLeadWithAI] AI API call fallback to heuristic classification:', error);

    // Fallback: If message has meaningful content, mark as valid lead
    const isVeryShort = details.length < 15;
    return {
      isSpam: isVeryShort,
      classification: isVeryShort ? 'LOW_QUALITY' : 'VALID_LEAD',
      leadQualityScore: isVeryShort ? 35 : 75,
      confidence: 0.75,
      spamReason: isVeryShort ? 'Very short submission details' : undefined,
      keyIntent: service || 'Web Development Inquiry',
      summary: `Inbound inquiry from ${name || email} regarding ${service || 'software services'}.`,
      suggestedNextAction: 'Review details and follow up directly.',
      analyzedAt: new Date().toISOString(),
    };
  }
}
