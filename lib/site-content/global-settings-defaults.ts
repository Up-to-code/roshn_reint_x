import type { GlobalSettings } from "@/lib/site-content/global-settings-types";

export const defaultGlobalSettings: GlobalSettings = {
  navigation: {
    mainLinks: [
      { id: "1", label: "Home", href: "/", external: false, icon: "home" },
      { id: "2", label: "About", href: "/about", external: false, icon: "info" },
    ],
    additionalMenus: [
      {
        id: "1",
        title: "Products",
        items: [
          { id: "1-1", label: "Web Design", href: "/products/web-design", external: false },
          { id: "1-2", label: "Development", href: "/products/development", external: false },
        ],
      },
    ],
    backgroundColor: "#ffffff",
    textColor: "#000000",
    sticky: true,
  },
  footer: {
    copyrightText: "© 2024 My Company. All rights reserved.",
    sections: [
      {
        id: "1",
        title: "Quick Links",
        links: [
          { id: "1-1", label: "Home", href: "/", external: false },
          { id: "1-2", label: "About", href: "/about", external: false },
        ],
      },
      {
        id: "2",
        title: "Support",
        links: [
          { id: "2-1", label: "Contact", href: "/contact", external: false },
          { id: "2-2", label: "Help Center", href: "/help", external: false },
        ],
      },
    ],
    socialLinks: [
      { platform: "facebook", url: "https://facebook.com", icon: "facebook" },
      { platform: "twitter", url: "https://twitter.com", icon: "twitter" },
      { platform: "instagram", url: "https://instagram.com", icon: "instagram" },
    ],
    backgroundColor: "#FFFFFF",
    textColor: "#1e293b",
    showSocialLinks: true,
  },
  logo: { imageUrl: "/logo.png", altText: "Company Logo", width: 150, height: 50 },
  meta: {
    title: "My Website",
    description: "A modern website built with Next.js",
    keywords: "website, nextjs, react",
    author: "My Company",
    ogImage: "/og-image.jpg",
  },
};
