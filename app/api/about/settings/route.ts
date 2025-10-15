import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function deepMerge<T>(base: T, override: any): T {
  if (Array.isArray(base)) {
    return (override && Array.isArray(override) ? override : base) as unknown as T;
  }
  if (base && typeof base === 'object') {
    const result: any = { ...base };
    if (override && typeof override === 'object') {
      for (const key of Object.keys(override)) {
        const baseVal = (base as any)[key];
        const overVal = override[key];
        result[key] = deepMerge(baseVal, overVal);
      }
    }
    return result;
  }
  return (override === undefined ? base : override) as T;
}

function getDefaultAboutSettings() {
  return {
    hero: {
      badge: { en: "About Our Company", ar: "نبذة عن شركتنا" },
      title: { en: "Building Dreams, Creating Homes", ar: "نبني الأحلام، نخلق المنازل" },
      subtitle: {
        en: "We are a team of passionate real estate professionals dedicated to helping you find your perfect property",
        ar: "نحن فريق من محترفي العقارات الشغوفين المكرسين لمساعدتك في العثور على عقارك المثالي"
      }
    },
    story: {
      title: { en: "15 Years of Excellence in Real Estate", ar: "15 عاماً من التميز في العقارات" },
      paragraph1: {
        en: "Founded in 2009, our company has grown from a small team of passionate real estate enthusiasts to one of the most trusted names in the industry.",
        ar: "تأسست شركتنا في عام 2009، ونمت من فريق صغير من عشاق العقارات الشغوفين إلى أحد الأسماء الموثوقة في الصناعة."
      },
      paragraph2: {
        en: "Over the years, we've helped thousands of families find their dream homes and assisted investors in making sound property decisions.",
        ar: "على مر السنين، ساعدنا آلاف العائلات في العثور على منازل أحلامهم وساعدنا المستثمرين في اتخاذ قرارات عقارية سليمة."
      },
      paragraph3: {
        en: "Today, we continue to innovate and adapt to the changing real estate landscape, always keeping our clients' best interests at heart.",
        ar: "اليوم، نواصل الابتكار والتكيف مع مشهد العقارات المتغير، مع الحفاظ دائماً على المصالح الفضلى لعملائنا."
      },
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      yearsInBusiness: { en: "15+", ar: "15+" }
    },
    stats: [],
    values: [],
    team: [],
    cta: {
      title: {
        en: "Ready to Find Your Dream Property?",
        ar: "هل أنت مستعد للعثور على عقار أحلامك؟"
      },
      subtitle: {
        en: "Let's work together to turn your real estate dreams into reality",
        ar: "دعنا نعمل معاً لتحويل أحلامك العقارية إلى حقيقة"
      }
    },
    contact: {
      address: {
        en: "123 Business Street\nCity, State 12345",
        ar: "123 شارع الأعمال\nالمدينة، الولاية 12345"
      },
      phone: {
        en: "+1 (555) 123-4567\nMon-Fri 9AM-6PM",
        ar: "+1 (555) 123-4567\nالإثنين-الجمعة 9 ص-6 م"
      },
      email: {
        en: "info@realestate.com\n24/7 Support",
        ar: "info@realestate.com\nدعم على مدار الساعة"
      }
    }
  };
}

// Reset about data to default
async function resetAboutData() {
  const defaultData = {
    hero: {
      badge: { en: "About Our Company", ar: "نبذة عن شركتنا" },
      title: { en: "Building Dreams, Creating Homes", ar: "نبني الأحلام، نخلق المنازل" },
      subtitle: { 
        en: "We are a team of passionate real estate professionals dedicated to helping you find your perfect property",
        ar: "نحن فريق من محترفي العقارات الشغوفين المكرسين لمساعدتك في العثور على عقارك المثالي"
      }
    },
    story: {
      title: { en: "15 Years of Excellence in Real Estate", ar: "15 عاماً من التميز في العقارات" },
      paragraph1: { 
        en: "Founded in 2009, our company has grown from a small team of passionate real estate enthusiasts to one of the most trusted names in the industry.",
        ar: "تأسست شركتنا في عام 2009، ونمت من فريق صغير من عشاق العقارات الشغوفين إلى أحد الأسماء الموثوقة في الصناعة."
      },
      paragraph2: { 
        en: "Over the years, we've helped thousands of families find their dream homes and assisted investors in making sound property decisions.",
        ar: "على مر السنين، ساعدنا آلاف العائلات في العثور على منازل أحلامهم وساعدنا المستثمرين في اتخاذ قرارات عقارية سليمة."
      },
      paragraph3: { 
        en: "Today, we continue to innovate and adapt to the changing real estate landscape, always keeping our clients' best interests at heart.",
        ar: "اليوم، نواصل الابتكار والتكيف مع مشهد العقارات المتغير، مع الحفاظ دائماً على المصالح الفضلى لعملائنا."
      },
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      yearsInBusiness: { en: "15+", ar: "15+" }
    },
    stats: [
      { value: { en: "500+", ar: "500+" }, label: { en: "Properties Sold", ar: "عقارات مبيعة" } },
      { value: { en: "10+", ar: "10+" }, label: { en: "Years Experience", ar: "سنوات خبرة" } },
      { value: { en: "98%", ar: "98%" }, label: { en: "Client Satisfaction", ar: "رضا العملاء" } },
      { value: { en: "50+", ar: "50+" }, label: { en: "Team Members", ar: "أعضاء الفريق" } }
    ],
    values: [
      {
        id: 1,
        icon: "Shield",
        title: { en: "Trust", ar: "الثقة" },
        description: { 
          en: "Building lasting relationships through transparency and integrity",
          ar: "بناء علاقات دائمة من خلال الشفافية والنزاهة"
        }
      },
      {
        id: 2,
        icon: "Heart",
        title: { en: "Passion", ar: "الشغف" },
        description: { 
          en: "Dedicated to helping clients find their perfect property",
          ar: "مكرسون لمساعدة العملاء في العثور على عقارهم المثالي"
        }
      },
      {
        id: 3,
        icon: "Target",
        title: { en: "Excellence", ar: "التميز" },
        description: { 
          en: "Setting the highest standards in real estate service",
          ar: "وضع أعلى المعايير في خدمة العقارات"
        }
      },
      {
        id: 4,
        icon: "TrendingUp",
        title: { en: "Growth", ar: "النمو" },
        description: { 
          en: "Continuously evolving to meet market demands",
          ar: "التطور المستمر لتلبية متطلبات السوق"
        }
      }
    ],
    team: [
      {
        id: 1,
        name: { en: "John Doe", ar: "جون دو" },
        role: { en: "CEO & Founder", ar: "الرئيس التنفيذي والمؤسس" },
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
        description: { 
          en: "Leading the company with 15+ years of real estate expertise",
          ar: "قيادة الشركة بخبرة تزيد عن 15 عاماً في العقارات"
        }
      },
      {
        id: 2,
        name: { en: "Jane Smith", ar: "جين سميث" },
        role: { en: "Head of Operations", ar: "رئيسة العمليات" },
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
        description: { 
          en: "Ensuring smooth operations and exceptional client service",
          ar: "ضمان سلاسة العمليات وخدمة العملاء الاستثنائية"
        }
      },
      {
        id: 3,
        name: { en: "Mike Johnson", ar: "مايك جونسون" },
        role: { en: "Senior Real Estate Advisor", ar: "مستشار عقاري أول" },
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
        description: { 
          en: "Expert in property valuation and market analysis",
          ar: "خبير في تقييم العقارات وتحليل السوق"
        }
      },
      {
        id: 4,
        name: { en: "Sarah Williams", ar: "سارة ويليامز" },
        role: { en: "Marketing Director", ar: "مديرة التسويق" },
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
        description: { 
          en: "Creating innovative marketing strategies for our clients",
          ar: "خلق استراتيجيات تسويق مبتكرة لعملائنا"
        }
      }
    ],
    cta: {
      title: { 
        en: "Ready to Find Your Dream Property?", 
        ar: "هل أنت مستعد للعثور على عقار أحلامك؟" 
      },
      subtitle: { 
        en: "Let's work together to turn your real estate dreams into reality",
        ar: "دعنا نعمل معاً لتحويل أحلامك العقارية إلى حقيقة"
      }
    },
    contact: {
      address: { 
        en: "123 Business Street\nCity, State 12345",
        ar: "123 شارع الأعمال\nالمدينة، الولاية 12345"
      },
      phone: { 
        en: "+1 (555) 123-4567\nMon-Fri 9AM-6PM",
        ar: "+1 (555) 123-4567\nالإثنين-الجمعة 9 ص-6 م"
      },
      email: { 
        en: "info@realestate.com\n24/7 Support",
        ar: "info@realestate.com\nدعم على مدار الساعة"
      }
    }
  };
  
  try {
    await prisma.aboutSettings.upsert({
      where: { id: 'default' },
      create: { id: 'default', data: defaultData },
      update: { data: defaultData },
    });
    return true;
  } catch (error) {
    console.error('Error resetting about settings:', error);
    return false;
  }
}

// GET /api/about/settings - Read about settings
export async function GET() {
  try {
    const existing = await prisma.aboutSettings.findUnique({ where: { id: 'default' } });
    const aboutData = deepMerge(getDefaultAboutSettings(), existing?.data ?? {});
    return NextResponse.json({ 
      success: true, 
      data: aboutData 
    });
  } catch (error) {
    console.error('Error reading about data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to read about data' },
      { status: 500 }
    );
  }
}

// POST /api/about/settings - Update about settings
export async function POST(request: NextRequest) {
  try {
    const body: any = await request.json();
    const about = body?.about ?? body; // accept both wrapped and raw payloads
    
    if (!about) {
      return NextResponse.json(
        { success: false, error: 'About data is required' },
        { status: 400 }
      );
    }
    
    const mergedToStore = deepMerge(getDefaultAboutSettings(), about);
    await prisma.aboutSettings.upsert({
      where: { id: 'default' },
      create: { id: 'default', data: mergedToStore },
      update: { data: mergedToStore },
    });
    return NextResponse.json({ 
      success: true, 
      message: 'About settings saved successfully',
      data: mergedToStore
    });
  } catch (error) {
    console.error('Error saving about data:', error);
    return NextResponse.json(
      { success: false, error: 'Invalid about data' },
      { status: 400 }
    );
  }
}

// PUT /api/about/settings - Reset about settings to default
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    if (action === 'reset') {
      const success = await resetAboutData();
      if (success) {
        const existing = await prisma.aboutSettings.findUnique({ where: { id: 'default' } });
        return NextResponse.json({ 
          success: true, 
          message: 'About settings reset to default',
          data: existing?.data ?? {}
        });
      }
      return NextResponse.json(
        { success: false, error: 'Failed to reset about settings' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error resetting about data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reset about settings' },
      { status: 500 }
    );
  }
}

// DELETE /api/about/settings - Clear all about settings
export async function DELETE() {
  try {
    await prisma.aboutSettings.upsert({
      where: { id: 'default' },
      create: { id: 'default', data: { hero: { badge: {}, title: {}, subtitle: {} }, story: { title: {}, paragraph1: {}, paragraph2: {}, paragraph3: {}, image: "", yearsInBusiness: {} }, stats: [], values: [], team: [], cta: { title: {}, subtitle: {} }, contact: { address: {}, phone: {}, email: {} } } },
      update: { data: { hero: { badge: {}, title: {}, subtitle: {} }, story: { title: {}, paragraph1: {}, paragraph2: {}, paragraph3: {}, image: "", yearsInBusiness: {} }, stats: [], values: [], team: [], cta: { title: {}, subtitle: {} }, contact: { address: {}, phone: {}, email: {} } } },
    });
    return NextResponse.json({ 
      success: true, 
      message: 'About settings cleared successfully' 
    });
  } catch (error) {
    console.error('Error clearing about data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear about settings' },
      { status: 500 }
    );
  }
}