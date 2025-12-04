"use client";

import { useState, useEffect, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Mail, Phone, User, Calendar, Building, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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

const ITEMS_PER_PAGE = 20;

export default function InterestsPage() {
  const t = useTranslations('interests');
  const commonT = useTranslations('common');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const [interests, setInterests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterRead, setFilterRead] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    loadInterests();
  }, []);

  const loadInterests = async () => {
    try {
      const res = await fetch('/api/interests');
      if (!res.ok) throw new Error('Failed to load interests');
      const data = await res.json();
      setInterests(data);
    } catch (error) {
      console.error('Error loading interests:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/interests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
      });
      if (res.ok) {
        setInterests(interests.map(i => i.id === id ? { ...i, read: true } : i));
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const filteredInterests = useMemo(() => {
    let filtered = interests;

    // Filter by read status
    if (filterRead === 'unread') {
      filtered = filtered.filter(i => !i.read);
    } else if (filterRead === 'read') {
      filtered = filtered.filter(i => i.read);
    }

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(i =>
        i.name.toLowerCase().includes(searchLower) ||
        i.email?.toLowerCase().includes(searchLower) ||
        i.phone.includes(search) ||
        i.propertyTitle.toLowerCase().includes(searchLower) ||
        i.message?.toLowerCase().includes(searchLower)
      );
    }

    return filtered.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [interests, search, filterRead]);

  const totalPages = Math.ceil(filteredInterests.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedInterests = filteredInterests.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const unreadCount = interests.filter(i => !i.read).length;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">{commonT('loading')}</div>
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
              {filteredInterests.length} {isRTL ? 'رسالة' : 'messages'}
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
              onChange={(e) => setSearch(e.target.value)}
              className={isRTL ? 'pr-12' : 'pl-12'}
            />
          </div>

          {/* Filter buttons */}
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button
              variant={filterRead === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterRead('all')}
            >
              {t('filters.all')} ({interests.length})
            </Button>
            <Button
              variant={filterRead === 'unread' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterRead('unread')}
            >
              {t('filters.unread')} ({unreadCount})
            </Button>
            <Button
              variant={filterRead === 'read' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterRead('read')}
            >
              {t('filters.read')} ({interests.length - unreadCount})
            </Button>
          </div>
        </div>

        {/* Table */}
        {paginatedInterests.length > 0 ? (
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
                {paginatedInterests.map((interest) => (
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
        {totalPages > 1 && (
          <div className={`mt-6 flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              {isRTL ? 'السابق' : 'Previous'}
            </Button>
            <span className="text-sm text-muted-foreground">
              {isRTL ? 'صفحة' : 'Page'} {currentPage} {isRTL ? 'من' : 'of'} {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              {isRTL ? 'التالي' : 'Next'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
