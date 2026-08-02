"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { updateProperty, type CreatePropertyData } from '@/app/actions/properties';
import { CustomUploader } from '@/components/shared/custom-uploader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import posthog from 'posthog-js';
import { 
  ArrowLeft, 
  X, 
  Image as ImageIcon, 
  MapPin,
  Building2,
  Eye,
  AlertCircle,
  CheckCircle2,
  Save,
  RotateCcw
} from 'lucide-react';

interface EditPropertyFormData extends CreatePropertyData {}

interface EditPropertyFormProps {
  property: EditPropertyFormData & { id: string };
  locale: string;
}

export default function EditPropertyForm({ property, locale }: EditPropertyFormProps) {
  const t = useTranslations('propertyForm');
  const commonT = useTranslations('common');
  const isRTL = locale === 'ar';
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [hasChanges, setHasChanges] = useState(false);
  
  const [formData, setFormData] = useState<EditPropertyFormData>({
    titleEn: property.titleEn || '',
    titleAr: property.titleAr,
    descriptionEn: property.descriptionEn || '',
    descriptionAr: property.descriptionAr || '',
    city: property.city || '',
    district: property.district || '',
    price: property.price || 0,
    images: property.images || [],
  });
  
  const [originalData] = useState<EditPropertyFormData>({ ...formData });

  // Required fields configuration
  const requiredFields = {
    titleEn: false,
    titleAr: true,
    city: false,
  };

  // Field errors state
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const updateFormData = (field: keyof EditPropertyFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
    
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleImageUpload = (urls: string[]) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...urls]
    }));
    setHasChanges(true);
    toast.success(isRTL ? 'تم رفع الصور بنجاح' : 'Images uploaded successfully');
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setHasChanges(true);
    toast.success(isRTL ? 'تم إزالة الصورة بنجاح' : 'Image removed successfully');
  };

  const resetToOriginal = () => {
    setFormData(originalData);
    setHasChanges(false);
    setFieldErrors({});
    toast.info(isRTL ? 'تم إعادة التعيين إلى القيم الأصلية' : 'Reset to original values');
  };

  // Required field indicator
  const RequiredIndicator = () => (
    <span className="ml-1 text-destructive">*</span>
  );

  const validateForm = (): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};

    if (requiredFields.titleEn && !formData.titleEn.trim()) {
      errors.titleEn = isRTL ? 'العنوان بالإنجليزية مطلوب' : 'English title is required';
    }
    if (requiredFields.titleAr && !formData.titleAr.trim()) {
      errors.titleAr = isRTL ? 'العنوان بالعربية مطلوب' : 'Arabic title is required';
    }
    if (requiredFields.city && !formData.city.trim()) {
      errors.city = isRTL ? 'يرجى إدخال مدينة صحيحة' : 'Please enter a valid city';
    }

    setFieldErrors(errors);
    return { isValid: Object.keys(errors).length === 0, errors };
  };

  const validateCurrentStep = (): boolean => {
    const stepValidations: Record<number, (keyof EditPropertyFormData)[]> = {
      1: ['titleAr'],
      2: [], // Images are optional
    };

    const currentStepFields = stepValidations[currentStep] || [];
    const errors: Record<string, string> = {};

    currentStepFields.forEach(field => {
      if (requiredFields[field]) {
        if (field === 'titleEn' && !formData.titleEn.trim()) {
          errors.titleEn = isRTL ? 'العنوان بالإنجليزية مطلوب' : 'English title is required';
        }
        if (field === 'titleAr' && !formData.titleAr.trim()) {
          errors.titleAr = isRTL ? 'العنوان بالعربية مطلوب' : 'Arabic title is required';
        }
        if (field === 'city' && !formData.city.trim()) {
          errors.city = isRTL ? 'يرجى إدخال مدينة صحيحة' : 'Please enter a valid city';
        }
      }
    });

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateForm();
    if (!validation.isValid) {
      const errorCount = Object.keys(validation.errors).length;
      toast.error(isRTL ? "خطأ في التحقق" : "Validation Error", {
        description: isRTL 
          ? `يرجى تصحيح ${errorCount} خطأ${errorCount > 1 ? 'ء' : ''} في النموذج`
          : `Please fix ${errorCount} error${errorCount > 1 ? 's' : ''} in the form`
      });
      return;
    }

    setLoading(true);
    
    const promise = new Promise(async (resolve, reject) => {
      try {
        const result = await updateProperty(property.id, formData);
        if (result.success) {
          posthog.capture('property_updated', {
            property_id: property.id,
            city: formData.city || undefined,
            image_count: formData.images.length,
          });
          setHasChanges(false);
          router.refresh(); // Refresh server data
          resolve(true);
        } else {
          reject(new Error(result.error || 'Failed to update property'));
        }
      } catch (error) {
        console.error('Error updating property:', error);
        reject(error);
      }
    });

    toast.promise(promise, {
      loading: isRTL ? 'جاري تحديث العقار...' : 'Updating property...',
      success: () => {
        setLoading(false);
        setTimeout(() => {
          router.push(`/${locale}/dashboard/p`);
        }, 1000);
        return isRTL ? 'تم تحديث العقار بنجاح!' : 'Property updated successfully!';
      },
      error: (error) => {
        setLoading(false);
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        return `${isRTL ? 'فشل في تحديث العقار' : 'Failed to update property'}: ${errorMessage}`;
      }
    });
  };

  // Steps configuration
  const steps = [
    { number: 1, title: isRTL ? 'المعلومات الأساسية' : 'Basic Information', icon: Building2 },
    { number: 2, title: isRTL ? 'الصور والوسائط' : 'Images & Media', icon: ImageIcon },
    { number: 3, title: isRTL ? 'التأكيد والتحديث' : 'Confirm & Update', icon: CheckCircle2 }
  ];

  const nextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      toast.error(isRTL ? "خطأ في التحقق" : "Validation Error", {
        description: isRTL 
          ? "يرجى ملء جميع الحقول المطلوبة بشكل صحيح"
          : "Please fill in all required fields correctly"
      });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Progress calculation
  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="min-h-screen bg-background px-4 py-8 text-foreground" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                asChild 
                className="size-10 rounded-full"
              >
                <Link href={`/${locale}/dashboard/p`}>
                  <ArrowLeft className={`size-5 ${isRTL ? 'rotate-180' : ''}`} />
                </Link>
              </Button>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <h1 className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-3xl font-bold text-transparent">
                  {isRTL ? 'تعديل العقار' : 'Edit Property'}
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  {steps[currentStep - 1].title}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-bold text-primary">
                {isRTL ? `الخطوة ${currentStep} من ${steps.length}` : `Step ${currentStep} of ${steps.length}`}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8 space-y-4">
            <Progress value={progress} className="h-2" />
            <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-center justify-between`}>
              {steps.map((step, index) => {
                const isCompleted = currentStep > step.number;
                const isCurrent = currentStep === step.number;
                
                return (
                  <div key={step.number} className="flex items-center gap-3">
                    <div 
                      className={`flex size-8 cursor-pointer items-center justify-center rounded-full text-sm font-medium transition-all ${
                        isCompleted 
                          ? 'bg-primary text-primary-foreground shadow-sm' 
                          : isCurrent
                          ? 'scale-110 bg-primary text-primary-foreground shadow-lg'
                          : 'bg-muted text-muted-foreground'
                      }`}
                      onClick={() => {
                        if (step.number <= currentStep) {
                          setCurrentStep(step.number);
                        }
                      }}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="size-4" />
                      ) : (
                        step.number
                      )}
                    </div>
                    <div className="hidden sm:block">
                      <div className={`text-sm font-medium transition-colors ${
                        isCompleted || isCurrent ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {step.title}
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`mx-2 h-0.5 w-8 ${
                        isCompleted ? 'bg-primary' : 'bg-muted'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Changes Indicator */}
        {hasChanges && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="size-5 text-orange-600" />
                  <span className="font-medium text-orange-800">
                    {isRTL ? 'لديك تغييرات غير محفوظة' : 'You have unsaved changes'}
                  </span>
                </div>
                <Button variant="outline" size="sm" onClick={resetToOriginal}>
                  <RotateCcw className="mr-2 size-4" />
                  {isRTL ? 'إعادة التعيين' : 'Reset Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <Card className="border-l-4 border-l-primary">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Building2 className="size-5 text-primary" />
                      {isRTL ? 'المعلومات الأساسية' : 'Basic Information'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Location */}
                    <div className="space-y-4">
                      <Label className="flex items-center gap-2 text-sm font-semibold">
                        <MapPin className="size-5 text-red-500" />
                        {isRTL ? 'تفاصيل الموقع' : 'Location Details'}
                      </Label>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="city">
                            {isRTL ? 'المدينة' : 'City'}
                          </Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => updateFormData('city', e.target.value)}
                            placeholder={isRTL ? 'أدخل اسم المدينة' : 'Enter city name'}
                            className={`h-11 ${fieldErrors.city ? 'border-destructive' : ''}`}
                            required
                            dir={isRTL ? 'rtl' : 'ltr'}
                          />
                          {fieldErrors.city && (
                            <p className="flex items-center gap-1 text-sm text-destructive">
                              <AlertCircle className="size-3" />
                              {fieldErrors.city}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="district">{isRTL ? 'المنطقة/الحي' : 'District/Area'}</Label>
                          <Input
                            id="district"
                            value={formData.district}
                            onChange={(e) => updateFormData('district', e.target.value)}
                            placeholder={isRTL ? 'أدخل المنطقة أو الحي' : 'Enter district or area'}
                            className="h-11"
                            dir={isRTL ? 'rtl' : 'ltr'}
                          />
                        </div>
                        <div className="space-y-2 col-span-2 md:col-span-1">
                          <Label htmlFor="price">{isRTL ? 'السعر' : 'Price'}</Label>
                          <Input
                            id="price"
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => updateFormData('price', parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                            className="h-11"
                            dir={isRTL ? 'rtl' : 'ltr'}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Titles and Descriptions */}
                    <div className="space-y-6">
                      {/* English Content */}
                      <div className="space-y-4">
                        <h3 className="border-b pb-2 text-lg font-semibold">
                          {isRTL ? 'المحتوى الإنجليزي' : 'English Content'}
                        </h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="titleEn">
                              {isRTL ? 'عنوان العقار (الإنجليزية)' : 'Property Title (English)'}
                            </Label>
                            <Input
                              id="titleEn"
                              value={formData.titleEn}
                              onChange={(e) => updateFormData('titleEn', e.target.value)}
                              placeholder={isRTL ? 'شقة رائعة في وسط المدينة' : 'Beautiful apartment in city center'}
                              className={fieldErrors.titleEn ? 'border-destructive' : ''}
                              required
                              dir="ltr"
                            />
                            {fieldErrors.titleEn && (
                              <p className="flex items-center gap-1 text-sm text-destructive">
                                <AlertCircle className="size-3" />
                                {fieldErrors.titleEn}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="descriptionEn">{isRTL ? 'الوصف (الإنجليزية)' : 'Description (English)'}</Label>
                            <RichTextEditor
                              value={formData.descriptionEn}
                              onChange={(value) => updateFormData('descriptionEn', value)}
                              placeholder={isRTL ? 'صف عقارك باللغة العربية...' : 'Describe your property in English...'}
                              className="min-h-[200px]"
                              isRTL={false}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Arabic Content */}
                      <div className="space-y-4" dir="rtl">
                        <h3 className="border-b pb-2 text-lg font-semibold">المحتوى العربي</h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="titleAr">
                              عنوان العقار (العربية) <RequiredIndicator />
                            </Label>
                            <Input
                              id="titleAr"
                              value={formData.titleAr}
                              onChange={(e) => updateFormData('titleAr', e.target.value)}
                              placeholder="شقة رائعة في وسط المدينة"
                              className={`text-right ${fieldErrors.titleAr ? 'border-destructive' : ''}`}
                              required
                              dir="rtl"
                            />
                            {fieldErrors.titleAr && (
                              <p className="flex items-center gap-1 text-sm text-destructive">
                                <AlertCircle className="size-3" />
                                {fieldErrors.titleAr}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="descriptionAr">الوصف (العربية)</Label>
                            <RichTextEditor
                              value={formData.descriptionAr}
                              onChange={(value) => updateFormData('descriptionAr', value)}
                              placeholder="صف عقارك باللغة العربية..."
                              className="min-h-[200px]"
                              isRTL={true}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Preview Card */}
              <div className="space-y-6">
                <Card className="sticky top-6">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="size-5" />
                      {isRTL ? 'معاينة سريعة' : 'Quick Preview'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{isRTL ? 'الموقع' : 'Location'}</span>
                        <span className="text-right text-sm font-medium">
                          {formData.city}{formData.district ? `, ${formData.district}` : ''}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{isRTL ? 'العنوان بالإنجليزية' : 'English Title'}</span>
                        <span className="max-w-[120px] truncate text-right text-sm font-semibold">
                          {formData.titleEn || '-'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{isRTL ? 'العنوان بالعربية' : 'Arabic Title'}</span>
                        <span className="max-w-[120px] truncate text-right text-sm font-semibold">
                          {formData.titleAr || '-'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{isRTL ? 'الصور' : 'Images'}</span>
                        <Badge variant="secondary">
                          {formData.images.length} {isRTL ? 'صورة' : 'images'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Step 2: Media */}
          {currentStep === 2 && (
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <ImageIcon className="size-5 text-primary" />
                  {isRTL ? 'الصور والوسائط' : 'Images & Media'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Upload Area */}
                <div className="rounded-2xl border-2 border-dashed border-border bg-muted/20 p-8 text-center transition-colors hover:bg-muted/40">
                  <ImageIcon className="mx-auto mb-4 size-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold">
                    {isRTL ? 'رفع صور العقار' : 'Upload Property Images'}
                  </h3>
                  <p className="mx-auto mb-6 max-w-md text-muted-foreground">
                    {isRTL 
                      ? 'اسحب وأفلت صورك هنا، أو انقر للتصفح. التنسيقات المدعومة: JPG, PNG, WEBP'
                      : 'Drag and drop your images here, or click to browse. Supported formats: JPG, PNG, WEBP'
                    }
                  </p>
                  <CustomUploader
                    bucket="IMAGES"
                    onMultipleUploadComplete={handleImageUpload}
                    buttonText={isRTL ? "اختر الصور" : "Select Images"}
                    multiple={true}
                    maxFiles={12}
                    acceptedFileTypes="image"
                  />
                </div>

                {/* Image Gallery */}
                {formData.images.length > 0 && (
                  <div>
                    <div className="mb-6 flex items-center justify-between">
                      <div>
                        <Label className="text-lg font-semibold">
                          {isRTL ? `الصور المرفوعة (${formData.images.length})` : `Uploaded Images (${formData.images.length})`}
                        </Label>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {isRTL 
                            ? 'انقر على X لإزالة الصور غير المرغوب فيها'
                            : 'Click on the X to remove unwanted images'
                          }
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-sm">
                        {formData.images.length} / 12 {isRTL ? 'صورة' : 'images'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {formData.images.map((url, idx) => (
                        <div key={idx} className="group relative aspect-video overflow-hidden rounded-xl shadow-lg transition-all hover:shadow-xl">
                          <img 
                            src={url} 
                            alt={isRTL ? `صورة العقار ${idx + 1}` : `Property image ${idx + 1}`}
                            className="size-full object-cover transition-transform duration-300 group-hover:scale-105" 
                          />
                          <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute right-3 top-3 rounded-full bg-destructive p-2 text-destructive-foreground opacity-0 shadow-lg transition-all duration-200 hover:scale-110 group-hover:opacity-100"
                          >
                            <X className="size-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className={`flex items-center justify-between border-t pt-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button 
              type="button" 
              variant="outline" 
              onClick={prevStep}
              disabled={currentStep === 1}
              className="h-11 gap-2 rounded-xl px-6"
            >
              <ArrowLeft className={`size-4 ${isRTL ? 'rotate-180' : ''}`} />
              {isRTL ? 'الخطوة السابقة' : 'Previous Step'}
            </Button>
            
            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                asChild 
                className="h-11 rounded-xl px-6"
              >
                <Link href={`/${locale}/dashboard/p`}>
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </Link>
              </Button>
              
              {currentStep < steps.length ? (
                <Button 
                  type="button" 
                  onClick={nextStep} 
                  className="h-11 gap-2 rounded-xl px-8"
                >
                  {isRTL ? 'التالي' : 'Next Step'}
                  <ArrowLeft className={`size-4 ${isRTL ? 'rotate-180' : 'rotate-0'}`} />
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="h-11 gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/80 px-8 hover:from-primary/90 hover:to-primary/70"
                >
                  {loading ? (
                    <>
                      <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      {isRTL ? 'جاري تحديث العقار...' : 'Updating Property...'}
                    </>
                  ) : (
                    <>
                      <Save className="size-4" />
                      {isRTL ? 'تحديث العقار' : 'Update Property'}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
