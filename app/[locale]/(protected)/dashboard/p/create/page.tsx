/* eslint-disable tailwindcss/no-contradicting-classname */
/* eslint-disable tailwindcss/classnames-order */
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PropertiesService, type CreatePropertyData } from '@/lib/api/properties-service';
import { CustomUploader } from '@/components/shared/custom-uploader';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  X, 
  Image as ImageIcon, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Car,
  Home,
  Building,
  Star,
  Phone,
  Plus,
  Minus,
  Upload,
  CheckCircle2,
  Building2,
  Heart,
  Calendar,
  DollarSign,
  Users,
  Eye,
  AlertCircle,
  CheckCircle,
  Languages
} from 'lucide-react';

// Define the form data interface
interface CreatePropertyFormData extends CreatePropertyData {
  yearBuilt?: number;
  floors?: number;
  furnished?: boolean;
  petFriendly?: boolean;
  balcony?: boolean;
  garden?: boolean;
  pool?: boolean;
  gym?: boolean;
  security?: boolean;
  elevator?: boolean;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
}

// Translations object
const translations = {
  en: {
    createTitle: "Create New Property",
    steps: {
      basicInfo: "Basic Information",
      details: "Property Details", 
      features: "Amenities",
      media: "Photos & Media",
      contact: "Contact Info",
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
      propertyType: "Property Type",
      price: "Price (USD)",
      status: "Status",
      city: "City",
      district: "District/Area",
      titleEn: "Property Title (English)",
      titleAr: "Property Title (Arabic)",
      descriptionEn: "Description (English)",
      descriptionAr: "Description (Arabic)",
      bedrooms: "Bedrooms",
      bathrooms: "Bathrooms",
      area: "Area (m²)",
      parking: "Parking",
      yearBuilt: "Year Built",
      floors: "Number of Floors",
      features: "Property Features",
      amenities: "Amenities & Facilities",
      uploadedImages: (count: number) => `Uploaded Images (${count})`,
      contactName: "Contact Person Name",
      contactPhone: "Phone Number",
      contactEmail: "Email Address",
      location: "Location Details",
      images: "images",
      language: "Language"
    },
    placeholders: {
      city: "Enter city name",
      district: "Enter district or area",
      titleEn: "Beautiful apartment in city center",
      titleAr: "شقة رائعة في وسط المدينة",
      contactName: "John Doe",
      contactPhone: "+1 (555) 123-4567",
      contactEmail: "john.doe@example.com",
      descriptionEn: "Describe your property in English...",
      descriptionAr: "صف عقارك باللغة العربية..."
    },
    types: {
      apartment: "Apartment",
      villa: "Villa",
      office: "Office",
      shop: "Shop"
    },
    status: {
      available: "Available",
      rented: "Rented",
      sold: "Sold"
    },
    amenities: {
      wifi: "WiFi",
      security: "Security",
      garden: "Garden",
      gym: "Gym",
      pool: "Pool",
      parking: "Parking",
      kitchen: "Kitchen",
      tv: "Cable TV",
      ac: "Air Conditioning",
      heating: "Heating",
      laundry: "Laundry",
      balcony: "Balcony"
    },
    features: {
      furnished: "Furnished",
      petFriendly: "Pet Friendly",
      balcony: "Balcony",
      garden: "Garden",
      pool: "Pool",
      gym: "Gym",
      security: "Security",
      elevator: "Elevator"
    },
    validation: {
      requiredFields: "Please fill in all required fields",
      requiredField: (field: string) => `${field} is required`,
      invalidPrice: "Please enter a valid price",
      invalidCity: "Please enter a valid city",
      invalidTitles: "Please enter both English and Arabic titles",
      invalidArea: "Please enter a valid area",
      invalidBedrooms: "Please enter number of bedrooms",
      invalidBathrooms: "Please enter number of bathrooms"
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
      details: "تفاصيل العقار", 
      features: "المرافق",
      media: "الصور والوسائط",
      contact: "معلومات الاتصال",
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
      propertyType: "نوع العقار",
      price: "السعر (دولار)",
      status: "الحالة",
      city: "المدينة",
      district: "المنطقة/الحي",
      titleEn: "عنوان العقار (الإنجليزية)",
      titleAr: "عنوان العقار (العربية)",
      descriptionEn: "الوصف (الإنجليزية)",
      descriptionAr: "الوصف (العربية)",
      bedrooms: "غرف النوم",
      bathrooms: "الحمامات",
      area: "المساحة (م²)",
      parking: "مواقف السيارات",
      yearBuilt: "سنة البناء",
      floors: "عدد الطوابق",
      features: "ميزات العقار",
      amenities: "المرافق والخدمات",
      uploadedImages: (count: number) => `الصور المرفوعة (${count})`,
      contactName: "اسم جهة الاتصال",
      contactPhone: "رقم الهاتف",
      contactEmail: "البريد الإلكتروني",
      location: "تفاصيل الموقع",
      images: "الصور",
      language: "اللغة"
    },
    placeholders: {
      city: "أدخل اسم المدينة",
      district: "أدخل المنطقة أو الحي",
      titleEn: "شقة جميلة في وسط المدينة",
      titleAr: "شقة رائعة في وسط المدينة",
      contactName: "جون دو",
      contactPhone: "+1 (555) 123-4567",
      contactEmail: "john.doe@example.com",
      descriptionEn: "صف عقارك باللغة الإنجليزية...",
      descriptionAr: "صف عقارك باللغة العربية..."
    },
    types: {
      apartment: "شقة",
      villa: "فيلا",
      office: "مكتب",
      shop: "متجر"
    },
    status: {
      available: "متاح",
      rented: "مؤجر",
      sold: "مباع"
    },
    amenities: {
      wifi: "واي فاي",
      security: "أمن",
      garden: "حديقة",
      gym: "نادي رياضي",
      pool: "مسبح",
      parking: "مواقف سيارات",
      kitchen: "مطبخ",
      tv: "تلفزيون كبلي",
      ac: "تكييف",
      heating: "تدفئة",
      laundry: "غسيل ملابس",
      balcony: "شرفة"
    },
    features: {
      furnished: "مؤثثة",
      petFriendly: "مسموح بالحيوانات الأليفة",
      balcony: "شرفة",
      garden: "حديقة",
      pool: "مسبح",
      gym: "نادي رياضي",
      security: "أمن",
      elevator: "مصعد"
    },
    validation: {
      requiredFields: "يرجى ملء جميع الحقول المطلوبة",
      requiredField: (field: string) => `${field} مطلوب`,
      invalidPrice: "يرجى إدخال سعر صحيح",
      invalidCity: "يرجى إدخال مدينة صحيحة",
      invalidTitles: "يرجى إدخال العنوان باللغتين الإنجليزية والعربية",
      invalidArea: "يرجى إدخال مساحة صحيحة",
      invalidBedrooms: "يرجى إدخال عدد غرف النوم",
      invalidBathrooms: "يرجى إدخال عدد الحمامات"
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

// Default form data with sensible defaults
const defaultFormData: CreatePropertyFormData = {
  titleEn: '',
  titleAr: '',
  descriptionEn: '',
  descriptionAr: '',
  price: 0,
  type: 'APARTMENT',
  status: 'AVAILABLE',
  city: '',
  district: '',
  bedrooms: 1,
  bathrooms: 1,
  area: 0,
  parking: 0,
  features: [],
  images: [],
  yearBuilt: new Date().getFullYear(),
  floors: 1,
  furnished: false,
  petFriendly: false,
  balcony: false,
  garden: false,
  pool: false,
  gym: false,
  security: false,
  elevator: false,
  contactName: '',
  contactPhone: '',
  contactEmail: '',
};

// Required fields configuration
const requiredFields = {
  titleEn: true,
  titleAr: true,
  price: true,
  type: true,
  status: true,
  city: true,
  bedrooms: true,
  bathrooms: true,
  area: true,
  parking: true,
};

// Loading component
function CreatePropertySkeleton() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-4 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

// Client component
function CreatePropertyForm({ locale }: { locale: string }) {
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [formData, setFormData] = useState<CreatePropertyFormData>(defaultFormData);
  const [currentLang, setCurrentLang] = useState<'en' | 'ar'>(locale as 'en' | 'ar' || 'ar'); // Default to Arabic
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const t = translations[currentLang];

  // Progress calculation
  const progress = (currentStep / 5) * 100;

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

  const toggleFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const validateForm = (): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};

    // Required field validation
    if (requiredFields.titleEn && !formData.titleEn.trim()) {
      errors.titleEn = t.validation.requiredField(currentLang === 'en' ? 'English title' : 'العنوان بالإنجليزية');
    }
    if (requiredFields.titleAr && !formData.titleAr.trim()) {
      errors.titleAr = t.validation.requiredField(currentLang === 'en' ? 'Arabic title' : 'العنوان بالعربية');
    }
    if (requiredFields.price && (!formData.price || formData.price <= 0)) {
      errors.price = t.validation.invalidPrice;
    }
    if (requiredFields.city && !formData.city.trim()) {
      errors.city = t.validation.invalidCity;
    }
    if (requiredFields.area && (!formData.area || formData.area <= 0)) {
      errors.area = t.validation.invalidArea;
    }
    if (requiredFields.bedrooms && (!formData.bedrooms || formData.bedrooms <= 0)) {
      errors.bedrooms = t.validation.invalidBedrooms;
    }
    if (requiredFields.bathrooms && (!formData.bathrooms || formData.bathrooms <= 0)) {
      errors.bathrooms = t.validation.invalidBathrooms;
    }

    setFieldErrors(errors);
    return { isValid: Object.keys(errors).length === 0, errors };
  };

  const validateCurrentStep = (): boolean => {
    const stepValidations: Record<number, (keyof CreatePropertyFormData)[]> = {
      1: ['titleEn', 'titleAr', 'price', 'type', 'status', 'city'],
      2: ['bedrooms', 'bathrooms', 'area'],
      3: [], // Features are optional
      4: [], // Images are optional
      5: [], // Contact info is optional
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
        if (field === 'price' && (!formData.price || formData.price <= 0)) {
          errors.price = t.validation.invalidPrice;
        }
        if (field === 'city' && !formData.city.trim()) {
          errors.city = t.validation.invalidCity;
        }
        if (field === 'area' && (!formData.area || formData.area <= 0)) {
          errors.area = t.validation.invalidArea;
        }
        if (field === 'bedrooms' && (!formData.bedrooms || formData.bedrooms <= 0)) {
          errors.bedrooms = t.validation.invalidBedrooms;
        }
        if (field === 'bathrooms' && (!formData.bathrooms || formData.bathrooms <= 0)) {
          errors.bathrooms = t.validation.invalidBathrooms;
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
        const basicData: CreatePropertyData = {
          titleEn: formData.titleEn,
          titleAr: formData.titleAr,
          descriptionEn: formData.descriptionEn,
          descriptionAr: formData.descriptionAr,
          price: formData.price,
          type: formData.type,
          status: formData.status,
          city: formData.city,
          district: formData.district,
          bedrooms: formData.bedrooms,
          bathrooms: formData.bathrooms,
          area: formData.area,
          parking: formData.parking,
          features: formData.features,
          images: formData.images
        };

        await PropertiesService.create(basicData);
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

  // Steps configuration
  const steps = [
    { number: 1, title: t.steps.basicInfo, icon: Building2, description: currentLang === 'en' ? 'Property type and basic details' : 'نوع العقار والتفاصيل الأساسية' },
    { number: 2, title: t.steps.details, icon: Home, description: currentLang === 'en' ? 'Specifications and features' : 'المواصفات والميزات' },
    { number: 3, title: t.steps.features, icon: Star, description: currentLang === 'en' ? 'Facilities and services' : 'المرافق والخدمات' },
    { number: 4, title: t.steps.media, icon: ImageIcon, description: currentLang === 'en' ? 'Photos and visual content' : 'الصور والمحتوى المرئي' },
    { number: 5, title: t.steps.contact, icon: Phone, description: currentLang === 'en' ? 'Contact information' : 'معلومات الاتصال' }
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

  // Property types
  const propertyTypes = [
    { value: 'APARTMENT', label: t.types.apartment, icon: Building, color: 'bg-blue-500' },
    { value: 'VILLA', label: t.types.villa, icon: Home, color: 'bg-green-500' },
    { value: 'OFFICE', label: t.types.office, icon: Building2, color: 'bg-purple-500' },
    { value: 'SHOP', label: t.types.shop, icon: Heart, color: 'bg-pink-500' }
  ];

  // Status options
  const statusOptions = [
    { value: 'AVAILABLE', label: t.status.available },
    { value: 'RENTED', label: t.status.rented },
    { value: 'SOLD', label: t.status.sold }
  ];

  // Modern amenities with icons
  const amenities = [
    { key: 'wifi', label: t.amenities.wifi, icon: '📶' },
    { key: 'security', label: t.amenities.security, icon: '🔒' },
    { key: 'garden', label: t.amenities.garden, icon: '🌿' },
    { key: 'gym', label: t.amenities.gym, icon: '💪' },
    { key: 'pool', label: t.amenities.pool, icon: '🏊' },
    { key: 'parking', label: t.amenities.parking, icon: '🅿️' },
    { key: 'kitchen', label: t.amenities.kitchen, icon: '👨‍🍳' },
    { key: 'tv', label: t.amenities.tv, icon: '📺' },
    { key: 'ac', label: t.amenities.ac, icon: '❄️' },
    { key: 'heating', label: t.amenities.heating, icon: '🔥' },
    { key: 'laundry', label: t.amenities.laundry, icon: '🧺' },
    { key: 'balcony', label: t.amenities.balcony, icon: '🏙️' }
  ];

  // Property features
  const propertyFeatures = [
    { key: 'furnished', label: t.features.furnished },
    { key: 'petFriendly', label: t.features.petFriendly },
    { key: 'balcony', label: t.features.balcony },
    { key: 'garden', label: t.features.garden },
    { key: 'pool', label: t.features.pool },
    { key: 'gym', label: t.features.gym },
    { key: 'security', label: t.features.security },
    { key: 'elevator', label: t.features.elevator },
  ];

  const toggleLanguage = () => {
    setCurrentLang(prev => prev === 'en' ? 'ar' : 'en');
    toast.info(currentLang === 'en' ? "تم التبديل إلى اللغة العربية" : "Switched to English", {
      icon: <Languages className="h-4 w-4" />
    });
  };

  // Required field indicator component
  const RequiredIndicator = () => (
    <span className="text-destructive ml-1">*</span>
  );

  return (
    <div className={`min-h-screen bg-gradient-to-br from-background to-muted/20 ${currentLang === 'ar' ? 'font-arabic' : ''}`}>
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        {/* Modern Header */}
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
            
            {/* Language and View Controls */}
            <div className="flex items-center gap-4">
              {/* Language Toggle */}
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

              {/* View Controls */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => {
                      setViewMode('grid');
                      toast.info(currentLang === 'en' ? "Switched to grid view" : "تم التبديل إلى العرض الشبكي");
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <div className="h-4 w-4 grid grid-cols-2 gap-0.5">
                      <div className="bg-current rounded-sm" />
                      <div className="bg-current rounded-sm" />
                      <div className="bg-current rounded-sm" />
                      <div className="bg-current rounded-sm" />
                    </div>
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => {
                      setViewMode('list');
                      toast.info(currentLang === 'en' ? "Switched to list view" : "تم التبديل إلى العرض القائم");
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <div className="h-4 w-4 flex flex-col gap-0.5">
                      <div className="bg-current h-1 rounded-sm" />
                      <div className="bg-current h-1 rounded-sm" />
                      <div className="bg-current h-1 rounded-sm" />
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Modern Progress Bar */}
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
                        <CheckCircle className="h-4 w-4" />
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
                    {/* Property Type Selection */}
                    <div>
                      <Label className="text-base font-semibold mb-4 block">
                        {t.labels.propertyType} <RequiredIndicator />
                      </Label>
                      <div className={`grid gap-4 ${
                        viewMode === 'list' ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-2'
                      }`}>
                        {propertyTypes.map((type) => {
                          const Icon = type.icon;
                          return (
                            <button
                              key={type.value}
                              type="button"
                              onClick={() => {
                                updateFormData('type', type.value);
                                toast.success(currentLang === 'en' 
                                  ? `Property type set to ${type.label}`
                                  : `تم تعيين نوع العقار إلى ${type.label}`
                                );
                              }}
                              className={`p-6 rounded-xl border-2 transition-all text-left group hover:shadow-lg ${
                                formData.type === type.value
                                  ? 'border-primary bg-primary/5 shadow-md scale-[1.02]'
                                  : 'border-border hover:border-primary/50 hover:bg-accent/50'
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${type.color} text-white shadow-lg`}>
                                  <Icon className="h-6 w-6" />
                                </div>
                                <div>
                                  <div className="font-semibold text-base">{type.label}</div>
                                  <div className="text-sm text-muted-foreground mt-1">
                                    {type.value === 'APARTMENT' && (currentLang === 'en' ? 'Multi-unit residential building' : 'مبنى سكني متعدد الوحدات')}
                                    {type.value === 'VILLA' && (currentLang === 'en' ? 'Luxury standalone house' : 'منزل فاخر مستقل')}
                                    {type.value === 'OFFICE' && (currentLang === 'en' ? 'Commercial workspace' : 'مساحة عمل تجارية')}
                                    {type.value === 'SHOP' && (currentLang === 'en' ? 'Retail business space' : 'مساحة تجارية بيع بالتجزئة')}
                                  </div>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <Separator />

                    {/* Price and Status */}
                    <div className={`grid gap-6 ${viewMode === 'list' ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
                      <div className="space-y-3">
                        <Label htmlFor="price" className="text-sm font-semibold flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-500" />
                          {t.labels.price} <RequiredIndicator />
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-lg">
                            $
                          </span>
                          <Input
                            id="price"
                            type="number"
                            value={formData.price || ''}
                            onChange={(e) => updateFormData('price', parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                            className={`pl-10 text-lg h-12 border-2 focus:border-primary ${
                              fieldErrors.price ? 'border-destructive' : ''
                            }`}
                            min="0"
                            step="0.01"
                            required
                          />
                        </div>
                        {fieldErrors.price && (
                          <p className="text-destructive text-sm flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {fieldErrors.price}
                          </p>
                        )}
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="status" className="text-sm font-semibold flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-blue-500" />
                          {t.labels.status} <RequiredIndicator />
                        </Label>
                        <Select 
                          value={formData.status} 
                          onValueChange={(val) => {
                            updateFormData('status', val);
                            toast.info(currentLang === 'en'
                              ? `Status set to ${statusOptions.find(s => s.value === val)?.label}`
                              : `تم تعيين الحالة إلى ${statusOptions.find(s => s.value === val)?.label}`
                            );
                          }}
                        >
                          <SelectTrigger className="h-12 border-2 text-lg" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((status) => (
                              <SelectItem key={status.value} value={status.value} className="text-base" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-4">
                      <Label className="text-sm font-semibold flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-red-500" />
                        {t.labels.location}
                      </Label>
                      <div className={`grid gap-4 ${viewMode === 'list' ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
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
                        <span className="text-sm text-muted-foreground">{currentLang === 'en' ? 'Type' : 'النوع'}</span>
                        <Badge variant="secondary" className="capitalize">
                          {formData.type.toLowerCase()}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{currentLang === 'en' ? 'Price' : 'السعر'}</span>
                        <span className="font-semibold">${formData.price?.toLocaleString() || '0'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{currentLang === 'en' ? 'Status' : 'الحالة'}</span>
                        <Badge variant={
                          formData.status === 'AVAILABLE' ? 'default' : 
                          formData.status === 'RENTED' ? 'secondary' : 'destructive'
                        }>
                          {formData.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{currentLang === 'en' ? 'Location' : 'الموقع'}</span>
                        <span className="font-medium text-right text-sm">
                          {formData.city}{formData.district ? `, ${formData.district}` : ''}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{currentLang === 'en' ? 'Bedrooms' : 'غرف النوم'}</span>
                        <span className="font-semibold">{formData.bedrooms}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{currentLang === 'en' ? 'Bathrooms' : 'الحمامات'}</span>
                        <span className="font-semibold">{formData.bathrooms}</span>
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
                        <li>{t.labels.propertyType}</li>
                        <li>{t.labels.price}</li>
                        <li>{t.labels.status}</li>
                        <li>{t.labels.city}</li>
                        <li>{t.labels.titleEn}</li>
                        <li>{t.labels.titleAr}</li>
                        <li>{t.labels.bedrooms}</li>
                        <li>{t.labels.bathrooms}</li>
                        <li>{t.labels.area}</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Step 2: Property Details */}
          {currentStep === 2 && (
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Home className="h-5 w-5 text-primary" />
                  {t.steps.details}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Property Specifications Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { key: 'bedrooms', label: t.labels.bedrooms, icon: Bed, value: formData.bedrooms, required: true },
                    { key: 'bathrooms', label: t.labels.bathrooms, icon: Bath, value: formData.bathrooms, required: true },
                    { key: 'area', label: t.labels.area, icon: Square, value: formData.area, required: true },
                    { key: 'parking', label: t.labels.parking, icon: Car, value: formData.parking, required: true }
                  ].map((spec) => {
                    const Icon = spec.icon;
                    return (
                      <div key={spec.key} className="text-center p-4 rounded-lg bg-muted/50">
                        <Label className="text-sm font-semibold flex items-center justify-center gap-2 mb-3">
                          <Icon className="h-4 w-4 text-primary" />
                          {spec.label}
                          {spec.required && <RequiredIndicator />}
                        </Label>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              const newValue = Math.max(0, spec.value - 1);
                              updateFormData(spec.key as any, newValue);
                              toast.info(`${spec.label} ${currentLang === 'en' ? 'set to' : 'تم تعيين إلى'} ${newValue}`);
                            }}
                            className="h-8 w-8 rounded-full"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Input
                            type="number"
                            value={spec.value}
                            onChange={(e) => updateFormData(spec.key as any, parseInt(e.target.value) || 0)}
                            className={`w-20 text-center text-lg font-semibold border-2 ${
                              fieldErrors[spec.key] ? 'border-destructive' : ''
                            }`}
                            min="0"
                            dir="ltr"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              const newValue = spec.value + 1;
                              updateFormData(spec.key as any, newValue);
                              toast.info(`${spec.label} ${currentLang === 'en' ? 'set to' : 'تم تعيين إلى'} ${newValue}`);
                            }}
                            className="h-8 w-8 rounded-full"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        {fieldErrors[spec.key] && (
                          <p className="text-destructive text-sm mt-2 flex items-center justify-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {fieldErrors[spec.key]}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                <Separator />

                {/* Additional Details */}
                <div className={`grid gap-6 ${viewMode === 'list' ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
                  <div className="space-y-3">
                    <Label htmlFor="yearBuilt" className="text-sm font-semibold">{t.labels.yearBuilt}</Label>
                    <Input
                      id="yearBuilt"
                      type="number"
                      value={formData.yearBuilt}
                      onChange={(e) => updateFormData('yearBuilt', parseInt(e.target.value) || new Date().getFullYear())}
                      placeholder="2024"
                      className="h-11"
                      min="1900"
                      max={new Date().getFullYear()}
                      dir="ltr"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="floors" className="text-sm font-semibold">{t.labels.floors}</Label>
                    <Input
                      id="floors"
                      type="number"
                      value={formData.floors}
                      onChange={(e) => updateFormData('floors', parseInt(e.target.value) || 1)}
                      placeholder="1"
                      className="h-11"
                      min="1"
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* Features Grid */}
                <div>
                  <Label className="text-sm font-semibold mb-4 block">{t.labels.features}</Label>
                  <div className={`grid gap-4 ${
                    viewMode === 'list' ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                  }`}>
                    {propertyFeatures.map((feature) => (
                      <div key={feature.key} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                        <Switch
                          checked={formData[feature.key as keyof CreatePropertyFormData] as boolean}
                          onCheckedChange={(checked) => {
                            updateFormData(feature.key as keyof CreatePropertyFormData, checked);
                            toast.info(`${feature.label} ${checked 
                              ? (currentLang === 'en' ? 'enabled' : 'تم التفعيل')
                              : (currentLang === 'en' ? 'disabled' : 'تم التعطيل')
                            }`);
                          }}
                        />
                        <Label htmlFor={feature.key} className="text-sm font-medium cursor-pointer flex-1">
                          {feature.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Amenities */}
          {currentStep === 3 && (
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Star className="h-5 w-5 text-primary" />
                  {t.labels.amenities}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`grid gap-4 ${
                  viewMode === 'list' ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                }`}>
                  {amenities.map((amenity) => {
                    const isSelected = formData.features.includes(amenity.key);
                    return (
                      <button
                        key={amenity.key}
                        type="button"
                        onClick={() => {
                          toggleFeature(amenity.key);
                          toast.info(`${amenity.label} ${isSelected 
                            ? (currentLang === 'en' ? 'removed' : 'تم الإزالة')
                            : (currentLang === 'en' ? 'added' : 'تم الإضافة')
                          }`);
                        }}
                        className={`p-4 rounded-xl border-2 transition-all text-center group hover:shadow-lg ${
                          isSelected
                            ? 'border-primary bg-primary/5 shadow-md scale-[1.02]'
                            : 'border-border hover:border-primary/50 hover:bg-accent/50'
                        }`}
                      >
                        <div className="text-2xl mb-3 transform group-hover:scale-110 transition-transform">
                          {amenity.icon}
                        </div>
                        <div className="text-sm font-medium">{amenity.label}</div>
                        <div className={`h-2 w-2 rounded-full mt-2 mx-auto transition-colors ${
                          isSelected ? 'bg-primary' : 'bg-transparent'
                        }`} />
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Media */}
          {currentStep === 4 && (
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
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
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
                    <div className={`grid gap-4 ${
                      viewMode === 'list' ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3'
                    }`}>
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

          {/* Step 5: Contact */}
          {currentStep === 5 && (
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Users className="h-5 w-5 text-primary" />
                  {t.steps.contact}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className={`grid gap-6 ${viewMode === 'list' ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
                  <div className="space-y-3">
                    <Label htmlFor="contactName" className="text-sm font-semibold">{t.labels.contactName}</Label>
                    <Input
                      id="contactName"
                      value={formData.contactName}
                      onChange={(e) => updateFormData('contactName', e.target.value)}
                      placeholder={t.placeholders.contactName}
                      className="h-11"
                      dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="contactPhone" className="text-sm font-semibold">{t.labels.contactPhone}</Label>
                    <Input
                      id="contactPhone"
                      value={formData.contactPhone}
                      onChange={(e) => updateFormData('contactPhone', e.target.value)}
                      placeholder={t.placeholders.contactPhone}
                      className="h-11"
                      dir="ltr"
                    />
                  </div>
                  <div className={viewMode === 'list' ? '' : 'md:col-span-2'}>
                    <Label htmlFor="contactEmail" className="text-sm font-semibold">{t.labels.contactEmail}</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => updateFormData('contactEmail', e.target.value)}
                      placeholder={t.placeholders.contactEmail}
                      className="h-11"
                      dir="ltr"
                    />
                  </div>
                </div>
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