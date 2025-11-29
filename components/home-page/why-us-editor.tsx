"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useHomePageStore } from "@/store/home-page-store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CustomUploader } from "@/components/shared/custom-uploader";
import { Plus, Trash2 } from "lucide-react";

export function WhyUsEditor() {
  const t = useTranslations('homePageEditor.whyUs');
  const { data, currentLang, updateWhyUs, addFeature, updateFeature, removeFeature } = useHomePageStore();
  const whyUs = data[currentLang].whyUs;
  const [newFeature, setNewFeature] = useState({ icon: '', title: '', description: '' });

  const handleAddFeature = () => {
    if (newFeature.title && newFeature.description) {
      addFeature({ id: Date.now().toString(), ...newFeature });
      setNewFeature({ icon: '', title: '', description: '' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <Input
          value={whyUs.title}
          onChange={(e) => updateWhyUs({ title: e.target.value })}
          placeholder={t('sectionTitle')}
          dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
        />
        <Input
          value={whyUs.subtitle}
          onChange={(e) => updateWhyUs({ subtitle: e.target.value })}
          placeholder={t('sectionSubtitle')}
          dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
        />
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">{t('features')}</h3>
        <div className="space-y-3">
          {whyUs.features.map((feature) => (
            <div key={feature.id} className="space-y-3 rounded-lg border p-4">
              <Input
                value={feature.icon}
                onChange={(e) => updateFeature(feature.id, { icon: e.target.value })}
                placeholder={t('iconUrlOrEmoji')}
                className="mb-2"
              />
              <CustomUploader
                onUploadComplete={(url) => updateFeature(feature.id, { icon: url })}
                acceptedFileTypes="image"
              />
              <Input
                value={feature.title}
                onChange={(e) => updateFeature(feature.id, { title: e.target.value })}
                placeholder={t('featureTitle')}
                dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
              />
              <Textarea
                value={feature.description}
                onChange={(e) => updateFeature(feature.id, { description: e.target.value })}
                placeholder={t('featureDescription')}
                rows={2}
                dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
              />
              <Button variant="outline" size="sm" onClick={() => removeFeature(feature.id)}>
                <Trash2 className="size-4" />
                {t('remove')}
              </Button>
            </div>
          ))}
        </div>

        <div className="rounded-lg border bg-muted/50 p-4">
          <h4 className="mb-3 font-medium">{t('addNewFeature')}</h4>
          <div className="space-y-3">
            <Input
              value={newFeature.icon}
              onChange={(e) => setNewFeature({ ...newFeature, icon: e.target.value })}
              placeholder={t('iconUrlOrEmoji')}
              className="mb-2"
            />
            <CustomUploader
              onUploadComplete={(url) => setNewFeature({ ...newFeature, icon: url })}
              acceptedFileTypes="image"
            />
            <Input
              value={newFeature.title}
              onChange={(e) => setNewFeature({ ...newFeature, title: e.target.value })}
              placeholder={t('featureTitle')}
              dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
            />
            <Textarea
              value={newFeature.description}
              onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
              placeholder={t('featureDescription')}
              rows={2}
              dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
            />
            <Button onClick={handleAddFeature} className="w-full">
              <Plus className="mr-2 size-4" />
              {t('addFeature')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}