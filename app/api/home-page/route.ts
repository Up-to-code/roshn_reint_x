import { NextRequest, NextResponse } from 'next/server';
import { readSettings, writeSettings } from '@/lib/db-utils';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
const defaultHomePageData = {
  en: {
    partners: [
      {
        id: '1',
        src: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200',
        alt: 'Partner 1',
        name: 'Real Estate Partner 1',
        logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200',
        link: 'https://example.com/partner1'
      },
      {
        id: '2',
        src: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200',
        alt: 'Partner 2',
        name: 'Real Estate Partner 2',
        logo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200',
        link: 'https://example.com/partner2'
      },
      {
        id: '3',
        src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200',
        alt: 'Partner 3',
        name: 'Real Estate Partner 3',
        logo: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200',
        link: 'https://example.com/partner3'
      },
      {
        id: '4',
        src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200',
        alt: 'Partner 4',
        name: 'Real Estate Partner 4',
        logo: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200',
        link: 'https://example.com/partner4'
      },
      {
        id: '5',
        src: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=200',
        alt: 'Partner 5',
        name: 'Real Estate Partner 5',
        logo: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=200',
        link: 'https://example.com/partner5'
      }
    ],
    hero: {
      title: "Welcome to Our Platform",
      primaryButton: { text: "Get Started", link: "/signup", variant: "primary" as const },
      secondaryButton: { text: "Learn More", link: "/about", variant: "secondary" as const },
      backgroundVideo: "",
      overlayColor: "rgba(0,0,0,0.4)",
    },
    banners: [],
    whyUs: { title: "Why Choose Us", subtitle: "We provide the best services in the industry", features: [] },
    testimonials: { title: "Testimonials", subtitle: "What our clients say", testimonials: [] },
    aboutUs: { title: "About Us", content: "We are a leading company...", image: "", stats: [] },
    contactUs: {
      title: "Contact Us",
      subtitle: "Get in touch",
      description: "We'd love to hear from you",
      enabled: true,
      email: "info@company.com",
      phone: "+1234567890",
      address: "123 Main Street",
      formEnabled: true,
      contactInfo: {
        address: "123 Main Street",
        phone: "+1234567890",
        email: "info@company.com",
        workingHours: "Mon-Fri: 9AM-5PM",
      },
      form: { enabled: true, fields: [] },
      map: { enabled: true, embedCode: "" },
    },
    footer: {
      copyrightText: "© 2024 RealeEast Properties. All rights reserved.",
      sections: [
        {
          id: "1",
          title: "Quick Links",
          links: [
            {
              id: "1-1",
              label: "Home",
              href: "/",
              external: false
            },
            {
              id: "1-2",
              label: "Properties",
              href: "/properties",
              external: false
            },
            {
              id: "1-3",
              label: "Services",
              href: "/services",
              external: false
            },
            {
              id: "1-4",
              label: "Agents",
              href: "/agents",
              external: false
            },
            {
              id: "1-5",
              label: "Contact",
              href: "/contact",
              external: false
            }
          ]
        },
        {
          id: "2",
          title: "Services",
          links: [
            {
              id: "2-1",
              label: "Buying",
              href: "/services/buying",
              external: false
            },
            {
              id: "2-2",
              label: "Selling",
              href: "/services/selling",
              external: false
            },
            {
              id: "2-3",
              label: "Renting",
              href: "/services/renting",
              external: false
            },
            {
              id: "2-4",
              label: "Property Management",
              href: "/services/property-management",
              external: false
            },
            {
              id: "2-5",
              label: "Valuation",
              href: "/services/valuation",
              external: false
            }
          ]
        },
        {
          id: "3",
          title: "Support",
          links: [
            {
              id: "3-1",
              label: "Contact",
              href: "/contact",
              external: false
            },
            {
              id: "3-2",
              label: "Help Center",
              href: "/help",
              external: false
            },
            {
              id: "3-3",
              label: "Privacy Policy",
              href: "/privacy",
              external: false
            },
            {
              id: "3-4",
              label: "Terms of Service",
              href: "/terms",
              external: false
            },
            {
              id: "3-5",
              label: "FAQ",
              href: "/faq",
              external: false
            }
          ]
        }
      ],
      socialLinks: [
        {
          platform: "facebook",
          url: "https://facebook.com/realeastproperties",
          icon: "facebook"
        },
        {
          platform: "twitter",
          url: "https://twitter.com/realeastproperties",
          icon: "twitter"
        },
        {
          platform: "instagram",
          url: "https://instagram.com/realeastproperties",
          icon: "instagram"
        },
        {
          platform: "linkedin",
          url: "https://linkedin.com/company/realeastproperties",
          icon: "linkedin"
        },
        {
          platform: "youtube",
          url: "https://youtube.com/realeastproperties",
          icon: "youtube"
        }
      ],
      backgroundColor: "#0f172a",
      textColor: "#94a3b8",
      showSocialLinks: true
    }
  },
  ar: {
    partners: [
      {
        id: '1',
        src: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200',
        alt: 'شريك 1',
        name: 'شريك عقاري 1',
        logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200',
        link: 'https://example.com/partner1'
      },
      {
        id: '2',
        src: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200',
        alt: 'شريك 2',
        name: 'شريك عقاري 2',
        logo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200',
        link: 'https://example.com/partner2'
      },
      {
        id: '3',
        src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200',
        alt: 'شريك 3',
        name: 'شريك عقاري 3',
        logo: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200',
        link: 'https://example.com/partner3'
      },
      {
        id: '4',
        src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200',
        alt: 'شريك 4',
        name: 'شريك عقاري 4',
        logo: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200',
        link: 'https://example.com/partner4'
      },
      {
        id: '5',
        src: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=200',
        alt: 'شريك 5',
        name: 'شريك عقاري 5',
        logo: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=200',
        link: 'https://example.com/partner5'
      }
    ],
    hero: {
      title: "مرحباً بكم في منصتنا",
      primaryButton: { text: "ابدأ الآن", link: "/signup", variant: "primary" as const },
      secondaryButton: { text: "اعرف المزيد", link: "/about", variant: "secondary" as const },
      backgroundVideo: "",
      overlayColor: "rgba(0,0,0,0.4)",
    },
    banners: [],
    whyUs: { title: "لماذا تختارنا", subtitle: "نقدم أفضل الخدمات في المجال", features: [] },
    testimonials: { title: "آراء العملاء", subtitle: "ما يقوله عملاؤنا", testimonials: [] },
    aboutUs: { title: "من نحن", content: "نحن شركة رائدة...", image: "", stats: [] },
    contactUs: {
      title: "اتصل بنا",
      subtitle: "ابق على تواصل",
      description: "نحن سعداء بتواصلك معنا",
      enabled: true,
      email: "info@company.com",
      phone: "+1234567890",
      address: "123 الشارع الرئيسي",
      formEnabled: true,
      contactInfo: {
        address: "123 الشارع الرئيسي",
        phone: "+1234567890",
        email: "info@company.com",
        workingHours: "الإثنين-الجمعة: 9ص-5م",
      },
      form: { enabled: true, fields: [] },
      map: { enabled: true, embedCode: "" },
    },
    footer: {
      copyrightText: "© 2024 العقارية. جميع الحقوق محفوظة.",
      sections: [
        {
          id: "1",
          title: "روابط سريعة",
          links: [
            {
              id: "1-1",
              label: "الرئيسية",
              href: "/",
              external: false
            },
            {
              id: "1-2",
              label: "العقارات",
              href: "/properties",
              external: false
            },
            {
              id: "1-3",
              label: "الخدمات",
              href: "/services",
              external: false
            },
            {
              id: "1-4",
              label: "الوكلاء",
              href: "/agents",
              external: false
            },
            {
              id: "1-5",
              label: "اتصل بنا",
              href: "/contact",
              external: false
            }
          ]
        },
        {
          id: "2",
          title: "خدماتنا",
          links: [
            {
              id: "2-1",
              label: "الشراء",
              href: "/services/buying",
              external: false
            },
            {
              id: "2-2",
              label: "البيع",
              href: "/services/selling",
              external: false
            },
            {
              id: "2-3",
              label: "التأجير",
              href: "/services/renting",
              external: false
            },
            {
              id: "2-4",
              label: "إدارة العقارات",
              href: "/services/property-management",
              external: false
            },
            {
              id: "2-5",
              label: "التقييم",
              href: "/services/valuation",
              external: false
            }
          ]
        },
        {
          id: "3",
          title: "الدعم",
          links: [
            {
              id: "3-1",
              label: "اتصل بنا",
              href: "/contact",
              external: false
            },
            {
              id: "3-2",
              label: "مركز المساعدة",
              href: "/help",
              external: false
            },
            {
              id: "3-3",
              label: "سياسة الخصوصية",
              href: "/privacy",
              external: false
            },
            {
              id: "3-4",
              label: "شروط الخدمة",
              href: "/terms",
              external: false
            },
            {
              id: "3-5",
              label: "الأسئلة الشائعة",
              href: "/faq",
              external: false
            }
          ]
        }
      ],
      socialLinks: [
        {
          platform: "facebook",
          url: "https://facebook.com/realeastproperties",
          icon: "facebook"
        },
        {
          platform: "twitter",
          url: "https://twitter.com/realeastproperties",
          icon: "twitter"
        },
        {
          platform: "instagram",
          url: "https://instagram.com/realeastproperties",
          icon: "instagram"
        },
        {
          platform: "linkedin",
          url: "https://linkedin.com/company/realeastproperties",
          icon: "linkedin"
        },
        {
          platform: "youtube",
          url: "https://youtube.com/realeastproperties",
          icon: "youtube"
        }
      ],
      backgroundColor: "#0f172a",
      textColor: "#94a3b8",
      showSocialLinks: true
    }
  },
};

// GET /api/home-page
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') as 'en' | 'ar' | null;

    const settings = await readSettings();
    const homePageData = settings.homePage || defaultHomePageData;

    // Deep merge to ensure hero.backgroundVideo is preserved
    const mergedData = {
      en: {
        ...defaultHomePageData.en,
        ...homePageData.en,
        hero: {
          ...defaultHomePageData.en.hero,
          ...(homePageData.en?.hero || {}),
          // Ensure backgroundVideo is preserved (can be empty string)
          backgroundVideo: homePageData.en?.hero?.backgroundVideo !== undefined 
            ? homePageData.en.hero.backgroundVideo 
            : defaultHomePageData.en.hero.backgroundVideo,
        },
      },
      ar: {
        ...defaultHomePageData.ar,
        ...homePageData.ar,
        hero: {
          ...defaultHomePageData.ar.hero,
          ...(homePageData.ar?.hero || {}),
          // Ensure backgroundVideo is preserved (can be empty string)
          backgroundVideo: homePageData.ar?.hero?.backgroundVideo !== undefined 
            ? homePageData.ar.hero.backgroundVideo 
            : defaultHomePageData.ar.hero.backgroundVideo,
        },
      },
    };

    if (locale && (locale === 'ar' || locale === 'en')) {
      return NextResponse.json({ success: true, data: mergedData[locale] });
    }

    return NextResponse.json({ success: true, data: mergedData });
  } catch (error) {
    console.error('Error reading home page data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to read home page data' },
      { status: 500 }
    );
  }
}

// POST /api/home-page
export async function POST(request: NextRequest) {
  try {
    const homePageData = await request.json();

    console.log('Received home page data:', {
      hasEn: !!homePageData.en,
      hasAr: !!homePageData.ar,
      enHero: homePageData.en?.hero ? {
        hasTitle: !!homePageData.en.hero.title,
        hasBackgroundVideo: !!homePageData.en.hero.backgroundVideo,
        backgroundVideo: homePageData.en.hero.backgroundVideo,
      } : null,
      arHero: homePageData.ar?.hero ? {
        hasTitle: !!homePageData.ar.hero.title,
        hasBackgroundVideo: !!homePageData.ar.hero.backgroundVideo,
        backgroundVideo: homePageData.ar.hero.backgroundVideo,
      } : null,
    });

    if (!homePageData.en || !homePageData.ar) {
      console.error('Invalid data structure - missing en or ar:', {
        hasEn: !!homePageData.en,
        hasAr: !!homePageData.ar,
      });
      return NextResponse.json(
        { success: false, error: 'Invalid home page data structure' },
        { status: 400 }
      );
    }

    // Ensure hero objects have all required fields including backgroundVideo
    if (!homePageData.en.hero) {
      homePageData.en.hero = { ...defaultHomePageData.en.hero };
    } else {
      homePageData.en.hero = {
        ...defaultHomePageData.en.hero,
        ...homePageData.en.hero,
        backgroundVideo: homePageData.en.hero.backgroundVideo || '',
      };
    }

    if (!homePageData.ar.hero) {
      homePageData.ar.hero = { ...defaultHomePageData.ar.hero };
    } else {
      homePageData.ar.hero = {
        ...defaultHomePageData.ar.hero,
        ...homePageData.ar.hero,
        backgroundVideo: homePageData.ar.hero.backgroundVideo || '',
      };
    }

    const settings = await readSettings();

    const updatedSettings = { ...settings, homePage: homePageData };

    console.log('Saving to database:', {
      enHeroBackgroundVideo: updatedSettings.homePage?.en?.hero?.backgroundVideo,
      arHeroBackgroundVideo: updatedSettings.homePage?.ar?.hero?.backgroundVideo,
    });

    const success = await writeSettings(updatedSettings);

    if (success) {
      console.log('Home page data saved successfully');
      return NextResponse.json({ success: true, message: 'Home page data saved successfully' });
    }

    console.error('Failed to save home page data - writeSettings returned false');
    return NextResponse.json(
      { success: false, error: 'Failed to save home page data' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Error saving home page data:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
      });
    }
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Invalid home page data' },
      { status: 400 }
    );
  }
}