import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/auth';
import { classifyLeadWithAI } from '@/lib/ai-lead-classifier';
import { LeadStatus } from '@/lib/generated/client/index';

export async function POST(request: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { leadId, scanAll } = body;

    // Scan all unscanned or requested leads
    if (scanAll) {
      const allLeads = await prisma.lead.findMany({
        include: {
          notes: true,
        },
        orderBy: { submittedAt: 'desc' },
        take: 50,
      });

      const results = [];

      for (const lead of allLeads) {
        // Check if already has an AI analysis note
        const existingAiNote = lead.notes?.find((n) => n.content.startsWith('[AI SPAM & INTENT ANALYSIS]'));

        if (!existingAiNote || body.forceReScan) {
          const analysis = await classifyLeadWithAI(lead);

          // Update status if spam detected
          const targetStatus: LeadStatus = analysis.isSpam ? 'SPAM' : lead.status === 'SPAM' ? 'NEW' : lead.status;

          const updatedLead = await prisma.lead.update({
            where: { id: lead.id },
            data: {
              status: targetStatus,
            },
          });

          // Record AI analysis note
          const noteContent = `[AI SPAM & INTENT ANALYSIS]
• Classification: ${analysis.classification} (Score: ${analysis.leadQualityScore}/100 | Confidence: ${Math.round(analysis.confidence * 100)}%)
• Is Spam: ${analysis.isSpam ? `YES (${analysis.spamReason || 'Bot/Spam pattern'})` : 'NO (Legitimate Inquiry)'}
• Intent: ${analysis.keyIntent}
• Summary: ${analysis.summary}
• Suggested Next Action: ${analysis.suggestedNextAction}`;

          await prisma.leadNote.create({
            data: {
              leadId: lead.id,
              content: noteContent,
            },
          });

          results.push({
            leadId: lead.id,
            status: targetStatus,
            analysis,
          });
        }
      }

      return NextResponse.json({
        success: true,
        scannedCount: results.length,
        results,
        message: `Successfully analyzed ${results.length} leads with AI.`,
      });
    }

    // Scan a single specific lead
    if (!leadId) {
      return NextResponse.json({ success: false, message: 'leadId or scanAll is required' }, { status: 400 });
    }

    const lead = await prisma.lead.findUnique({
      where: { id: Number(leadId) },
      include: { notes: true },
    });

    if (!lead) {
      return NextResponse.json({ success: false, message: 'Lead not found' }, { status: 404 });
    }

    const analysis = await classifyLeadWithAI(lead);

    const targetStatus: LeadStatus = analysis.isSpam ? 'SPAM' : lead.status === 'SPAM' ? 'NEW' : lead.status;

    const updatedLead = await prisma.lead.update({
      where: { id: lead.id },
      data: {
        status: targetStatus,
      },
    });

    const noteContent = `[AI SPAM & INTENT ANALYSIS]
• Classification: ${analysis.classification} (Score: ${analysis.leadQualityScore}/100 | Confidence: ${Math.round(analysis.confidence * 100)}%)
• Is Spam: ${analysis.isSpam ? `YES (${analysis.spamReason || 'Bot/Spam pattern'})` : 'NO (Legitimate Inquiry)'}
• Intent: ${analysis.keyIntent}
• Summary: ${analysis.summary}
• Suggested Next Action: ${analysis.suggestedNextAction}`;

    const createdNote = await prisma.leadNote.create({
      data: {
        leadId: lead.id,
        content: noteContent,
      },
    });

    return NextResponse.json({
      success: true,
      lead: updatedLead,
      note: createdNote,
      analysis,
      message: `Lead classified as ${analysis.classification} (Score: ${analysis.leadQualityScore}/100).`,
    });
  } catch (error: any) {
    console.error('[API/crm/leads/ai-scan] Error:', error);
    return NextResponse.json({ success: false, message: error?.message || 'Failed to scan lead with AI' }, { status: 500 });
  }
}
