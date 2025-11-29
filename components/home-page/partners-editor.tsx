"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useHomePageStore } from "@/store/home-page-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CustomUploader } from "@/components/shared/custom-uploader";
import { Plus, Trash2 } from "lucide-react";

export function PartnersEditor() {
  const t = useTranslations('homePageEditor.partners');
  const { data, currentLang, addPartner, updatePartner, removePartner } = useHomePageStore();
  const partners = data[currentLang].partners || [];
  const [newPartner, setNewPartner] = useState({ src: "", alt: "" });

  const handleAddPartner = () => {
    if (newPartner.src && newPartner.alt) {
      addPartner({ id: Date.now().toString(), ...newPartner });
      setNewPartner({ src: "", alt: "" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-medium">{t('currentPartners')}</h3>
        <div className="space-y-3">
          {partners.map((partner) => (
            <div key={partner.id} className="space-y-3 rounded-lg border p-4">
              <Input
                value={partner.src}
                onChange={(e) => updatePartner(partner.id, { src: e.target.value })}
                placeholder={t('logoImageUrl')}
                className="mb-2"
              />
              <CustomUploader
                onUploadComplete={(url) => updatePartner(partner.id, { src: url })}
                acceptedFileTypes="image"
              />
              <Input
                value={partner.alt}
                onChange={(e) => updatePartner(partner.id, { alt: e.target.value })}
                placeholder={t('altText')}
              />
              <Button variant="outline" size="sm" onClick={() => removePartner(partner.id)}>
                <Trash2 className="h-4 w-4" />
                {t('remove')}
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border bg-muted/50 p-4">
        <h3 className="mb-3 font-medium">{t('addNewPartner')}</h3>
        <div className="space-y-3">
          <Input
            value={newPartner.src}
            onChange={(e) => setNewPartner({ ...newPartner, src: e.target.value })}
            placeholder={t('logoImageUrl')}
            className="mb-2"
          />
          <CustomUploader
            onUploadComplete={(url) => setNewPartner({ ...newPartner, src: url })}
            acceptedFileTypes="image"
          />
          <Input
            value={newPartner.alt}
            onChange={(e) => setNewPartner({ ...newPartner, alt: e.target.value })}
            placeholder={t('altText')}
          />
          <Button onClick={handleAddPartner} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            {t('addPartner')}
          </Button>
        </div>
      </div>
    </div>
  );
}