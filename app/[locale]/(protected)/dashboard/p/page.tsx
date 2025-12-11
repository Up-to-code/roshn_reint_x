"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { PropertiesService } from '@/lib/api/properties-service';
import { Property } from '@prisma/client';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 12;

export default function PropertiesDashboard() {
  const t = useTranslations('properties');
  const commonT = useTranslations('common');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const [search, setSearch] = useState('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

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
      setProperties(prev => prev.filter(p => p.id !== id));
      // Optional: Show success toast instead of silent update
    } catch (error: any) {
      // If error is 404 or "Property not found", we should still remove it from UI
      if (error.message?.includes('not found') || error.message?.includes('404')) {
        setProperties(prev => prev.filter(p => p.id !== id));
        return;
      }
      
      console.error('Error deleting property:', error);
      alert(commonT('error'));
    }
  };

  const getLocalizedTitle = (property: Property) => {
    return locale === 'ar' ? property.titleAr : property.titleEn;
  };

  const getDisplayLocation = (property: Property) => {
    if (property.district) {
      return `${property.city}, ${property.district}`;
    }
    return property.city;
  };

  // Filter properties based on search
  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const title = (locale === 'ar' ? p.titleAr : p.titleEn).toLowerCase();
      const searchTerm = search.toLowerCase();
      return title.includes(searchTerm) || p.city.toLowerCase().includes(searchTerm);
    });
  }, [properties, search, locale]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProperties = filteredProperties.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="mx-auto max-w-7xl py-12 text-center">
          <div className="text-muted-foreground text-lg">{commonT('loading')}</div>
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
            <h1 className="text-2xl font-bold">{t('title')}</h1>
            <p className="text-muted-foreground mt-1">
              {t('subtitle')} ({filteredProperties.length} {isRTL ? 'عقار' : 'properties'})
            </p>
          </div>
          <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Link href={`/${locale}/dashboard/p/create`}>
              <Button>
                <Plus className="size-4" />
                {t('actions.add')}
              </Button>
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 rounded-lg border bg-card p-4">
          <div className="relative">
            <Search className={`absolute top-3 size-4 text-muted-foreground ${isRTL ? 'right-4' : 'left-4'}`} />
            <Input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={isRTL ? 'pr-12' : 'pl-12'}
            />
          </div>
        </div>

        {/* Properties Grid */}
        {paginatedProperties.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {paginatedProperties.map((property) => (
                <div key={property.id} className="group overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg">
                  <div className="relative aspect-video w-full overflow-hidden">
                    {property.images?.[0] ? (
                      <Image
                        src={property.images[0]}
                        alt={getLocalizedTitle(property)}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-muted">
                        <span className="text-muted-foreground">{isRTL ? 'لا توجد صورة' : 'No Image'}</span>
                      </div>
                    )}
                    <div className="absolute right-3 top-3 rounded-full bg-primary/90 px-3 py-1 text-xs text-primary-foreground">
                      {property.images?.length || 0} {isRTL ? 'صورة' : 'images'}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className={`mb-3 flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
                        {new Date(property.createdAt).toLocaleDateString(locale)}
                      </span>
                      <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Link href={`/${locale}/dashboard/p/edit/${property.id}`}>
                          <Button variant="ghost" size="icon" className="size-8">
                            <Edit className="size-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="size-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(property.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>

                    <h3 className={`mb-2 line-clamp-2 text-lg font-semibold ${isRTL ? 'text-right' : ''}`}>
                      {getLocalizedTitle(property)}
                    </h3>
                    
                    <div className={`mb-3 flex items-center text-sm text-muted-foreground ${
                      isRTL ? 'flex-row-reverse' : ''
                    }`}>
                      <span className={isRTL ? 'ml-2' : 'mr-2'}>📍</span>
                      <span>{getDisplayLocation(property)}</span>
                    </div>

                    {(property.descriptionEn || property.descriptionAr) && (
                      <p className={`mb-3 line-clamp-2 text-sm text-muted-foreground ${isRTL ? 'text-right' : ''}`}>
                        {locale === 'ar' ? property.descriptionAr : property.descriptionEn}
                      </p>
                    )}

                    <div className={`border-t pt-3 text-xs text-muted-foreground ${
                      isRTL ? 'text-right' : ''
                    }`}>
                      {isRTL ? 'آخر تحديث:' : 'Last updated:'}{' '}
                      {new Date(property.updatedAt).toLocaleDateString(locale)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={`mt-8 flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="size-4" />
                  {isRTL ? 'السابق' : 'Previous'}
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="min-w-[40px]"
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  {isRTL ? 'التالي' : 'Next'}
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="py-12 text-center">
            <p className="text-lg text-muted-foreground">
              {properties.length === 0 ? t('createFirst') : t('noProperties')}
            </p>
            {properties.length === 0 && (
              <Link href={`/${locale}/dashboard/p/create`} className="mt-4 inline-block">
                <Button>
                  <Plus className="size-4" />
                  {t('actions.add')}
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
