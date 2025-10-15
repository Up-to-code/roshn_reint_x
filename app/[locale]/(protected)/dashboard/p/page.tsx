// app/[locale]/properties/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { PropertiesService } from '@/lib/api/properties-service';
import { Property } from '@prisma/client';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
 

export default function PropertiesDashboard() {
  const t = useTranslations('properties');
  const commonT = useTranslations('common');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const [search, setSearch] = useState('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const data = await PropertiesService.getAll();
      setProperties(data);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(commonT('confirmDelete'))) return;
    
    try {
      await PropertiesService.delete(id);
      setProperties(properties.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting property:', error);
      alert(commonT('error'));
    }
  };

  const getLocalizedTitle = (property: Property) => {
    return locale === 'ar' ? property.titleAr : property.titleEn;
  };

  const filteredProperties = properties.filter(p => {
    const title = getLocalizedTitle(p).toLowerCase();
    const searchTerm = search.toLowerCase();
    return title.includes(searchTerm) || p.city.toLowerCase().includes(searchTerm);
  });

  const statusColors = {
    AVAILABLE: 'bg-green-500',
    RENTED: 'bg-blue-500', 
    SOLD: 'bg-gray-500'
  };

  const getStatusText = (status: string) => {
    return t(`status.${status.toLowerCase()}`);
  };

  const getTypeText = (type: string) => {
    return t(`types.${type.toLowerCase()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="mx-auto max-w-7xl py-12 text-center">
          <div className="text-text-secondary text-lg">{commonT('loading')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className={`mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
          <div className={isRTL ? 'text-right' : ''}>
            <h1 className="text-text-primary text-2xl font-bold">{t('title')}</h1>
            <p className="text-text-secondary mt-1">{t('subtitle')}</p>
          </div>
          <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Link 
              href={`/${locale}/dashboard/p/create`}
              className="hover:bg-primary-dark rounded-lg bg-primary px-4 py-2 text-white transition-colors"
            >
              + {t('actions.add')}
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="bg-background-card mb-6 rounded-lg border border-border p-4">
          <div className="relative">
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`text-text-primary w-full rounded-lg border border-border bg-background p-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary ${
                isRTL ? 'pr-12' : 'pl-12'
              }`}
            />
            <div className={`absolute top-3 ${isRTL ? 'right-4' : 'left-4'} text-text-muted`}>
              🔍
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProperties.map((property) => (
            <div key={property.id} className="bg-background-card overflow-hidden rounded-lg border border-border transition-shadow hover:shadow-lg">
              <div className="relative">
                <img
                  src={property.images[0] || '/api/placeholder/400/250'}
                  alt={getLocalizedTitle(property)}
                  className="h-48 w-full object-cover"
                />
                <div className={`absolute right-3 top-3 rounded-full px-3 py-1 text-sm text-white ${statusColors[property.status]}`}>
                  {getStatusText(property.status)}
                </div>
              </div>
              
              <div className="p-4">
                <div className={`mb-3 flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-text-secondary bg-background-alt rounded px-2 py-1 text-sm capitalize">
                    {getTypeText(property.type)}
                  </span>
                  <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Link 
                      href={`/${locale}/dashboard/p/edit/${property.id}`}
                      className="hover:text-primary-dark p-1 text-primary"
                    >
                      ✏️
                    </Link>
                    <button 
                      onClick={() => handleDelete(property.id)}
                      className="text-error p-1 hover:text-red-700"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <h3 className={`text-text-primary mb-2 text-lg font-semibold ${isRTL ? 'text-right' : ''}`}>
                  {getLocalizedTitle(property)}
                </h3>
                
                <div className={`text-text-secondary mb-3 flex items-center ${
                  isRTL ? 'flex-row-reverse' : ''
                }`}>
                  <span className={`${isRTL ? 'ml-2' : 'mr-2'}`}>📍</span>
                  <span className="text-sm">{property.city}</span>
                </div>

                <div className={`mb-4 flex items-center justify-between ${
                  isRTL ? 'flex-row-reverse' : ''
                }`}>
                  <span className="text-text-primary text-xl font-bold">
                    ${property.price.toLocaleString()}
                  </span>
                </div>

                <div className={`text-text-secondary flex justify-between border-t border-border pt-3 text-sm ${
                  isRTL ? 'flex-row-reverse' : ''
                }`}>
                  <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span>🛏️</span>
                    <span>{property.bedrooms}</span>
                  </div>
                  <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span>🚿</span>
                    <span>{property.bathrooms}</span>
                  </div>
                  <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span>📐</span>
                    <span>{property.area}m²</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-text-secondary text-lg">
              {properties.length === 0 ? t('createFirst') : t('noProperties')}
            </p>
            {properties.length === 0 && (
              <Link 
                href={`/${locale}/dashboard/p/create`}
                className="hover:bg-primary-dark mt-4 inline-block rounded-lg bg-primary px-6 py-2 text-white transition-colors"
              >
                + {t('actions.add')}
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}