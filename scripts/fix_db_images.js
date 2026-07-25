const { PrismaClient } = require('../lib/generated/client');

const prisma = new PrismaClient();

async function fix() {
  const projects = await prisma.project.findMany();
  for (const p of projects) {
    let updated = false;
    const data = {};
    ['image', 'mobileImage', 'fullDesktopImage', 'fullMobileImage'].forEach((field) => {
      if (p[field] && typeof p[field] === 'string' && p[field].startsWith('//')) {
        data[field] = '/' + p[field].replace(/^\/+/, '');
        updated = true;
      }
    });

    if (updated) {
      await prisma.project.update({ where: { id: p.id }, data });
      console.log('✓ Cleaned project image path in DB for:', p.sitename);
    }
  }
  console.log('✓ Database image path cleanup completed.');
}

fix()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
