// Canonical localized homepage defaults.
import { HomePageData, HomePageContent, ContactFormField } from '@/types/home-page';

const deepCopy = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

const defaultContactFormFields: ContactFormField[] = [
  { name: "name", label: "Name", required: true, type: "text" },
  { name: "email", label: "Email", required: true, type: "email" },
  { name: "message", label: "Message", required: true, type: "textarea" }
];

// Real Estate Theme Content
const defaultContent: HomePageContent = {
  partners: [
    {
      id: '1',
      src: '/jeddah-skyline.png', alt: 'Roshn Reit brand', name: 'Roshn Reit', logo: '/logo.png', link: 'https://roshnreit.com'
    },
    {
      id: '2',
      src: '/jeddah-skyline.png', alt: 'Roshn Reit brand', name: 'Roshn Reit', logo: '/logo.png', link: 'https://roshnreit.com'
    },
    {
      id: '3',
      src: '/jeddah-skyline.png', alt: 'Roshn Reit brand', name: 'Roshn Reit', logo: '/logo.png', link: 'https://roshnreit.com'
    },
    {
      id: '4',
      src: '/jeddah-skyline.png', alt: 'Roshn Reit brand', name: 'Roshn Reit', logo: '/logo.png', link: 'https://roshnreit.com'
    },
    {
      id: '5',
      src: '/jeddah-skyline.png', alt: 'Roshn Reit brand', name: 'Roshn Reit', logo: '/logo.png', link: 'https://roshnreit.com'
    }
  ],
  hero: {
    title: "Modern Architecture & Real Estate",
    subtitle: "",
    primaryButton: {
      text: "View Properties",
      link: "/properties",
      variant: "primary"
    },
    secondaryButton: {
      text: "Watch Video",
      link: "/video",
      variant: "secondary"
    },
    backgroundVideo: "/videos/hero-bg.mp4",
    overlayColor: "rgba(0,0,0,0.4)"
  },
  banners: [
    {
      id: '1',
      title: "Luxury Villa",
      description: "Modern 5-bedroom villa with panoramic city views",
      image: "/images/property1.jpg",
      link: "/properties/villa-1",
      position: 'top'
    }
  ],
  whyUs: {
    title: "Why Choose Us?",
    subtitle: "We provide the best solutions for your business",
    features: [
      {
        id: '1',
        icon: "🚀",
        title: "Fast Delivery",
        description: "We deliver projects faster than anyone in the industry"
      }
    ]
  },
  testimonials: {
    title: "What Our Clients Say",
    subtitle: "Join thousands of satisfied customers",
    testimonials: [
      {
        id: '1',
        name: "John Doe",
        position: "CEO",
        company: "Tech Corp",
        content: "This platform transformed our business operations completely!",
        avatar: "/avatars/john.jpg",
        rating: 5
      }
    ]
  },
  aboutUs: {
    title: "About Our Company",
    content: "We are a team of passionate professionals dedicated to delivering exceptional digital solutions.",
    image: "/jeddah-skyline.png",
    stats: [
      {
        id: '1',
        value: "1000+",
        label: "Happy Clients"
      }
    ]
  },
  contactUs: {
    title: "Get In Touch",
    subtitle: "We're here to help",
    description: "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
    enabled: true,
    email: "hello@company.com",
    phone: "+1 (555) 123-4567",
    address: "123 Business St, City, State 12345",
    formEnabled: true,
    contactInfo: {
      address: "123 Business St, City, State 12345",
      phone: "+1 (555) 123-4567",
      email: "hello@company.com",
      workingHours: "Mon - Fri: 9:00 AM - 6:00 PM"
    },
    form: {
      enabled: true,
      fields: defaultContactFormFields
    },
    map: {
      enabled: true,
      embedCode: ""
    }
  }
};
const arabicContent: HomePageContent = {
  partners: [
    {
      id: '1',
      src: '/jeddah-skyline.png', alt: 'علامة روشن ريت', name: 'روشن ريت', logo: '/logo.png', link: 'https://roshnreit.com/ar'
    },
    {
      id: '2',
      src: '/jeddah-skyline.png', alt: 'علامة روشن ريت', name: 'روشن ريت', logo: '/logo.png', link: 'https://roshnreit.com/ar'
    },
    {
      id: '3',
      src: '/jeddah-skyline.png', alt: 'علامة روشن ريت', name: 'روشن ريت', logo: '/logo.png', link: 'https://roshnreit.com/ar'
    },
    {
      id: '4',
      src: '/jeddah-skyline.png', alt: 'علامة روشن ريت', name: 'روشن ريت', logo: '/logo.png', link: 'https://roshnreit.com/ar'
    },
    {
      id: '5',
      src: '/jeddah-skyline.png', alt: 'علامة روشن ريت', name: 'روشن ريت', logo: '/logo.png', link: 'https://roshnreit.com/ar'
    }
  ],
  hero: {
    title: "مرحبًا بكم في منصتنا المذهلة",
    subtitle: "",
    primaryButton: {
      text: "ابدأ الآن",
      link: "/get-started",
      variant: "primary"
    },
    secondaryButton: {
      text: "اعرف المزيد",
      link: "/about",
      variant: "secondary"
    },
    backgroundVideo: "/videos/hero-bg.mp4",
    overlayColor: "rgba(0,0,0,0.4)"
  },
  banners: [
    {
      id: '1',
      title: "عرض خاص",
      description: "احصل على خصم 50٪ على جميع الخطط هذا الشهر",
      image: "/images/banner1.jpg",
      link: "/offers",
      position: 'top'
    }
  ],
  whyUs: {
    title: "لماذا تختارنا؟",
    subtitle: "نحن نقدم أفضل الحلول لعملك",
    features: [
      {
        id: '1',
        icon: "🚀",
        title: "تسليم سريع",
        description: "نحن نسلم المشاريع بشكل أسرع من أي شخص في الصناعة"
      }
    ]
  },
  testimonials: {
    title: "ما يقوله عملاؤنا",
    subtitle: "انضم إلى آلاف العملاء الراضين",
    testimonials: [
      {
        id: '1',
        name: "محمد أحمد",
        position: "الرئيس التنفيذي",
        company: "الشركة التقنية",
        content: "هذه المنصة غيرت عملياتنا التجارية بالكامل!",
        avatar: "/avatars/mohamed.jpg",
        rating: 5
      }
    ]
  },
  aboutUs: {
    title: "عن شركتنا",
    content: "نحن فريق من المحترفين المتحمسين المكرسين لتقديم حلول رقمية استثنائية.",
    image: "/jeddah-skyline.png",
    stats: [
      {
        id: '1',
        value: "1000+",
        label: "عميل سعيد"
      }
    ]
  },
  contactUs: {
    title: "اتصل بنا",
    subtitle: "نحن هنا لمساعدتك",
    description: "نود أن نسمع منك. أرسل لنا رسالة وسنرد في أقرب وقت ممكن.",
    enabled: true,
    email: "hello@company.com",
    phone: "+1 (555) 123-4567",
    address: "123 شارع الأعمال، المدينة، الولاية 12345",
    formEnabled: true,
    contactInfo: {
      address: "123 شارع الأعمال، المدينة، الولاية 12345",
      phone: "+1 (555) 123-4567",
      email: "hello@company.com",
      workingHours: "الإثنين - الجمعة: 9:00 ص - 6:00 م"
    },
    form: {
      enabled: true,
      fields: [
        { name: "name", label: "الاسم", required: true, type: "text" },
        { name: "email", label: "البريد الإلكتروني", required: true, type: "email" },
        { name: "message", label: "الرسالة", required: true, type: "textarea" }
      ]
    },
    map: {
      enabled: true,
      embedCode: ""
    }
  }
};

export const defaultData: HomePageData = {
  en: deepCopy(defaultContent),
  ar: deepCopy(arabicContent)
};
