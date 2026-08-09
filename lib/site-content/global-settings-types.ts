// Canonical global Site Content types.
export interface GlobalSettings {
    navigation: NavigationSettings;
    footer: FooterSettings;
    logo: LogoSettings;
    meta: MetaSettings;
  }
  
  interface NavigationSettings {
    mainLinks: MenuItem[];
    additionalMenus: AdditionalMenu[];
    backgroundColor: string;
    textColor: string;
    sticky: boolean;
  }
  
  interface AdditionalMenu {
    id: string;
    title: string;
    items: MenuItem[];
  }
  
  interface FooterSettings {
    copyrightText: string;
    sections: FooterSection[];
    backgroundColor: string;
    textColor: string;
    showSocialLinks: boolean;
    socialLinks: SocialLink[];
  }
  
  interface FooterSection {
    id: string;
    title: string;
    links: MenuItem[];
  }
  
  interface SocialLink {
    platform: string;
    url: string;
    icon: string;
  }
  
  interface LogoSettings {
    imageUrl: string;
    altText: string;
    width: number;
    height: number;
  }
  
  interface MetaSettings {
    title: string;
    description: string;
    keywords: string;
    author: string;
    ogImage: string;
  }
  
  interface MenuItem {
    id: string;
    label: string;
    href: string;
    external: boolean;
    icon?: string;
  }
