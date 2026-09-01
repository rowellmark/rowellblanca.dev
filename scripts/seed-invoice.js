const { PrismaClient } = require('../lib/generated/client');
const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.invoice.findFirst();
  if (!existing) {
    const inv = await prisma.invoice.create({
      data: {
        invoiceNumber: 'INV-2026-001',
        clientName: 'Sarah Jenkins',
        clientEmail: 's.jenkins@apexdigital.io',
        clientCompany: 'Apex Digital Solutions Ltd.',
        clientPhone: '+1 (555) 382-9102',
        clientAddress: '742 Evergreen Terrace, Suite 400, San Francisco, CA 94107',
        currency: 'USD',
        subtotal: 5200,
        discount: 0,
        taxRate: 0,
        totalAmount: 5200,
        tagline: 'Bring your ideas in to reality.',
        status: 'SCHEDULED',
        scheduledSendDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        paymentTerms: 'Payment due within 14 days of invoice issue date. Direct bank wire, Wise, Stripe, or PayPal accepted.',
        paymentDetails: `Bank: Silicon Valley Bank / Wise USD
Beneficiary: Rowell Mark Blanca
Account Number: **** **** 8392
SWIFT: WISEUS33XXX
PayPal: rowellblanca94@gmail.com`,
        items: {
          create: [
            {
              description: 'Full-Stack Next.js 14 Custom Web Platform',
              details: 'High-performance Next.js App Router architecture, responsive UI components, Tailwind CSS styling, dynamic page routing, and SEO optimization.',
              quantity: 1,
              unitPrice: 3500,
              amount: 3500,
            },
            {
              description: 'PostgreSQL Database & Custom CRM Lead Engine',
              details: 'Prisma ORM schema design, NeonDB connection pooling, automated lead capture pipeline, spam protection, and admin API webhooks.',
              quantity: 1,
              unitPrice: 1200,
              amount: 1200,
            },
            {
              description: 'Cloud Edge Deployment & Performance Tuning',
              details: 'Vercel Edge CDN setup, automated SSL security, image optimization pipeline, and 99+ Google Core Web Vitals audit score.',
              quantity: 1,
              unitPrice: 500,
              amount: 500,
            },
          ],
        },
      },
    });
    console.log('Seeded initial invoice:', inv.invoiceNumber);
  } else {
    console.log('Invoices already exist in DB:', existing.invoiceNumber);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
