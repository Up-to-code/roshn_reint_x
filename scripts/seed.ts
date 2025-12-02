import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seeding...\n');

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log('🧹 Cleaning existing data...');
  try {
    await prisma.event.deleteMany();
    await prisma.contact.deleteMany();
    await prisma.interest.deleteMany();
    await prisma.property.deleteMany();
    await prisma.post.deleteMany();
    await prisma.service.deleteMany();
    console.log('✅ Existing data cleaned\n');
  } catch (error: any) {
    if (error.code === 'P2021' || error.message?.includes('does not exist')) {
      console.log('⚠️  Tables do not exist yet. Skipping cleanup. Run migrations first if needed.\n');
    } else {
      throw error;
    }
  }

  // Seed Properties
  console.log('🏡 Creating properties...');
  const properties = await prisma.property.createMany({
    data: [
      {
        titleEn: 'Luxury Villa in Riyadh',
        titleAr: 'فيلا فاخرة في الرياض',
        descriptionEn: 'Beautiful 5-bedroom villa with modern amenities, located in the heart of Riyadh. Features include a private pool, garden, and premium finishes throughout.',
        descriptionAr: 'فيلا جميلة من 5 غرف نوم مع وسائل الراحة الحديثة، تقع في قلب الرياض. تشمل الميزات مسبح خاص وحديقة وتشطيبات فاخرة في جميع أنحاء المنزل.',
        city: 'Riyadh',
        district: 'Al Olaya',
        images: [
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
        ],
      },
      {
        titleEn: 'Modern Apartment in Jeddah',
        titleAr: 'شقة حديثة في جدة',
        descriptionEn: 'Spacious 3-bedroom apartment with sea view, located in the prestigious Corniche area. Includes parking, gym, and 24/7 security.',
        descriptionAr: 'شقة واسعة من 3 غرف نوم مع إطلالة على البحر، تقع في منطقة الكورنيش المرموقة. تشمل موقف سيارات وصالة ألعاب رياضية وأمن على مدار الساعة.',
        city: 'Jeddah',
        district: 'Corniche',
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
        ],
      },
      {
        titleEn: 'Family Home in Dammam',
        titleAr: 'منزل عائلي في الدمام',
        descriptionEn: 'Comfortable 4-bedroom family home with large backyard, perfect for families. Close to schools and shopping centers.',
        descriptionAr: 'منزل عائلي مريح من 4 غرف نوم مع فناء خلفي كبير، مثالي للعائلات. قريب من المدارس ومراكز التسوق.',
        city: 'Dammam',
        district: 'Al Faisaliyah',
        images: [
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
          'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800',
        ],
      },
      {
        titleEn: 'Penthouse in Khobar',
        titleAr: 'بنتهاوس في الخبر',
        descriptionEn: 'Luxurious penthouse with panoramic city views, premium finishes, and private terrace. Located in the most exclusive area of Khobar.',
        descriptionAr: 'بنتهاوس فاخر مع إطلالات بانورامية على المدينة وتشطيبات فاخرة وتراس خاص. يقع في أكثر المناطق حصرية في الخبر.',
        city: 'Khobar',
        district: 'Al Hamra',
        images: [
          'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800',
          'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
        ],
      },
      {
        titleEn: 'Investment Property in Makkah',
        titleAr: 'عقار استثماري في مكة',
        descriptionEn: 'Prime commercial property ideal for investment, located near the Grand Mosque. High rental yield potential.',
        descriptionAr: 'عقار تجاري رئيسي مثالي للاستثمار، يقع بالقرب من المسجد الحرام. إمكانية عائد إيجار عالية.',
        city: 'Makkah',
        district: 'Al Haram',
        images: [
          'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
        ],
      },
    ],
  });
  console.log(`✅ Created ${properties.count} properties\n`);

  // Get created properties for relationships
  const createdProperties = await prisma.property.findMany();
  const property1 = createdProperties[0];
  const property2 = createdProperties[1];

  // Seed Contacts
  console.log('📧 Creating contacts...');
  const contactData = [
    {
      name: 'Ahmed Al-Saud',
      phoneNumber: '+966501234567',
      email: 'ahmed.alsaud@example.com',
      message: 'I am interested in viewing the luxury villa in Riyadh. Please contact me to schedule a visit.',
    },
    {
      name: 'Fatima Al-Rashid',
      phoneNumber: '+966502345678',
      email: 'fatima.alrashid@example.com',
      message: 'Looking for a modern apartment in Jeddah for my family. Would like more information about the available options.',
    },
    {
      name: 'Mohammed Al-Ghamdi',
      phoneNumber: '+966503456789',
      message: 'Interested in investment properties in Makkah. Please send me details about rental yields and payment plans.',
    },
    {
      name: 'Sara Al-Mutairi',
      phoneNumber: '+966504567890',
      email: 'sara.almutairi@example.com',
      message: 'I need a family home in Dammam. Looking for something with 4+ bedrooms and a good school nearby.',
    },
    {
      name: 'Khalid Al-Zahrani',
      phoneNumber: '+966505678901',
      message: 'Interested in the penthouse in Khobar. Can you provide more details about the amenities and pricing?',
    },
  ];
  
  // Create contacts using raw SQL - check if email column exists first
  const createdContacts = [];
  for (const contact of contactData) {
    const id = `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    try {
      // Try with email column
      await prisma.$executeRawUnsafe(
        `INSERT INTO contacts (id, name, "phoneNumber", message, email, "createdAt", "updatedAt") 
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
        id,
        contact.name,
        contact.phoneNumber,
        contact.message,
        contact.email || null
      );
    } catch (error: any) {
      // If email column doesn't exist, insert without it
      if (error.code === 'P2010' || error.message?.includes('email')) {
        await prisma.$executeRawUnsafe(
          `INSERT INTO contacts (id, name, "phoneNumber", message, "createdAt", "updatedAt") 
           VALUES ($1, $2, $3, $4, NOW(), NOW())`,
          id,
          contact.name,
          contact.phoneNumber,
          contact.message
        );
      } else {
        throw error;
      }
    }
    createdContacts.push({ id, ...contact });
  }
  const contacts = { count: createdContacts.length };
  console.log(`✅ Created ${contacts.count} contacts\n`);

  // Use created contacts for relationships (already created above)

  // Seed Events
  console.log('📅 Creating events...');
  const events = await prisma.event.createMany({
    data: [
      {
        type: 'contact',
        title: 'New Contact Form Submission: Ahmed Al-Saud',
        description: 'New user added contact: Ahmed Al-Saud',
        metadata: {
          contactId: createdContacts[0].id,
          name: 'Ahmed Al-Saud',
          phoneNumber: '+966501234567',
          email: 'ahmed.alsaud@example.com',
          reason: 'Interested in property viewing',
        },
      },
      {
        type: 'property_interest',
        title: 'New Contact - Property Inquiry: Luxury Villa in Riyadh',
        description: 'New user interested in property: Luxury Villa in Riyadh',
        metadata: {
          contactId: createdContacts[0].id,
          propertyId: property1.id,
          propertyTitle: property1.titleEn,
          name: 'Ahmed Al-Saud',
          phoneNumber: '+966501234567',
          email: 'ahmed.alsaud@example.com',
          reason: 'User interested in property',
        },
      },
      {
        type: 'contact',
        title: 'New Contact Form Submission: Fatima Al-Rashid',
        description: 'New user added contact: Fatima Al-Rashid',
        metadata: {
          contactId: createdContacts[1].id,
          name: 'Fatima Al-Rashid',
          phoneNumber: '+966502345678',
          email: 'fatima.alrashid@example.com',
          reason: 'Looking for apartment',
        },
      },
      {
        type: 'property_interest',
        title: 'New Contact - Property Inquiry: Modern Apartment in Jeddah',
        description: 'New user interested in property: Modern Apartment in Jeddah',
        metadata: {
          contactId: createdContacts[1].id,
          propertyId: property2.id,
          propertyTitle: property2.titleEn,
          name: 'Fatima Al-Rashid',
          phoneNumber: '+966502345678',
          email: 'fatima.alrashid@example.com',
          reason: 'User interested in property',
        },
      },
      {
        type: 'property_created',
        title: 'Property Created: Luxury Villa in Riyadh',
        description: 'New property added to the system',
        metadata: {
          propertyId: property1.id,
          propertyTitle: property1.titleEn,
          city: property1.city,
          district: property1.district,
        },
      },
      {
        type: 'property_created',
        title: 'Property Created: Modern Apartment in Jeddah',
        description: 'New property added to the system',
        metadata: {
          propertyId: property2.id,
          propertyTitle: property2.titleEn,
          city: property2.city,
          district: property2.district,
        },
      },
    ],
  });
  console.log(`✅ Created ${events.count} events\n`);

  // Seed Services
  console.log('🛠️ Creating services...');
  const services = await prisma.service.createMany({
    data: [
      {
        title: 'Property Valuation',
        description: 'Professional property valuation services to determine accurate market value of your property.',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
        features: [
          'Market analysis',
          'Comparative property assessment',
          'Detailed valuation report',
          'Expert consultation',
        ],
        order: 1,
        enabled: true,
      },
      {
        title: 'Property Management',
        description: 'Comprehensive property management services including maintenance, tenant relations, and financial management.',
        image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800',
        features: [
          '24/7 maintenance support',
          'Tenant screening and management',
          'Rent collection',
          'Property inspections',
        ],
        order: 2,
        enabled: true,
      },
      {
        title: 'Real Estate Investment Consultation',
        description: 'Expert advice on real estate investment opportunities and portfolio management.',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
        features: [
          'Investment strategy development',
          'Market trend analysis',
          'ROI calculations',
          'Portfolio diversification advice',
        ],
        order: 3,
        enabled: true,
      },
    ],
  });
  console.log(`✅ Created ${services.count} services\n`);

  // Seed Posts
  console.log('📝 Creating blog posts...');
  const posts = await prisma.post.createMany({
    data: [
      {
        title: 'Top 5 Real Estate Investment Tips in Saudi Arabia',
        content: '<h1>Top 5 Real Estate Investment Tips in Saudi Arabia</h1><p>Investing in real estate in Saudi Arabia can be highly rewarding if you follow the right strategies. Here are our top 5 tips for successful real estate investment...</p><h2>1. Location is Key</h2><p>Always prioritize location when investing in property. Areas with good infrastructure, schools, and amenities tend to appreciate faster.</p><h2>2. Understand Market Trends</h2><p>Stay informed about market trends and economic indicators that affect property values.</p><h2>3. Work with Professionals</h2><p>Partner with experienced real estate agents and legal advisors to navigate the market effectively.</p><h2>4. Consider Long-term Value</h2><p>Look for properties with potential for appreciation and rental income.</p><h2>5. Diversify Your Portfolio</h2><p>Don\'t put all your investments in one area or property type.</p>',
        excerpt: 'Learn the essential strategies for successful real estate investment in Saudi Arabia\'s growing market.',
        status: 'PUBLISHED',
        headerImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200',
        thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400',
      },
      {
        title: 'Understanding Property Laws in Saudi Arabia',
        content: '<h1>Understanding Property Laws in Saudi Arabia</h1><p>Navigating property laws in Saudi Arabia requires understanding both local regulations and Islamic property principles...</p><h2>Key Legal Considerations</h2><p>When purchasing property in Saudi Arabia, it\'s important to understand the legal framework, ownership rights, and registration processes.</p>',
        excerpt: 'A comprehensive guide to property laws and regulations in Saudi Arabia for investors and buyers.',
        status: 'PUBLISHED',
        headerImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200',
        thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400',
      },
      {
        title: 'Future of Real Estate in Saudi Arabia',
        content: '<h1>Future of Real Estate in Saudi Arabia</h1><p>The real estate sector in Saudi Arabia is experiencing significant growth driven by Vision 2030 initiatives...</p><p>This article explores upcoming trends and opportunities in the market.</p>',
        excerpt: 'Exploring the future trends and opportunities in Saudi Arabia\'s real estate market.',
        status: 'DRAFT',
        headerImage: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1200',
        thumbnail: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400',
      },
    ],
  });
  console.log(`✅ Created ${posts.count} blog posts\n`);

  // Seed Interests
  console.log('💼 Creating property interests...');
  const interests = await prisma.interest.createMany({
    data: [
      {
        name: 'Omar Al-Harbi',
        email: 'omar.alharbi@example.com',
        phone: '+966506789012',
        message: 'Very interested in the luxury villa. Please contact me ASAP.',
        propertyTitle: property1.titleEn,
      },
      {
        name: 'Noura Al-Qahtani',
        phone: '+966507890123',
        message: 'Would like to schedule a viewing for the apartment in Jeddah.',
        propertyTitle: property2.titleEn,
      },
    ],
  });
  console.log(`✅ Created ${interests.count} property interests\n`);

  console.log('✨ Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - Properties: ${properties.count}`);
  console.log(`   - Contacts: ${contacts.count}`);
  console.log(`   - Events: ${events.count}`);
  console.log(`   - Services: ${services.count}`);
  console.log(`   - Posts: ${posts.count}`);
  console.log(`   - Interests: ${interests.count}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
