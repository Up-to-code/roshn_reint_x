"use client";

import { useTranslations } from "next-intl";
import { useHomePageStore } from "@/store/home-page-store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CustomUploader } from "@/components/shared/custom-uploader";
import { HeroFormBuilder } from "./hero-form-builder";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Trash2 } from "lucide-react";

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

  const handleVideoUpload = (url: string) => {
    updateHero({ backgroundVideo: url });
  };

  const handleRemoveVideo = () => {
    updateHero({ backgroundVideo: "" });
  };

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
            <div className="flex gap-2">
              <Input
                value={hero.backgroundVideo}
                onChange={(e) => updateHero({ backgroundVideo: e.target.value })}
                placeholder={t('placeholders.videoPath')}
                className="flex-1"
              />
              {hero.backgroundVideo && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleRemoveVideo}
                  title="Remove video"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <CustomUploader
              bucket="VIDEOS"
              onUploadComplete={handleVideoUpload}
              acceptedFileTypes="video"
              buttonText={t('uploadVideo') || "Upload Video"}
              maxSize={100}
              multiple={false}
            />

            {/* Video Preview */}
            {hero.backgroundVideo && (
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Video Preview</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(hero.backgroundVideo, '_blank')}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Open in New Tab
                      </Button>
                    </div>
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                      <video
                        src={hero.backgroundVideo}
                        controls
                        className="h-full w-full object-contain"
                        preload="metadata"
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                    <p className="text-xs text-muted-foreground break-all">
                      {hero.backgroundVideo}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
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