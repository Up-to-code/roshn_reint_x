// app/dashboard/services/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Edit, Save, X, GripVertical, AlertCircle, ImageIcon } from "lucide-react";
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
    title: "Our Services",
    subtitle: "Comprehensive solutions to transform your digital presence",
    heroImage: "",
    enabled: true
  });
  
  const [services, setServices] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isEditingHero, setIsEditingHero] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setError(null);
      const [pageResponse, servicesResponse] = await Promise.all([
        fetch('/api/services-page'),
        fetch('/api/services')
      ]);

      if (!pageResponse.ok) throw new Error('Failed to fetch page data');
      if (!servicesResponse.ok) throw new Error('Failed to fetch services');

      const pageData = await pageResponse.json();
      const servicesData = await servicesResponse.json();

      setServicesPage(pageData);
      setServices(servicesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveServicesPage = async () => {
    try {
      setError(null);
      const response = await fetch('/api/services-page', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(servicesPage),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save page');
      }

      const updatedPage = await response.json();
      setServicesPage(updatedPage);
      setIsEditingHero(false);
      alert('Services page updated successfully!');
    } catch (error) {
      console.error('Error saving services page:', error);
      setError(error instanceof Error ? error.message : 'Failed to save page');
    }
  };

  // Handle hero image upload
  const handleHeroImageUpload = (url: string) => {
    setServicesPage(prev => ({ ...prev, heroImage: url }));
  };

  // Handle service image upload
  const handleServiceImageUpload = (url: string) => {
    if (editingService) {
      setEditingService(prev => prev ? { ...prev, image: url } : null);
    }
  };

  const addService = () => {
    const newService: Service = {
      id: '',
      title: 'New Service',
      description: 'Service description',
      image: '',
      features: ['Feature 1', 'Feature 2'],
      order: services.length,
      enabled: true
    };
    setEditingService(newService);
  };

  const saveService = async () => {
    if (!editingService) return;

    try {
      setError(null);
      const url = editingService.id ? `/api/services/${editingService.id}` : '/api/services';
      const method = editingService.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingService),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save service');
      }

      await fetchData();
      setEditingService(null);
      alert('Service saved successfully!');
    } catch (error) {
      console.error('Error saving service:', error);
      setError(error instanceof Error ? error.message : 'Failed to save service');
    }
  };

  const deleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const response = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete service');
      }

      await fetchData();
      alert('Service deleted successfully!');
    } catch (error) {
      console.error('Error deleting service:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete service');
    }
  };

  const addFeature = () => {
    if (editingService) {
      setEditingService({
        ...editingService,
        features: [...editingService.features, 'New Feature']
      });
    }
  };

  const updateFeature = (index: number, value: string) => {
    if (editingService) {
      const updatedFeatures = [...editingService.features];
      updatedFeatures[index] = value;
      setEditingService({
        ...editingService,
        features: updatedFeatures
      });
    }
  };

  const removeFeature = (index: number) => {
    if (editingService) {
      const updatedFeatures = editingService.features.filter((_, i) => i !== index);
      setEditingService({
        ...editingService,
        features: updatedFeatures
      });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-gray-900">Services Editor</h1>
          <p className="text-gray-600">Manage your services page content and offerings</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="size-5" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Hero Section Editor */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Hero Section</CardTitle>
            <Button
              onClick={() => isEditingHero ? saveServicesPage() : setIsEditingHero(true)}
              className={isEditingHero ? "bg-green-600 hover:bg-green-700" : ""}
              disabled={isEditingHero && (!servicesPage.title || !servicesPage.subtitle)}
            >
              {isEditingHero ? <Save className="mr-2 size-4" /> : <Edit className="mr-2 size-4" />}
              {isEditingHero ? "Save Changes" : "Edit Hero"}
            </Button>
          </CardHeader>
          <CardContent>
            {isEditingHero ? (
              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Title *
                  </label>
                  <Input
                    value={servicesPage.title}
                    onChange={(e) => setServicesPage({ ...servicesPage, title: e.target.value })}
                    placeholder="Enter hero title"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Subtitle *
                  </label>
                  <Textarea
                    value={servicesPage.subtitle}
                    onChange={(e) => setServicesPage({ ...servicesPage, subtitle: e.target.value })}
                    placeholder="Enter hero subtitle"
                    rows={3}
                    required
                  />
                </div>
                
                {/* Hero Image Uploader */}
                <div>
                  <label className="mb-4 block text-sm font-medium text-gray-700">
                    Hero Image
                  </label>
                  <div className="space-y-4">
                    {/* Current Hero Image Preview */}
                    {servicesPage.heroImage && (
                      <div className="flex items-center gap-4 rounded-lg border bg-gray-50 p-4">
                        <div className="relative size-20 overflow-hidden rounded bg-gray-200">
                          <img 
                            src={servicesPage.heroImage} 
                            alt="Current hero" 
                            className="size-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Current Hero Image</p>
                          <p className="truncate text-xs text-gray-500">{servicesPage.heroImage}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Custom Uploader for Hero Image */}
                    <CustomUploader
                      bucket="IMAGES"
                      onUploadComplete={handleHeroImageUpload}
                      buttonText="Upload Hero Image"
                      acceptedFileTypes="image"
                      multiple={false}
                      maxSize={20}
                      className="rounded-lg border-2 border-dashed border-gray-300 p-4"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={saveServicesPage} 
                    className="bg-green-600 hover:bg-green-700"
                    disabled={!servicesPage.title || !servicesPage.subtitle}
                  >
                    <Save className="mr-2 size-4" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditingHero(false)}>
                    <X className="mr-2 size-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <p><strong>Title:</strong> {servicesPage.title}</p>
                    <p><strong>Subtitle:</strong> {servicesPage.subtitle}</p>
                  </div>
                  <div className="space-y-2">
                    <p><strong>Hero Image:</strong></p>
                    <div className="relative flex size-32 w-full items-center justify-center overflow-hidden rounded-lg bg-gray-200">
                      {servicesPage.heroImage ? (
                        <img 
                          src={servicesPage.heroImage} 
                          alt="Hero preview" 
                          className="size-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="text-center text-gray-500">
                          <ImageIcon className="mx-auto mb-2 size-8" />
                          <p className="text-sm">No image set</p>
                        </div>
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
            <CardTitle>Services ({services.length})</CardTitle>
            <Button onClick={addService}>
              <Plus className="mr-2 size-4" />
              Add Service
            </Button>
          </CardHeader>
          <CardContent>
            {/* Services List */}
            <div className="mb-6 space-y-4">
              {services.map((service, index) => (
                <div
                  key={service.id}
                  className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4"
                >
                  <GripVertical className="size-5 cursor-move text-gray-400" />
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      {/* Service Image Preview */}
                      <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                        {service.image ? (
                          <img 
                            src={service.image} 
                            alt={service.title}
                            className="size-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <ImageIcon className="size-6 text-gray-400" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{service.title}</h3>
                        <p className="line-clamp-2 text-sm text-gray-600">{service.description}</p>
                        <div className="mt-2 flex gap-2">
                          {service.features.slice(0, 3).map((feature, i) => (
                            <span
                              key={i}
                              className="rounded bg-orange-100 px-2 py-1 text-xs text-orange-800"
                            >
                              {feature}
                            </span>
                          ))}
                          {service.features.length > 3 && (
                            <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">
                              +{service.features.length - 3} more
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
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Service Editor Form */}
            {editingService && (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {editingService.id ? 'Edit Service' : 'New Service'}
                    <Button variant="outline" size="sm" onClick={() => setEditingService(null)}>
                      <X className="size-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Title *
                    </label>
                    <Input
                      value={editingService.title}
                      onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                      placeholder="Service title"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Description *
                    </label>
                    <Textarea
                      value={editingService.description}
                      onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                      placeholder="Service description"
                      rows={3}
                      required
                    />
                  </div>
                  
                  {/* Service Image Uploader */}
                  <div>
                    <label className="mb-4 block text-sm font-medium text-gray-700">
                      Service Image
                    </label>
                    <div className="space-y-4">
                      {/* Current Image Preview */}
                      {editingService.image && (
                        <div className="flex items-center gap-4 rounded-lg border bg-white p-4">
                          <div className="relative flex size-20 items-center justify-center overflow-hidden rounded-lg bg-gray-200">
                            <img 
                              src={editingService.image} 
                              alt="Current service" 
                              className="size-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                            {!editingService.image && (
                              <ImageIcon className="size-6 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">Current Service Image</p>
                            <p className="truncate text-xs text-gray-500">{editingService.image}</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Custom Uploader for Service Image */}
                      <CustomUploader
                        bucket="IMAGES"
                        onUploadComplete={handleServiceImageUpload}
                        buttonText="Upload Service Image"
                        acceptedFileTypes="image"
                        multiple={false}
                        maxSize={10}
                        className="rounded-lg border-2 border-dashed border-gray-300 p-4"
                      />
                    </div>
                  </div>
                  
                  {/* Features Editor */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">Features</label>
                      <Button type="button" size="sm" onClick={addFeature}>
                        <Plus className="mr-1 size-4" />
                        Add Feature
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {editingService.features.map((feature, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={feature}
                            onChange={(e) => updateFeature(index, e.target.value)}
                            placeholder="Feature description"
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
                      disabled={!editingService.title || !editingService.description}
                    >
                      <Save className="mr-2 size-4" />
                      Save Service
                    </Button>
                    <Button variant="outline" onClick={() => setEditingService(null)}>
                      Cancel
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