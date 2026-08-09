import { AboutUsSection } from "@/components/home-page/sections/about-us-section";
import ApartmentsPage from "@/components/home-page/sections/ApartmentsPage";
import { ContactUsSection } from "@/components/home-page/sections/contact-us-section";
import { HeroSection } from "@/components/home-page/sections/hero-section";
import { PartnersBanner } from "@/components/home-page/sections/partners-banner";
import { WhyUsSection } from "@/components/home-page/sections/why-us-section";
import { propertyModule } from "@/lib/properties/property-module";
import { siteContentModule } from "@/lib/site-content/site-content-module";

export const revalidate = 300;

export default async function Home({ params }: { params: { locale: string } }) {
  const locale = params.locale === "ar" ? "ar" : "en";
  const [content, properties] = await Promise.all([
    siteContentModule.getLocalizedHomePage(locale),
    propertyModule.list({ limit: 24 }),
  ]);

  return (
    <div className="min-h-screen">
      <HeroSection content={content.hero} />
      <ApartmentsPage locale={locale} initialProperties={properties} />
      {content.partners.length > 0 && (
        <>
          <div className="h-[10px]" />
          <PartnersBanner logos={content.partners.map(partner => ({ src: partner.src || partner.logo || "", alt: partner.alt || partner.name || "Partner" }))} />
        </>
      )}
      {content.whyUs.features.length > 0 && <WhyUsSection content={content.whyUs} />}
      {(content.aboutUs.title || content.aboutUs.content || content.aboutUs.image || content.aboutUs.stats.length > 0) && (
        <AboutUsSection content={content.aboutUs} />
      )}
      <ContactUsSection content={content.contactUs} locale={locale} />
    </div>
  );
}
