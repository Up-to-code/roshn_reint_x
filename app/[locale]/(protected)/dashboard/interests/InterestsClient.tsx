"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Mail, Phone, User, Calendar, Building, Eye, EyeOff, Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter, usePathname } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { InterestsPagination } from './InterestsPagination';

interface Interest {
  id: string;
  name: string;
  email?: string;
  phone: string;
  message?: string;
  propertyTitle: string;
  propertyId?: string;
  property?: {
    id: string;
    titleEn: string;
    titleAr: string;
  };
  read: boolean;
  createdAt: string;
}

interface InterestsClientProps {
  interests: Interest[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  allCount: number;
  unreadCount: number;
  readCount: number;
  startIndex: number;
  endIndex: number;
  search: string;
  filterRead: 'all' | 'unread' | 'read';
  locale: string;
}

export default function InterestsClient({
  interests,
  currentPage,
  totalPages,
  totalCount,
  allCount,
  unreadCount,
  readCount,
  startIndex,
  endIndex,
  search: initialSearch,
  filterRead: initialFilterRead,
  locale,
}: InterestsClientProps) {
  const t = useTranslations('interests');
  const router = useRouter();
  const pathname = usePathname();
  const isRTL = locale === 'ar';
  const [search, setSearch] = useState(initialSearch);
  const [filterRead, setFilterRead] = useState<'all' | 'unread' | 'read'>(initialFilterRead);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const updateUrl = (newSearch: string, newFilter: 'all' | 'unread' | 'read', newPage: number = 1) => {
    const params = new URLSearchParams();
    if (newSearch) params.set('search', newSearch);
    if (newFilter !== 'all') params.set('filter', newFilter);
    if (newPage > 1) params.set('page', newPage.toString());
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    updateUrl(value, filterRead, 1);
  };

  const handleFilterChange = (filter: 'all' | 'unread' | 'read') => {
    setFilterRead(filter);
    updateUrl(search, filter, 1);
  };

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/interests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
      });
      if (res.ok) {
        toast.success(isRTL ? 'تم التحديث بنجاح' : 'Marked as read');
        router.refresh();
      }
    } catch (error) {
      console.error('Error marking as read:', error);
      toast.error(isRTL ? 'حدث خطأ' : 'An error occurred');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(isRTL ? 'هل أنت متأكد من حذف هذه الرسالة؟' : 'Are you sure you want to delete this message?')) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/interests/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success(isRTL ? 'تم الحذف بنجاح' : 'Deleted successfully');
        router.refresh();
      } else {
        toast.error(isRTL ? 'فشل الحذف' : 'Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting interest:', error);
      toast.error(isRTL ? 'حدث خطأ' : 'An error occurred');
    } finally {
      setDeletingId(null);
    }
  };


  return (
    <div className="min-h-screen bg-background p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className={`mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
          <div className={isRTL ? 'text-right' : ''}>
            <h1 className="text-2xl font-bold">{t('title')}</h1>
            <p className="text-muted-foreground mt-1">
              {totalCount} {isRTL ? 'رسالة' : 'messages'}
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount} {isRTL ? 'غير مقروء' : 'unread'}
                </Badge>
              )}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4 rounded-lg border bg-card p-4">
          {/* Search */}
          <div className="relative">
            <Search className={`absolute top-3 size-4 text-muted-foreground ${isRTL ? 'right-4' : 'left-4'}`} />
            <Input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className={isRTL ? 'pr-12' : 'pl-12'}
            />
          </div>

          {/* Filter buttons */}
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button
              variant={filterRead === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange('all')}
            >
              {t('filters.all')} ({allCount})
            </Button>
            <Button
              variant={filterRead === 'unread' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange('unread')}
            >
              {t('filters.unread')} ({unreadCount})
            </Button>
            <Button
              variant={filterRead === 'read' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange('read')}
            >
              {t('filters.read')} ({readCount})
            </Button>
          </div>
        </div>

        {/* Table */}
        {interests.length > 0 ? (
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={isRTL ? 'text-right' : ''}>{t('table.status')}</TableHead>
                  <TableHead className={isRTL ? 'text-right' : ''}>{t('table.name')}</TableHead>
                  <TableHead className={isRTL ? 'text-right' : ''}>{t('table.email')}</TableHead>
                  <TableHead className={isRTL ? 'text-right' : ''}>{t('table.phone')}</TableHead>
                  <TableHead className={isRTL ? 'text-right' : ''}>{t('table.property')}</TableHead>
                  <TableHead className={isRTL ? 'text-right' : ''}>{t('table.message')}</TableHead>
                  <TableHead className={isRTL ? 'text-right' : ''}>{t('table.date')}</TableHead>
                  <TableHead className={isRTL ? 'text-right' : ''}>{t('table.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {interests.map((interest) => (
                  <TableRow key={interest.id} className={!interest.read ? 'bg-muted/50' : ''}>
                    <TableCell>
                      {interest.read ? (
                        <Badge variant="secondary" className="gap-1">
                          <Eye className="size-3" />
                          {t('badges.read')}
                        </Badge>
                      ) : (
                        <Badge variant="default" className="gap-1">
                          <EyeOff className="size-3" />
                          {t('badges.unread')}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className={isRTL ? 'text-right' : ''}>
                      <div className="flex items-center gap-2">
                        <User className="size-4 text-muted-foreground" />
                        {interest.name}
                      </div>
                    </TableCell>
                    <TableCell className={isRTL ? 'text-right' : ''}>
                      {interest.email ? (
                        <div className="flex items-center gap-2">
                          <Mail className="size-4 text-muted-foreground" />
                          <a href={`mailto:${interest.email}`} className="text-primary hover:underline">
                            {interest.email}
                          </a>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className={isRTL ? 'text-right' : ''}>
                      <div className="flex items-center gap-2">
                        <Phone className="size-4 text-muted-foreground" />
                        <a href={`tel:${interest.phone}`} className="text-primary hover:underline">
                          {interest.phone}
                        </a>
                      </div>
                    </TableCell>
                    <TableCell className={isRTL ? 'text-right' : ''}>
                      {interest.propertyId ? (
                        <Link
                          href={`/${locale}/p/${interest.propertyId}`}
                          className="flex items-center gap-2 text-primary hover:underline"
                        >
                          <Building className="size-4" />
                          {locale === 'ar'
                            ? interest.property?.titleAr || interest.propertyTitle
                            : interest.property?.titleEn || interest.propertyTitle}
                        </Link>
                      ) : (
                        <span>{interest.propertyTitle}</span>
                      )}
                    </TableCell>
                    <TableCell className={isRTL ? 'text-right' : ''}>
                      {interest.message ? (
                        <p className="max-w-xs truncate text-sm">{interest.message}</p>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className={isRTL ? 'text-right' : ''}>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="size-4" />
                        {new Date(interest.createdAt).toLocaleDateString(locale, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        {!interest.read && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markAsRead(interest.id)}
                          >
                            {t('actions.markRead')}
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(interest.id)}
                          disabled={deletingId === interest.id}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          {deletingId === interest.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-muted-foreground text-lg">
              {t('empty.title')}
            </p>
          </div>
        )}

        {/* Pagination */}
        <InterestsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          search={search}
          filterRead={filterRead}
          isRTL={isRTL}
        />
      </div>
    </div>
  );
}

