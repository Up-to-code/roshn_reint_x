
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Testing Direct DB Access...');
  try {
    const property = await prisma.property.create({
      data: {
        titleEn: 'Direct DB Test',
        titleAr: 'Direct DB Test Ar',
        city: 'Riyadh',
        price: 999999,
        images: []
      }
    });
    console.log('Successfully created property with price:', property.price);
    
    // Clean up
    await prisma.property.delete({ where: { id: property.id } });
    console.log('Successfully cleaned up.');
    
  } catch (error) {
    console.error('Direct DB failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
