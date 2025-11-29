import { create } from 'zustand';
import { GlobalSettings, MenuItem, AdditionalMenu, FooterSection, SocialLink } from '@/components/global/types/global-settings';

interface GlobalSettingsStore {
  settings: GlobalSettings;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  
  // Actions
  loadSettings: () => Promise<void>;
  saveSettings: () => Promise<boolean>;
  resetSettings: () => Promise<boolean>;
  
  updateSettings: (updates: Partial<GlobalSettings>) => void;
  updateNavigation: (updates: Partial<GlobalSettings['navigation']>) => void;
  updateFooter: (updates: Partial<GlobalSettings['footer']>) => void;
  updateLogo: (updates: Partial<GlobalSettings['logo']>) => void;
  updateMeta: (updates: Partial<GlobalSettings['meta']>) => void;
  
  // Navigation actions
  addMainLink: (link: MenuItem) => void;
  updateMainLink: (id: string, updates: Partial<MenuItem>) => void;
  removeMainLink: (id: string) => void;
  
  addAdditionalMenu: (menu: AdditionalMenu) => void;
  updateAdditionalMenu: (id: string, updates: Partial<AdditionalMenu>) => void;
  removeAdditionalMenu: (id: string) => void;
  
  // Footer actions
  addFooterSection: (section: FooterSection) => void;
  updateFooterSection: (id: string, updates: Partial<FooterSection>) => void;
  removeFooterSection: (id: string) => void;
  
  addSocialLink: (link: SocialLink) => void;
  updateSocialLink: (platform: string, updates: Partial<SocialLink>) => void;
  removeSocialLink: (platform: string) => void;
  
  clearError: () => void;
}

const defaultSettings: GlobalSettings = {
  navigation: {
    mainLinks: [
      { id: '1', label: 'Home', href: '/', external: false, icon: 'home' },
      { id: '2', label: 'About', href: '/about', external: false, icon: 'info' },
    ],
    additionalMenus: [
      {
        id: '1',
        title: 'Products',
        items: [
          { id: '1-1', label: 'Web Design', href: '/products/web-design', external: false },
          { id: '1-2', label: 'Development', href: '/products/development', external: false },
        ]
      }
    ],
    backgroundColor: '#ffffff',
    textColor: '#000000',
    sticky: true,
  },
  footer: {
    copyrightText: '© 2024 My Company. All rights reserved.',
    sections: [
      {
        id: '1',
        title: 'Quick Links',
        links: [
          { id: '1-1', label: 'Home', href: '/', external: false },
          { id: '1-2', label: 'About', href: '/about', external: false },
        ]
      },
      {
        id: '2',
        title: 'Support',
        links: [
          { id: '2-1', label: 'Contact', href: '/contact', external: false },
          { id: '2-2', label: 'Help Center', href: '/help', external: false },
        ]
      }
    ],
    socialLinks: [
      { platform: 'facebook', url: 'https://facebook.com', icon: 'facebook' },
      { platform: 'twitter', url: 'https://twitter.com', icon: 'twitter' },
      { platform: 'instagram', url: 'https://instagram.com', icon: 'instagram' },
    ],
    backgroundColor: '#FFFFFF',
    textColor: '#1e293b',
    showSocialLinks: true,
  },
  logo: {
    imageUrl: '/logo.png',
    altText: 'Company Logo',
    width: 150,
    height: 50,
  },
  meta: {
    title: 'My Website',
    description: 'A modern website built with Next.js',
    keywords: 'website, nextjs, react',
    author: 'My Company',
    ogImage: '/og-image.jpg',
  },
};

export const useGlobalSettingsStore = create<GlobalSettingsStore>((set, get) => ({
  settings: defaultSettings,
  isLoading: false,
  isSaving: false,
  error: null,
  
  // Load settings from API
  loadSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/settings');
      const result = await response.json();
      
      if (result.success) {
        set({ settings: result.data, isLoading: false });
      } else {
        set({ error: result.error, isLoading: false });
      }
    } catch (error) {
      set({ error: 'Failed to load settings', isLoading: false });
    }
  },
  
  // Save settings to API
  saveSettings: async () => {
    const { settings } = get();
    set({ isSaving: true, error: null });
    
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      
      const result = await response.json();
      set({ isSaving: false });
      
      if (result.success) {
        return true;
      } else {
        set({ error: result.error });
        return false;
      }
    } catch (error) {
      set({ error: 'Failed to save settings', isSaving: false });
      return false;
    }
  },
  
  // Reset settings to default via API
  resetSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/settings?action=reset', {
        method: 'PUT',
      });
      
      const result = await response.json();
      set({ isLoading: false });
      
      if (result.success) {
        set({ settings: defaultSettings });
        return true;
      } else {
        set({ error: result.error });
        return false;
      }
    } catch (error) {
      set({ error: 'Failed to reset settings', isLoading: false });
      return false;
    }
  },
  
  // Local state updates (same as before)
  updateSettings: (updates) => set((state) => ({
    settings: { ...state.settings, ...updates }
  })),
  
  updateNavigation: (updates) => set((state) => ({
    settings: {
      ...state.settings,
      navigation: { ...state.settings.navigation, ...updates }
    }
  })),
  
  updateFooter: (updates) => set((state) => ({
    settings: {
      ...state.settings,
      footer: { ...state.settings.footer, ...updates }
    }
  })),
  
  updateLogo: (updates) => set((state) => ({
    settings: {
      ...state.settings,
      logo: { ...state.settings.logo, ...updates }
    }
  })),
  
  updateMeta: (updates) => set((state) => ({
    settings: {
      ...state.settings,
      meta: { ...state.settings.meta, ...updates }
    }
  })),
  
  // Navigation actions (same as before)
  addMainLink: (link) => set((state) => ({
    settings: {
      ...state.settings,
      navigation: {
        ...state.settings.navigation,
        mainLinks: [...state.settings.navigation.mainLinks, link]
      }
    }
  })),
  
  updateMainLink: (id, updates) => set((state) => ({
    settings: {
      ...state.settings,
      navigation: {
        ...state.settings.navigation,
        mainLinks: state.settings.navigation.mainLinks.map(link =>
          link.id === id ? { ...link, ...updates } : link
        )
      }
    }
  })),
  
  removeMainLink: (id) => set((state) => ({
    settings: {
      ...state.settings,
      navigation: {
        ...state.settings.navigation,
        mainLinks: state.settings.navigation.mainLinks.filter(link => link.id !== id)
      }
    }
  })),
  
  addAdditionalMenu: (menu) => set((state) => ({
    settings: {
      ...state.settings,
      navigation: {
        ...state.settings.navigation,
        additionalMenus: [...state.settings.navigation.additionalMenus, menu]
      }
    }
  })),
  
  updateAdditionalMenu: (id, updates) => set((state) => ({
    settings: {
      ...state.settings,
      navigation: {
        ...state.settings.navigation,
        additionalMenus: state.settings.navigation.additionalMenus.map(menu =>
          menu.id === id ? { ...menu, ...updates } : menu
        )
      }
    }
  })),
  
  removeAdditionalMenu: (id) => set((state) => ({
    settings: {
      ...state.settings,
      navigation: {
        ...state.settings.navigation,
        additionalMenus: state.settings.navigation.additionalMenus.filter(menu => menu.id !== id)
      }
    }
  })),
  
  // Footer actions (same as before)
  addFooterSection: (section) => set((state) => ({
    settings: {
      ...state.settings,
      footer: {
        ...state.settings.footer,
        sections: [...state.settings.footer.sections, section]
      }
    }
  })),
  
  updateFooterSection: (id, updates) => set((state) => ({
    settings: {
      ...state.settings,
      footer: {
        ...state.settings.footer,
        sections: state.settings.footer.sections.map(section =>
          section.id === id ? { ...section, ...updates } : section
        )
      }
    }
  })),
  
  removeFooterSection: (id) => set((state) => ({
    settings: {
      ...state.settings,
      footer: {
        ...state.settings.footer,
        sections: state.settings.footer.sections.filter(section => section.id !== id)
      }
    }
  })),
  
  addSocialLink: (link) => set((state) => ({
    settings: {
      ...state.settings,
      footer: {
        ...state.settings.footer,
        socialLinks: [...state.settings.footer.socialLinks, link]
      }
    }
  })),
  
  updateSocialLink: (platform, updates) => set((state) => ({
    settings: {
      ...state.settings,
      footer: {
        ...state.settings.footer,
        socialLinks: state.settings.footer.socialLinks.map(link =>
          link.platform === platform ? { ...link, ...updates } : link
        )
      }
    }
  })),
  
  removeSocialLink: (platform) => set((state) => ({
    settings: {
      ...state.settings,
      footer: {
        ...state.settings.footer,
        socialLinks: state.settings.footer.socialLinks.filter(link => link.platform !== platform)
      }
    }
  })),
  
  clearError: () => set({ error: null }),
}));