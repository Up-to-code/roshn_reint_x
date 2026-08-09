import { z } from "zod";

import { defaultGlobalSettings } from "@/lib/site-content/global-settings-defaults";
import type { GlobalSettings } from "@/lib/site-content/global-settings-types";
import { defaultData, legacyDemoData } from "@/lib/site-content/home-page-defaults";
import type { HomePageContent, HomePageData } from "@/types/home-page";

const menuItemSchema = z.object({
  id: z.string().min(1), label: z.string(), href: z.string(), external: z.boolean(), icon: z.string().optional(),
});
const globalSettingsSchema = z.object({
  navigation: z.object({
    mainLinks: z.array(menuItemSchema),
    additionalMenus: z.array(z.object({ id: z.string().min(1), title: z.string(), items: z.array(menuItemSchema) })),
    backgroundColor: z.string(), textColor: z.string(), sticky: z.boolean(),
  }),
  footer: z.object({
    copyrightText: z.string(),
    sections: z.array(z.object({ id: z.string().min(1), title: z.string(), links: z.array(menuItemSchema) })),
    backgroundColor: z.string(), textColor: z.string(), showSocialLinks: z.boolean(),
    socialLinks: z.array(z.object({ platform: z.string().min(1), url: z.string(), icon: z.string() })),
  }),
  logo: z.object({ imageUrl: z.string(), altText: z.string(), width: z.number().positive(), height: z.number().positive() }),
  meta: z.object({ title: z.string(), description: z.string(), keywords: z.string(), author: z.string(), ogImage: z.string() }),
});

const buttonSchema = z.object({ text: z.string(), link: z.string(), variant: z.string() });
const contentSchema = z.object({
  partners: z.array(z.object({
    id: z.string().min(1), src: z.string(), alt: z.string(), name: z.string(), logo: z.string(), link: z.string().optional(),
  })),
  hero: z.object({
    title: z.string(), subtitle: z.string().optional(), accentText: z.string().optional(),
    backgroundImage: z.string().optional(), primaryButton: buttonSchema.optional(), secondaryButton: buttonSchema.optional(),
    backgroundVideo: z.string().optional(), overlayColor: z.string().optional(),
    formFields: z.array(z.object({
      name: z.string(), label: z.string(), type: z.string(), placeholder: z.string().optional(), required: z.boolean().optional(),
    })).optional(),
  }),
  banners: z.array(z.object({
    id: z.string().min(1), title: z.string(), description: z.string(), image: z.string(), link: z.string(), position: z.string(),
  })),
  whyUs: z.object({
    title: z.string(), subtitle: z.string(),
    features: z.array(z.object({ id: z.string().min(1), icon: z.string(), title: z.string(), description: z.string() })),
  }),
  testimonials: z.object({
    title: z.string(), subtitle: z.string(), testimonials: z.array(z.object({
      id: z.string().min(1), name: z.string(), position: z.string(), company: z.string(), content: z.string(), avatar: z.string(), rating: z.number().min(0).max(5),
    })),
  }),
  aboutUs: z.object({
    title: z.string(), content: z.string(), image: z.string(),
    stats: z.array(z.object({ id: z.string().min(1), value: z.string(), label: z.string() })),
  }),
  contactUs: z.object({
    title: z.string(), subtitle: z.string(), description: z.string(), enabled: z.boolean(), email: z.string(), phone: z.string(), address: z.string(), formEnabled: z.boolean(),
    contactInfo: z.object({ address: z.string(), phone: z.string(), email: z.string(), workingHours: z.string() }),
    form: z.object({ enabled: z.boolean(), fields: z.array(z.object({ name: z.string(), label: z.string(), required: z.boolean(), type: z.string() })) }),
    map: z.object({ enabled: z.boolean(), embedCode: z.string() }),
  }),
});
const homePageSchema = z.object({ en: contentSchema, ar: contentSchema });

type JsonRecord = Record<string, unknown>;
export interface SiteContentDocument extends GlobalSettings {
  schemaVersion: 2;
  homePage: HomePageData;
}

export interface SiteContentRepository {
  read(): Promise<unknown>;
  patch(sections: Partial<SiteContentDocument>): Promise<void>;
}

export class SiteContentError extends Error {
  constructor(message: string, readonly details?: unknown) {
    super(message);
    this.name = "SiteContentError";
  }
}

function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

const HOME_PAGE_SECTIONS = [
  "partners",
  "hero",
  "banners",
  "whyUs",
  "testimonials",
  "aboutUs",
  "contactUs",
] as const;

function sameValue(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function withoutLegacyDemoSections(input: unknown, schemaVersion: unknown): unknown {
  if (typeof schemaVersion === "number" && schemaVersion >= 2) return input;
  if (!isRecord(input)) return input;

  const migrated = clone(input);
  for (const locale of ["en", "ar"] as const) {
    const localized = migrated[locale];
    if (!isRecord(localized)) continue;

    for (const section of HOME_PAGE_SECTIONS) {
      let isLegacyDemo = sameValue(localized[section], legacyDemoData[locale][section]);

      // The first production seed used the nonexistent legacy about image;
      // later code briefly changed only that path before schema v2 existed.
      if (section === "aboutUs" && isRecord(localized[section])) {
        const candidate = { ...localized[section], image: legacyDemoData[locale].aboutUs.image };
        isLegacyDemo ||= sameValue(candidate, legacyDemoData[locale].aboutUs);
      }

      if (isLegacyDemo) localized[section] = clone(defaultData[locale][section]);
    }
  }
  return migrated;
}

function deepMerge<T>(base: T, override: unknown): T {
  if (Array.isArray(base)) return (Array.isArray(override) ? clone(override) : clone(base)) as T;
  if (isRecord(base)) {
    const source = isRecord(override) ? override : {};
    const keys = new Set([...Object.keys(base), ...Object.keys(source)]);
    return Object.fromEntries(
      Array.from(keys).map((key) => [
        key,
        key in base ? deepMerge(base[key], source[key]) : clone(source[key]),
      ]),
    ) as T;
  }
  return (override === undefined ? base : override) as T;
}

function parseGlobal(input: unknown, tolerateLegacy: boolean): GlobalSettings {
  const result = globalSettingsSchema.safeParse(deepMerge(defaultGlobalSettings, input));
  if (result.success) return result.data as GlobalSettings;
  if (tolerateLegacy) return clone(defaultGlobalSettings);
  throw new SiteContentError("Invalid global settings", result.error.flatten());
}

function parseHomePage(input: unknown, tolerateLegacy: boolean): HomePageData {
  const result = homePageSchema.safeParse(deepMerge(defaultData, input));
  if (result.success) return result.data as HomePageData;
  if (tolerateLegacy) return clone(defaultData);
  throw new SiteContentError("Invalid homepage content", result.error.flatten());
}

function normalizeGlobalSettings(input: unknown): GlobalSettings {
  return parseGlobal(input, false);
}

function normalizeHomePage(input: unknown): HomePageData {
  return parseHomePage(input, false);
}

export function createDefaultSiteContent(): SiteContentDocument {
  return { schemaVersion: 2, ...clone(defaultGlobalSettings), homePage: clone(defaultData) };
}

export function createSiteContentModule(repository: SiteContentRepository) {
  async function readDocument(): Promise<SiteContentDocument> {
    const raw = await repository.read();
    const source = isRecord(raw) ? raw : {};
    return {
      schemaVersion: 2,
      ...parseGlobal(source, true),
      homePage: parseHomePage(withoutLegacyDemoSections(source.homePage, source.schemaVersion), true),
    };
  }

  return {
    async getGlobalSettings(): Promise<GlobalSettings> {
      const { schemaVersion: _version, homePage: _homePage, ...settings } = await readDocument();
      return settings;
    },
    async getHomePage(): Promise<HomePageData> {
      return (await readDocument()).homePage;
    },
    async getLocalizedHomePage(locale: "en" | "ar"): Promise<HomePageContent> {
      return (await readDocument()).homePage[locale];
    },
    async saveGlobalSettings(input: unknown): Promise<GlobalSettings> {
      const settings = parseGlobal(input, false);
      await repository.patch({ ...settings, schemaVersion: 2 });
      return settings;
    },
    async saveHomePage(input: unknown): Promise<HomePageData> {
      const homePage = parseHomePage(input, false);
      await repository.patch({ homePage, schemaVersion: 2 });
      return homePage;
    },
    async resetGlobalSettings(): Promise<GlobalSettings> {
      const settings = clone(defaultGlobalSettings);
      await repository.patch({ ...settings, schemaVersion: 2 });
      return settings;
    },
  };
}
