import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Disable caching in production to always get fresh DB data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

function getDefaultAboutData() {
  return {
    hero: {
      title: "من نحن",
      subtitle: "درة العقارية، مطور عقاري معتمد من وزارة الإسكان، تقدم مجموعة متكاملة من الخدمات العقارية. مقرها في مدينة جدة، بدأت أولى أعمالها في عام 2017. وصلت إلى أكثر من 51 مشروعًا سكنيًا، واستطاعت من خلال أسعارها التنافسية تغطية شريحة واسعة ومكَّنت آلاف العائلات من تملك منازلهم.",
      image: "https://dorrah.sa/wp-content/uploads/2023/12/2023-12-24-20.34.01.jpg"
    },
    vision: {
      title: "الرؤية",
      description: "تقديم خدمات عقارية متميزة ومتكاملة من خلال الابتكار والاستدامة والتميز في كل جانب."
    },
    mission: {
      title: "الرسالة", 
      description: "توفير فرص استثمارية وسكنية استثنائية في قطاع العقارات وتحقيق تجربة فريدة لعملائنا."
    },
    goals: [
      "توفير خدمات متكاملة تمتد من فكرة شراء العقار إلى ما بعد البيع",
      "تسهيل عمليات البحث عن العقار واختياره وشرائه وتملكه",
      "تنويع خيارات المساحات والديكور وكذلك المنطقة السكنية"
    ],
    tagline: "توفير فرص استثمارية وسكنية استثنائية في قطاع العقارات، وتحقيق تجربة متفوقة لعملائنا."
  };
}

// GET /api/about - Read about data
export async function GET() {
  try {
    const existing = await prisma.aboutPage.findUnique({ 
      where: { id: 'default' } 
    });

    if (!existing) {
      // Create default if doesn't exist
      const defaultData = getDefaultAboutData();
      const newAboutPage = await prisma.aboutPage.create({
        data: {
          id: 'default',
          data: defaultData
        }
      });
      return NextResponse.json({ 
        success: true, 
        data: newAboutPage.data 
      });
    }

    return NextResponse.json({ 
      success: true, 
      data: existing.data 
    });
  } catch (error) {
    console.error('Error reading about data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch about page data' },
      { status: 500 }
    );
  }
}

// POST /api/about - Update about data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Accept both wrapped and direct data structures
    const aboutData = body?.data || body;
    
    if (!aboutData) {
      return NextResponse.json(
        { success: false, error: 'About data is required' },
        { status: 400 }
      );
    }

    // Validate the structure
    if (!aboutData.hero || !aboutData.vision || !aboutData.mission || !aboutData.goals || !aboutData.tagline) {
      return NextResponse.json(
        { success: false, error: 'Invalid about data structure' },
        { status: 400 }
      );
    }

    const updatedAboutPage = await prisma.aboutPage.upsert({
      where: { id: 'default' },
      create: {
        id: 'default',
        data: aboutData
      },
      update: {
        data: aboutData
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'About page data saved successfully',
      data: updatedAboutPage.data
    });
  } catch (error) {
    console.error('Error saving about data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save about page data' },
      { status: 500 }
    );
  }
}

// PUT /api/about - Reset about data to default
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    if (action === 'reset') {
      const defaultData = getDefaultAboutData();
      
      const resetAboutPage = await prisma.aboutPage.upsert({
        where: { id: 'default' },
        create: {
          id: 'default',
          data: defaultData
        },
        update: {
          data: defaultData
        }
      });

      return NextResponse.json({ 
        success: true, 
        message: 'About page data reset to default',
        data: resetAboutPage.data
      });
    }
    
    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error resetting about data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reset about page data' },
      { status: 500 }
    );
  }
}