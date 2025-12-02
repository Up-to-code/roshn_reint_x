"use client";

import { useTranslations } from "next-intl";
import { useHomePageStore } from "@/store/home-page-store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CustomUploader } from "@/components/shared/custom-uploader";
import { HeroFormBuilder } from "./hero-form-builder";

const defaultHero = {
  title: "",
  subtitle: "",
  backgroundVideo: "",
  overlayColor: "rgba(0,0,0,0.4)",
  formFields: []
};

export function HeroEditor() {
  const t = useTranslations('homePageEditor.hero');
  const { data, currentLang, updateHero } = useHomePageStore();
  const content = data?.[currentLang];
  const hero = content?.hero || defaultHero;

  if (!content) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 animate-pulse rounded bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div>
          <label className="text-sm font-medium">{t('heroTitle')}</label>
          <Input
            value={hero.title}
            onChange={(e) => updateHero({ title: e.target.value })}
            placeholder={t('placeholders.mainHeroTitle')}
            dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
          />
        </div>

        <div>
          <label className="text-sm font-medium">{t('heroSubtitle')}</label>
          <Textarea
            value={hero.subtitle}
            onChange={(e) => updateHero({ subtitle: e.target.value })}
            placeholder={t('placeholders.heroSubtitleDescription')}
            rows={3}
            dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
          />
        </div>

        <div>
          <label className="text-sm font-medium">{t('backgroundVideo')}</label>
          <div className="space-y-3">
            <Input
              value={hero.backgroundVideo}
              onChange={(e) => updateHero({ backgroundVideo: e.target.value })}
              placeholder={t('placeholders.videoPath')}
            />
            <CustomUploader
               onUploadComplete={(url) => updateHero({ backgroundVideo: url })}
              acceptedFileTypes="video"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">{t('overlayColor')}</label>
          <Input
            value={hero.overlayColor}
            onChange={(e) => updateHero({ overlayColor: e.target.value })}
            placeholder={t('placeholders.overlayColorExample')}
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <HeroFormBuilder />
      </div>
    </div>
  );
}