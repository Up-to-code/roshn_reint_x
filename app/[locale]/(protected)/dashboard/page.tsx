'use client'

import { useState, useEffect } from 'react'
import { StatsCard } from './components/dashboard/stats-card'
import { DataTable } from './components/dashboard/data-table'
import { useParams, useRouter } from 'next/navigation'

interface DashboardData {
  users: any[]
  properties: any[]
  posts: any[]
  contacts: any[]
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const params = useParams()
  const router = useRouter()
  
  // Get locale from params
  const locale = params.locale as string
  
  // Check if it's Arabic
  const isArabic = locale === 'ar'

  // Translation function based on locale
  const t = (key: string): string => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        // Dashboard
        'dashboard.title': 'Dashboard',
        'dashboard.users': 'Users',
        'dashboard.properties': 'Properties',
        'dashboard.posts': 'Posts',
        'dashboard.contacts': 'Contacts',
        'dashboard.totalUsers': 'Total Users',
        'dashboard.registeredUsers': 'Registered users in system',
        'dashboard.listedProperties': 'Listed properties',
        'dashboard.publishedArticles': 'Published articles',
        'dashboard.customerInquiries': 'Customer inquiries',
        'dashboard.loading': 'Loading...',
        'dashboard.error': 'Error:',
        'dashboard.noData': 'No data found'
      },
      ar: {
        // Dashboard
        'dashboard.title': 'لوحة التحكم',
        'dashboard.users': 'المستخدمين',
        'dashboard.properties': 'العقارات',
        'dashboard.posts': 'المقالات',
        'dashboard.contacts': 'جهات الاتصال',
        'dashboard.totalUsers': 'إجمالي المستخدمين',
        'dashboard.registeredUsers': 'المستخدمين المسجلين في النظام',
        'dashboard.listedProperties': 'العقارات المدرجة',
        'dashboard.publishedArticles': 'المقالات المنشورة',
        'dashboard.customerInquiries': 'استفسارات العملاء',
        'dashboard.loading': 'جاري التحميل...',
        'dashboard.error': 'خطأ:',
        'dashboard.noData': 'لا توجد بيانات'
      }
    }
    
    return translations[locale]?.[key] || key
  }

  const switchLocale = (newLocale: string) => {
    // Update the URL with the new locale
    const newPath = `/${newLocale}/dashboard`
    router.push(newPath)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data')
        if (!response.ok) throw new Error('Failed to fetch data')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div className="flex justify-center p-8">{t('dashboard.loading')}</div>
  if (error) return <div className="flex justify-center p-8 text-red-500">{t('dashboard.error')} {error}</div>
  if (!data) return <div className="flex justify-center p-8">{t('dashboard.noData')}</div>

  return (
    <div 
      className="container mx-auto space-y-8 p-6" 
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className={`flex items-center justify-between ${isArabic ? 'flex-row-reverse' : ''}`}>
        <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
        <div className="flex space-x-2 rtl:space-x-reverse">
          <button 
            onClick={() => switchLocale('en')}
            className={`rounded px-4 py-2 ${
              locale === 'en' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            EN
          </button>
          <button 
            onClick={() => switchLocale('ar')}
            className={`rounded px-4 py-2 ${
              locale === 'ar' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            AR
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title={t('dashboard.totalUsers')}
          value={data.users.length}
          description={t('dashboard.registeredUsers')}
        />
        <StatsCard
          title={t('dashboard.properties')}
          value={data.properties.length}
          description={t('dashboard.listedProperties')}
        />
        <StatsCard
          title={t('dashboard.posts')}
          value={data.posts.length}
          description={t('dashboard.publishedArticles')}
        />
        <StatsCard
          title={t('dashboard.contacts')}
          value={data.contacts.length}
          description={t('dashboard.customerInquiries')}
        />
      </div>

      {/* Data Tables */}
      <div className="space-y-8">
        {/* Users Table */}
        <DataTable
          data={data.users}
          columns={['id', 'name', 'email', 'role', 'createdAt']}
          title={t('dashboard.users')}
        />

        {/* Properties Table */}
        <DataTable
          data={data.properties}
          columns={['id', 'titleEn', 'price', 'type', 'status', 'city', 'bedrooms']}
          title={t('dashboard.properties')}
        />

        {/* Posts Table */}
        <DataTable
          data={data.posts}
          columns={['id', 'title', 'status', 'createdAt']}
          title={t('dashboard.posts')}
        />

        {/* Contacts Table */}
        <DataTable
          data={data.contacts}
          columns={['id', 'name', 'phoneNumber', 'createdAt']}
          title={t('dashboard.contacts')}
        />
      </div>
    </div>
  )
}