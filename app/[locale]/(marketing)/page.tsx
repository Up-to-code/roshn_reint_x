import { HeroSection } from "@/components/home-page/sections/hero-section";
 import { WhyUsSection } from "@/components/home-page/sections/why-us-section";
import { AboutUsSection } from "@/components/home-page/sections/about-us-section";
import { TestimonialsSection } from "@/components/home-page/sections/testimonials-section";
import { ContactUsSection } from "@/components/home-page/sections/contact-us-section";
import { PartnersBanner } from "@/components/home-page/sections/partners-banner";
import ApartmentsPage from "@/components/home-page/sections/ApartmentsPage";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

async function getHomePageData(locale: string) {
  try {
    const hdrs = headers();
    const host = hdrs.get('x-forwarded-host') || hdrs.get('host') || '';
    const proto = hdrs.get('x-forwarded-proto') || 'https';
    const envBase = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || '';
    const baseUrl = envBase || (host ? `${proto}://${host}` : '');
    const response = await fetch(`${baseUrl}/api/home-page?locale=${locale}`, {
      cache: 'no-store', // Ensure fresh data on each request
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    }
    
    throw new Error('Failed to load home page data');
  } catch (error) {
    // Return fallback data structure WITH partners array
    return {
      hero: {
        title: locale === 'ar' ? 'مرحباً بكم' : 'Welcome',
        subtitle: locale === 'ar' ? 'نحن هنا لمساعدتك' : 'We are here to help you',
        primaryButton: { text: locale === 'ar' ? 'ابدأ الآن' : 'Get Started', link: "/signup", variant: "primary" as const },
        secondaryButton: { text: locale === 'ar' ? 'اعرف المزيد' : 'Learn More', link: "/about", variant: "secondary" as const },
        backgroundVideo: "",
        overlayColor: "rgba(0,0,0,0.4)"
      },
      // ADDED: partners array in fallback data
      partners: [
        { src: "/placeholder-logo1.png", alt: "Partner 1" },
        { src: "/placeholder-logo2.png", alt: "Partner 2" },
        { src: "/placeholder-logo3.png", alt: "Partner 3" },
      ],
      banners: [],
      whyUs: { 
        title: locale === 'ar' ? 'لماذا نختارنا' : 'Why Choose Us', 
        subtitle: locale === 'ar' ? 'أفضل الخدمات' : 'Best Services', 
        features: [] 
      },
      testimonials: { 
        title: locale === 'ar' ? 'آراء العملاء' : 'Testimonials', 
        subtitle: locale === 'ar' ? 'ما يقوله عملاؤنا' : 'What our clients say', 
        testimonials: [] 
      },
      aboutUs: { 
        title: locale === 'ar' ? 'من نحن' : 'About Us', 
        content: locale === 'ar' ? 'شركة رائدة' : 'Leading company', 
        image: "", 
        stats: [] 
      },
      contactUs: {
        title: locale === 'ar' ? 'اتصل بنا' : 'Contact Us', 
        subtitle: locale === 'ar' ? 'ابق على تواصل' : 'Get in touch', 
        description: locale === 'ar' ? 'نحن سعداء بتواصلك معنا' : 'We are happy to hear from you', 
        enabled: true,
        email: "info@company.com", 
        phone: "+1234567890", 
        address: locale === 'ar' ? 'الشارع الرئيسي' : 'Main Street', 
        formEnabled: true,
        contactInfo: { 
          address: locale === 'ar' ? 'الشارع الرئيسي' : 'Main Street', 
          phone: "+1234567890", 
          email: "info@company.com", 
          workingHours: locale === 'ar' ? '9ص-5م' : '9AM-5PM' 
        },
        form: { enabled: true, fields: [] },
        map: { enabled: true, embedCode: "" }
      }
    };
  }
}

export default async function Home({ params }: { params: { locale: string } }) {
  const locale = params.locale || 'en';
  const content = await getHomePageData(locale);

  return (
    <div className="min-h-screen bg-white">
      <HeroSection content={content.hero} />
      
      {/* Our Partners Section */}
      {content.partners && content.partners.length > 0 && (
        <>
          <div className="h-[10px]" />
          <PartnersBanner 
            logos={content.partners.map((partner: any) => ({
              src: partner.logo || partner.src,
              alt: partner.alt || partner.name || 'Partner'
            }))} 
          />
        </>
      )}
      
      <ApartmentsPage locale={locale} />
      <WhyUsSection content={content.whyUs} />
      <AboutUsSection content={content.aboutUs} />
      <ContactUsSection content={content.contactUs} locale={locale} />
    </div>
  );
}