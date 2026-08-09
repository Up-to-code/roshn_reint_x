"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useHomePageStore } from "@/store/home-page-store";
import { Input } from "@/components/ui/input";
import { CustomUploader } from "@/components/shared/custom-uploader";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Trash2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { getMediaStatus } from "@/lib/media-storage/media-client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  const [bucketValidation, setBucketValidation] = useState<Awaited<ReturnType<typeof getMediaStatus>> | null>(null);
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const checkBucket = async () => {
      setIsValidating(true);
      try {
        const validation = await getMediaStatus("VIDEOS");
        setBucketValidation(validation);
      } catch (error) {
        console.error('Failed to validate video bucket:', error);
        setBucketValidation({
          key: "VIDEOS",
          name: "videos",
          exists: false,
          isPublic: false,
          fileSizeLimitMB: 0,
          isValid: false,
          expectedLimitMB: 100,
        });
      } finally {
        setIsValidating(false);
      }
    };

    checkBucket();
  }, []);

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
          <label className="mb-2 block text-sm font-medium">
            {t('heroTitle')} 
            <span className="ml-2 text-xs text-muted-foreground">
              ({currentLang === 'ar' ? 'محرر نص منسق - يمكنك تنسيق النص وإضافة أسطر جديدة' : 'Rich text editor - Format text and add new lines'})
            </span>
          </label>
          <RichTextEditor
            value={hero.title || ''}
            onChange={(value) => updateHero({ title: value })}
            placeholder={currentLang === 'ar' 
              ? 'أدخل العنوان هنا... يمكنك استخدام Enter لسطر جديد'
              : 'Enter title here... Press Enter for a new line'}
            isRTL={currentLang === 'ar'}
            className="min-h-[250px]"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {currentLang === 'ar' 
              ? '💡 نصيحة: استخدم شريط الأدوات لتنسيق النص. اضغط Enter لإنشاء سطر جديد.'
              : '💡 Tip: Use the toolbar to format text. Press Enter to create a new line.'}
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            {t('heroSubtitle') || (currentLang === 'ar' ? 'العنوان الفرعي' : 'Subtitle')}
            <span className="ml-2 text-xs text-muted-foreground">
              ({currentLang === 'ar' ? 'اختياري - نص قصير يظهر تحت العنوان الرئيسي' : 'Optional - Short text displayed below the main title'})
            </span>
          </label>
          <RichTextEditor
            value={hero.subtitle || ''}
            onChange={(value) => updateHero({ subtitle: value })}
            placeholder={currentLang === 'ar' 
              ? 'أدخل العنوان الفرعي هنا...'
              : 'Enter subtitle here...'}
            isRTL={currentLang === 'ar'}
            className="min-h-[120px]"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {currentLang === 'ar' 
              ? '💡 نصيحة: العنوان الفرعي يظهر بحجم أصغر تحت العنوان الرئيسي مباشرة.'
              : '💡 Tip: The subtitle appears in a smaller size directly below the main title.'}
          </p>
        </div>

        <div>
          <label className="text-sm font-medium">{t('backgroundVideo')}</label>
          <div className="space-y-3">
            {/* Bucket Validation Status */}
            {!isValidating && bucketValidation && (
              <>
                {bucketValidation.isValid ? (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle2 className="size-4 text-green-600" />
                    <AlertTitle className="text-green-800">Video Bucket Ready</AlertTitle>
                    <AlertDescription className="text-green-700">
                      Video bucket is configured correctly. Max file size: {bucketValidation.fileSizeLimitMB.toFixed(0)}MB
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert variant={!bucketValidation.exists ? "destructive" : "default"} className="border-yellow-200 bg-yellow-50">
                    <AlertTriangle className="size-4 text-yellow-600" />
                    <AlertTitle className="text-yellow-800">Bucket Configuration Warning</AlertTitle>
                    <AlertDescription className="text-yellow-700">
                      <div className="space-y-1">
                        {!bucketValidation.exists && <div>The videos bucket has not been provisioned.</div>}
                        {bucketValidation.exists && !bucketValidation.isPublic && <div>The videos bucket must be public for playback.</div>}
                        {bucketValidation.exists && bucketValidation.fileSizeLimitMB < bucketValidation.expectedLimitMB && <div>The configured file limit is below the application policy.</div>}
                        <div className="mt-2 text-xs">
                          Current limit: {bucketValidation.fileSizeLimitMB.toFixed(2)}MB | 
                          Recommended: 100MB+
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </>
            )}

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
                  <Trash2 className="size-4" />
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
                        <ExternalLink className="mr-2 size-4" />
                        Open in New Tab
                      </Button>
                    </div>
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                      <video
                        src={hero.backgroundVideo}
                        controls
                        className="size-full object-contain"
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
    </div>
  );
}
