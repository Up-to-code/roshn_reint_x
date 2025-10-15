const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const current = await prisma.siteSettings.findUnique({ where: { id: 'default' } });
  const data = current?.data || {};
  const updated = {
    ...data,
    logo: {
      ...(data.logo || {}),
      imageUrl: '/logo.jpg',
      altText: (data.logo && data.logo.altText) || 'Company Logo',
      width: (data.logo && data.logo.width) || 150,
      height: (data.logo && data.logo.height) || 50,
    },
  };
  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    create: { id: 'default', data: updated },
    update: { data: updated },
  });
  console.log('Updated site_settings.logo.imageUrl -> /logo.jpg');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


