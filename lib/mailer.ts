import nodemailer from 'nodemailer';

interface SendMailParams {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export async function sendContactEmail({ name, email, subject, message }: SendMailParams) {
  const host = process.env.MAILTRAP_HOST || 'sandbox.smtp.mailtrap.io';
  const port = Number(process.env.MAILTRAP_PORT) || 2525;
  const user = process.env.MAILTRAP_USER;
  const pass = process.env.MAILTRAP_PASS;
  const toEmail = process.env.MAILTRAP_TO || 'rowellblanca94@gmail.com';
  const fromEmail = process.env.MAILTRAP_FROM || 'no-reply@rowellblanca.dev';

  if (!user || !pass) {
    console.warn('[Mailer] MAILTRAP_USER or MAILTRAP_PASS is not set in environment variables. Email notification skipped.');
    return { success: false, reason: 'Credentials not configured' };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    auth: {
      user,
      pass,
    },
  });

  const mailOptions = {
    from: `"${name}" <${fromEmail}>`,
    replyTo: email,
    to: toEmail,
    subject: subject ? `[Portfolio Inquiry] ${subject}` : `New Inquiry from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
        <h2 style="color: #0f172a; margin-top: 0;">New Portfolio Inquiry</h2>
        <p><strong>From:</strong> ${name} (&lt;<a href="mailto:${email}">${email}</a>&gt;)</p>
        ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="color: #334155; white-space: pre-wrap;">${message}</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #94a3b8;">Sent via rowellblanca.dev contact form</p>
      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  return { success: true, messageId: info.messageId };
}
