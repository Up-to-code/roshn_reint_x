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

      const response = await fetch("/api/home-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        set({ isSaving: false });
        return true;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error saving data:", error);
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
