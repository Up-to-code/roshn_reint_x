"use client";
import React, { useState, useEffect } from 'react';
import { Property, PropertyStatus } from '@prisma/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Heart, 
  Building
} from 'lucide-react';
import Link from 'next/link';

interface HomePropertiesGridProps {
  locale: string;
}

export default function HomePropertiesGrid({ locale }: HomePropertiesGridProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({});
  const isRTL = locale === 'ar';

  // Fetch properties on client side
  useEffect(() => {
    async function fetchProperties() {
      try {
        const response = await fetch('/api/properties');
        if (response.ok) {
          const data = await response.json();
          setProperties(data);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProperties();
  }, []);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const handleImageError = (propertyId: string) => {
    setImageErrors(prev => ({ ...prev, [propertyId]: true }));
  };

  // Format price
  const formatPrice = (price: number) => new Intl.NumberFormat('en-US').format(price);

  // Get localized content
  const getLocalizedTitle = (property: Property) => 
    locale === 'ar' ? property.titleAr : property.titleEn;

  const getStatusText = (status: PropertyStatus) => {
    const statusMap = {
      [PropertyStatus.AVAILABLE]: locale === 'ar' ? 'متاح' : 'Available',
      [PropertyStatus.RENTED]: locale === 'ar' ? 'مؤجر' : 'Rented',
      [PropertyStatus.SOLD]: locale === 'ar' ? 'مباع' : 'Sold'
    };
    return statusMap[status] || status;
  };

  const displayProperties = properties.slice(0, 3);

  // Loading state
  if (isLoading) {
    return (
      <section className="bg-gradient-to-br from-slate-50 to-slate-100 py-16">
        <div className="container mx-auto px-4">
          {/* Header Skeleton */}
          <div className="mb-10 text-center">
            <Skeleton className="mx-auto mb-3 h-10 w-96" />
            <Skeleton className="mx-auto h-6 w-64" />
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="overflow-hidden border-0 shadow-md">
                <Skeleton className="h-96 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="mb-2 h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-br from-slate-50 to-slate-100 py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-bold text-slate-900">
            {locale === 'ar' ? 'عقارات مميزة' : 'Featured Properties'}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            {locale === 'ar' ? 'اكتشف أفضل العقارات' : 'Discover the best properties'}
          </p>
        </div>

        {/* Properties Grid */}
        {displayProperties.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {displayProperties.map((property) => (
                <Link 
                  href={`/${locale}/p/${property.id}`}
                  key={property.id}
                  className="group block overflow-hidden rounded-2xl border-0 shadow-md transition-all hover:shadow-2xl"
                >
                  {/* Image Section - Very tall 2:1 aspect ratio (like 720x360) */}
                  <div className="relative h-96 w-full overflow-hidden">
                    {property.images && property.images.length > 0 && !imageErrors[property.id] ? (
                      <img 
                        src={property.images[0]} 
                        alt={getLocalizedTitle(property)}
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={() => handleImageError(property.id)}
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
                        <Building className="size-20 text-slate-400" />
                      </div>
                    )}
                    
                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                    
                    {/* Content Overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                      {/* Status Badge */}
                      <div className="mb-3">
                        <Badge className="rounded-full border-0 bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                          {getStatusText(property.status)}
                        </Badge>
                      </div>
                      
                      {/* Title */}
                      <h3 className="mb-2 line-clamp-2 text-xl font-bold">
                        {getLocalizedTitle(property)}
                      </h3>
                      
                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold">
                          {formatPrice(property.price)}
                          <span className="ml-2 text-lg font-normal">
                            {locale === 'ar' ? 'ريال' : 'SAR'}
                          </span>
                        </p>
                        
                        {/* Favorite Button */}
                        <Button 
                          variant="secondary" 
                          size="icon"
                          className="size-10 rounded-full bg-white/20 backdrop-blur-sm transition-all hover:scale-110 hover:bg-white/30"
                          onClick={(e) => toggleFavorite(property.id, e)}
                        >
                          <Heart 
                            className={`size-5 transition-all ${
                              favorites.includes(property.id) 
                                ? 'scale-110 fill-red-500 text-red-500' 
                                : 'text-white'
                            }`} 
                          />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* View All Button */}
            <div className="mt-12 text-center">
              <Button 
                variant="outline" 
                size="lg" 
                className="rounded-xl border-2 px-8 py-6 text-base font-semibold hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600"
                asChild
              >
                <Link href={`/${locale}/p`} className={isRTL ? 'flex-row-reverse' : ''}>
                  {locale === 'ar' ? 'عرض كل العقارات' : 'View All Properties'}
                  <span className={`ml-2 rounded bg-slate-100 px-2 py-1 text-sm ${isRTL ? 'ml-0 mr-2' : ''}`}>
                    {properties.length}
                  </span>
                </Link>
              </Button>
            </div>
          </>
        ) : (
          // Empty State
          <div className="mx-auto max-w-md text-center">
            <Building className="mx-auto mb-4 size-16 text-slate-400" />
            <h3 className="mb-2 text-xl font-semibold text-slate-900">
              {locale === 'ar' ? 'لا توجد عقارات' : 'No Properties'}
            </h3>
            <p className="mb-6 text-slate-600">
              {locale === 'ar' ? 'تفقد لاحقاً' : 'Check back later'}
            </p>
            <Button className="rounded-xl px-8 py-6">
              {locale === 'ar' ? 'استكشاف العقارات' : 'Explore Properties'}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}