"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useHomePageStore } from "@/store/home-page-store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CustomUploader } from "@/components/shared/custom-uploader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Trash2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { validateVideoBucket, type VideoBucketValidation } from "@/lib/supabase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const defaultHero = {
  title: "",
  backgroundVideo: "",
  overlayColor: "rgba(0,0,0,0.4)",
  formFields: []
};

export function HeroEditor() {
  const t = useTranslations('homePageEditor.hero');
  const { data, currentLang, updateHero } = useHomePageStore();
  const content = data?.[currentLang];
  const hero = content?.hero || defaultHero;
  const [bucketValidation, setBucketValidation] = useState<VideoBucketValidation | null>(null);
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const checkBucket = async () => {
      setIsValidating(true);
      try {
        const validation = await validateVideoBucket();
        setBucketValidation(validation);
        console.log('Video bucket validation result:', validation);
      } catch (error) {
        console.error('Failed to validate video bucket:', error);
        setBucketValidation({
          exists: false,
          isPublic: false,
          fileSizeLimitMB: 0,
          isValid: false,
          errors: ['Failed to validate bucket'],
          warnings: [],
          canListBuckets: false,
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
              ({currentLang === 'ar' ? 'يمكنك إدخال HTML لتنسيق النص - اضغط Enter لسطر جديد' : 'You can enter HTML to format text - Press Enter for a new line'})
            </span>
          </label>
          <Textarea
            value={hero.title || ''}
            onChange={(e) => updateHero({ title: e.target.value })}
            placeholder={currentLang === 'ar' 
              ? 'أدخل العنوان هنا...\nيمكنك استخدام HTML مثل <strong>نص عريض</strong> أو <em>نص مائل</em>\nاضغط Enter لسطر جديد'
              : 'Enter title here...\nYou can use HTML like <strong>bold</strong> or <em>italic</em>\nPress Enter for a new line'}
            rows={10}
            dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
            className="min-h-[250px] font-mono text-sm leading-relaxed"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {currentLang === 'ar' 
              ? '💡 نصيحة: يمكنك استخدام HTML لتنسيق النص (مثل <strong>، <em>، <br>). اضغط Enter لإنشاء سطر جديد.'
              : '💡 Tip: You can use HTML to format text (like <strong>, <em>, <br>). Press Enter to create a new line.'}
          </p>
        </div>

        <div>
          <label className="text-sm font-medium">{t('backgroundVideo')}</label>
          <div className="space-y-3">
            {/* Bucket Validation Status */}
            {!isValidating && bucketValidation && (
              <>
                {bucketValidation.isValid && bucketValidation.warnings.length === 0 ? (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">Video Bucket Ready</AlertTitle>
                    <AlertDescription className="text-green-700">
                      Video bucket is configured correctly. Max file size: {bucketValidation.fileSizeLimitMB.toFixed(0)}MB
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert variant={bucketValidation.errors.length > 0 ? "destructive" : "default"} className="border-yellow-200 bg-yellow-50">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <AlertTitle className="text-yellow-800">Bucket Configuration Warning</AlertTitle>
                    <AlertDescription className="text-yellow-700">
                      <div className="space-y-1">
                        {bucketValidation.errors.length > 0 && (
                          <div>
                            <strong>Errors:</strong>
                            <ul className="list-disc list-inside ml-2">
                              {bucketValidation.errors.map((error, i) => (
                                <li key={i}>{error}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {bucketValidation.warnings.length > 0 && (
                          <div>
                            <strong>Warnings:</strong>
                            <ul className="list-disc list-inside ml-2">
                              {bucketValidation.warnings.map((warning, i) => (
                                <li key={i}>{warning}</li>
                              ))}
                            </ul>
                          </div>
                        )}
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
    </div>
  );
}