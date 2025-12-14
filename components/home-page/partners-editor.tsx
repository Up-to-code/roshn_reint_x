"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useHomePageStore } from "@/store/home-page-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CustomUploader } from "@/components/shared/custom-uploader";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export function PartnersEditor() {
  const t = useTranslations('homePageEditor.partners');
  const { data, currentLang, addPartner, updatePartner, removePartner } = useHomePageStore();
  const partners = data[currentLang].partners || [];
  const [newPartner, setNewPartner] = useState({ src: "", alt: "" });

  const handleAddPartner = () => {
    if (newPartner.src && newPartner.alt) {
      addPartner({ 
        id: Date.now().toString(), 
        src: newPartner.src,
        alt: newPartner.alt,
        name: newPartner.alt,
        logo: newPartner.src,
        link: ""
      });
      setNewPartner({ src: "", alt: "" });
    }
  };

  const handleMultipleUpload = (urls: string[]) => {
    urls.forEach((url, index) => {
      addPartner({
        id: `${Date.now()}-${index}`,
        src: url,
        alt: `Partner ${partners.length + index + 1}`,
        name: `Partner ${partners.length + index + 1}`,
        logo: url,
        link: ""
      });
    });
  };

  return (
    <div className="space-y-6">
      {/* Current Partners Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{t('currentPartners')}</h3>
          <Badge variant="secondary">
            {partners.length} {partners.length === 1 ? 'Partner' : 'Partners'}
          </Badge>
        </div>
        
        {partners.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No partners added yet. Add your first partner below.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {partners.map((partner) => (
              <Card key={partner.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-sm font-medium">Partner #{partners.indexOf(partner) + 1}</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removePartner(partner.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Partner Image Preview */}
                  {partner.src && (
                    <div className="relative h-32 w-full overflow-hidden rounded-lg border bg-muted">
                      <Image
                        src={partner.src}
                        alt={partner.alt || 'Partner logo'}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                  )}
                  
                  <Input
                    value={partner.src}
                    onChange={(e) => updatePartner(partner.id, { src: e.target.value, logo: e.target.value })}
                    placeholder={t('logoImageUrl')}
                    className="text-xs"
                  />
                  
                  <CustomUploader
                    bucket="IMAGES"
                    onUploadComplete={(url) => updatePartner(partner.id, { src: url, logo: url })}
                    acceptedFileTypes="image"
                    buttonText="Upload Logo"
                    maxSize={10}
                    multiple={false}
                  />
                  
                  <Input
                    value={partner.alt}
                    onChange={(e) => updatePartner(partner.id, { alt: e.target.value, name: e.target.value })}
                    placeholder={t('altText')}
                    className="text-xs"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add New Partner Section */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-lg">{t('addNewPartner')}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Add unlimited partners. No limit on the number of partner images you can upload.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Input
              value={newPartner.src}
              onChange={(e) => setNewPartner({ ...newPartner, src: e.target.value })}
              placeholder={t('logoImageUrl')}
            />
            
            <CustomUploader
              bucket="IMAGES"
              onUploadComplete={(url) => setNewPartner({ ...newPartner, src: url })}
              acceptedFileTypes="image"
              buttonText="Upload Partner Logo"
              maxSize={10}
              multiple={false}
            />
            
            {newPartner.src && (
              <div className="relative h-24 w-full overflow-hidden rounded-lg border bg-muted">
                <Image
                  src={newPartner.src}
                  alt="Preview"
                  fill
                  className="object-contain p-2"
                />
              </div>
            )}
            
            <Input
              value={newPartner.alt}
              onChange={(e) => setNewPartner({ ...newPartner, alt: e.target.value })}
              placeholder={t('altText')}
            />
            
            <Button 
              onClick={handleAddPartner} 
              className="w-full"
              disabled={!newPartner.src || !newPartner.alt}
            >
              <Plus className="mr-2 h-4 w-4" />
              {t('addPartner')}
            </Button>
          </div>

          {/* Bulk Upload Option */}
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-2">Bulk Upload (Optional)</p>
            <p className="text-xs text-muted-foreground mb-3">
              Upload multiple partner logos at once. You can add names/alt text after uploading.
            </p>
            <CustomUploader
              bucket="IMAGES"
              onMultipleUploadComplete={handleMultipleUpload}
              acceptedFileTypes="image"
              buttonText="Upload Multiple Partner Logos"
              maxSize={10}
              multiple={true}
              maxFiles={50}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}