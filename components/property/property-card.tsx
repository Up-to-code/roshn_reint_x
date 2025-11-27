"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Minimal property type as a model, without enums/types from @prisma/client
interface PropertyCardProps {
  property: {
    id: string;
    titleEn: string;
    titleAr: string;
    descriptionEn: string;
    descriptionAr: string;
    city: string;
    district?: string;
    images: string[];
    createdAt: Date;
    updatedAt: Date;
    status?: string;
    type?: string;
    price?: number;
    bedrooms?: number;
    bathrooms?: number;
    area?: number;
    parking?: number;
  };
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
  // Get localized title for display
  const getLocalizedTitle = (property: PropertyCardProps['property']) => {
    return locale === "ar" ? property.titleAr : property.titleEn;
  };

  // Status (simple, string-based instead of enum/typed)
  const getStatusText = (status?: string) => {
    const statusMap: { [key: string]: string } = {
      AVAILABLE: 'Available',
      RENTED: 'Rented',
      SOLD: 'Sold'
    };
    return status && statusMap[status] ? statusMap[status] : (status || "");
  };

  const getTypeText = (type?: string) => {
    const typeMap: { [key: string]: string } = {
      APARTMENT: 'Apartment',
      VILLA: 'Villa',
      OFFICE: 'Office',
      SHOP: 'Shop'
    };
    return type && typeMap[type] ? typeMap[type] : (type || "");
  };

  // Basic color tag for status
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-600";
      case "RENTED":
        return "bg-yellow-500";
      case "SOLD":
        return "bg-red-600";
      default:
        return "bg-gray-400";
    }
  };

  const formatPrice = (price?: number) => {
    if (typeof price !== 'number') return '';
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
                <button
                  type="button"
                  onClick={() => onEdit(property.id)}
                  className="hover:text-primary-dark p-1 text-primary bg-transparent border-none cursor-pointer"
                >
                  ✏️
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(property.id)}
                  className="text-error p-1 hover:text-red-700 bg-transparent border-none cursor-pointer"
                >
                  🗑️
                </button>
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
          {/* MapPin icon replacement, as simple SVG */}
          <svg className={`size-4 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21C12 21 4 13.91 4 8.5C4 5.42 6.42 3 9.5 3C11.11 3 12.55 3.84 13.35 5.04C14.15 3.84 15.59 3 17.2 3C20.28 3 22.7 5.42 22.7 8.5C22.7 13.91 15.7 21 15.7 21H12Z" /></svg>
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
            {/* Bed icon replacement */}
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="14" width="20" height="6" rx="2" /><path d="M2 14v-4a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v4"/></svg>
            <span>{property.bedrooms}</span>
          </div>
          <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Bath icon replacement */}
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 21h6M8 17l1.59-1.59A2 2 0 0 1 11.17 15h1.66a2 2 0 0 1 1.58.41L16 17"/><path d="M12 4a4 4 0 0 1 4 4v9H8V8a4 4 0 0 1 4-4z"/></svg>
            <span>{property.bathrooms}</span>
          </div>
          <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Square icon replacement */}
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" /></svg>
            <span>{property.area}m²</span>
          </div>
          {property.parking && property.parking > 0 && (
            <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {/* Car icon replacement */}
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="13" width="18" height="4" rx="1"/><path d="M5 13V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v6" /><circle cx="7.5" cy="17" r="1.5"/><circle cx="16.5" cy="17" r="1.5"/></svg>
              <span>{property.parking}</span>
            </div>
          )}
        </div>

        {!showActions && (
          <div className="mt-4">
            <a className="w-full flex justify-center items-center bg-primary text-white rounded px-4 py-2" href={`/${locale}/p/${property.id}`}>View Details</a>
          </div>
        )}
      </div>
    </div>
  );
}
