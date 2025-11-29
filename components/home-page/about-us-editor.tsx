"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useHomePageStore } from "@/store/home-page-store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CustomUploader } from "@/components/shared/custom-uploader";
import { Plus, Trash2 } from "lucide-react";

export function AboutUsEditor() {
  const t = useTranslations('homePageEditor.aboutUs');
  const { data, currentLang, updateAboutUs, addStat, updateStat, removeStat } = useHomePageStore();
  const aboutUs = data[currentLang].aboutUs;
  const [newStat, setNewStat] = useState({ value: '', label: '' });

  const handleAddStat = () => {
    if (newStat.value && newStat.label) {
      addStat({ id: Date.now().toString(), ...newStat });
      setNewStat({ value: '', label: '' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div>
          <label className="text-sm font-medium">{t('sectionTitle')}</label>
          <Input
            value={aboutUs.title}
            onChange={(e) => updateAboutUs({ title: e.target.value })}
            placeholder={t('placeholders.aboutOurCompany')}
            dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
          />
        </div>

        <div>
          <label className="text-sm font-medium">{t('content')}</label>
          <Textarea
            value={aboutUs.content}
            onChange={(e) => updateAboutUs({ content: e.target.value })}
            placeholder={t('placeholders.companyDescription')}
            rows={4}
            dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
          />
        </div>

        <div>
          <label className="text-sm font-medium">{t('image')}</label>
          <Input
            value={aboutUs.image}
            onChange={(e) => updateAboutUs({ image: e.target.value })}
            placeholder={t('placeholders.imagePath')}
            className="mb-2"
          />
          <CustomUploader
             onUploadComplete={(url) => updateAboutUs({ image: url })}
            acceptedFileTypes="image"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">{t('statistics')}</h3>
        <div className="space-y-3">
          {aboutUs.stats.map((stat) => (
            <div key={stat.id} className="flex items-center gap-2 rounded-lg border p-3">
              <Input
                value={stat.value}
                onChange={(e) => updateStat(stat.id, { value: e.target.value })}
                placeholder={t('placeholders.valueExample')}
              />
              <Input
                value={stat.label}
                onChange={(e) => updateStat(stat.id, { label: e.target.value })}
                placeholder={t('placeholders.labelExample')}
                dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
              />
              <Button variant="outline" size="sm" onClick={() => removeStat(stat.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="rounded-lg border bg-muted/50 p-3">
          <div className="grid grid-cols-2 gap-2">
            <Input
              value={newStat.value}
              onChange={(e) => setNewStat({ ...newStat, value: e.target.value })}
              placeholder={t('value')}
            />
            <Input
              value={newStat.label}
              onChange={(e) => setNewStat({ ...newStat, label: e.target.value })}
              placeholder={t('label')}
              dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
            />
          </div>
          <Button onClick={handleAddStat} size="sm" className="mt-2">
            <Plus className="mr-2 h-4 w-4" />
            {t('addStatistic')}
          </Button>
        </div>
      </div>
    </div>
  );
}