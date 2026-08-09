import { create } from "zustand";

import { defaultData } from "@/lib/site-content/home-page-defaults";
import type { HomePageContent } from "@/types/home-page";

import type { HomePageStore } from "./ts/home-page-store-types";

type Lang = HomePageStore["currentLang"];
type Identified = { id: string };

const append = <T>(items: T[], item: T) => [...items, item];
const updateById = <T extends Identified>(items: T[], id: string, updates: Partial<T>) =>
  items.map((item) => item.id === id ? { ...item, ...updates } : item);
const removeById = <T extends Identified>(items: T[], id: string) =>
  items.filter((item) => item.id !== id);

export const useHomePageStore = create<HomePageStore>((set, get) => {
  const currentLang = (lang?: Lang) => lang ?? get().currentLang;
  const updateContent = (lang: Lang | undefined, update: (content: HomePageContent) => HomePageContent) =>
    set((state) => {
      const locale = currentLang(lang);
      return { data: { ...state.data, [locale]: update(state.data[locale]) } };
    });

  return {
    data: defaultData,
    currentLang: "en",
    isSaving: false,

    setCurrentLang: (lang) => set({ currentLang: lang }),
    setData: (data) => set({ data }),

    async saveData() {
      if (get().isSaving) return false;
      set({ isSaving: true });
      try {
        const response = await fetch("/api/home-page", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(get().data),
        });
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.error || "Failed to save homepage");
        set({ data: result.data });
        return true;
      } catch (error) {
        console.error("Error saving homepage:", error);
        return false;
      } finally {
        set({ isSaving: false });
      }
    },

    updateData: (updates, lang) => updateContent(lang, (content) => ({ ...content, ...updates })),
    updateHero: (updates, lang) => updateContent(lang, (content) => ({
      ...content,
      hero: { ...content.hero, ...updates },
    })),
    updateHeroButton: (type, updates, lang) => updateContent(lang, (content) => ({
      ...content,
      hero: {
        ...content.hero,
        [`${type}Button`]: { ...content.hero[`${type}Button`], ...updates },
      },
    })),

    addBanner: (banner, lang) => updateContent(lang, (content) => ({
      ...content,
      banners: append(content.banners, banner),
    })),
    updateBanner: (id, updates, lang) => updateContent(lang, (content) => ({
      ...content,
      banners: updateById(content.banners, id, updates),
    })),
    removeBanner: (id, lang) => updateContent(lang, (content) => ({
      ...content,
      banners: removeById(content.banners, id),
    })),

    addPartner: (partner, lang) => updateContent(lang, (content) => ({
      ...content,
      partners: append(content.partners, partner),
    })),
    updatePartner: (id, updates, lang) => updateContent(lang, (content) => ({
      ...content,
      partners: updateById(content.partners, id, updates),
    })),
    removePartner: (id, lang) => updateContent(lang, (content) => ({
      ...content,
      partners: removeById(content.partners, id),
    })),

    updateWhyUs: (updates, lang) => updateContent(lang, (content) => ({
      ...content,
      whyUs: { ...content.whyUs, ...updates },
    })),
    addFeature: (feature, lang) => updateContent(lang, (content) => ({
      ...content,
      whyUs: { ...content.whyUs, features: append(content.whyUs.features, feature) },
    })),
    updateFeature: (id, updates, lang) => updateContent(lang, (content) => ({
      ...content,
      whyUs: { ...content.whyUs, features: updateById(content.whyUs.features, id, updates) },
    })),
    removeFeature: (id, lang) => updateContent(lang, (content) => ({
      ...content,
      whyUs: { ...content.whyUs, features: removeById(content.whyUs.features, id) },
    })),

    updateTestimonials: (updates, lang) => updateContent(lang, (content) => ({
      ...content,
      testimonials: { ...content.testimonials, ...updates },
    })),
    addTestimonial: (testimonial, lang) => updateContent(lang, (content) => ({
      ...content,
      testimonials: {
        ...content.testimonials,
        testimonials: append(content.testimonials.testimonials, testimonial),
      },
    })),
    updateTestimonial: (id, updates, lang) => updateContent(lang, (content) => ({
      ...content,
      testimonials: {
        ...content.testimonials,
        testimonials: updateById(content.testimonials.testimonials, id, updates),
      },
    })),
    removeTestimonial: (id, lang) => updateContent(lang, (content) => ({
      ...content,
      testimonials: {
        ...content.testimonials,
        testimonials: removeById(content.testimonials.testimonials, id),
      },
    })),

    updateAboutUs: (updates, lang) => updateContent(lang, (content) => ({
      ...content,
      aboutUs: { ...content.aboutUs, ...updates },
    })),
    addStat: (stat, lang) => updateContent(lang, (content) => ({
      ...content,
      aboutUs: { ...content.aboutUs, stats: append(content.aboutUs.stats, stat) },
    })),
    updateStat: (id, updates, lang) => updateContent(lang, (content) => ({
      ...content,
      aboutUs: { ...content.aboutUs, stats: updateById(content.aboutUs.stats, id, updates) },
    })),
    removeStat: (id, lang) => updateContent(lang, (content) => ({
      ...content,
      aboutUs: { ...content.aboutUs, stats: removeById(content.aboutUs.stats, id) },
    })),

    updateContactUs: (updates, lang) => updateContent(lang, (content) => ({
      ...content,
      contactUs: { ...content.contactUs, ...updates },
    })),
    updateContactData: (contactUs, lang) => updateContent(lang, (content) => ({ ...content, contactUs })),
    addContactFormField: (field, lang) => updateContent(lang, (content) => ({
      ...content,
      contactUs: {
        ...content.contactUs,
        form: { ...content.contactUs.form, fields: append(content.contactUs.form.fields, field) },
      },
    })),
    updateContactFormField: (index, updates, lang) => updateContent(lang, (content) => ({
      ...content,
      contactUs: {
        ...content.contactUs,
        form: {
          ...content.contactUs.form,
          fields: content.contactUs.form.fields.map((field, fieldIndex) =>
            fieldIndex === index ? { ...field, ...updates } : field),
        },
      },
    })),
    removeContactFormField: (index, lang) => updateContent(lang, (content) => ({
      ...content,
      contactUs: {
        ...content.contactUs,
        form: {
          ...content.contactUs.form,
          fields: content.contactUs.form.fields.filter((_, fieldIndex) => fieldIndex !== index),
        },
      },
    })),
  };
});
