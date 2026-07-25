const { PrismaClient } = require('../lib/generated/client');
const prisma = new PrismaClient();

async function check() {
  const projects = await prisma.project.findMany();
  console.log('--- ALL DB PROJECTS ---');
  projects.forEach((p) => {
    console.log(`ID ${p.id}: ${p.sitename}`);
    console.log(`  image: "${p.image}"`);
    console.log(`  mobileImage: "${p.mobileImage}"`);
    console.log(`  fullDesktopImage: "${p.fullDesktopImage}"`);
    console.log(`  fullMobileImage: "${p.fullMobileImage}"`);
  });
}

check()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
