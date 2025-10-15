export interface GlobalSettings {
    navigation: NavigationSettings;
    footer: FooterSettings;
    logo: LogoSettings;
    meta: MetaSettings;
  }
  
  export interface NavigationSettings {
    mainLinks: MenuItem[];
    additionalMenus: AdditionalMenu[];
    backgroundColor: string;
    textColor: string;
    sticky: boolean;
  }
  
  export interface AdditionalMenu {
    id: string;
    title: string;
    items: MenuItem[];
  }
  
  export interface FooterSettings {
    copyrightText: string;
    sections: FooterSection[];
    backgroundColor: string;
    textColor: string;
    showSocialLinks: boolean;
    socialLinks: SocialLink[];
  }
  
  export interface FooterSection {
    id: string;
    title: string;
    links: MenuItem[];
  }
  
  export interface SocialLink {
    platform: string;
    url: string;
    icon: string;
  }
  
  export interface LogoSettings {
    imageUrl: string;
    altText: string;
    width: number;
    height: number;
  }
  
  export interface MetaSettings {
    title: string;
    description: string;
    keywords: string;
    author: string;
    ogImage: string;
  }
  
  export interface MenuItem {
    id: string;
    label: string;
    href: string;
    external: boolean;
    icon?: string;
  }