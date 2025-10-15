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

interface RealEstateListingsProps {
  properties: Property[];
  locale: string;
}

export default function RealEstateListings({ properties, locale }: RealEstateListingsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({});
  const isRTL = locale === 'ar';

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US').format(price);
  };

  const getStatusText = (status: PropertyStatus) => {
    const statusMap = {
      [PropertyStatus.AVAILABLE]: locale === 'ar' ? 'متاح' : 'Available',
      [PropertyStatus.RENTED]: locale === 'ar' ? 'مؤجر' : 'Rented',
      [PropertyStatus.SOLD]: locale === 'ar' ? 'مباع' : 'Sold'
    };
    return statusMap[status] || status;
  };

  const getLocalizedTitle = (property: Property): string => {
    return locale === 'ar' ? property.titleAr : property.titleEn;
  };

  const safeProperties = properties || [];

  // Loading state
  if (isLoading) {
    return (
      <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-white">
        <div className="container mx-auto max-w-7xl px-4 py-12">
          {/* Header Skeleton */}
          <div className="mb-12 text-center">
            <Skeleton className="mx-auto mb-4 h-10 w-96" />
            <Skeleton className="mx-auto h-6 w-64" />
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="overflow-hidden border">
                <Skeleton className="h-96 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="mb-2 h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="my-40 min-h-screen bg-white py-12">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-3xl font-bold text-gray-900">
            {locale === 'ar' ? 'المشاريع المتاحة' : 'Available Projects'}
          </h1>
          <p className="text-gray-600">
            {safeProperties.length} {locale === 'ar' ? 'مشروع متاح' : 'projects available'}
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {safeProperties.map((property) => (
            <Link 
              href={`/${locale}/p/${property.id}`}
              key={property.id} 
              className="group block overflow-hidden border"
            >
              {/* Image Section - Very Vertical */}
              <div className="relative h-96 w-full overflow-hidden">
                {property.images && property.images.length > 0 && !imageErrors[property.id] ? (
                  <img 
                    src={property.images[0]} 
                    alt={getLocalizedTitle(property)}
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={() => handleImageError(property.id)}
                  />
                ) : (
                  <div className="flex size-full items-center justify-center bg-gray-100">
                    <Building className="size-16 text-gray-400" />
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute left-3 top-3">
                  <Badge className="border bg-white text-gray-700">
                    {getStatusText(property.status)}
                  </Badge>
                </div>
                
                {/* Favorite Button */}
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="absolute right-3 top-3 size-8 bg-white/80 hover:bg-white"
                  onClick={(e) => toggleFavorite(property.id, e)}
                >
                  <Heart 
                    className={`size-4 ${
                      favorites.includes(property.id) 
                        ? 'fill-red-500 text-red-500' 
                        : 'text-gray-600'
                    }`} 
                  />
                </Button>
              </div>

              {/* Content Section */}
              <CardContent className="p-4">
                {/* Title */}
                <h3 className="mb-2 line-clamp-2 text-lg font-medium text-gray-900">
                  {getLocalizedTitle(property)}
                </h3>

                {/* Price */}
                <p className="text-xl font-bold text-gray-900">
                  {formatPrice(property.price)}
                  <span className="ml-2 text-sm font-normal text-gray-600">
                    {locale === 'ar' ? 'ريال' : 'SAR'}
                  </span>
                </p>
              </CardContent>
            </Link>
          ))}
        </div>

        {/* Load More */}
        {safeProperties.length > 0 && (
          <div className="mt-12 flex justify-center">
            <Button 
              variant="outline" 
              className="px-8"
            >
              {locale === 'ar' ? 'عرض المزيد' : 'Load More'}
            </Button>
          </div>
        )}

        {/* Empty State */}
        {safeProperties.length === 0 && (
          <Card className="mx-auto max-w-md border py-16 text-center">
            <CardContent>
              <Building className="mx-auto mb-4 size-16 text-gray-400" />
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                {locale === 'ar' ? 'لا توجد مشاريع' : 'No projects'}
              </h3>
              <p className="mb-8 text-gray-600">
                {locale === 'ar' 
                  ? 'تفقد لاحقاً' 
                  : 'Check back later'
                }
              </p>
              <Button>
                {locale === 'ar' ? 'استكشاف' : 'Explore'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}