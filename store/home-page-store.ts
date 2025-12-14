import { create } from "zustand";
import { HomePageStore } from "./ts/home-page-store-types";
import { defaultData } from "./constants/home-page-store-constants";

export const useHomePageStore = create<HomePageStore>((set, get) => ({
  data: defaultData,
  currentLang: "en",
  isLoading: false,
  isSaving: false,

  setCurrentLang: (lang) => set({ currentLang: lang }),

  setData: (newData) => set({ data: newData }),

  // Load Data
  loadData: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch("/api/home-page");
      const result = await response.json();

      if (result.success) {
        set({ data: result.data, isLoading: false });
        return result.data;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  // Save Data
  saveData: async () => {
    set({ isSaving: true });
    try {
      const { data } = get();

      // Log what we're about to save
      console.log('Saving home page data:', {
        hasEn: !!data.en,
        hasAr: !!data.ar,
        currentLang: get().currentLang,
        enHero: data.en?.hero ? {
          title: data.en.hero.title,
          backgroundVideo: data.en.hero.backgroundVideo,
        } : null,
        arHero: data.ar?.hero ? {
          title: data.ar.hero.title,
          backgroundVideo: data.ar.hero.backgroundVideo,
        } : null,
      });

      // Ensure data structure is complete
      if (!data.en || !data.ar) {
        console.error('Invalid data structure - missing en or ar');
        throw new Error('Invalid data structure');
      }

      // Ensure hero objects exist and have all required fields
      if (!data.en.hero) {
        data.en.hero = { 
          title: '', 
          backgroundVideo: '', 
          overlayColor: 'rgba(0,0,0,0.4)', 
          formFields: [],
          primaryButton: { text: '', link: '', variant: 'primary' },
          secondaryButton: { text: '', link: '', variant: 'secondary' },
        };
      } else {
        // Ensure backgroundVideo exists (can be empty string)
        if (data.en.hero.backgroundVideo === undefined || data.en.hero.backgroundVideo === null) {
          data.en.hero.backgroundVideo = '';
        }
        // Ensure formFields exists
        if (!data.en.hero.formFields) {
          data.en.hero.formFields = [];
        }
        // Ensure overlayColor exists
        if (!data.en.hero.overlayColor) {
          data.en.hero.overlayColor = 'rgba(0,0,0,0.4)';
        }
      }

      if (!data.ar.hero) {
        data.ar.hero = { 
          title: '', 
          backgroundVideo: '', 
          overlayColor: 'rgba(0,0,0,0.4)', 
          formFields: [],
          primaryButton: { text: '', link: '', variant: 'primary' },
          secondaryButton: { text: '', link: '', variant: 'secondary' },
        };
      } else {
        // Ensure backgroundVideo exists (can be empty string)
        if (data.ar.hero.backgroundVideo === undefined || data.ar.hero.backgroundVideo === null) {
          data.ar.hero.backgroundVideo = '';
        }
        // Ensure formFields exists
        if (!data.ar.hero.formFields) {
          data.ar.hero.formFields = [];
        }
        // Ensure overlayColor exists
        if (!data.ar.hero.overlayColor) {
          data.ar.hero.overlayColor = 'rgba(0,0,0,0.4)';
        }
      }

      const response = await fetch("/api/home-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API response error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        });
        throw new Error(`Failed to save: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        console.log('Data saved successfully');
        set({ isSaving: false });
        return true;
      } else {
        console.error('Save failed:', result.error);
        throw new Error(result.error || 'Failed to save data');
      }
    } catch (error) {
      console.error("Error saving data:", error);
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
        });
      }
      set({ isSaving: false });
      return false;
    }
  },

  // Generic Update
  updateData: (updates, lang = get().currentLang) =>
    set((state) => ({
      data: { ...state.data, [lang]: { ...state.data[lang], ...updates } },
    })),

  // Hero
  updateHero: (updates, lang = get().currentLang) =>
    set((state) => ({
      data: {
        ...state.data,
        [lang]: {
          ...state.data[lang],
          hero: { ...state.data[lang].hero, ...updates },
        },
      },
    })),

  updateHeroButton: (type, updates, lang = get().currentLang) =>
    set((state) => ({
      data: {
        ...state.data,
        [lang]: {
          ...state.data[lang],
          hero: {
            ...state.data[lang].hero,
            [`${type}Button`]: {
              ...state.data[lang].hero[`${type}Button`],
              ...updates,
            },
          },
        },
      },
    })),

  // Banners
  addBanner: (banner, lang = get().currentLang) =>
    set((state) => ({
      data: {
        ...state.data,
        [lang]: {
          ...state.data[lang],
          banners: [...state.data[lang].banners, banner],
        },
      },
    })),

  updateBanner: (id, updates, lang = get().currentLang) =>
    set((state) => ({
      data: {
        ...state.data,
        [lang]: {
          ...state.data[lang],
          banners: state.data[lang].banners.map((b) =>
            b.id === id ? { ...b, ...updates } : b
          ),
        },
      },
    })),

  removeBanner: (id, lang = get().currentLang) =>
    set((state) => ({
      data: {
        ...state.data,
        [lang]: {
          ...state.data[lang],
          banners: state.data[lang].banners.filter((b) => b.id !== id),
        },
      },
    })),

  // Partners
  addPartner: (partner, lang = get().currentLang) =>
    set((state) => ({
      data: {
        ...state.data,
        [lang]: {
          ...state.data[lang],
          partners: [...(state.data[lang].partners || []), partner],
        },
      },
    })),

  updatePartner: (id, updates, lang = get().currentLang) =>
    set((state) => ({
      data: {
        ...state.data,
        [lang]: {
          ...state.data[lang],
          partners: (state.data[lang].partners || []).map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        },
      },
    })),

  removePartner: (id, lang = get().currentLang) =>
    set((state) => ({
      data: {
        ...state.data,
        [lang]: {
          ...state.data[lang],
          partners: (state.data[lang].partners || []).filter((p) => p.id !== id),
        },
      },
    })),

  // Why Us
  updateWhyUs: (updates, lang = get().currentLang) =>
    set((state) => ({
      data: {
        ...state.data,
        [lang]: { ...state.data[lang], whyUs: { ...state.data[lang].whyUs, ...updates } },
      },
    })),

  addFeature: (feature, lang = get().currentLang) =>
    set((state) => ({
      data: {
        ...state.data,
        [lang]: {
          ...state.data[lang],
          whyUs: {
            ...state.data[lang].whyUs,
            features: [...state.data[lang].whyUs.features, feature],
          },
        },
      },
    })),

  updateFeature: (id, updates, lang = get().currentLang) =>
    set((state) => ({
      data: {
        ...state.data,
        [lang]: {
          ...state.data[lang],
          whyUs: {
            ...state.data[lang].whyUs,
            features: state.data[lang].whyUs.features.map((f) =>
              f.id === id ? { ...f, ...updates } : f
            ),
          },
        },
      },
    })),

  removeFeature: (id, lang = get().currentLang) =>
    set((state) => ({
      data: {
        ...state.data,
        [lang]: {
          ...state.data[lang],
          whyUs: {
            ...state.data[lang].whyUs,
            features: state.data[lang].whyUs.features.filter((f) => f.id !== id),
          },
        },
      },
    })),

  // Testimonials
  updateTestimonials: (updates, lang = get().currentLang) =>
    set((state) => ({
      data: {
        ...state.data,
        [lang]: {
          ...state.data[lang],
          testimonials: { ...state.data[lang].testimonials, ...updates },
        },
      },
    })),

  addTestimonial: (testimonial, lang = get().currentLang) =>
    set((state) => ({
      data: {
        ...state.data,
        [lang]: {
          ...state.data[lang],
          testimonials: {
            ...state.data[lang].testimonials,
            testimonials: [...state.data[lang].testimonials.testimonials, testimonial],
          },
        },
      },
    })),

  updateTestimonial: (id, updates, lang = get().currentLang) =>
    set((state) => ({
      data: {
        ...state.data,
        [lang]: {
          ...state.data[lang],
          testimonials: {
            ...state.data[lang].testimonials,
            testimonials: state.data[lang].testimonials.testimonials.map((t) =>
              t.id === id ? { ...t, ...updates } : t
            ),
          },
        },
      },
    })),

  removeTestimonial: (id, lang = get().currentLang) =>
    set((state) => ({
      data: {
        ...state.data,
        [lang]: {
          ...state.data[lang],
          testimonials: {
            ...state.data[lang].testimonials,
            testimonials: state.data[lang].testimonials.testimonials.filter(
              (t) => t.id !== id
            ),
          },
        },
      },
    })),

  // About Us
  updateAboutUs: (updates, lang = get().currentLang) =>
    set((state) => ({
      data: {
        ...state.data,
        [lang]: { ...state.data[lang], aboutUs: { ...state.data[lang].aboutUs, ...updates } },
      },
    })),

  addStat: (stat, lang = get().currentLang) =>
    set((state) => ({
      data: {
        ...state.data,
        [lang]: {
          ...state.data[lang],
          aboutUs: { ...state.data[lang].aboutUs, stats: [...state.data[lang].aboutUs.stats, stat] },
        },
      },
    })),

  updateStat: (id, updates, lang = get().currentLang) =>
    set((state) => ({
      data: {
        ...state.data,
        [lang]: {
          ...state.data[lang],
          aboutUs: {
            ...state.data[lang].aboutUs,
            stats: state.data[lang].aboutUs.stats.map((s) =>
              s.id === id ? { ...s, ...updates } : s
            ),
          },
        },
      },
    })),

  removeStat: (id, lang = get().currentLang) =>
    set((state) => ({
      data: {
        ...state.data,
        [lang]: {
          ...state.data[lang],
          aboutUs: {
            ...state.data[lang].aboutUs,
            stats: state.data[lang].aboutUs.stats.filter((s) => s.id !== id),
          },
        },
      },
    })),

  // Contact Us
  updateContactUs: (updates, lang = get().currentLang) =>
    set((state) => ({
      data: {
        ...state.data,
        [lang]: { ...state.data[lang], contactUs: { ...state.data[lang].contactUs, ...updates } },
      },
    })),

  updateContactData: (contactData, lang = get().currentLang) =>
    set((state) => ({
      data: { ...state.data, [lang]: { ...state.data[lang], contactUs: contactData } },
    })),

  addContactFormField: (field, lang = get().currentLang) =>
    set((state) => ({
      data: {
        ...state.data,
        [lang]: {
          ...state.data[lang],
          contactUs: {
            ...state.data[lang].contactUs,
            form: {
              ...state.data[lang].contactUs.form,
              fields: [...state.data[lang].contactUs.form.fields, field],
            },
          },
        },
      },
    })),

  updateContactFormField: (index, updates, lang = get().currentLang) => {
    const updatedFields = [...get().data[lang].contactUs.form.fields];
    updatedFields[index] = { ...updatedFields[index], ...updates };

    return set((state) => ({
      data: {
        ...state.data,
        [lang]: {
          ...state.data[lang],
          contactUs: { ...state.data[lang].contactUs, form: { ...state.data[lang].contactUs.form, fields: updatedFields } },
        },
      },
    }));
  },

  removeContactFormField: (index, lang = get().currentLang) =>
    set((state) => ({
      data: {
        ...state.data,
        [lang]: {
          ...state.data[lang],
          contactUs: {
            ...state.data[lang].contactUs,
            form: {
              ...state.data[lang].contactUs.form,
              fields: state.data[lang].contactUs.form.fields.filter((_, i) => i !== index),
            },
          },
        },
      },
    })),
}));
