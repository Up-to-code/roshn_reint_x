"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { deleteProperty } from '@/app/actions/properties';
import { Property } from '@prisma/client';
import { useTranslations, useFormatter } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 12;

interface SerializedProperty extends Omit<Property, 'createdAt' | 'updatedAt'> {
  createdAt: string;
  updatedAt: string;
}

interface PropertiesClientProps {
  initialProperties: SerializedProperty[];
  locale: string;
}

export default function PropertiesClient({ initialProperties, locale }: PropertiesClientProps) {
  const t = useTranslations('properties');
  const commonT = useTranslations('common');
  const format = useFormatter();
  const router = useRouter();
  const isRTL = locale === 'ar';

  const [search, setSearch] = useState('');
  const [properties, setProperties] = useState<SerializedProperty[]>(initialProperties);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Update properties when initialProperties change (revalidation)
  useEffect(() => {
    setProperties(initialProperties);
  }, [initialProperties]);

  const handleDelete = async (id: string) => {
    if (!confirm(commonT('confirmDelete'))) return;
    
    setIsDeleting(id);
    try {
      const result = await deleteProperty(id);
      
      if (result.success) {
        toast.success(commonT('success'));
        // Optimistic update
        setProperties(prev => prev.filter(p => p.id !== id));
        router.refresh(); // Sync server state
      } else {
        if (result.error?.includes('not found') || result.error?.includes('404')) {
          setProperties(prev => prev.filter(p => p.id !== id));
          return;
        }
        console.error('Error deleting property:', result.error);
        toast.error(commonT('error'));
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error(commonT('error'));
    } finally {
      setIsDeleting(null);
    }
  };

  const getLocalizedTitle = (property: SerializedProperty) => {
    if (locale === 'ar') return property.titleAr;
    return property.titleEn || property.titleAr;
  };

  const getDisplayLocation = (property: SerializedProperty) => {
    const city = property.city || '';
    const district = property.district || '';
    
    if (city && district) return `${city}, ${district}`;
    if (city) return city;
    if (district) return district;
    return '';
  };

  // Filter properties based on search
  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const title = (locale === 'ar' ? p.titleAr : (p.titleEn || p.titleAr)).toLowerCase();
      const searchTerm = search.toLowerCase();
      const city = (p.city || '').toLowerCase();
      return title.includes(searchTerm) || city.includes(searchTerm);
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
                        {format.dateTime(new Date(property.createdAt), { dateStyle: 'medium' })}
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
                          disabled={isDeleting === property.id}
                        >
                          {isDeleting === property.id ? (
                            <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          ) : (
                            <Trash2 className="size-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className={`mb-2 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="font-bold text-primary">
                        {format.number(property.price || 0, { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 })}
                      </span>
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
                      {format.dateTime(new Date(property.updatedAt), { dateStyle: 'medium' })}
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
