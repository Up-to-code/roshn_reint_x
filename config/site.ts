import { SidebarNavItem, SiteConfig } from "types";

// Normalize site URL to ensure it has protocol
function normalizeSiteURL(url: string | undefined): string {
  if (!url) {
    return "http://localhost:3000";
  }
  
  // If URL doesn't start with http:// or https://, add https://
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`;
  }
  
  return url;
}

const site_url = normalizeSiteURL(process.env.NEXT_PUBLIC_APP_URL);

export const siteConfig: SiteConfig = {
  name: "Next Starter",
  description:
    "Get your project off to an explosive start with Auth & User Roles! Harness the power of Next.js 14, Prisma, Neon, Auth.js v5, Resend, React Email, Shadcn/ui to build your next big thing.",
  url: site_url,
  ogImage: `${site_url}/_static/og.jpg`,
  links: {
    twitter: "https://twitter.com/miickasmt",
    github: "https://github.com/mickasmt/next-auth-roles-template",
  },
  mailSupport: "support@next-starter.fake",
};

export const footerLinks: SidebarNavItem[] = [
  {
    title: "Company",
    items: [
      { title: "About", href: "#" },
      { title: "Enterprise", href: "#" },
      { title: "Terms", href: "/terms" },
      { title: "Privacy", href: "/privacy" },
    ],
  },
  {
    title: "Product",
    items: [
      { title: "Security", href: "#" },
      { title: "Customization", href: "#" },
      { title: "Customers", href: "#" },
      { title: "Changelog", href: "#" },
    ],
  },
  {
    title: "Docs",
    items: [
      { title: "Introduction", href: "#" },
      { title: "Installation", href: "#" },
      { title: "Components", href: "#" },
      { title: "Code Blocks", href: "#" },
    ],
  },
];
