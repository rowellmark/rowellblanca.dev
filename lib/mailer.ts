import nodemailer from 'nodemailer';

type ResendConfig = {
  provider: 'resend';
  apiKey: string;
  fromEmail: string;
  fromName: string;
  toEmail: string;
};

type MailTransportConfig = {
  provider: 'smtp';
  host: string;
  port: number;
  user: string;
  pass: string;
  fromEmail: string;
  toEmail: string;
};

type MailConfig = ResendConfig | MailTransportConfig;

type MailContent = {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderParagraph(value: string) {
  return escapeHtml(value).replace(/\n/g, '<br />');
}

function renderDetailRow(label: string, value?: string, accent = false) {
  if (!value) {
    return '';
  }

  return `
    <tr>
      <td style="padding: 10px 0; width: 150px; font-size: 12px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; color: #64748b; border-bottom: 1px solid #e2e8f0;">${label}</td>
      <td style="padding: 10px 0; font-size: 14px; font-weight: ${accent ? '700' : '500'}; color: ${accent ? '#b45309' : '#0f172a'}; border-bottom: 1px solid #e2e8f0;">${escapeHtml(value)}</td>
    </tr>
  `;
}

function buildEmailShell(options: {
  eyebrow: string;
  title: string;
  intro: string;
  content: string;
  footer?: string;
}) {
  return `
    <div style="margin: 0; padding: 32px 16px; background: linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%);">
      <div style="max-width: 680px; margin: 0 auto; font-family: Inter, Arial, sans-serif; color: #0f172a;">
        <div style="overflow: hidden; border-radius: 24px; background: #ffffff; border: 1px solid #dbeafe; box-shadow: 0 20px 45px rgba(15, 23, 42, 0.08);">
          <div style="padding: 28px 32px; background: linear-gradient(135deg, #0b1a30 0%, #153e75 55%, #f59e0b 180%); color: #ffffff;">
            <div style="display: inline-block; padding: 7px 12px; border-radius: 999px; background: rgba(255,255,255,0.14); font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase;">${options.eyebrow}</div>
            <h1 style="margin: 18px 0 10px; font-size: 28px; line-height: 1.2; font-weight: 900; color: #ffffff;">${options.title}</h1>
            <p style="margin: 0; max-width: 520px; font-size: 15px; line-height: 1.7; color: rgba(255,255,255,0.86);">${options.intro}</p>
          </div>
          <div style="padding: 32px; background: #ffffff;">${options.content}</div>
          <div style="padding: 18px 32px 28px; font-size: 12px; line-height: 1.6; color: #64748b; background: #f8fafc; border-top: 1px solid #e2e8f0;">
            ${options.footer || 'rowellblanca.dev · Full-Stack Web Development · Replies are monitored.'}
          </div>
        </div>
      </div>
    </div>
  `;
}

function getMailTransportConfig(): MailConfig | null {
  const resendApiKey = process.env.RESEND_API_KEY;
  const resendFromEmail = process.env.RESEND_FROM_EMAIL || process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev';
  const resendFromName = process.env.RESEND_FROM_NAME || 'Rowell Mark Blanca';
  const toEmail = process.env.CONTACT_TO_EMAIL || 'rowellblanca94@gmail.com';

  if (resendApiKey && resendFromEmail) {
    return {
      provider: 'resend',
      apiKey: resendApiKey,
      fromEmail: resendFromEmail,
      fromName: resendFromName,
      toEmail,
    };
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 2525);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const fromEmail = process.env.CONTACT_FROM_EMAIL || 'no-reply@rowellblanca.dev';

  if (!host || !user || !pass || !fromEmail) {
    return null;
  }

  return {
    provider: 'smtp',
    host,
    port,
    user,
    pass,
    fromEmail,
    toEmail,
  };
}

function createTransport(config: MailTransportConfig) {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
}

async function sendMail(config: MailConfig, content: MailContent) {
  if (config.provider === 'resend') {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        from: `${config.fromName} <${config.fromEmail}>`,
        to: [content.to],
        reply_to: content.replyTo ? [content.replyTo] : undefined,
        subject: content.subject,
        text: content.text,
        html: content.html,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Resend API error ${response.status}: ${errorText}`);
    }

    const result = await response.json().catch(() => ({}));
    return { success: true, messageId: result?.id };
  }

  const transporter = createTransport(config);
  const info = await transporter.sendMail({
    from: `"Rowell Mark Blanca" <${config.fromEmail}>`,
    to: content.to,
    replyTo: content.replyTo,
    subject: content.subject,
    text: content.text,
    html: content.html,
  });

  return { success: true, messageId: info.messageId };
}

interface SendMailParams {
  name: string;
  email: string;
  subject?: string;
  message: string;
  phone?: string;
  company?: string;
  service?: string;
  budget?: string;
  sourceUrl?: string;
}

export async function sendContactEmail({ name, email, subject, message, phone, company, service, budget, sourceUrl }: SendMailParams) {
  const config = getMailTransportConfig();

  if (!config) {
    console.warn('[Mailer] Email provider credentials are incomplete. Email notification skipped.');
    return { success: false, reason: 'Credentials not configured' };
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);

  return sendMail(config, {
    to: config.toEmail,
    replyTo: email,
    subject: subject ? `[Portfolio Inquiry] ${subject}` : `New Inquiry from ${name}`,
    text: `Name: ${name}\nEmail: ${email}${phone ? `\nPhone: ${phone}` : ''}${company ? `\nCompany: ${company}` : ''}${service ? `\nService: ${service}` : ''}${budget ? `\nBudget: ${budget}` : ''}${sourceUrl ? `\nLead Source Page: ${sourceUrl}` : ''}\n\nMessage:\n${message}`,
    html: buildEmailShell({
      eyebrow: 'New Inquiry',
      title: 'A new project request just came in',
      intro: 'A visitor submitted the portfolio contact form. Review the request details below and reply directly from your inbox if the project looks like a fit.',
      content: `
        <div style="margin-bottom: 24px; padding: 18px 20px; border: 1px solid #dbeafe; border-radius: 18px; background: linear-gradient(180deg, #f8fbff 0%, #f8fafc 100%);">
          <div style="font-size: 18px; font-weight: 800; color: #0b1a30;">${safeName}</div>
          <div style="margin-top: 6px; font-size: 14px; color: #475569;">&lt;<a href="mailto:${safeEmail}" style="color: #1d4ed8; text-decoration: none;">${safeEmail}</a>&gt;</div>
        </div>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;"> 
          ${renderDetailRow('Lead Source / Page', sourceUrl, true)}
          ${renderDetailRow('Subject', subject)}
          ${renderDetailRow('Phone', phone)}
          ${renderDetailRow('Company', company)}
          ${renderDetailRow('Service', service, true)}
          ${renderDetailRow('Budget', budget, true)}
        </table>
        <div style="padding: 22px; border-radius: 20px; background: #0f172a; color: #f8fafc;">
          <div style="margin-bottom: 12px; font-size: 12px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #fbbf24;">Message</div>
          <div style="font-size: 15px; line-height: 1.8; color: rgba(248,250,252,0.92);">${renderParagraph(message)}</div>
        </div>
      `,
      footer: `Sent via rowellblanca.dev contact form${sourceUrl ? ` (${sourceUrl})` : ''} · Reply directly to this email to continue the conversation.`,
    }),
  });
}

interface SendReplyParams {
  toName: string;
  toEmail: string;
  replyMessage: string;
  originalSubject?: string;
  originalMessage?: string;
}

export async function sendReplyEmail({ toName, toEmail, replyMessage, originalSubject, originalMessage }: SendReplyParams) {
  const config = getMailTransportConfig();

  if (!config) {
    console.warn('[Mailer] Email provider credentials missing. Reply email skipped.');
    return { success: false, reason: 'Credentials not configured' };
  }

  const safeName = escapeHtml(toName);

  return sendMail(config, {
    to: toEmail,
    subject: originalSubject ? `Re: ${originalSubject}` : `Reply regarding your inquiry - Rowell Mark Blanca`,
    text: `Hi ${toName},\n\n${replyMessage}\n\n---\nOriginal Inquiry:\n${originalMessage || ''}`,
    html: buildEmailShell({
      eyebrow: 'Direct Reply',
      title: 'You have a new response from Rowell Mark Blanca',
      intro: `Hi ${safeName}, here is the latest reply regarding your inquiry.`,
      content: `
        <div style="padding: 22px; border-radius: 20px; background: linear-gradient(180deg, #eff6ff 0%, #f8fafc 100%); border: 1px solid #dbeafe; margin-bottom: 24px;">
          <div style="font-size: 15px; line-height: 1.8; color: #1e293b;">${renderParagraph(replyMessage)}</div>
        </div>
        ${originalMessage ? `
          <div style="padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <div style="margin-bottom: 10px; font-size: 12px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #64748b;">Original inquiry</div>
            <div style="padding: 18px 20px; border-radius: 18px; background: #f8fafc; border: 1px solid #e2e8f0; font-size: 14px; line-height: 1.7; color: #475569;">${renderParagraph(originalMessage)}</div>
          </div>
        ` : ''}
      `,
    }),
  });
}

interface SendReceiptParams {
  name: string;
  email: string;
  subject?: string;
  service?: string;
  budget?: string;
  company?: string;
  phone?: string;
  message: string;
}

export async function sendAcknowledgmentReceipt({
  name,
  email,
  subject,
  service,
  budget,
  company,
  phone,
  message,
}: SendReceiptParams) {
  const config = getMailTransportConfig();

  if (!config) {
    console.warn('[Mailer] Email provider credentials missing. Acknowledgment receipt skipped.');
    return { success: false, reason: 'Credentials not configured' };
  }

  const safeName = escapeHtml(name);

  return sendMail(config, {
    to: email,
    subject: `Inquiry Receipt & Submission Copy — Rowell Mark Blanca`,
    text: `Hi ${name},\n\nThank you for reaching out! I have received your message and will review it promptly.\n\nHere is a copy of your inquiry for your records:\nService: ${service || subject || 'General Inquiry'}\nBudget: ${budget || 'N/A'}\nMessage:\n${message}\n\nBest regards,\nRowell Mark Blanca\nhttps://rowellblanca.dev`,
    html: buildEmailShell({
      eyebrow: 'Submission Received',
      title: 'Thanks, your inquiry is in the queue',
      intro: `Hi ${safeName}, thanks for reaching out. This email confirms that your message was received successfully and includes a copy of what you sent.`,
      content: `
        <div style="display: grid; gap: 14px; margin-bottom: 24px;">
          <div style="padding: 18px 20px; border-radius: 18px; background: #f8fafc; border: 1px solid #e2e8f0; font-size: 14px; line-height: 1.7; color: #334155;">
            You can expect a direct reply within <strong style="color: #0b1a30;">24 hours</strong>. If your request is time-sensitive, reply to this confirmation and it will stay attached to the same thread.
          </div>
        </div>
        <div style="padding: 22px; border-radius: 20px; background: linear-gradient(180deg, #fffdf7 0%, #f8fafc 100%); border: 1px solid #fde68a; margin-bottom: 24px;">
          <div style="margin-bottom: 14px; font-size: 12px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #b45309;">Submission summary</div>
          <table style="width: 100%; border-collapse: collapse;">
            ${renderDetailRow('Name', name)}
            ${renderDetailRow('Email', email)}
            ${renderDetailRow('Company', company)}
            ${renderDetailRow('Phone', phone)}
            ${renderDetailRow('Service', service || subject, true)}
            ${renderDetailRow('Budget', budget, true)}
          </table>
        </div>
        <div style="padding: 22px; border-radius: 20px; background: #ffffff; border: 1px solid #dbeafe;">
          <div style="margin-bottom: 12px; font-size: 12px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #1d4ed8;">Your message</div>
          <div style="font-size: 15px; line-height: 1.8; color: #1e293b;">${renderParagraph(message)}</div>
        </div>
        <div style="text-align: center; margin-top: 28px;">
          <a href="https://rowellblanca.dev" style="display: inline-block; padding: 12px 22px; border-radius: 999px; background: #0b1a30; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 800;">Visit rowellblanca.dev</a>
        </div>
      `,
      footer: 'This is an automated confirmation for your records. Replies to this email will continue the same conversation.',
    }),
  });
}

interface TestimonialNotifyParams {
  name: string;
  role?: string;
  company?: string;
  quote: string;
  rating: number;
}

export async function sendTestimonialNotification({
  name,
  role,
  company,
  quote,
  rating,
}: TestimonialNotifyParams) {
  const config = getMailTransportConfig();

  if (!config) {
    console.warn('[Mailer] Email provider credentials missing. Testimonial notification skipped.');
    return { success: false, reason: 'Credentials not configured' };
  }

  const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
  const clientInfo = [role, company].filter(Boolean).join(' · ');

  return sendMail(config, {
    to: config.toEmail,
    subject: `⭐ New Client Review Submitted: ${name} (${rating}/5 Stars)`,
    text: `New Client Testimonial Received!\n\nName: ${name}\nRole/Company: ${clientInfo}\nRating: ${rating}/5 (${stars})\nQuote:\n"${quote}"\n\nApprove or Manage in Admin Dashboard: https://www.rowellblanca.dev/admin/testimonials`,
    html: buildEmailShell({
      eyebrow: 'New Review Submitted',
      title: `⭐ New ${rating}-Star Review Received!`,
      intro: `${escapeHtml(name)} just submitted a new client testimonial on rowellblanca.dev. Review and approve it in your Admin Dashboard.`,
      content: `
        <div style="padding: 22px; border-radius: 20px; background: linear-gradient(180deg, #fffdf7 0%, #f8fafc 100%); border: 1px solid #fde68a; margin-bottom: 24px;">
          <div style="margin-bottom: 14px; font-size: 12px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #b45309;">Reviewer details</div>
          <table style="width: 100%; border-collapse: collapse;">
            ${renderDetailRow('Client Name', name)}
            ${renderDetailRow('Role / Company', clientInfo)}
            ${renderDetailRow('Rating', `${rating} / 5 Stars (${stars})`, true)}
          </table>
        </div>

        <div style="padding: 22px; border-radius: 20px; background: #ffffff; border: 1px solid #dbeafe; margin-bottom: 24px;">
          <div style="margin-bottom: 12px; font-size: 12px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #1d4ed8;">Testimonial Quote</div>
          <div style="font-size: 15px; line-height: 1.8; color: #1e293b; font-style: italic;">"${renderParagraph(quote)}"</div>
        </div>

        <div style="text-align: center; margin-top: 28px;">
          <a href="https://www.rowellblanca.dev/admin/testimonials" style="display: inline-block; padding: 14px 28px; border-radius: 999px; background: #0b1a30; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 800; shadow: 0 4px 12px rgba(11,26,48,0.2);">Approve Review in Admin Dashboard →</a>
        </div>
      `,
      footer: 'Pending testimonials require manual approval in your Admin Dashboard before publishing to public landing pages.',
    }),
  });
}

export async function sendChatTranscriptEmail({
  name,
  email,
  sessionId,
  transcript,
}: {
  name: string;
  email: string;
  sessionId: string;
  transcript: string;
}) {
  const config = getMailTransportConfig();

  if (!config) {
    console.warn('[Mailer] Email provider credentials missing. Chat transcript email skipped.');
    return { success: false, reason: 'Credentials not configured' };
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);

  return sendMail(config, {
    to: config.toEmail,
    replyTo: email,
    subject: `💬 Ended Chat Session Transcript: ${name}`,
    text: `Chat Session Completed!\nName: ${name}\nEmail: ${email}\nSession ID: ${sessionId}\n\nFull Chat Transcript:\n${transcript}`,
    html: buildEmailShell({
      eyebrow: 'Chat Session Completed',
      title: `💬 Completed Chat Transcript from ${safeName}`,
      intro: `${safeName} (<a href="mailto:${safeEmail}" style="color: #1d4ed8;">${safeEmail}</a>) just ended a live chat session with Rowell's AI Assistant. Below is the full chat conversation history.`,
      content: `
        <div style="padding: 18px 20px; border-radius: 18px; background-color: #f8fafc; border: 1px solid #e2e8f0; margin-bottom: 24px;">
          <div style="font-size: 16px; font-weight: 800; color: #0b1a30;">${safeName}</div>
          <div style="font-size: 13px; color: #475569; margin-top: 4px;">Email: <a href="mailto:${safeEmail}" style="color: #1d4ed8; text-decoration: none;">${safeEmail}</a></div>
          <div style="font-size: 11px; font-family: monospace; color: #94a3b8; margin-top: 4px;">Session ID: ${escapeHtml(sessionId)}</div>
        </div>
        <div style="padding: 22px; border-radius: 20px; background: #0f172a; color: #f8fafc; margin-bottom: 24px;">
          <div style="margin-bottom: 12px; font-size: 12px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #fbbf24;">Full Chat Transcript History</div>
          <div style="font-size: 13px; line-height: 1.8; font-family: monospace; white-space: pre-wrap; color: rgba(248,250,252,0.92);">${renderParagraph(transcript)}</div>
        </div>
      `,
      footer: 'Sent via rowellblanca.dev AI & Live Chat · Reply directly to this email to contact the client.',
    }),
  });
}

export interface SendInvoiceEmailParams {
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  clientCompany?: string | null;
  clientPhone?: string | null;
  clientAddress?: string | null;
  tagline?: string | null;
  currency?: string;
  subtotal: number;
  discount?: number;
  taxRate?: number;
  totalAmount: number;
  issueDate: Date | string;
  dueDate: Date | string;
  paymentTerms?: string | null;
  paymentDetails?: string | null;
  items: Array<{
    description: string;
    details?: string | null;
    quantity: number;
    unitPrice: number;
    amount: number;
  }>;
  invoiceUrl?: string;
}

export async function sendInvoiceEmail(params: SendInvoiceEmailParams) {
  const config = getMailTransportConfig();

  if (!config) {
    console.warn('[Mailer] Email provider credentials missing. Invoice email skipped.');
    return { success: false, reason: 'Credentials not configured' };
  }

  const {
    invoiceNumber,
    clientName,
    clientEmail,
    clientCompany,
    clientPhone,
    clientAddress,
    tagline = 'Bring your ideas in to reality.',
    currency = 'USD',
    subtotal,
    discount = 0,
    taxRate = 0,
    totalAmount,
    issueDate,
    dueDate,
    paymentTerms,
    paymentDetails,
    items,
    invoiceUrl = `https://rowellblanca.dev/invoice/${invoiceNumber}`,
  } = params;

  const formatDate = (d: Date | string) => {
    try {
      const dateObj = typeof d === 'string' ? new Date(d) : d;
      return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      });
    } catch {
      return String(d);
    }
  };

  const currencySymbol =
    currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'PHP' ? '₱' : '$';

  const formatMoney = (amount: number) => {
    return `${currencySymbol}${Number(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const safeClientName = escapeHtml(clientName);
  const safeClientCompany = clientCompany ? escapeHtml(clientCompany) : '';
  const safeTagline = escapeHtml(tagline || 'Bring your ideas in to reality.');

  const itemsHtml = items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 16px 14px; vertical-align: top;">
          <div style="font-weight: 800; color: #0b1a30; font-size: 14px;">${escapeHtml(item.description)}</div>
          ${
            item.details
              ? `<div style="font-size: 12px; color: #64748b; margin-top: 4px; line-height: 1.5;">${escapeHtml(item.details)}</div>`
              : ''
          }
        </td>
        <td style="padding: 16px 10px; text-align: center; vertical-align: top; font-weight: 700; color: #334155; font-size: 13px;">${item.quantity}</td>
        <td style="padding: 16px 12px; text-align: right; vertical-align: top; font-weight: 700; color: #334155; font-size: 13px;">${formatMoney(item.unitPrice)}</td>
        <td style="padding: 16px 14px; text-align: right; vertical-align: top; font-weight: 800; color: #0b1a30; font-size: 14px;">${formatMoney(item.amount)}</td>
      </tr>
    `
    )
    .join('');

  const textSummary = items
    .map((item) => `- ${item.description} (${item.quantity}x @ ${formatMoney(item.unitPrice)}): ${formatMoney(item.amount)}`)
    .join('\n');

  const emailHtml = `
    <div style="margin: 0; padding: 24px 12px; background-color: #0b1a30; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <div style="max-width: 680px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4); border: 1px solid #1e293b;">
        
        <!-- Header & Tagline Banner with Logo and Phone -->
        <div style="background: linear-gradient(135deg, #071224 0%, #0b1a30 60%, #153e75 100%); padding: 36px 32px 28px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); color: #ffffff;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="vertical-align: top;">
                <table style="border-collapse: collapse; margin-bottom: 12px;">
                  <tr>
                    <td style="vertical-align: middle; padding-right: 12px;">
                      <img src="https://rowellblanca.dev/logo.png" alt="Rowell Blanca Logo" width="40" height="40" style="display: block; border-radius: 10px; background: rgba(255,255,255,0.12); padding: 4px; border: 1px solid rgba(255,255,255,0.25);" />
                    </td>
                    <td style="vertical-align: middle;">
                      <div style="display: inline-block; padding: 4px 12px; background: rgba(245, 158, 11, 0.18); border: 1px solid rgba(245, 158, 11, 0.35); border-radius: 999px; color: #fbbf24; font-size: 10px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase;">
                        Official Invoice
                      </div>
                    </td>
                  </tr>
                </table>

                <h1 style="margin: 0; font-size: 24px; font-weight: 900; color: #ffffff; letter-spacing: -0.02em;">
                  Rowell Mark Blanca
                </h1>
                <p style="margin: 4px 0 0; font-size: 13px; color: #94a3b8; font-weight: 500;">
                  Full-Stack Web Development & Engineering
                </p>

                <!-- Phone with Icon, Email, and Web -->
                <div style="margin-top: 10px; font-size: 11px; color: #cbd5e1; line-height: 1.6;">
                  <span style="display: inline-block; margin-right: 14px;">
                    📞 <a href="tel:+639688900418" style="color: #60a5fa; text-decoration: none; font-weight: 700;">+63 968 890 0418</a>
                  </span>
                  <span style="display: inline-block; margin-right: 14px;">
                    ✉️ <a href="mailto:rowellblanca94@gmail.com" style="color: #60a5fa; text-decoration: none; font-weight: 700;">rowellblanca94@gmail.com</a>
                  </span>
                  <span style="display: inline-block;">
                    🌐 <a href="https://rowellblanca.dev" style="color: #60a5fa; text-decoration: none; font-weight: 700;">rowellblanca.dev</a>
                  </span>
                </div>
              </td>
              <td style="text-align: right; vertical-align: top;">
                <div style="display: inline-block; padding: 8px 16px; background: #1e293b; border: 1px solid #334155; border-radius: 14px; text-align: right; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
                  <div style="font-size: 10px; color: #94a3b8; text-transform: uppercase; font-weight: 800; letter-spacing: 0.05em;">Invoice No.</div>
                  <div style="font-size: 16px; font-weight: 900; color: #ffffff; font-family: monospace; margin-top: 2px;">${escapeHtml(invoiceNumber)}</div>
                </div>
              </td>
            </tr>
          </table>

          <!-- Prominent Tagline Callout -->
          <div style="margin-top: 22px; padding: 14px 18px; background: linear-gradient(90deg, rgba(29, 99, 237, 0.28) 0%, rgba(245, 158, 11, 0.22) 100%); border-left: 4px solid #f59e0b; border-radius: 12px;">
            <div style="font-size: 15px; font-weight: 800; color: #ffffff; letter-spacing: 0.01em;">
              <em>&ldquo;${safeTagline}&rdquo;</em>
            </div>
          </div>
        </div>

        <!-- Main Body -->
        <div style="padding: 32px; color: #0f172a; background-color: #ffffff;">
          
          <div style="font-size: 13px; color: #475569; margin-bottom: 24px; line-height: 1.6;">
            Hi <strong style="color: #0b1a30;">${safeClientName}</strong>,<br />
            Thank you for your business! Below is your itemized invoice for the completed milestones and development deliverables.
          </div>

          <!-- Billed To & Dates Grid -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 28px; background-color: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0;">
            <tr>
              <td style="width: 50%; vertical-align: top; padding: 18px 20px;">
                <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 6px;">Billed To:</div>
                ${safeClientCompany ? `<div style="font-size: 15px; font-weight: 800; color: #0b1a30;">${safeClientCompany}</div>` : ''}
                <div style="font-size: 13px; font-weight: 700; color: #334155; margin-top: 2px;">${safeClientName}</div>
                <div style="font-size: 12px; color: #64748b; font-family: monospace; margin-top: 2px;">${escapeHtml(clientEmail)}</div>
                ${clientPhone ? `<div style="font-size: 12px; color: #64748b; margin-top: 2px;">${escapeHtml(clientPhone)}</div>` : ''}
                ${clientAddress ? `<div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">${escapeHtml(clientAddress)}</div>` : ''}
              </td>
              <td style="width: 50%; vertical-align: top; padding: 18px 20px; text-align: right;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="font-size: 12px; font-weight: 700; color: #64748b; padding: 3px 0; text-align: left;">Issue Date:</td>
                    <td style="font-size: 13px; font-weight: 800; color: #0f172a; text-align: right; padding: 3px 0;">${formatDate(issueDate)}</td>
                  </tr>
                  <tr>
                    <td style="font-size: 12px; font-weight: 700; color: #64748b; padding: 3px 0; text-align: left;">Due Date:</td>
                    <td style="font-size: 13px; font-weight: 800; color: #dc2626; text-align: right; padding: 3px 0;">${formatDate(dueDate)}</td>
                  </tr>
                  <tr>
                    <td style="font-size: 12px; font-weight: 700; color: #64748b; padding: 3px 0; text-align: left;">Status:</td>
                    <td style="text-align: right; padding: 3px 0;">
                      <span style="display: inline-block; padding: 3px 10px; background: #fef3c7; color: #92400e; border: 1px solid #fde68a; border-radius: 999px; font-size: 10px; font-weight: 800; text-transform: uppercase;">
                        Payment Pending
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <!-- Multi-Job Line Items Table -->
          <div style="margin-bottom: 24px; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 13px;">
              <thead>
                <tr style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; color: #475569; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">
                  <th style="padding: 12px 14px;">Job / Deliverable</th>
                  <th style="padding: 12px 10px; text-align: center; width: 50px;">Qty</th>
                  <th style="padding: 12px 12px; text-align: right; width: 90px;">Rate</th>
                  <th style="padding: 12px 14px; text-align: right; width: 100px;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
          </div>

          <!-- Financial Calculation Block -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="width: 50%; vertical-align: top; padding-right: 16px;">
                ${
                  paymentTerms || paymentDetails
                    ? `
                  <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 14px 16px;">
                    <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #64748b; margin-bottom: 4px;">Payment Instructions</div>
                    ${paymentTerms ? `<div style="font-size: 11px; color: #475569; line-height: 1.5; margin-bottom: 6px;">${escapeHtml(paymentTerms)}</div>` : ''}
                    ${paymentDetails ? `<div style="font-size: 11px; font-family: monospace; color: #1e293b; line-height: 1.5; white-space: pre-line;">${escapeHtml(paymentDetails)}</div>` : ''}
                  </div>
                `
                    : ''
                }
              </td>
              <td style="width: 50%; vertical-align: top; padding-left: 16px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 5px 0; font-size: 12px; color: #64748b; font-weight: 600;">Subtotal:</td>
                    <td style="padding: 5px 0; font-size: 13px; color: #0f172a; font-weight: 800; text-align: right;">${formatMoney(subtotal)}</td>
                  </tr>
                  ${
                    discount > 0
                      ? `
                    <tr>
                      <td style="padding: 5px 0; font-size: 12px; color: #64748b; font-weight: 600;">Discount:</td>
                      <td style="padding: 5px 0; font-size: 13px; color: #16a34a; font-weight: 800; text-align: right;">-${formatMoney(discount)}</td>
                    </tr>
                  `
                      : ''
                  }
                  ${
                    taxRate > 0
                      ? `
                    <tr>
                      <td style="padding: 5px 0; font-size: 12px; color: #64748b; font-weight: 600;">Tax (${taxRate}%):</td>
                      <td style="padding: 5px 0; font-size: 13px; color: #0f172a; font-weight: 800; text-align: right;">${formatMoney((subtotal - discount) * (taxRate / 100))}</td>
                    </tr>
                  `
                      : ''
                  }
                  <tr style="border-top: 2px solid #0b1a30;">
                    <td style="padding: 10px 0; font-size: 14px; color: #0b1a30; font-weight: 900; text-transform: uppercase;">Total Due:</td>
                    <td style="padding: 10px 0; font-size: 20px; color: #1d63ed; font-weight: 900; text-align: right;">${formatMoney(totalAmount)} ${escapeHtml(currency)}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <!-- Action CTA -->
          <div style="text-align: center; padding: 18px 0 8px; border-top: 1px solid #e2e8f0;">
            <a href="${invoiceUrl}" style="display: inline-block; background: linear-gradient(135deg, #0b1a30 0%, #1d63ed 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 999px; font-size: 13px; font-weight: 800; letter-spacing: 0.02em; box-shadow: 0 4px 15px rgba(29, 99, 237, 0.35);">
              💳 View Live Invoice & Pay Online →
            </a>
            <div style="margin-top: 12px; font-size: 11px; color: #64748b;">
              📎 Printable PDF copy available in the online portal
            </div>
          </div>

        </div>

        <!-- Footer -->
        <div style="background-color: #071224; padding: 22px 32px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid rgba(255, 255, 255, 0.08);">
          <p style="margin: 0 0 4px; color: #94a3b8; font-weight: 600;">
            Rowell Mark Blanca · Full-Stack Web Developer
          </p>
          <p style="margin: 0;">
            📞 <a href="tel:+639688900418" style="color: #60a5fa; text-decoration: none;">+63 968 890 0418</a> · 
            <a href="https://rowellblanca.dev" style="color: #60a5fa; text-decoration: none;">rowellblanca.dev</a> · 
            <a href="mailto:rowellblanca94@gmail.com" style="color: #60a5fa; text-decoration: none;">rowellblanca94@gmail.com</a>
          </p>
        </div>

      </div>
    </div>
  `;

  return sendMail(config, {
    to: clientEmail,
    replyTo: config.toEmail,
    subject: `📄 Invoice ${invoiceNumber} from Rowell Mark Blanca (${formatMoney(totalAmount)} ${currency})`,
    text: `Invoice #${invoiceNumber}\nFrom: Rowell Mark Blanca (+63 968 890 0418)\nBilled To: ${clientName} (${clientCompany || ''})\nIssue Date: ${formatDate(issueDate)}\nDue Date: ${formatDate(dueDate)}\n\nTagline: ${tagline}\n\nDeliverables:\n${textSummary}\n\nTotal Due: ${formatMoney(totalAmount)} ${currency}\n\nView and pay your invoice online at: ${invoiceUrl}`,
    html: emailHtml,
  });
}
