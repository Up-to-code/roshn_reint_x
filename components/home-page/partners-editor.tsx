"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useHomePageStore } from "@/store/home-page-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CustomUploader } from "@/components/shared/custom-uploader";
import { Plus, Trash2, Image as ImageIcon, Upload, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
      });
    });
  };

  return (
    <div className="space-y-6">
      {/* Info Alert */}
      <Alert>
        <Info className="size-4" />
        <AlertDescription>
          <strong>Unlimited Partners:</strong> You can add as many partners as you need. All partners will be displayed on your homepage.
        </AlertDescription>
      </Alert>

      {/* Current Partners Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{t('currentPartners')}</CardTitle>
              <CardDescription className="mt-1">
                Manage your existing partners. Edit or remove any partner below.
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-base px-3 py-1">
              {partners.length} {partners.length === 1 ? 'Partner' : 'Partners'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {partners.length === 0 ? (
            <div className="py-12 text-center border-2 border-dashed rounded-lg bg-muted/30">
              <ImageIcon className="mx-auto size-16 text-muted-foreground mb-4 opacity-50" />
              <p className="text-lg font-medium text-muted-foreground mb-2">No partners yet</p>
              <p className="text-sm text-muted-foreground">
                Start by adding your first partner using the form below.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {partners.map((partner, index) => (
                <Card key={partner.id} className="relative border-2 hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base font-semibold">
                          Partner #{index + 1}
                        </CardTitle>
                        <CardDescription className="text-xs mt-1">
                          Click to edit details
                        </CardDescription>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removePartner(partner.id)}
                        className="size-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        title="Remove partner"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Partner Image Preview */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Partner Logo</Label>
                      {partner.src ? (
                        <div className="relative h-40 w-full overflow-hidden rounded-lg border-2 border-muted bg-muted/50">
                          <Image
                            src={typeof partner.src === 'string' ? partner.src : String(partner.src)}
                            alt={typeof partner.alt === 'string' ? partner.alt : String(partner.alt || 'Partner logo')}
                            fill
                            className="object-contain p-3"
                          />
                        </div>
                      ) : (
                        <div className="relative h-40 w-full overflow-hidden rounded-lg border-2 border-dashed border-muted bg-muted/30 flex items-center justify-center">
                          <div className="text-center">
                            <ImageIcon className="mx-auto size-8 text-muted-foreground mb-2" />
                            <p className="text-xs text-muted-foreground">No image</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`partner-src-${partner.id}`} className="text-sm font-medium">
                        Image URL
                      </Label>
                  <Input
                    id={`partner-src-${partner.id}`}
                    value={String(partner.src || '')}
                    onChange={(e) => updatePartner(partner.id, { src: e.target.value, logo: e.target.value })}
                    placeholder="https://example.com/logo.png"
                    className="text-sm"
                  />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Upload Logo</Label>
                      <CustomUploader
                        bucket="IMAGES"
                        onUploadComplete={(url) => updatePartner(partner.id, { src: url, logo: url })}
                        acceptedFileTypes="image"
                        buttonText="Choose Image"
                        maxSize={10}
                        multiple={false}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`partner-alt-${partner.id}`} className="text-sm font-medium">
                        Partner Name / Alt Text <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id={`partner-alt-${partner.id}`}
                        value={String(partner.alt || '')}
                        onChange={(e) => updatePartner(partner.id, { alt: e.target.value })}
                        placeholder="Enter partner name"
                        className="text-sm"
                      />
                      <p className="text-xs text-muted-foreground">
                        This text appears when the image cannot load
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add New Partner Section */}
      <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Plus className="size-5 text-primary" />
            <CardTitle className="text-xl">{t('addNewPartner')}</CardTitle>
          </div>
          <CardDescription className="mt-2">
            Add a new partner to your homepage. You can add unlimited partners with no restrictions!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Single Partner Upload */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Upload className="size-4 text-muted-foreground" />
              <h4 className="font-semibold text-base">Add Single Partner</h4>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-partner-src" className="text-sm font-medium">
                  Partner Logo Image URL (Optional)
                </Label>
                <Input
                  id="new-partner-src"
                  value={newPartner.src}
                  onChange={(e) => setNewPartner({ ...newPartner, src: e.target.value })}
                  placeholder="https://example.com/partner-logo.png"
                  className="text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Or upload an image using the button below
                </p>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Upload Partner Logo</Label>
                <CustomUploader
                  bucket="IMAGES"
                  onUploadComplete={(url) => setNewPartner({ ...newPartner, src: url })}
                  acceptedFileTypes="image"
                  buttonText="Upload Image"
                  maxSize={10}
                  multiple={false}
                />
              </div>
              
              {newPartner.src && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Preview</Label>
                  <div className="relative h-32 w-full overflow-hidden rounded-lg border-2 border-primary/20 bg-muted/50">
                    <Image
                      src={newPartner.src}
                      alt="Preview"
                      fill
                      className="object-contain p-3"
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="new-partner-alt" className="text-sm font-medium">
                  Partner Name / Alt Text <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="new-partner-alt"
                  value={newPartner.alt}
                  onChange={(e) => setNewPartner({ ...newPartner, alt: e.target.value })}
                  placeholder="Enter partner name (e.g., Company Name)"
                  className="text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Required: This identifies your partner
                </p>
              </div>
              
              <Button 
                onClick={handleAddPartner} 
                className="w-full"
                size="lg"
                disabled={!newPartner.src || !newPartner.alt}
              >
                <Plus className="mr-2 size-5" />
                Add Partner
              </Button>
            </div>
          </div>

          {/* Bulk Upload Option */}
          <div className="space-y-4 pt-6 border-t-2">
            <div className="flex items-center gap-2">
              <Upload className="size-4 text-muted-foreground" />
              <h4 className="font-semibold text-base">Bulk Upload (Optional)</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Upload multiple partner logos at once (unlimited). You can edit the names after uploading.
            </p>
            <CustomUploader
              bucket="IMAGES"
              onMultipleUploadComplete={handleMultipleUpload}
              acceptedFileTypes="image"
              buttonText="Upload Multiple Logos (Unlimited)"
              maxSize={10}
              multiple={true}
              maxFiles={1000}
            />
            <p className="text-xs text-muted-foreground italic">
              💡 Tip: After bulk upload, you can edit each partner&apos;s name individually above.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
