// app/dashboard/services/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Edit, Save, X, ImageIcon } from "lucide-react";
import { CustomUploader } from "@/components/shared/custom-uploader";

interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
  features: string[];
  order: number;
  enabled: boolean;
}

interface ServicesPageData {
  id: string;
  title: string;
  subtitle: string;
  heroImage: string;
  enabled: boolean;
}

export default function ServicesEditor() {
  const [servicesPage, setServicesPage] = useState<ServicesPageData>({
    id: "",
    title: "خدماتنا",
    subtitle: "حلول شاملة لتحسين وجودك الرقمي",
    heroImage: "",
    enabled: true
  });
  
  const [services, setServices] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isEditingHero, setIsEditingHero] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pageResponse, servicesResponse] = await Promise.all([
        fetch('/api/services-page'),
        fetch('/api/services')
      ]);

      const pageData = await pageResponse.json();
      const servicesData = await servicesResponse.json();

      setServicesPage(pageData);
      setServices(servicesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveServicesPage = async () => {
    try {
      const response = await fetch('/api/services-page', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(servicesPage),
      });

      const updatedPage = await response.json();
      setServicesPage(updatedPage);
      setIsEditingHero(false);
    } catch (error) {
      console.error('Error saving services page:', error);
    }
  };

  const handleHeroImageUpload = (url: string) => {
    setServicesPage(prev => ({ ...prev, heroImage: url }));
  };

  const handleServiceImageUpload = (url: string) => {
    if (editingService) {
      setEditingService(prev => prev ? { ...prev, image: url } : null);
    }
  };

  const addService = () => {
    const newService: Service = {
      id: '',
      title: 'خدمة جديدة',
      description: 'وصف الخدمة',
      image: '',
      features: ['ميزة 1', 'ميزة 2'],
      order: services.length,
      enabled: true
    };
    setEditingService(newService);
  };

  const saveService = async () => {
    if (!editingService) return;

    try {
      const url = editingService.id ? `/api/services/${editingService.id}` : '/api/services';
      const method = editingService.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingService),
      });

      await fetchData();
      setEditingService(null);
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const deleteService = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الخدمة؟')) return;

    try {
      await fetch(`/api/services/${id}`, { method: 'DELETE' });
      await fetchData();
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const addFeature = () => {
    if (editingService) {
      setEditingService({
        ...editingService,
        features: [...editingService.features, 'ميزة جديدة']
      });
    }
  };

  const updateFeature = (index: number, value: string) => {
    if (editingService) {
      const updatedFeatures = [...editingService.features];
      updatedFeatures[index] = value;
      setEditingService({ ...editingService, features: updatedFeatures });
    }
  };

  const removeFeature = (index: number) => {
    if (editingService) {
      const updatedFeatures = editingService.features.filter((_, i) => i !== index);
      setEditingService({ ...editingService, features: updatedFeatures });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50" dir="rtl">
        <div className="text-lg">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" dir="rtl">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-right">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">محرر الخدمات</h1>
          <p className="text-gray-600">إدارة محتوى صفحة الخدمات والعروض</p>
        </div>

        {/* Hero Section Editor */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-right">القسم الرئيسي</CardTitle>
            <Button
              onClick={() => isEditingHero ? saveServicesPage() : setIsEditingHero(true)}
              className={isEditingHero ? "bg-green-600 hover:bg-green-700" : ""}
            >
              {isEditingHero ? <Save className="ml-2 size-4" /> : <Edit className="ml-2 size-4" />}
              {isEditingHero ? "حفظ التغييرات" : "تعديل القسم"}
            </Button>
          </CardHeader>
          <CardContent>
            {isEditingHero ? (
              <div className="space-y-4 text-right">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    العنوان *
                  </label>
                  <Input
                    value={servicesPage.title}
                    onChange={(e) => setServicesPage({ ...servicesPage, title: e.target.value })}
                    placeholder="أدخل العنوان الرئيسي"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    الوصف *
                  </label>
                  <Textarea
                    value={servicesPage.subtitle}
                    onChange={(e) => setServicesPage({ ...servicesPage, subtitle: e.target.value })}
                    placeholder="أدخل الوصف الفرعي"
                    rows={2}
                    required
                  />
                </div>
                
                {/* Hero Image Uploader */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    صورة القسم الرئيسي
                  </label>
                  <CustomUploader
                    bucket="IMAGES"
                    onUploadComplete={handleHeroImageUpload}
                    buttonText="رفع صورة القسم"
                    acceptedFileTypes="image"
                    multiple={false}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={saveServicesPage} 
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Save className="ml-2 size-4" />
                    حفظ التغييرات
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditingHero(false)}>
                    <X className="ml-2 size-4" />
                    إلغاء
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-right">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <p><strong>العنوان:</strong> {servicesPage.title}</p>
                    <p><strong>الوصف:</strong> {servicesPage.subtitle}</p>
                  </div>
                  <div className="space-y-2">
                    <p><strong>صورة القسم:</strong></p>
                    <div className="flex size-24 items-center justify-center overflow-hidden rounded-lg bg-gray-200">
                      {servicesPage.heroImage ? (
                        <img 
                          src={servicesPage.heroImage} 
                          alt="معاينة الصورة" 
                          className="size-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="size-6 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Services Editor */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-right">الخدمات ({services.length})</CardTitle>
            <Button onClick={addService}>
              <Plus className="ml-2 size-4" />
              إضافة خدمة
            </Button>
          </CardHeader>
          <CardContent>
            {/* Services List */}
            <div className="mb-6 space-y-3">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 text-right"
                >
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                        {service.image ? (
                          <img 
                            src={service.image} 
                            alt={service.title}
                            className="size-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="size-6 text-gray-400" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{service.title}</h3>
                        <p className="line-clamp-2 text-sm text-gray-600">{service.description}</p>
                        <div className="mt-2 flex gap-2 flex-wrap">
                          {service.features.slice(0, 3).map((feature, i) => (
                            <span
                              key={i}
                              className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800"
                            >
                              {feature}
                            </span>
                          ))}
                          {service.features.length > 3 && (
                            <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">
                              +{service.features.length - 3} أكثر
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingService(service)}
                    >
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteService(service.id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Service Editor Form */}
            {editingService && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-right">
                    {editingService.id ? 'تعديل الخدمة' : 'خدمة جديدة'}
                    <Button variant="outline" size="sm" onClick={() => setEditingService(null)}>
                      <X className="size-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-right">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      العنوان *
                    </label>
                    <Input
                      value={editingService.title}
                      onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                      placeholder="عنوان الخدمة"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      الوصف *
                    </label>
                    <Textarea
                      value={editingService.description}
                      onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                      placeholder="وصف الخدمة"
                      rows={2}
                      required
                    />
                  </div>
                  
                  {/* Service Image Uploader */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      صورة الخدمة
                    </label>
                    <CustomUploader
                      bucket="IMAGES"
                      onUploadComplete={handleServiceImageUpload}
                      buttonText="رفع صورة الخدمة"
                      acceptedFileTypes="image"
                      multiple={false}
                    />
                  </div>
                  
                  {/* Features Editor */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">الميزات</label>
                      <Button type="button" size="sm" onClick={addFeature}>
                        <Plus className="ml-1 size-4" />
                        إضافة ميزة
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {editingService.features.map((feature, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={feature}
                            onChange={(e) => updateFeature(index, e.target.value)}
                            placeholder="وصف الميزة"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeFeature(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button 
                      onClick={saveService} 
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="ml-2 size-4" />
                      حفظ الخدمة
                    </Button>
                    <Button variant="outline" onClick={() => setEditingService(null)}>
                      إلغاء
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}