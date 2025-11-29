"use client";

import { useTranslations } from "next-intl";
import { useHomePageStore } from "@/store/home-page-store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomUploader } from "@/components/shared/custom-uploader";

const defaultHero = {
  title: "",
  subtitle: "",
  primaryButton: { text: "", link: "", variant: "primary" as const },
  secondaryButton: { text: "", link: "", variant: "secondary" as const },
  backgroundVideo: "",
  overlayColor: "rgba(0,0,0,0.4)"
};

export function HeroEditor() {
  const t = useTranslations('homePageEditor.hero');
  const { data, currentLang, updateHero, updateHeroButton } = useHomePageStore();
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

  const ButtonEditor = ({ type }: { type: 'primary' | 'secondary' }) => (
    <div className="space-y-3 rounded-lg border p-4">
      <Input
        value={hero[`${type}Button`]?.text || ""}
        onChange={(e) => updateHeroButton(type, { text: e.target.value })}
        placeholder={t('placeholders.buttonText')}
      />
      <Input
        value={hero[`${type}Button`]?.link || ""}
        onChange={(e) => updateHeroButton(type, { link: e.target.value })}
        placeholder={t('placeholders.buttonLink')}
      />
      <Select
        value={hero[`${type}Button`]?.variant || type}
        onValueChange={(value: any) => updateHeroButton(type, { variant: value })}
      >
        <SelectTrigger>
          <SelectValue placeholder={t('buttonVariant')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="primary">{t('variants.primary')}</SelectItem>
          <SelectItem value="secondary">{t('variants.secondary')}</SelectItem>
          <SelectItem value="outline">{t('variants.outline')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

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

      <div className="space-y-4">
        <h3 className="font-medium">{t('primaryButton')}</h3>
        <ButtonEditor type="primary" />
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">{t('secondaryButton')}</h3>
        <ButtonEditor type="secondary" />
      </div>
    </div>
  );
}