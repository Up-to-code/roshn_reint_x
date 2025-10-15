"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { PropertiesService, type CreatePropertyData } from '@/lib/api/properties-service';
import { CustomUploader } from '@/components/shared/custom-uploader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { 
  ArrowLeft, 
  X, 
  Image as ImageIcon, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Car, 
  Calendar,
  DollarSign,
  Building,
  Home,
  Briefcase,
  Store,
  Star,
  Wifi,
  Shield,
  TreePine,
  Dumbbell,
  Waves,
  Car as CarIcon,
  Utensils,
  Monitor,
  Phone,
  Mail,
  Globe,
  Clock,
  Users,
  Eye,
  Heart,
  Share2,
  Plus,
  Minus,
  Save,
  RotateCcw,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Property } from '@prisma/client';

interface EnhancedCreatePropertyData extends CreatePropertyData {
  // Additional fields
  yearBuilt?: number;
  floors?: number;
  furnished?: boolean;
  petFriendly?: boolean;
  smokingAllowed?: boolean;
  nearSchools?: boolean;
  nearHospitals?: boolean;
  nearShopping?: boolean;
  nearTransport?: boolean;
  balcony?: boolean;
  garden?: boolean;
  pool?: boolean;
  gym?: boolean;
  security?: boolean;
  concierge?: boolean;
  elevator?: boolean;
  parkingType?: 'STREET' | 'GARAGE' | 'COVERED' | 'UNDERGROUND';
  heating?: 'CENTRAL' | 'INDIVIDUAL' | 'NONE';
  cooling?: 'CENTRAL' | 'INDIVIDUAL' | 'NONE';
  waterHeater?: boolean;
  internet?: boolean;
  cableTV?: boolean;
  dishwasher?: boolean;
  washingMachine?: boolean;
  dryer?: boolean;
  microwave?: boolean;
  refrigerator?: boolean;
  oven?: boolean;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  contactWhatsapp?: string;
  virtualTour?: string;
  videoUrl?: string;
  floorPlan?: string;
  energyRating?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  propertyTax?: number;
  maintenanceFee?: number;
  hoaFee?: number;
  insurance?: number;
  utilities?: string[];
  nearbyAmenities?: string[];
  transportation?: string[];
  schools?: string[];
  hospitals?: string[];
  shopping?: string[];
  restaurants?: string[];
  entertainment?: string[];
  views?: number;
  favorites?: number;
  shares?: number;
}

export default function EditPropertyPage() {
  const t = useTranslations('propertyForm');
  const commonT = useTranslations('common');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [loadingProperty, setLoadingProperty] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState<EnhancedCreatePropertyData | null>(null);
  const [formData, setFormData] = useState<EnhancedCreatePropertyData>({
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
    images: [],
    // Additional fields with defaults
    yearBuilt: new Date().getFullYear(),
    floors: 1,
    furnished: false,
    petFriendly: false,
    smokingAllowed: false,
    nearSchools: false,
    nearHospitals: false,
    nearShopping: false,
    nearTransport: false,
    balcony: false,
    garden: false,
    pool: false,
    gym: false,
    security: false,
    concierge: false,
    elevator: false,
    parkingType: 'STREET',
    heating: 'CENTRAL',
    cooling: 'CENTRAL',
    waterHeater: false,
    internet: false,
    cableTV: false,
    dishwasher: false,
    washingMachine: false,
    dryer: false,
    microwave: false,
    refrigerator: false,
    oven: false,
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    contactWhatsapp: '',
    virtualTour: '',
    videoUrl: '',
    floorPlan: '',
    energyRating: 'C',
    propertyTax: 0,
    maintenanceFee: 0,
    hoaFee: 0,
    insurance: 0,
    utilities: [],
    nearbyAmenities: [],
    transportation: [],
    schools: [],
    hospitals: [],
    shopping: [],
    restaurants: [],
    entertainment: [],
    views: 0,
    favorites: 0,
    shares: 0
  });

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
  };

  // Field errors state
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (propertyId) {
      loadProperty();
    }
  }, [propertyId]);

  const loadProperty = async () => {
    try {
      setLoadingProperty(true);
      console.log('Loading property with ID:', propertyId);
      const property = await PropertiesService.getById(propertyId);
      
      if (!property) {
        console.error('Property not found');
        alert('Property not found');
        return;
      }
      
      console.log('Property loaded:', property);
      
      const enhancedData: EnhancedCreatePropertyData = {
        titleEn: property.titleEn,
        titleAr: property.titleAr,
        descriptionEn: property.descriptionEn || '',
        descriptionAr: property.descriptionAr || '',
        price: property.price,
        type: property.type,
        status: property.status,
        city: property.city,
        district: property.district || '',
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        area: property.area,
        parking: property.parking,
        features: property.features,
        images: property.images,
        // Map additional fields (with fallbacks for existing properties)
        yearBuilt: (property as any).yearBuilt || new Date().getFullYear(),
        floors: (property as any).floors || 1,
        furnished: (property as any).furnished || false,
        petFriendly: (property as any).petFriendly || false,
        smokingAllowed: (property as any).smokingAllowed || false,
        nearSchools: (property as any).nearSchools || false,
        nearHospitals: (property as any).nearHospitals || false,
        nearShopping: (property as any).nearShopping || false,
        nearTransport: (property as any).nearTransport || false,
        balcony: (property as any).balcony || false,
        garden: (property as any).garden || false,
        pool: (property as any).pool || false,
        gym: (property as any).gym || false,
        security: (property as any).security || false,
        concierge: (property as any).concierge || false,
        elevator: (property as any).elevator || false,
        parkingType: (property as any).parkingType || 'STREET',
        heating: (property as any).heating || 'CENTRAL',
        cooling: (property as any).cooling || 'CENTRAL',
        waterHeater: (property as any).waterHeater || false,
        internet: (property as any).internet || false,
        cableTV: (property as any).cableTV || false,
        dishwasher: (property as any).dishwasher || false,
        washingMachine: (property as any).washingMachine || false,
        dryer: (property as any).dryer || false,
        microwave: (property as any).microwave || false,
        refrigerator: (property as any).refrigerator || false,
        oven: (property as any).oven || false,
        contactName: (property as any).contactName || '',
        contactPhone: (property as any).contactPhone || '',
        contactEmail: (property as any).contactEmail || '',
        contactWhatsapp: (property as any).contactWhatsapp || '',
        virtualTour: (property as any).virtualTour || '',
        videoUrl: (property as any).videoUrl || '',
        floorPlan: (property as any).floorPlan || '',
        energyRating: (property as any).energyRating || 'C',
        propertyTax: (property as any).propertyTax || 0,
        maintenanceFee: (property as any).maintenanceFee || 0,
        hoaFee: (property as any).hoaFee || 0,
        insurance: (property as any).insurance || 0,
        utilities: (property as any).utilities || [],
        nearbyAmenities: (property as any).nearbyAmenities || [],
        transportation: (property as any).transportation || [],
        schools: (property as any).schools || [],
        hospitals: (property as any).hospitals || [],
        shopping: (property as any).shopping || [],
        restaurants: (property as any).restaurants || [],
        entertainment: (property as any).entertainment || [],
        views: (property as any).views || 0,
        favorites: (property as any).favorites || 0,
        shares: (property as any).shares || 0
      };
      
      setFormData(enhancedData);
      setOriginalData(enhancedData);
    } catch (error) {
      console.error('Error loading property:', error);
      alert(`Error loading property: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoadingProperty(false);
    }
  };

  const updateFormData = (field: keyof EnhancedCreatePropertyData, value: any) => {
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

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, url]
    }));
    setHasChanges(true);
  };

  const handleMultipleImageUpload = (urls: string[]) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...urls]
    }));
    setHasChanges(true);
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setHasChanges(true);
  };

  const toggleFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
    setHasChanges(true);
  };

  const resetToOriginal = () => {
    if (originalData) {
      setFormData(originalData);
      setHasChanges(false);
      setFieldErrors({});
    }
  };

  // Required field indicator component
  const RequiredIndicator = () => (
    <span className="ml-1 text-destructive">*</span>
  );

  const validateForm = (): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};

    // Required field validation
    if (requiredFields.titleEn && !formData.titleEn.trim()) {
      errors.titleEn = isRTL ? 'العنوان بالإنجليزية مطلوب' : 'English title is required';
    }
    if (requiredFields.titleAr && !formData.titleAr.trim()) {
      errors.titleAr = isRTL ? 'العنوان بالعربية مطلوب' : 'Arabic title is required';
    }
    if (requiredFields.price && (!formData.price || formData.price <= 0)) {
      errors.price = isRTL ? 'يرجى إدخال سعر صحيح' : 'Please enter a valid price';
    }
    if (requiredFields.city && !formData.city.trim()) {
      errors.city = isRTL ? 'يرجى إدخال مدينة صحيحة' : 'Please enter a valid city';
    }
    if (requiredFields.area && (!formData.area || formData.area <= 0)) {
      errors.area = isRTL ? 'يرجى إدخال مساحة صحيحة' : 'Please enter a valid area';
    }
    if (requiredFields.bedrooms && (!formData.bedrooms || formData.bedrooms <= 0)) {
      errors.bedrooms = isRTL ? 'يرجى إدخال عدد غرف النوم' : 'Please enter number of bedrooms';
    }
    if (requiredFields.bathrooms && (!formData.bathrooms || formData.bathrooms <= 0)) {
      errors.bathrooms = isRTL ? 'يرجى إدخال عدد الحمامات' : 'Please enter number of bathrooms';
    }

    setFieldErrors(errors);
    return { isValid: Object.keys(errors).length === 0, errors };
  };

  const validateCurrentStep = (): boolean => {
    const stepValidations: Record<number, (keyof EnhancedCreatePropertyData)[]> = {
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
          errors.titleEn = isRTL ? 'العنوان بالإنجليزية مطلوب' : 'English title is required';
        }
        if (field === 'titleAr' && !formData.titleAr.trim()) {
          errors.titleAr = isRTL ? 'العنوان بالعربية مطلوب' : 'Arabic title is required';
        }
        if (field === 'price' && (!formData.price || formData.price <= 0)) {
          errors.price = isRTL ? 'يرجى إدخال سعر صحيح' : 'Please enter a valid price';
        }
        if (field === 'city' && !formData.city.trim()) {
          errors.city = isRTL ? 'يرجى إدخال مدينة صحيحة' : 'Please enter a valid city';
        }
        if (field === 'area' && (!formData.area || formData.area <= 0)) {
          errors.area = isRTL ? 'يرجى إدخال مساحة صحيحة' : 'Please enter a valid area';
        }
        if (field === 'bedrooms' && (!formData.bedrooms || formData.bedrooms <= 0)) {
          errors.bedrooms = isRTL ? 'يرجى إدخال عدد غرف النوم' : 'Please enter number of bedrooms';
        }
        if (field === 'bathrooms' && (!formData.bathrooms || formData.bathrooms <= 0)) {
          errors.bathrooms = isRTL ? 'يرجى إدخال عدد الحمامات' : 'Please enter number of bathrooms';
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
      alert(isRTL 
        ? `يرجى تصحيح ${errorCount} خطأ${errorCount > 1 ? 'ء' : ''} في النموذج`
        : `Please fix ${errorCount} error${errorCount > 1 ? 's' : ''} in the form`
      );
      return;
    }

    setLoading(true);
    try {
      // Convert enhanced data to basic CreatePropertyData for API
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

      await PropertiesService.update(propertyId, basicData);
      setHasChanges(false);
      router.push(`/${locale}/dashboard/p`);
    } catch (error) {
      console.error('Error updating property:', error);
      const errorMessage = error instanceof Error ? error.message : commonT('error');
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const propertyTypes = [
    { value: 'APARTMENT', label: t('types.apartment'), icon: Building },
    { value: 'VILLA', label: t('types.villa'), icon: Home },
    { value: 'OFFICE', label: t('types.office'), icon: Briefcase },
    { value: 'SHOP', label: t('types.shop'), icon: Store }
  ];

  const amenities = [
    { key: 'wifi', label: 'WiFi', icon: Wifi },
    { key: 'security', label: 'Security', icon: Shield },
    { key: 'garden', label: 'Garden', icon: TreePine },
    { key: 'gym', label: 'Gym', icon: Dumbbell },
    { key: 'pool', label: 'Pool', icon: Waves },
    { key: 'parking', label: 'Parking', icon: CarIcon },
    { key: 'kitchen', label: 'Kitchen', icon: Utensils },
    { key: 'tv', label: 'Cable TV', icon: Monitor },
    { key: 'phone', label: 'Phone', icon: Phone },
    { key: 'internet', label: 'Internet', icon: Globe }
  ];

  const steps = [
    { number: 1, title: 'Basic Information', icon: Home },
    { number: 2, title: 'Property Details', icon: Building },
    { number: 3, title: 'Amenities & Features', icon: Star },
    { number: 4, title: 'Images & Media', icon: ImageIcon },
    { number: 5, title: 'Contact & Final', icon: Phone }
  ];

  const nextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      alert(isRTL 
        ? "يرجى ملء جميع الحقول المطلوبة بشكل صحيح"
        : "Please fill in all required fields correctly"
      );
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (loadingProperty) {
    return (
      <div className="min-h-screen bg-background px-4 py-8 text-foreground" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="mx-auto max-w-6xl">
          <div className="py-12 text-center">
            <div className="text-lg text-muted-foreground">{commonT('loading')}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 text-foreground" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href={`/${locale}/dashboard/p`}
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            {t('actions.back')}
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-foreground">
                {t('editTitle')}
              </h1>
              <p className="mt-2 text-lg text-muted-foreground">
                {t('editSubtitle')}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {isRTL ? `الخطوة ${currentStep} من ${steps.length}` : `Step ${currentStep} of ${steps.length}`}
              </div>
              <div className="text-sm text-muted-foreground">
                {steps[currentStep - 1].title}
              </div>
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

        {/* Progress Steps */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;
                
                return (
                  <div key={step.number} className="flex items-center">
                    <div className={`flex size-12 items-center justify-center rounded-full border-2 transition-all ${
                      isActive 
                        ? 'border-primary bg-primary text-white' 
                        : isCompleted 
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-muted-foreground bg-background text-muted-foreground'
                    }`}>
                      <Icon className="size-5" />
                    </div>
                    <div className={isRTL ? "mr-3" : "ml-3"}>
                      <div className={`text-sm font-medium ${
                        isActive ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-muted-foreground'
                      }`}>
                        {step.title}
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`mx-4 h-0.5 w-16 ${
                        isCompleted ? 'bg-green-500' : 'bg-muted-foreground'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Home className="size-5 text-primary" />
                  {isRTL ? 'المعلومات الأساسية' : 'Basic Information'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Property Type */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">
                    {isRTL ? 'نوع العقار' : 'Property Type'} <RequiredIndicator />
                  </Label>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {propertyTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => updateFormData('type', type.value)}
                          className={`rounded-lg border-2 p-4 transition-all hover:shadow-md ${
                            formData.type === type.value
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <Icon className="mx-auto mb-2 size-8" />
                          <div className="text-sm font-medium">{type.label}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Separator />

                {/* Price and Status */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-base font-semibold">
                      <DollarSign className="mr-2 inline size-4" />
                      {isRTL ? 'السعر (دولار)' : 'Price (USD)'} <RequiredIndicator />
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price || ''}
                      onChange={(e) => updateFormData('price', parseFloat(e.target.value))}
                      placeholder={isRTL ? 'أدخل سعر العقار' : 'Enter property price'}
                      className={`text-lg ${fieldErrors.price ? 'border-destructive' : ''}`}
                      required
                    />
                    {fieldErrors.price && (
                      <p className="flex items-center gap-1 text-sm text-destructive">
                        <AlertCircle className="size-3" />
                        {fieldErrors.price}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-base font-semibold">
                      <Calendar className="mr-2 inline size-4" />
                      {isRTL ? 'الحالة' : 'Status'} <RequiredIndicator />
                    </Label>
                    <Select value={formData.status} onValueChange={(val) => updateFormData('status', val)}>
                      <SelectTrigger className={fieldErrors.status ? 'border-destructive' : ''}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AVAILABLE">{isRTL ? 'متاح' : 'Available'}</SelectItem>
                        <SelectItem value="RENTED">{isRTL ? 'مؤجر' : 'Rented'}</SelectItem>
                        <SelectItem value="SOLD">{isRTL ? 'مباع' : 'Sold'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-base font-semibold">
                    <MapPin className="size-4" />
                    {isRTL ? 'الموقع' : 'Location'}
                  </Label>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="city">
                        {isRTL ? 'المدينة' : 'City'} <RequiredIndicator />
                      </Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => updateFormData('city', e.target.value)}
                        placeholder={isRTL ? 'أدخل المدينة' : 'Enter city'}
                        className={fieldErrors.city ? 'border-destructive' : ''}
                        required
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
                      />
                    </div>
                  </div>
                </div>

                {/* Content - English */}
                <div className="space-y-4">
                  <h3 className="border-b border-border pb-2 text-lg font-semibold">
                    {isRTL ? 'المحتوى الإنجليزي' : 'English Content'}
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="titleEn">
                        {isRTL ? 'عنوان العقار' : 'Property Title'} <RequiredIndicator />
                      </Label>
                      <Input
                        id="titleEn"
                        value={formData.titleEn}
                        onChange={(e) => updateFormData('titleEn', e.target.value)}
                        placeholder={isRTL ? 'أدخل عنوان العقار بالإنجليزية' : 'Enter property title in English'}
                        className={fieldErrors.titleEn ? 'border-destructive' : ''}
                        required
                      />
                      {fieldErrors.titleEn && (
                        <p className="flex items-center gap-1 text-sm text-destructive">
                          <AlertCircle className="size-3" />
                          {fieldErrors.titleEn}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="descriptionEn">{isRTL ? 'الوصف' : 'Description'}</Label>
                      <RichTextEditor
                        value={formData.descriptionEn}
                        onChange={(value) => updateFormData('descriptionEn', value)}
                        placeholder={isRTL ? 'أدخل وصف مفصل للعقار بالإنجليزية' : 'Enter detailed property description in English'}
                        isRTL={false}
                      />
                    </div>
                  </div>
                </div>

                {/* Content - Arabic */}
                <div className="space-y-4" dir="rtl">
                  <h3 className="border-b border-border pb-2 text-lg font-semibold">المحتوى العربي</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="titleAr">
                        عنوان العقار <RequiredIndicator />
                      </Label>
                      <Input
                        id="titleAr"
                        value={formData.titleAr}
                        onChange={(e) => updateFormData('titleAr', e.target.value)}
                        placeholder="أدخل عنوان العقار بالعربية"
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
                      <Label htmlFor="descriptionAr">الوصف</Label>
                      <RichTextEditor
                        value={formData.descriptionAr}
                        onChange={(value) => updateFormData('descriptionAr', value)}
                        placeholder="أدخل وصف مفصل للعقار بالعربية"
                        isRTL={true}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Property Details */}
          {currentStep === 2 && (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building className="size-5 text-primary" />
                  {isRTL ? 'تفاصيل العقار' : 'Property Details'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Details */}
                <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Bed className="size-4" />
                      {isRTL ? 'غرف النوم' : 'Bedrooms'} <RequiredIndicator />
                    </Label>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => updateFormData('bedrooms', Math.max(0, formData.bedrooms - 1))}
                      >
                        <Minus className="size-4" />
                      </Button>
                      <Input
                        type="number"
                        value={formData.bedrooms}
                        onChange={(e) => updateFormData('bedrooms', parseInt(e.target.value))}
                        className={`text-center ${fieldErrors.bedrooms ? 'border-destructive' : ''}`}
                        required
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => updateFormData('bedrooms', formData.bedrooms + 1)}
                      >
                        <Plus className="size-4" />
                      </Button>
                    </div>
                    {fieldErrors.bedrooms && (
                      <p className="flex items-center gap-1 text-sm text-destructive">
                        <AlertCircle className="size-3" />
                        {fieldErrors.bedrooms}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Bath className="size-4" />
                      {isRTL ? 'الحمامات' : 'Bathrooms'} <RequiredIndicator />
                    </Label>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => updateFormData('bathrooms', Math.max(0, formData.bathrooms - 1))}
                      >
                        <Minus className="size-4" />
                      </Button>
                      <Input
                        type="number"
                        value={formData.bathrooms}
                        onChange={(e) => updateFormData('bathrooms', parseInt(e.target.value))}
                        className={`text-center ${fieldErrors.bathrooms ? 'border-destructive' : ''}`}
                        required
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => updateFormData('bathrooms', formData.bathrooms + 1)}
                      >
                        <Plus className="size-4" />
                      </Button>
                    </div>
                    {fieldErrors.bathrooms && (
                      <p className="flex items-center gap-1 text-sm text-destructive">
                        <AlertCircle className="size-3" />
                        {fieldErrors.bathrooms}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Square className="size-4" />
                      {isRTL ? 'المساحة (م²)' : 'Area (m²)'} <RequiredIndicator />
                    </Label>
                    <Input
                      type="number"
                      value={formData.area}
                      onChange={(e) => updateFormData('area', parseInt(e.target.value))}
                      placeholder={isRTL ? 'أدخل المساحة' : 'Enter area'}
                      className={fieldErrors.area ? 'border-destructive' : ''}
                      required
                    />
                    {fieldErrors.area && (
                      <p className="flex items-center gap-1 text-sm text-destructive">
                        <AlertCircle className="size-3" />
                        {fieldErrors.area}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Car className="size-4" />
                      {isRTL ? 'مواقف السيارات' : 'Parking'}
                    </Label>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => updateFormData('parking', Math.max(0, formData.parking - 1))}
                      >
                        <Minus className="size-4" />
                      </Button>
                      <Input
                        type="number"
                        value={formData.parking}
                        onChange={(e) => updateFormData('parking', parseInt(e.target.value))}
                        className="text-center"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => updateFormData('parking', formData.parking + 1)}
                      >
                        <Plus className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Additional Details */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="yearBuilt">{isRTL ? 'سنة البناء' : 'Year Built'}</Label>
                    <Input
                      id="yearBuilt"
                      type="number"
                      value={formData.yearBuilt}
                      onChange={(e) => updateFormData('yearBuilt', parseInt(e.target.value))}
                      placeholder={isRTL ? 'أدخل سنة البناء' : 'Enter year built'}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="floors">{isRTL ? 'عدد الطوابق' : 'Number of Floors'}</Label>
                    <Input
                      id="floors"
                      type="number"
                      value={formData.floors}
                      onChange={(e) => updateFormData('floors', parseInt(e.target.value))}
                      placeholder={isRTL ? 'أدخل عدد الطوابق' : 'Enter number of floors'}
                    />
                  </div>
                </div>

                {/* Property Features */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">{isRTL ? 'ميزات العقار' : 'Property Features'}</Label>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    {[
                      { key: 'furnished', label: isRTL ? 'مؤثثة' : 'Furnished' },
                      { key: 'petFriendly', label: isRTL ? 'مسموح بالحيوانات الأليفة' : 'Pet Friendly' },
                      { key: 'smokingAllowed', label: isRTL ? 'مسموح بالتدخين' : 'Smoking Allowed' },
                      { key: 'balcony', label: isRTL ? 'شرفة' : 'Balcony' },
                      { key: 'garden', label: isRTL ? 'حديقة' : 'Garden' },
                      { key: 'elevator', label: isRTL ? 'مصعد' : 'Elevator' }
                    ].map((feature) => (
                      <div key={feature.key} className="flex items-center space-x-2">
                        <Checkbox
                          id={feature.key}
                          checked={formData[feature.key as keyof EnhancedCreatePropertyData] as boolean}
                          onCheckedChange={(checked) => updateFormData(feature.key as keyof EnhancedCreatePropertyData, checked)}
                        />
                        <Label htmlFor={feature.key} className="text-sm">
                          {feature.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Amenities & Features */}
          {currentStep === 3 && (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Star className="size-5 text-primary" />
                  {isRTL ? 'المرافق والميزات' : 'Amenities & Features'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Amenities */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">{isRTL ? 'اختر المرافق' : 'Select Amenities'}</Label>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {amenities.map((amenity) => {
                      const Icon = amenity.icon;
                      const isSelected = formData.features.includes(amenity.key);
                      
                      return (
                        <button
                          key={amenity.key}
                          type="button"
                          onClick={() => toggleFeature(amenity.key)}
                          className={`rounded-lg border-2 p-4 transition-all hover:shadow-md ${
                            isSelected
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <Icon className="mx-auto mb-2 size-6" />
                          <div className="text-sm font-medium">{amenity.label}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Separator />

                {/* Utilities */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">{isRTL ? 'المرافق' : 'Utilities'}</Label>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    {[
                      { key: 'waterHeater', label: isRTL ? 'سخان ماء' : 'Water Heater' },
                      { key: 'internet', label: isRTL ? 'إنترنت' : 'Internet' },
                      { key: 'cableTV', label: isRTL ? 'تلفزيون كبلي' : 'Cable TV' },
                      { key: 'dishwasher', label: isRTL ? 'غسالة صحون' : 'Dishwasher' },
                      { key: 'washingMachine', label: isRTL ? 'غسالة ملابس' : 'Washing Machine' },
                      { key: 'dryer', label: isRTL ? 'مجفف ملابس' : 'Dryer' },
                      { key: 'microwave', label: isRTL ? 'مايكروويف' : 'Microwave' },
                      { key: 'refrigerator', label: isRTL ? 'ثلاجة' : 'Refrigerator' },
                      { key: 'oven', label: isRTL ? 'فرن' : 'Oven' }
                    ].map((utility) => (
                      <div key={utility.key} className="flex items-center space-x-2">
                        <Checkbox
                          id={utility.key}
                          checked={formData[utility.key as keyof EnhancedCreatePropertyData] as boolean}
                          onCheckedChange={(checked) => updateFormData(utility.key as keyof EnhancedCreatePropertyData, checked)}
                        />
                        <Label htmlFor={utility.key} className="text-sm">
                          {utility.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nearby Amenities */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">{isRTL ? 'المرافق القريبة' : 'Nearby Amenities'}</Label>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    {[
                      { key: 'nearSchools', label: isRTL ? 'قرب المدارس' : 'Near Schools' },
                      { key: 'nearHospitals', label: isRTL ? 'قرب المستشفيات' : 'Near Hospitals' },
                      { key: 'nearShopping', label: isRTL ? 'قرب مراكز التسوق' : 'Near Shopping' },
                      { key: 'nearTransport', label: isRTL ? 'قرب المواصلات' : 'Near Transport' }
                    ].map((amenity) => (
                      <div key={amenity.key} className="flex items-center space-x-2">
                        <Checkbox
                          id={amenity.key}
                          checked={formData[amenity.key as keyof EnhancedCreatePropertyData] as boolean}
                          onCheckedChange={(checked) => updateFormData(amenity.key as keyof EnhancedCreatePropertyData, checked)}
                        />
                        <Label htmlFor={amenity.key} className="text-sm">
                          {amenity.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Images & Media */}
          {currentStep === 4 && (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ImageIcon className="size-5 text-primary" />
                  {isRTL ? 'الصور والوسائط' : 'Images & Media'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <CustomUploader
                  bucket="IMAGES"
                  onUploadComplete={handleImageUpload}
                  onMultipleUploadComplete={handleMultipleImageUpload}
                  buttonText={isRTL ? "رفع صور العقار" : "Upload Property Images"}
                  multiple={true}
                  maxFiles={20}
                  acceptedFileTypes="image"
                />

                {formData.images.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold">
                        {isRTL ? `الصور المرفوعة (${formData.images.length})` : `Uploaded Images (${formData.images.length})`}
                      </Label>
                      <Badge variant="secondary">
                        {formData.images.length} {isRTL ? 'صورة' : 'images'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                      {formData.images.map((url, idx) => (
                        <div key={idx} className="group relative aspect-square">
                          <img 
                            src={url} 
                            alt={`Property image ${idx + 1}`}
                            className="size-full rounded-lg border-2 border-border object-cover" 
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
                          >
                            <X className="size-4" />
                          </button>
                          <div className="absolute bottom-2 left-2 rounded bg-black/50 px-2 py-1 text-xs text-white">
                            {idx + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Media */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="virtualTour">{isRTL ? 'رابط الجولة الافتراضية' : 'Virtual Tour URL'}</Label>
                    <Input
                      id="virtualTour"
                      value={formData.virtualTour}
                      onChange={(e) => updateFormData('virtualTour', e.target.value)}
                      placeholder={isRTL ? 'أدخل رابط الجولة الافتراضية' : 'Enter virtual tour URL'}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="videoUrl">{isRTL ? 'رابط الفيديو' : 'Video URL'}</Label>
                    <Input
                      id="videoUrl"
                      value={formData.videoUrl}
                      onChange={(e) => updateFormData('videoUrl', e.target.value)}
                      placeholder={isRTL ? 'أدخل رابط الفيديو' : 'Enter video URL'}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 5: Contact & Final */}
          {currentStep === 5 && (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Phone className="size-5 text-primary" />
                  {isRTL ? 'معلومات الاتصال والتفاصيل النهائية' : 'Contact Information & Final Details'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">{isRTL ? 'معلومات الاتصال' : 'Contact Information'}</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="contactName">{isRTL ? 'اسم جهة الاتصال' : 'Contact Name'}</Label>
                      <Input
                        id="contactName"
                        value={formData.contactName}
                        onChange={(e) => updateFormData('contactName', e.target.value)}
                        placeholder={isRTL ? 'أدخل اسم جهة الاتصال' : 'Enter contact person name'}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">{isRTL ? 'رقم الهاتف' : 'Phone Number'}</Label>
                      <Input
                        id="contactPhone"
                        value={formData.contactPhone}
                        onChange={(e) => updateFormData('contactPhone', e.target.value)}
                        placeholder={isRTL ? 'أدخل رقم الهاتف' : 'Enter phone number'}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">{isRTL ? 'البريد الإلكتروني' : 'Email'}</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) => updateFormData('contactEmail', e.target.value)}
                        placeholder={isRTL ? 'أدخل البريد الإلكتروني' : 'Enter email address'}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactWhatsapp">{isRTL ? 'رقم الواتساب' : 'WhatsApp'}</Label>
                      <Input
                        id="contactWhatsapp"
                        value={formData.contactWhatsapp}
                        onChange={(e) => updateFormData('contactWhatsapp', e.target.value)}
                        placeholder={isRTL ? 'أدخل رقم الواتساب' : 'Enter WhatsApp number'}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Additional Costs */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">{isRTL ? 'التكاليف الإضافية (اختياري)' : 'Additional Costs (Optional)'}</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="propertyTax">{isRTL ? 'ضريبة العقار (سنوية)' : 'Property Tax (Annual)'}</Label>
                      <Input
                        id="propertyTax"
                        type="number"
                        value={formData.propertyTax}
                        onChange={(e) => updateFormData('propertyTax', parseFloat(e.target.value))}
                        placeholder={isRTL ? 'أدخل ضريبة العقار السنوية' : 'Enter annual property tax'}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maintenanceFee">{isRTL ? 'رسوم الصيانة (شهرية)' : 'Maintenance Fee (Monthly)'}</Label>
                      <Input
                        id="maintenanceFee"
                        type="number"
                        value={formData.maintenanceFee}
                        onChange={(e) => updateFormData('maintenanceFee', parseFloat(e.target.value))}
                        placeholder={isRTL ? 'أدخل رسوم الصيانة الشهرية' : 'Enter monthly maintenance fee'}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hoaFee">{isRTL ? 'رسوم الجمعية (شهرية)' : 'HOA Fee (Monthly)'}</Label>
                      <Input
                        id="hoaFee"
                        type="number"
                        value={formData.hoaFee}
                        onChange={(e) => updateFormData('hoaFee', parseFloat(e.target.value))}
                        placeholder={isRTL ? 'أدخل رسوم الجمعية الشهرية' : 'Enter monthly HOA fee'}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="insurance">{isRTL ? 'التأمين (سنوي)' : 'Insurance (Annual)'}</Label>
                      <Input
                        id="insurance"
                        type="number"
                        value={formData.insurance}
                        onChange={(e) => updateFormData('insurance', parseFloat(e.target.value))}
                        placeholder={isRTL ? 'أدخل تكلفة التأمين السنوية' : 'Enter annual insurance cost'}
                      />
                    </div>
                  </div>
                </div>

                {/* Energy Rating */}
                <div className="space-y-2">
                  <Label htmlFor="energyRating">{isRTL ? 'التصنيف الطاقة' : 'Energy Rating'}</Label>
                  <Select value={formData.energyRating} onValueChange={(val) => updateFormData('energyRating', val)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">{isRTL ? 'أ - الأكثر كفاءة' : 'A - Most Efficient'}</SelectItem>
                      <SelectItem value="B">{isRTL ? 'ب - عالي الكفاءة' : 'B - Very Efficient'}</SelectItem>
                      <SelectItem value="C">{isRTL ? 'ج - كفاءة' : 'C - Efficient'}</SelectItem>
                      <SelectItem value="D">{isRTL ? 'د - متوسط' : 'D - Average'}</SelectItem>
                      <SelectItem value="E">{isRTL ? 'هـ - أقل من المتوسط' : 'E - Below Average'}</SelectItem>
                      <SelectItem value="F">{isRTL ? 'و - غير كفء' : 'F - Inefficient'}</SelectItem>
                      <SelectItem value="G">{isRTL ? 'ز - الأقل كفاءة' : 'G - Least Efficient'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button 
              type="button" 
              variant="outline" 
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              {isRTL ? 'السابق' : 'Previous'}
            </Button>
            
            <div className="flex gap-3">
              <Button type="button" variant="outline" asChild>
                <Link href={`/${locale}/dashboard/p`}>
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </Link>
              </Button>
              
              {currentStep < steps.length ? (
                <Button type="button" onClick={nextStep}>
                  {isRTL ? 'الخطوة التالية' : 'Next Step'}
                </Button>
              ) : (
                <Button type="submit" disabled={loading} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  {loading ? (
                    <>
                      <Save className="mr-2 size-4 animate-spin" />
                      {isRTL ? 'جاري تحديث العقار...' : 'Updating Property...'}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 size-4" />
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