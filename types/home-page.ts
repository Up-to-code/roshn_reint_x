// types/home-page.ts
export interface HomePageData {
  en: HomePageContent;
  ar: HomePageContent;
}

export interface Partner {
  alt: string | number | readonly string[] | undefined;
  src: string | number | readonly string[] | undefined;
  id: string;
  name: string;
  logo: string; // image url
  link?: string; // optional link
}

export interface HomePageContent {
  hero: HeroSection;
  banners: Banner[];
  partners: Partner[];
  whyUs: WhyUsSection;
  testimonials: TestimonialsSection;
  aboutUs: AboutUsSection;
  contactUs: ContactUsSection;
}

export interface HeroFormField {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
}

export interface HeroSection {
  title: string;
  subtitle: string;
  accentText?: string;
  backgroundImage?: string;
  primaryButton?: {
    text: string;
    link: string;
    variant: string;
  };
  secondaryButton?: {
    text: string;
    link: string;
    variant: string;
  };
  backgroundVideo?: string;
  overlayColor?: string;
  formFields?: HeroFormField[];
}

export interface Banner {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  position: string;
}

export interface WhyUsSection {
  title: string;
  subtitle: string;
  features: Feature[];
}

export interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface TestimonialsSection {
  title: string;
  subtitle: string;
  testimonials: Testimonial[];
}

export interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  content: string;
  avatar: string;
  rating: number;
}

export interface AboutUsSection {
  title: string;
  content: string;
  image: string;
  stats: Stat[];
}

export interface Stat {
  id: string;
  value: string;
  label: string;
}

export interface ContactUsSection {
  title: string;
  subtitle: string;
  description: string;
  enabled: boolean;
  email: string;
  phone: string;
  address: string;
  formEnabled: boolean;
  contactInfo: ContactInfo;
  form: ContactForm;
  map: MapSettings;
}

export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  workingHours: string;
}

export interface ContactForm {
  enabled: boolean;
  fields: ContactFormField[];
}

export interface ContactFormField {
  name: string;
  label: string;
  required: boolean;
  type: string;
}

export interface MapSettings {
  enabled: boolean;
  embedCode: string;
}