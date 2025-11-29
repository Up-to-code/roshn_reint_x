"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useHomePageStore } from "@/store/home-page-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CustomUploader } from "@/components/shared/custom-uploader";
import { Plus, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function BannersEditor() {
  const t = useTranslations('homePageEditor.banners');
  const { data, currentLang, addBanner, updateBanner, removeBanner } = useHomePageStore();
  const banners = data[currentLang].banners;
  const [newBanner, setNewBanner] = useState({
    title: '', description: '', image: '', link: '', position: 'top' as const
  });

  const handleAddBanner = () => {
    if (newBanner.title && newBanner.description) {
      addBanner({ id: Date.now().toString(), ...newBanner });
      setNewBanner({ title: '', description: '', image: '', link: '', position: 'top' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-medium">{t('currentBanners')}</h3>
        <div className="space-y-3">
          {banners.map((banner) => (
            <div key={banner.id} className="space-y-3 rounded-lg border p-4">
              <Input
                value={banner.title}
                onChange={(e) => updateBanner(banner.id, { title: e.target.value })}
                placeholder={t('bannerTitle')}
                dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
              />
              <Input
                value={banner.description}
                onChange={(e) => updateBanner(banner.id, { description: e.target.value })}
                placeholder={t('bannerDescription')}
                dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
              />
              <Input
                value={banner.image}
                onChange={(e) => updateBanner(banner.id, { image: e.target.value })}
                placeholder={t('imageUrl')}
                className="mb-2"
              />
              <CustomUploader
                 onUploadComplete={(url) => updateBanner(banner.id, { image: url })}
                acceptedFileTypes="image"
              />
              <Input
                value={banner.link}
                onChange={(e) => updateBanner(banner.id, { link: e.target.value })}
                placeholder={t('linkUrl')}
              />
              <Select value={banner.position} onValueChange={(value: any) => updateBanner(banner.id, { position: value })}>
                <SelectTrigger>
                  <SelectValue placeholder={t('position')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top">{t('positions.top')}</SelectItem>
                  <SelectItem value="middle">{t('positions.middle')}</SelectItem>
                  <SelectItem value="bottom">{t('positions.bottom')}</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => removeBanner(banner.id)}>
                <Trash2 className="h-4 w-4" />
                {t('remove')}
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border bg-muted/50 p-4">
        <h3 className="mb-3 font-medium">{t('addNewBanner')}</h3>
        <div className="space-y-3">
          <Input
            value={newBanner.title}
            onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
            placeholder={t('bannerTitle')}
            dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
          />
          <Input
            value={newBanner.description}
            onChange={(e) => setNewBanner({ ...newBanner, description: e.target.value })}
            placeholder={t('bannerDescription')}
            dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
          />
          <Input
            value={newBanner.image}
            onChange={(e) => setNewBanner({ ...newBanner, image: e.target.value })}
            placeholder={t('imageUrl')}
            className="mb-2"
          />
          <CustomUploader
             onUploadComplete={(url) => setNewBanner({ ...newBanner, image: url })}
            acceptedFileTypes="image"
          />
          <Input
            value={newBanner.link}
            onChange={(e) => setNewBanner({ ...newBanner, link: e.target.value })}
            placeholder={t('linkUrl')}
          />
          <Select value={newBanner.position} onValueChange={(value: any) => setNewBanner({ ...newBanner, position: value })}>
            <SelectTrigger>
              <SelectValue placeholder={t('position')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="top">{t('positions.top')}</SelectItem>
              <SelectItem value="middle">{t('positions.middle')}</SelectItem>
              <SelectItem value="bottom">{t('positions.bottom')}</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleAddBanner} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            {t('addBanner')}
          </Button>
        </div>
      </div>
    </div>
  );
}