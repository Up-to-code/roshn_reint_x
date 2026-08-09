import { describe, expect, test } from "bun:test";

import { defaultGlobalSettings } from "../../lib/site-content/global-settings-defaults";
import { defaultData, legacyDemoData } from "../../lib/site-content/home-page-defaults";
import {
  createDefaultSiteContent,
  createSiteContentModule,
  SiteContentError,
  type SiteContentDocument,
} from "../../lib/site-content/site-content-core";

function harness(initial: unknown = createDefaultSiteContent()) {
  let document = structuredClone(initial) as SiteContentDocument;
  const siteContentModule = createSiteContentModule({
    async read() {
      return structuredClone(document);
    },
    async patch(sections) {
      document = { ...document, ...structuredClone(sections) };
    },
  });
  return { siteContentModule, get document() { return document; } };
}

describe("Site Content module", () => {
  test("migrates partial legacy homepage content without losing supplied values", async () => {
    const context = harness({
      navigation: defaultGlobalSettings.navigation,
      footer: defaultGlobalSettings.footer,
      logo: defaultGlobalSettings.logo,
      meta: defaultGlobalSettings.meta,
      homePage: { en: { hero: { title: "Custom title", backgroundVideo: "/custom.mp4" } } },
    });

    const homepage = await context.siteContentModule.getHomePage();
    expect(homepage.en.hero.title).toBe("Custom title");
    expect(homepage.en.hero.backgroundVideo).toBe("/custom.mp4");
    expect(homepage.en.contactUs.form.fields).toEqual([]);
    expect(homepage.ar.hero.title).toBe(defaultData.ar.hero.title);
  });

  test("homepage writes preserve global settings", async () => {
    const context = harness();
    const changed = structuredClone(defaultData);
    changed.en.hero.title = "Changed";
    await context.siteContentModule.saveHomePage(changed);

    expect(context.document.homePage.en.hero.title).toBe("Changed");
    expect(context.document.navigation).toEqual(defaultGlobalSettings.navigation);
  });

  test("global writes and resets preserve homepage content", async () => {
    const initial = createDefaultSiteContent();
    initial.homePage.ar.hero.title = "محفوظ";
    const context = harness(initial);
    await context.siteContentModule.saveGlobalSettings({ meta: { ...defaultGlobalSettings.meta, title: "New title" } });
    expect(context.document.meta.title).toBe("New title");
    expect(context.document.homePage.ar.hero.title).toBe("محفوظ");

    await context.siteContentModule.resetGlobalSettings();
    expect(context.document.meta.title).toBe(defaultGlobalSettings.meta.title);
    expect(context.document.homePage.ar.hero.title).toBe("محفوظ");
  });

  test("rejects malformed writes instead of persisting corrupt JSON", async () => {
    const context = harness();
    await expect(context.siteContentModule.saveHomePage({ en: { hero: { title: 42 } } })).rejects.toBeInstanceOf(
      SiteContentError,
    );
    await expect(context.siteContentModule.saveGlobalSettings({ logo: { width: -10 } })).rejects.toBeInstanceOf(
      SiteContentError,
    );
  });

  test("new documents do not inject demo homepage data", async () => {
    const context = harness(null);
    const homepage = await context.siteContentModule.getHomePage();
    expect(homepage.en.partners).toEqual([]);
    expect(homepage.ar.whyUs.features).toEqual([]);
    expect(homepage.ar.aboutUs.stats).toEqual([]);
  });

  test("schema v1 removes untouched demo sections but preserves dashboard edits", async () => {
    const legacy = {
      schemaVersion: 1,
      ...defaultGlobalSettings,
      homePage: structuredClone(legacyDemoData),
    };
    legacy.homePage.ar.hero.title = "عنوان محفوظ من لوحة التحكم";
    const context = harness(legacy);

    const homepage = await context.siteContentModule.getHomePage();
    expect(homepage.ar.hero.title).toBe("عنوان محفوظ من لوحة التحكم");
    expect(homepage.ar.partners).toEqual([]);
    expect(homepage.ar.whyUs.features).toEqual([]);
    expect(homepage.ar.aboutUs.stats).toEqual([]);
  });
});
