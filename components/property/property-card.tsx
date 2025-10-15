"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Property, PropertyStatus } from '@prisma/client';
import { PropertyUtils } from '@/lib/api/properties-service';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Bed, Bath, Square, Car } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  locale: string;
  isRTL?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export function PropertyCard({ 
  property, 
  locale, 
  isRTL = false, 
  onEdit, 
  onDelete, 
  showActions = false 
}: PropertyCardProps) {
  const getLocalizedTitle = (property: Property) => {
    return PropertyUtils.getLocalizedTitle(property, locale);
  };

  const getStatusText = (status: PropertyStatus) => {
    const statusMap = {
      AVAILABLE: 'Available',
      RENTED: 'Rented',
      SOLD: 'Sold'
    };
    return statusMap[status] || status;
  };

  const getTypeText = (type: string) => {
    const typeMap = {
      APARTMENT: 'Apartment',
      VILLA: 'Villa',
      OFFICE: 'Office',
      SHOP: 'Shop'
    };
    return typeMap[type as keyof typeof typeMap] || type;
  };

  const getStatusColor = (status: PropertyStatus) => {
    return PropertyUtils.getStatusColor(status);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-background-card overflow-hidden rounded-lg border border-border transition-shadow hover:shadow-lg">
      <div className="relative">
        <Image
          src={property.images[0] || '/api/placeholder/400/250'}
          alt={getLocalizedTitle(property)}
          width={400}
          height={250}
          className="aspect-video w-full object-cover"
        />
        <div className={`absolute right-3 top-3 rounded-full px-3 py-1 text-sm text-white ${getStatusColor(property.status)}`}>
          {getStatusText(property.status)}
        </div>
      </div>
      
      <div className="p-4">
        <div className={`mb-3 flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="bg-background-alt rounded px-2 py-1 text-sm capitalize">
            {getTypeText(property.type)}
          </span>
          {showActions && (
            <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(property.id)}
                  className="hover:text-primary-dark p-1 text-primary"
                >
                  ✏️
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(property.id)}
                  className="text-error p-1 hover:text-red-700"
                >
                  🗑️
                </Button>
              )}
            </div>
          )}
        </div>

        <h3 className={`text-text-primary mb-2 text-lg font-semibold ${isRTL ? 'text-right' : ''}`}>
          {getLocalizedTitle(property)}
        </h3>
        
        <div className={`text-text-secondary mb-3 flex items-center ${
          isRTL ? 'flex-row-reverse' : ''
        }`}>
          <MapPin className={`size-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          <span className="text-sm">{property.city}</span>
        </div>

        <div className={`mb-4 flex items-center justify-between ${
          isRTL ? 'flex-row-reverse' : ''
        }`}>
          <span className="text-text-primary text-xl font-bold">
            {formatPrice(property.price)}
          </span>
        </div>

        <div className={`text-text-secondary flex justify-between border-t border-border pt-3 text-sm ${
          isRTL ? 'flex-row-reverse' : ''
        }`}>
          <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Bed className="size-4" />
            <span>{property.bedrooms}</span>
          </div>
          <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Bath className="size-4" />
            <span>{property.bathrooms}</span>
          </div>
          <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Square className="size-4" />
            <span>{property.area}m²</span>
          </div>
          {property.parking > 0 && (
            <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Car className="size-4" />
              <span>{property.parking}</span>
            </div>
          )}
        </div>

        {!showActions && (
          <div className="mt-4">
            <Button asChild className="w-full">
              <Link href={`/${locale}/p/${property.id}`}>
                View Details
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
