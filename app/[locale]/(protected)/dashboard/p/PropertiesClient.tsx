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

// Smart prose class generator for rich text formatting
const getProseClasses = (isRTL: boolean) => {
  const base = "prose prose-sm max-w-none text-slate-600";
  const direction = isRTL 
    ? "text-right prose-headings:text-right prose-ul:text-right prose-ol:text-right prose-blockquote:text-right"
    : "text-left prose-headings:text-left prose-ul:text-left prose-ol:text-left prose-blockquote:text-left";
  
  return `${base} ${direction} 
    [&>*:first-child]:mt-0 [&>*:last-child]:mb-0
    prose-p:text-sm prose-p:leading-snug prose-p:my-1
    prose-headings:text-sm prose-headings:font-semibold prose-headings:text-slate-800 prose-headings:my-1 prose-headings:leading-tight
    prose-strong:text-slate-900 prose-strong:font-semibold prose-em:text-slate-700 prose-em:italic
    prose-ul:text-sm prose-ul:my-1 prose-ul:list-disc prose-ul:pl-4 prose-ol:text-sm prose-ol:my-1 prose-ol:list-decimal prose-ol:pl-4
    prose-li:text-sm prose-li:my-0 prose-li:leading-snug
    prose-a:text-primary prose-a:underline prose-a:font-medium hover:prose-a:text-primary/80 transition-colors
    prose-blockquote:my-1 prose-blockquote:border-l-2 prose-blockquote:border-slate-300 prose-blockquote:pl-3 prose-blockquote:italic prose-blockquote:text-slate-600
    prose-code:text-sm prose-code:bg-slate-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
    prose-pre:my-1 prose-pre:text-xs prose-img:my-1 prose-img:rounded-md prose-hr:my-2 prose-hr:border-slate-300
    line-clamp-2 overflow-hidden`.replace(/\s+/g, ' ').trim();
};

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

                    {(property.descriptionEn || property.descriptionAr) && (() => {
                      const descriptionHtml = locale === 'ar'
                        ? property.descriptionAr || property.descriptionEn || ''
                        : property.descriptionEn || property.descriptionAr || '';
                      
                      if (!descriptionHtml) return null;

                      return (
                        <div 
                          className={`mb-3 ${getProseClasses(isRTL)}`}
                          dir={isRTL ? 'rtl' : 'ltr'}
                          dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                        />
                      );
                    })()}

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
