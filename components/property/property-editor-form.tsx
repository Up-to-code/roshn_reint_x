"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, ImageIcon, RotateCcw, Save, X } from "lucide-react";
import posthog from "posthog-js";
import { toast } from "sonner";

import { CustomUploader } from "@/components/shared/custom-uploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
  emptyPropertyEditorValues,
  type PropertyEditorValues,
  usePropertyEditor,
} from "@/components/property/use-property-editor";

type SaveResult = { success: boolean; error?: string; data?: { id: string } };

interface PropertyEditorFormProps {
  locale: string;
  mode: "create" | "edit";
  initialValues?: PropertyEditorValues;
  onSave(values: PropertyEditorValues): Promise<SaveResult>;
}

export function PropertyEditorForm({ locale, mode, initialValues = emptyPropertyEditorValues, onSave }: PropertyEditorFormProps) {
  const isRTL = locale === "ar";
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const {
    formData,
    fieldErrors,
    hasChanges,
    setHasChanges,
    updateFormData,
    addImages,
    removeImage,
    validate,
    reset,
  } = usePropertyEditor(initialValues, isRTL ? "العنوان بالعربية مطلوب" : "Arabic title is required");

  const text = isRTL ? {
    title: mode === "create" ? "إنشاء عقار جديد" : "تعديل العقار",
    subtitle: "أدخل بيانات العقار باللغتين ثم أضف الصور.",
    location: "الموقع والسعر", content: "المحتوى", images: "صور العقار",
    city: "المدينة", district: "الحي", price: "السعر (ر.س)",
    englishTitle: "العنوان بالإنجليزية", arabicTitle: "العنوان بالعربية",
    englishDescription: "الوصف بالإنجليزية", arabicDescription: "الوصف بالعربية",
    save: mode === "create" ? "إنشاء العقار" : "حفظ التغييرات", saving: "جاري الحفظ...",
    reset: "إعادة تعيين", back: "العودة إلى العقارات", noImages: "لم تتم إضافة صور بعد",
    success: mode === "create" ? "تم إنشاء العقار بنجاح" : "تم تحديث العقار بنجاح",
  } : {
    title: mode === "create" ? "Create Property" : "Edit Property",
    subtitle: "Enter bilingual property details, then add its images.",
    location: "Location and price", content: "Content", images: "Property images",
    city: "City", district: "District", price: "Price (SAR)",
    englishTitle: "English title", arabicTitle: "Arabic title",
    englishDescription: "English description", arabicDescription: "Arabic description",
    save: mode === "create" ? "Create property" : "Save changes", saving: "Saving...",
    reset: "Reset", back: "Back to properties", noImages: "No images added yet",
    success: mode === "create" ? "Property created successfully" : "Property updated successfully",
  };

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const result = validate();
    if (!result.isValid) {
      toast.error(Object.values(result.errors)[0] || "Invalid property data");
      return;
    }
    setSaving(true);
    try {
      const saved = await onSave(formData);
      if (!saved.success) throw new Error(saved.error || "Failed to save property");
      setHasChanges(false);
      posthog.capture(mode === "create" ? "property_created" : "property_updated", {
        property_id: saved.data?.id,
        city: formData.city || undefined,
        image_count: formData.images.length,
      });
      toast.success(text.success);
      router.push(`/${locale}/dashboard/p`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save property");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-5xl space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">{text.title}</h1>
          <p className="mt-1 text-muted-foreground">{text.subtitle}</p>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/${locale}/dashboard/p`}><ArrowLeft className="size-4" />{text.back}</Link>
        </Button>
      </header>

      <Card>
        <CardHeader><CardTitle>{text.location}</CardTitle></CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-3">
          <div className="space-y-2"><Label htmlFor="city">{text.city}</Label><Input id="city" value={formData.city} onChange={event => updateFormData("city", event.target.value)} /></div>
          <div className="space-y-2"><Label htmlFor="district">{text.district}</Label><Input id="district" value={formData.district} onChange={event => updateFormData("district", event.target.value)} /></div>
          <div className="space-y-2"><Label htmlFor="price">{text.price}</Label><Input id="price" type="number" min={0} step="0.01" value={formData.price} onChange={event => updateFormData("price", Number(event.target.value) || 0)} /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>{text.content}</CardTitle></CardHeader>
        <CardContent className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-5" dir="ltr">
            <div className="space-y-2"><Label htmlFor="titleEn">{text.englishTitle}</Label><Input id="titleEn" value={formData.titleEn} onChange={event => updateFormData("titleEn", event.target.value)} /></div>
            <div className="space-y-2"><Label>{text.englishDescription}</Label><RichTextEditor value={formData.descriptionEn} onChange={value => updateFormData("descriptionEn", value)} /></div>
          </div>
          <div className="space-y-5" dir="rtl">
            <div className="space-y-2"><Label htmlFor="titleAr">{text.arabicTitle} *</Label><Input id="titleAr" required value={formData.titleAr} onChange={event => updateFormData("titleAr", event.target.value)} aria-invalid={Boolean(fieldErrors.titleAr)} />{fieldErrors.titleAr && <p className="text-sm text-destructive">{fieldErrors.titleAr}</p>}</div>
            <div className="space-y-2"><Label>{text.arabicDescription}</Label><RichTextEditor isRTL value={formData.descriptionAr} onChange={value => updateFormData("descriptionAr", value)} /></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><ImageIcon className="size-5" />{text.images}</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <CustomUploader bucket="IMAGES" acceptedFileTypes="image" multiple maxFiles={12} onMultipleUploadComplete={addImages} />
          {formData.images.length ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {formData.images.map((url, index) => (
                <div key={`${url}-${index}`} className="group relative aspect-video overflow-hidden rounded-lg border">
                  <Image src={url} alt={`${text.images} ${index + 1}`} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
                  <Button type="button" size="icon" onClick={() => removeImage(index)} className="absolute right-2 top-2 size-8 bg-destructive text-destructive-foreground opacity-0 hover:bg-destructive/90 group-hover:opacity-100"><X className="size-4" /></Button>
                </div>
              ))}
            </div>
          ) : <p className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">{text.noImages}</p>}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        {mode === "edit" && <Button type="button" variant="outline" disabled={!hasChanges || saving} onClick={reset}><RotateCcw className="size-4" />{text.reset}</Button>}
        <Button type="submit" disabled={saving}><Save className="size-4" />{saving ? text.saving : text.save}</Button>
      </div>
    </form>
  );
}
