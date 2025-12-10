import { IconName } from "@/components/shared/icons";
import { UserRole } from "@prisma/client";

export interface SidebarNavItem {
  title: string; // translation key
  items: {
    href: string;
    icon: IconName;
    title: string; // translation key
    badge?: number;
    authorizeOnly?: UserRole;
    disabled?: boolean;
  }[];
}

// Use translation keys here; the component will call `t(title)` dynamically
export const sidebarLinks: SidebarNavItem[] = [
  {
    title: "sidebar.menu",
    items: [
      { href: "/dashboard", icon: "dashboard", title: "sidebar.dashboard" },
      { href: "/dashboard/global", icon: "global", title: "sidebar.global" },
      { href: "/dashboard/p", icon: "building", title: "sidebar.properties" },
      { href: "/dashboard/p/create", icon: "plus", title: "sidebar.addProperty" },
      // { href: "/admin", icon: "briefcase", title: "sidebar.adminPanel", authorizeOnly: UserRole.ADMIN },
      { href: "/dashboard/blog", icon: "blog", title: "sidebar.blog" },
      //  { href: "/admin/forms", icon: "post", title: "sidebar.forms" },
      // { href: "/admin/blogs", icon: "blog", title: "sidebar.blogs" },
      // { href: "/admin/media", icon: "media", title: "sidebar.media" },
    ],
  },
   {
     title: "sidebar.pages",
     items: [
       { href: "/dashboard/home", icon: "home", title: "sidebar.homepage" },
       { href: "/dashboard/about", icon: "blog", title: "sidebar.about" },
       { href: "/dashboard/forms", icon: "post", title: "sidebar.forms" },
       { href: "/dashboard/interests", icon: "messages", title: "sidebar.interests" },
       { href: "/dashboard/services", icon: "briefcase", title: "sidebar.services" },
       { href: "/dashboard/leads", icon: "users", title: "sidebar.leads" },
     ],
   },
  {
    title: "sidebar.options",
    items: [
      { href: "/dashboard/users", icon: "users", title: "sidebar.users" },
      { href: "/dashboard/settings", icon: "settings", title: "sidebar.settings" },
      { href: "/", icon: "home", title: "sidebar.homepage" },
 
    ],
  },
];
