"use client";
import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { CreatePropertyData } from '@/lib/api/properties-service';
import { CustomUploader } from '@/components/shared/custom-uploader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Image as ImageIcon } from 'lucide-react';

interface PropertyFormProps {
  initialData?: CreatePropertyData;
  onSubmit: (data: CreatePropertyData) => Promise<void>;
  loading: boolean;
  submitText: string;
  cancelHref: string;
}

export function PropertyForm({
  initialData,
  onSubmit,
  loading,
  submitText,
  cancelHref
}: PropertyFormProps) {
  const t = useTranslations('propertyForm');
  const commonT = useTranslations('common');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const [formData, setFormData] = useState<CreatePropertyData>(
    initialData || {
      titleEn: '',
      titleAr: '',
      descriptionEn: '',
      descriptionAr: '',
      price: 0,
      type: 'APARTMENT',
      status: 'AVAILABLE',
      city: '',
      district: '',
      bedrooms: 0,
      bathrooms: 0,
      area: 0,
      parking: 0,
      features: [],
      images: []
    }
  );

  const updateFormData = (field: keyof CreatePropertyData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, url]
    }));
  };

  const handleMultipleImageUpload = (urls: string[]) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...urls]
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.titleEn || !formData.titleAr || !formData.price || !formData.city || 
        !formData.bedrooms || !formData.bathrooms || !formData.area) {
      alert('Please fill in all required fields');
      return;
    }

    await onSubmit(formData);
  };

  const propertyTypes = [
    { value: 'APARTMENT', label: t('types.apartment') },
    { value: 'VILLA', label: t('types.villa') },
    { value: 'OFFICE', label: t('types.office') },
    { value: 'SHOP', label: t('types.shop') }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="size-5" />
            {t('images')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <CustomUploader
             onUploadComplete={handleImageUpload}
            onMultipleUploadComplete={handleMultipleImageUpload}
            buttonText={t('uploadImage')}
            multiple={true}
            maxFiles={10}
          />

          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {formData.images.map((url, idx) => (
                <div key={idx} className="group relative aspect-square">
                  <img 
                    src={url} 
                    alt="" 
                    className="size-full rounded-lg border-2 border-border object-cover" 
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>{t('basicInfo')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">{t('labels.price')} *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price || ''}
                onChange={(e) => updateFormData('price', parseFloat(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">{t('labels.type')} *</Label>
              <Select value={formData.type} onValueChange={(val) => updateFormData('type', val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">{t('labels.city')} *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => updateFormData('city', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="district">{t('labels.district')}</Label>
              <Input
                id="district"
                value={formData.district}
                onChange={(e) => updateFormData('district', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bedrooms">{t('labels.bedrooms')} *</Label>
              <Input
                id="bedrooms"
                type="number"
                value={formData.bedrooms || ''}
                onChange={(e) => updateFormData('bedrooms', parseInt(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bathrooms">{t('labels.bathrooms')} *</Label>
              <Input
                id="bathrooms"
                type="number"
                value={formData.bathrooms || ''}
                onChange={(e) => updateFormData('bathrooms', parseInt(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">{t('labels.area')} *</Label>
              <Input
                id="area"
                type="number"
                value={formData.area || ''}
                onChange={(e) => updateFormData('area', parseInt(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parking">{t('labels.parking')}</Label>
              <Input
                id="parking"
                type="number"
                value={formData.parking || ''}
                onChange={(e) => updateFormData('parking', parseInt(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>{t('content')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* English */}
          <div className="space-y-4">
            <h3 className="border-b border-border pb-2 text-lg font-semibold">English</h3>
            <div className="space-y-2">
              <Label htmlFor="titleEn">{t('labels.title')} *</Label>
              <Input
                id="titleEn"
                value={formData.titleEn}
                onChange={(e) => updateFormData('titleEn', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descriptionEn">{t('labels.description')}</Label>
              <Textarea
                id="descriptionEn"
                value={formData.descriptionEn}
                onChange={(e) => updateFormData('descriptionEn', e.target.value)}
                rows={4}
              />
            </div>
          </div>

          {/* Arabic */}
          <div className="space-y-4" dir="rtl">
            <h3 className="border-b border-border pb-2 text-lg font-semibold">العربية</h3>
            <div className="space-y-2">
              <Label htmlFor="titleAr">{t('labels.title')} *</Label>
              <Input
                id="titleAr"
                value={formData.titleAr}
                onChange={(e) => updateFormData('titleAr', e.target.value)}
                className="text-right"
                required
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descriptionAr">{t('labels.description')}</Label>
              <Textarea
                id="descriptionAr"
                value={formData.descriptionAr}
                onChange={(e) => updateFormData('descriptionAr', e.target.value)}
                className="text-right"
                rows={4}
                dir="rtl"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : 'justify-end'}`}>
        <Button type="button" variant="outline" asChild>
          <a href={cancelHref}>
            {t('actions.cancel')}
          </a>
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? commonT('loading') : submitText}
        </Button>
      </div>
    </form>
  );
}
