import {
  HomePageData,
  HomePageContent,
  HeroSection,
  Banner,
  WhyUsSection,
  Testimonial,
  AboutUsSection,
  ContactUsSection,
  Feature,
  Stat,
  ContactFormField,
  TestimonialsSection,
  Partner,
} from "@/types/home-page";

export interface HomePageStore {
  data: HomePageData;
  currentLang: "en" | "ar";
  isSaving: boolean;

  // Actions
  setCurrentLang: (lang: "en" | "ar") => void;
  saveData: () => Promise<boolean>;
  updateData: (updates: Partial<HomePageContent>, lang?: "en" | "ar") => void;
  setData: (newData: HomePageData) => void;

  // Hero Section
  updateHero: (updates: Partial<HeroSection>, lang?: "en" | "ar") => void;
  updateHeroButton: (
    type: "primary" | "secondary",
    updates: Partial<HeroSection["primaryButton"]>,
    lang?: "en" | "ar"
  ) => void;

  // Banners
  addBanner: (banner: Banner, lang?: "en" | "ar") => void;
  updateBanner: (id: string, updates: Partial<Banner>, lang?: "en" | "ar") => void;
  removeBanner: (id: string, lang?: "en" | "ar") => void;

  // Partners
  addPartner: (partner: Partner, lang?: "en" | "ar") => void;
  updatePartner: (id: string, updates: Partial<Partner>, lang?: "en" | "ar") => void;
  removePartner: (id: string, lang?: "en" | "ar") => void;

  // Why Us Section
  updateWhyUs: (updates: Partial<WhyUsSection>, lang?: "en" | "ar") => void;
  addFeature: (feature: Feature, lang?: "en" | "ar") => void;
  updateFeature: (id: string, updates: Partial<Feature>, lang?: "en" | "ar") => void;
  removeFeature: (id: string, lang?: "en" | "ar") => void;

  // Testimonials
  updateTestimonials: (updates: Partial<TestimonialsSection>, lang?: "en" | "ar") => void;
  addTestimonial: (testimonial: Testimonial, lang?: "en" | "ar") => void;
  updateTestimonial: (id: string, updates: Partial<Testimonial>, lang?: "en" | "ar") => void;
  removeTestimonial: (id: string, lang?: "en" | "ar") => void;

  // About Us
  updateAboutUs: (updates: Partial<AboutUsSection>, lang?: "en" | "ar") => void;
  addStat: (stat: Stat, lang?: "en" | "ar") => void;
  updateStat: (id: string, updates: Partial<Stat>, lang?: "en" | "ar") => void;
  removeStat: (id: string, lang?: "en" | "ar") => void;

  // Contact Us
  updateContactUs: (updates: Partial<ContactUsSection>, lang?: "en" | "ar") => void;
  updateContactData: (contactData: ContactUsSection, lang?: "en" | "ar") => void;
  addContactFormField: (field: ContactFormField, lang?: "en" | "ar") => void;
  updateContactFormField: (
    index: number,
    updates: Partial<ContactFormField>,
    lang?: "en" | "ar"
  ) => void;
  removeContactFormField: (index: number, lang?: "en" | "ar") => void;
}
