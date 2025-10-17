/* eslint-disable tailwindcss/no-contradicting-classname */
/* eslint-disable tailwindcss/classnames-order */
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PropertiesService, type CreatePropertyData } from '@/lib/api/properties-service';
import { CustomUploader } from '@/components/shared/custom-uploader';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  X, 
  Image as ImageIcon, 
  MapPin,
  Building2,
  Eye,
  AlertCircle,
  CheckCircle2,
  Languages
} from 'lucide-react';

// Define the form data interface based on schema
interface CreatePropertyFormData extends CreatePropertyData {}

// Translations object
const translations = {
  en: {
    createTitle: "Create New Property",
    steps: {
      basicInfo: "Basic Information",
      media: "Photos & Media",
      current: (current: number, total: number) => `Step ${current} of ${total}`
    },
    actions: {
      back: "Back to Properties",
      previous: "Previous Step",
      next: "Next Step",
      cancel: "Cancel",
      creating: "Creating Property...",
      create: "Create Property Listing",
      uploadImages: "Upload Property Images"
    },
    labels: {
      city: "City",
      district: "District/Area",
      titleEn: "Property Title (English)",
      titleAr: "Property Title (Arabic)",
      descriptionEn: "Description (English)",
      descriptionAr: "Description (Arabic)",
      uploadedImages: (count: number) => `Uploaded Images (${count})`,
      location: "Location Details",
      images: "images",
      language: "Language"
    },
    placeholders: {
      city: "Enter city name",
      district: "Enter district or area",
      titleEn: "Beautiful apartment in city center",
      titleAr: "شقة رائعة في وسط المدينة",
      descriptionEn: "Describe your property in English...",
      descriptionAr: "صف عقارك باللغة العربية..."
    },
    validation: {
      requiredField: (field: string) => `${field} is required`,
      invalidCity: "Please enter a valid city",
      invalidTitles: "Please enter both English and Arabic titles"
    },
    success: {
      created: "Property created successfully!",
      imageUploaded: "Images uploaded successfully",
      imageRemoved: "Image removed successfully"
    },
    errors: {
      createFailed: "Failed to create property",
      uploadFailed: "Failed to upload images",
      generic: "An error occurred"
    },
    alt: {
      propertyImage: (number: number) => `Property image ${number}`
    }
  },
  ar: {
    createTitle: "إنشاء عقار جديد",
    steps: {
      basicInfo: "المعلومات الأساسية",
      media: "الصور والوسائط",
      current: (current: number, total: number) => `الخطوة ${current} من ${total}`
    },
    actions: {
      back: "العودة إلى العقارات",
      previous: "الخطوة السابقة",
      next: "التالي",
      cancel: "إلغاء",
      creating: "جاري إنشاء العقار...",
      create: "إنشاء قائمة العقار",
      uploadImages: "رفع صور العقار"
    },
    labels: {
      city: "المدينة",
      district: "المنطقة/الحي",
      titleEn: "عنوان العقار (الإنجليزية)",
      titleAr: "عنوان العقار (العربية)",
      descriptionEn: "الوصف (الإنجليزية)",
      descriptionAr: "الوصف (العربية)",
      uploadedImages: (count: number) => `الصور المرفوعة (${count})`,
      location: "تفاصيل الموقع",
      images: "الصور",
      language: "اللغة"
    },
    placeholders: {
      city: "أدخل اسم المدينة",
      district: "أدخل المنطقة أو الحي",
      titleEn: "شقة جميلة في وسط المدينة",
      titleAr: "شقة رائعة في وسط المدينة",
      descriptionEn: "صف عقارك باللغة الإنجليزية...",
      descriptionAr: "صف عقارك باللغة العربية..."
    },
    validation: {
      requiredField: (field: string) => `${field} مطلوب`,
      invalidCity: "يرجى إدخال مدينة صحيحة",
      invalidTitles: "يرجى إدخال العنوان باللغتين الإنجليزية والعربية"
    },
    success: {
      created: "تم إنشاء العقار بنجاح!",
      imageUploaded: "تم رفع الصور بنجاح",
      imageRemoved: "تم إزالة الصورة بنجاح"
    },
    errors: {
      createFailed: "فشل في إنشاء العقار",
      uploadFailed: "فشل في رفع الصور",
      generic: "حدث خطأ"
    },
    alt: {
      propertyImage: (number: number) => `صورة العقار ${number}`
    }
  }
};

// Default form data matching schema
const defaultFormData: CreatePropertyFormData = {
  titleEn: '',
  titleAr: '',
  descriptionEn: '',
  descriptionAr: '',
  city: '',
  district: '',
  images: [],
};

// Required fields configuration based on schema
const requiredFields = {
  titleEn: true,
  titleAr: true,
  city: true,
};

// Required field indicator component
const RequiredIndicator = () => (
  <span className="text-destructive ml-1">*</span>
);

// Client component
function CreatePropertyForm({ locale }: { locale: string }) {
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CreatePropertyFormData>(defaultFormData);
  const [currentLang, setCurrentLang] = useState<'en' | 'ar'>(locale as 'en' | 'ar' || 'ar');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const t = translations[currentLang];

  // Progress calculation
  const progress = (currentStep / 2) * 100;

  const updateFormData = (field: keyof CreatePropertyFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
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
    toast.success(t.success.imageUploaded, {
      description: `${urls.length} ${currentLang === 'en' ? 'images added successfully' : 'تم إضافة الصور بنجاح'}`
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    toast.success(t.success.imageRemoved, {
      description: currentLang === 'en' ? "Image removed from your property" : "تم إزالة الصورة من عقارك"
    });
  };

  const validateForm = (): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};

    // Required field validation based on schema
    if (requiredFields.titleEn && !formData.titleEn.trim()) {
      errors.titleEn = t.validation.requiredField(currentLang === 'en' ? 'English title' : 'العنوان بالإنجليزية');
    }
    if (requiredFields.titleAr && !formData.titleAr.trim()) {
      errors.titleAr = t.validation.requiredField(currentLang === 'en' ? 'Arabic title' : 'العنوان بالعربية');
    }
    if (requiredFields.city && !formData.city.trim()) {
      errors.city = t.validation.invalidCity;
    }

    setFieldErrors(errors);
    return { isValid: Object.keys(errors).length === 0, errors };
  };

  const validateCurrentStep = (): boolean => {
    const stepValidations: Record<number, (keyof CreatePropertyFormData)[]> = {
      1: ['titleEn', 'titleAr', 'city'],
      2: [], // Images are optional
    };

    const currentStepFields = stepValidations[currentStep] || [];
    const errors: Record<string, string> = {};

    currentStepFields.forEach(field => {
      if (requiredFields[field]) {
        if (field === 'titleEn' && !formData.titleEn.trim()) {
          errors.titleEn = t.validation.requiredField(currentLang === 'en' ? 'English title' : 'العنوان بالإنجليزية');
        }
        if (field === 'titleAr' && !formData.titleAr.trim()) {
          errors.titleAr = t.validation.requiredField(currentLang === 'en' ? 'Arabic title' : 'العنوان بالعربية');
        }
        if (field === 'city' && !formData.city.trim()) {
          errors.city = t.validation.invalidCity;
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
      toast.error(currentLang === 'en' ? "Validation Error" : "خطأ في التحقق", {
        description: currentLang === 'en' 
          ? `Please fix ${errorCount} error${errorCount > 1 ? 's' : ''} in the form`
          : `يرجى تصحيح ${errorCount} خطأ${errorCount > 1 ? 'ء' : ''} في النموذج`,
        icon: <AlertCircle className="h-4 w-4" />
      });
      return;
    }

    setLoading(true);
    
    const promise = new Promise(async (resolve, reject) => {
      try {
        await PropertiesService.create(formData);
        resolve(true);
      } catch (error) {
        console.error('Error creating property:', error);
        reject(error);
      }
    });

    toast.promise(promise, {
      loading: currentLang === 'en' ? 'Creating your property...' : 'جاري إنشاء عقارك...',
      success: () => {
        setLoading(false);
        setTimeout(() => {
          router.push(`/${locale}/dashboard/p`);
        }, 1000);
        return t.success.created;
      },
      error: (error) => {
        setLoading(false);
        const errorMessage = error instanceof Error ? error.message : t.errors.generic;
        return `${t.errors.createFailed}: ${errorMessage}`;
      }
    });
  };

  // Steps configuration - simplified to 2 steps
  const steps = [
    { number: 1, title: t.steps.basicInfo, icon: Building2, description: currentLang === 'en' ? 'Basic property information' : 'المعلومات الأساسية للعقار' },
    { number: 2, title: t.steps.media, icon: ImageIcon, description: currentLang === 'en' ? 'Photos and visual content' : 'الصور والمحتوى المرئي' }
  ];

  const nextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      toast.error(currentLang === 'en' ? "Validation Error" : "خطأ في التحقق", {
        description: currentLang === 'en' 
          ? "Please fill in all required fields correctly"
          : "يرجى ملء جميع الحقول المطلوبة بشكل صحيح",
        icon: <AlertCircle className="h-4 w-4" />
      });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleLanguage = () => {
    setCurrentLang(prev => prev === 'en' ? 'ar' : 'en');
    toast.info(currentLang === 'en' ? "تم التبديل إلى اللغة العربية" : "Switched to English", {
      icon: <Languages className="h-4 w-4" />
    });
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-background to-muted/20 ${currentLang === 'ar' ? 'font-arabic' : ''}`}>
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                asChild 
                className="h-10 w-10 rounded-full"
                onClick={() => toast.info(currentLang === 'en' ? "Returning to properties list" : "العودة إلى قائمة العقارات")}
              >
                <Link href={`/${locale}/dashboard/p`}>
                  <ArrowLeft className={`h-5 w-5 ${currentLang === 'ar' ? 'rotate-180' : ''}`} />
                </Link>
              </Button>
              <div className={currentLang === 'ar' ? 'text-right' : 'text-left'}>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  {t.createTitle}
                </h1>
                <p className="text-muted-foreground mt-2 text-sm lg:text-base">
                  {t.steps.current(currentStep, steps.length)} • {steps[currentStep - 1].title}
                </p>
              </div>
            </div>
            
            {/* Language Control */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="gap-2 h-9"
            >
              <Languages className="h-4 w-4" />
              {t.labels.language}
              <Badge variant="secondary" className="ml-1">
                {currentLang.toUpperCase()}
              </Badge>
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-4 mb-8">
            <Progress value={progress} className="h-2" />
            <div className={`flex ${currentLang === 'ar' ? 'flex-row-reverse' : ''} justify-between items-center`}>
              {steps.map((step, index) => {
                const isCompleted = currentStep > step.number;
                const isCurrent = currentStep === step.number;
                
                return (
                  <div key={step.number} className="flex items-center gap-3">
                    <div 
                      className={`flex items-center justify-center h-8 w-8 rounded-full text-sm font-medium transition-all cursor-pointer ${
                        isCompleted 
                          ? 'bg-primary text-primary-foreground shadow-sm' 
                          : isCurrent
                          ? 'bg-primary text-primary-foreground shadow-lg scale-110'
                          : 'bg-muted text-muted-foreground'
                      }`}
                      onClick={() => {
                        if (step.number <= currentStep) {
                          setCurrentStep(step.number);
                          toast.info(currentLang === 'en' 
                            ? `Jumped to step ${step.number}: ${step.title}`
                            : `الانتقال إلى الخطوة ${step.number}: ${step.title}`
                          );
                        }
                      }}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4" />
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
                      <div className={`w-8 h-0.5 mx-2 ${
                        isCompleted ? 'bg-primary' : 'bg-muted'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-l-4 border-l-primary">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Building2 className="h-5 w-5 text-primary" />
                      {t.steps.basicInfo}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Location */}
                    <div className="space-y-4">
                      <Label className="text-sm font-semibold flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-red-500" />
                        {t.labels.location}
                      </Label>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="city">{t.labels.city} <RequiredIndicator /></Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => updateFormData('city', e.target.value)}
                            placeholder={t.placeholders.city}
                            className={`h-11 ${fieldErrors.city ? 'border-destructive' : ''}`}
                            required
                            dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
                          />
                          {fieldErrors.city && (
                            <p className="text-destructive text-sm flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {fieldErrors.city}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="district">{t.labels.district}</Label>
                          <Input
                            id="district"
                            value={formData.district}
                            onChange={(e) => updateFormData('district', e.target.value)}
                            placeholder={t.placeholders.district}
                            className="h-11"
                            dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Titles and Descriptions */}
                    <Tabs defaultValue="english" className="space-y-4">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="english">English</TabsTrigger>
                        <TabsTrigger value="arabic">العربية</TabsTrigger>
                      </TabsList>
                      <TabsContent value="english" className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="titleEn">{t.labels.titleEn} <RequiredIndicator /></Label>
                          <Input
                            id="titleEn"
                            value={formData.titleEn}
                            onChange={(e) => updateFormData('titleEn', e.target.value)}
                            placeholder={t.placeholders.titleEn}
                            className={fieldErrors.titleEn ? 'border-destructive' : ''}
                            required
                            dir="ltr"
                          />
                          {fieldErrors.titleEn && (
                            <p className="text-destructive text-sm flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {fieldErrors.titleEn}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="descriptionEn">{t.labels.descriptionEn}</Label>
                          <RichTextEditor
                            value={formData.descriptionEn}
                            onChange={(value) => updateFormData('descriptionEn', value)}
                            placeholder={t.placeholders.descriptionEn}
                            className="min-h-[200px]"
                            isRTL={false}
                          />
                        </div>
                      </TabsContent>
                      <TabsContent value="arabic" className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="titleAr">{t.labels.titleAr} <RequiredIndicator /></Label>
                          <Input
                            id="titleAr"
                            value={formData.titleAr}
                            onChange={(e) => updateFormData('titleAr', e.target.value)}
                            placeholder={t.placeholders.titleAr}
                            className={`text-right ${fieldErrors.titleAr ? 'border-destructive' : ''}`}
                            required
                            dir="rtl"
                          />
                          {fieldErrors.titleAr && (
                            <p className="text-destructive text-sm flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {fieldErrors.titleAr}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="descriptionAr">{t.labels.descriptionAr}</Label>
                          <RichTextEditor
                            value={formData.descriptionAr}
                            onChange={(value) => updateFormData('descriptionAr', value)}
                            placeholder={t.placeholders.descriptionAr}
                            className="min-h-[200px]"
                            isRTL={true}
                          />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>

              {/* Preview Card */}
              <div className="space-y-6">
                <Card className="sticky top-6">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      {currentLang === 'en' ? 'Quick Preview' : 'معاينة سريعة'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{currentLang === 'en' ? 'Location' : 'الموقع'}</span>
                        <span className="font-medium text-right text-sm">
                          {formData.city}{formData.district ? `, ${formData.district}` : ''}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{currentLang === 'en' ? 'English Title' : 'العنوان بالإنجليزية'}</span>
                        <span className="font-semibold text-sm text-right truncate max-w-[120px]">
                          {formData.titleEn || '-'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{currentLang === 'en' ? 'Arabic Title' : 'العنوان بالعربية'}</span>
                        <span className="font-semibold text-sm text-right truncate max-w-[120px]">
                          {formData.titleAr || '-'}
                        </span>
                      </div>
                    </div>
                    <Separator />
                    <div className="text-xs text-muted-foreground">
                      {currentLang === 'en' 
                        ? 'Complete all steps to publish your property listing'
                        : 'أكمل جميع الخطوات لنشر قائمة عقارك'
                      }
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        const validation = validateForm();
                        toast.info(currentLang === 'en' ? "Form validation" : "التحقق من النموذج", {
                          description: validation.isValid 
                            ? (currentLang === 'en' ? 'All required fields are filled' : 'جميع الحقول المطلوبة مملوءة')
                            : (currentLang === 'en' ? `Found ${Object.keys(validation.errors).length} error(s)` : `تم العثور على ${Object.keys(validation.errors).length} خطأ(أخطاء)`)
                        });
                      }}
                    >
                      {currentLang === 'en' ? 'Validate Form' : 'التحقق من النموذج'}
                    </Button>
                  </CardContent>
                </Card>

                {/* Required Fields Info */}
                <Card className="bg-muted/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      {currentLang === 'en' ? 'Required Fields' : 'الحقول المطلوبة'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>{currentLang === 'en' ? 'Fields marked with' : 'الحقول الموسومة بـ'} <span className="text-destructive">*</span> {currentLang === 'en' ? 'are required' : 'مطلوبة'}</p>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>{t.labels.city}</li>
                        <li>{t.labels.titleEn}</li>
                        <li>{t.labels.titleAr}</li>
                      </ul>
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
                  <ImageIcon className="h-5 w-5 text-primary" />
                  {t.steps.media}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Upload Area */}
                <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center bg-muted/20 hover:bg-muted/40 transition-colors">
                  <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{t.actions.uploadImages}</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    {currentLang === 'en' 
                      ? 'Drag and drop your images here, or click to browse. Supported formats: JPG, PNG, WEBP (Max 12 images)'
                      : 'اسحب وأفلت صورك هنا، أو انقر للتصفح. التنسيقات المدعومة: JPG, PNG, WEBP (الحد الأقصى 12 صورة)'
                    }
                  </p>
                  <CustomUploader
                    bucket="IMAGES"
                    onMultipleUploadComplete={handleImageUpload}
                    buttonText={currentLang === 'en' ? "Select Images" : "اختر الصور"}
                    multiple={true}
                    maxFiles={12}
                    acceptedFileTypes="image"
                  />
                </div>

                {/* Image Gallery */}
                {formData.images.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <Label className="text-sm font-semibold text-lg">
                          {t.labels.uploadedImages(formData.images.length)}
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {currentLang === 'en' 
                            ? 'Click on the X to remove unwanted images'
                            : 'انقر على X لإزالة الصور غير المرغوب فيها'
                          }
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-sm">
                        {formData.images.length} / 12 {t.labels.images}
                      </Badge>
                    </div>
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                      {formData.images.map((url, idx) => (
                        <div key={idx} className="relative group aspect-video rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
                          <img 
                            src={url} 
                            alt={t.alt.propertyImage(idx + 1)}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" 
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-3 right-3 bg-destructive text-destructive-foreground rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:scale-110"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <div className="absolute bottom-3 left-3 bg-background/90 text-foreground text-sm px-3 py-1.5 rounded-full font-medium">
                            {currentLang === 'en' ? 'Image' : 'صورة'} {idx + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className={`flex items-center justify-between pt-8 border-t ${currentLang === 'ar' ? 'flex-row-reverse' : ''}`}>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                prevStep();
                toast.info(currentLang === 'en' 
                  ? `Moved to step ${currentStep - 1}`
                  : `الانتقال إلى الخطوة ${currentStep - 1}`
                );
              }}
              disabled={currentStep === 1}
              className="gap-2 h-11 px-6 rounded-xl"
            >
              <ArrowLeft className={`h-4 w-4 ${currentLang === 'ar' ? 'rotate-180' : ''}`} />
              {t.actions.previous}
            </Button>
            
            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                asChild 
                className="h-11 px-6 rounded-xl"
                onClick={() => toast.info(currentLang === 'en' 
                  ? "Cancelling property creation" 
                  : "جاري إلغاء إنشاء العقار"
                )}
              >
                <Link href={`/${locale}/dashboard/p`}>
                  {t.actions.cancel}
                </Link>
              </Button>
              
              {currentStep < steps.length ? (
                <Button 
                  type="button" 
                  onClick={nextStep} 
                  className="gap-2 h-11 px-8 rounded-xl"
                >
                  {t.actions.next}
                  <ArrowLeft className={`h-4 w-4 ${currentLang === 'ar' ? 'rotate-180' : 'rotate-0'}`} />
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="gap-2 h-11 px-8 rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      {t.actions.creating}
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      {t.actions.create}
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

// Main page component
export default function CreatePropertyPage({ params }: { params: { locale: string } }) {
  return <CreatePropertyForm locale={params.locale} />;
}