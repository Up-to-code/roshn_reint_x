import { Metadata } from 'next'
import { getTranslations } from '@/lib/i18n-server'
import { publishingModule } from '@/lib/publishing/publishing-module'
import { Suspense } from 'react'
import { Locale } from '@/lib/i18n'
import { SimpleBlogGrid } from '../../(protected)/dashboard/blog/components/BlogGrid'
 
interface PageProps {
  params: { locale: Locale }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = params
  const t = await getTranslations(locale)
  
  return {
    title: locale === 'ar' ? 'المدونة - أحدث مقالات العقارات' : 'Blog - Latest Real Estate Articles',
    description: locale === 'ar' 
      ? 'استكشف أحدث المقالات والأخبار حول العقارات في السعودية. نصائح واستشارات من خبراء العقارات.'
      : 'Explore the latest articles and news about real estate in Saudi Arabia. Tips and advice from real estate experts.',
    openGraph: {
      title: locale === 'ar' ? 'المدونة - مدونة ديل آب' : 'Blog - Deal App',
      description: locale === 'ar' 
        ? 'أحدث المقالات والأخبار حول العقارات في السعودية'
        : 'Latest articles and news about real estate in Saudi Arabia',
    },
  }
}

async function BlogContent({ locale }: { locale: Locale }) {
  const posts = await publishingModule.listPublic(12)
  return <SimpleBlogGrid posts={posts} locale={locale} />
}

export default async function BlogPage({ params }: PageProps) {
  const { locale } = params

  return (
    <Suspense fallback={<BlogGridSkeleton />}>
      <BlogContent locale={locale} />
    </Suspense>
  )
}

function BlogGridSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-8">
          {/* Header Skeleton */}
          <div className="space-y-4 text-center">
            <div className="mx-auto h-6 w-48 rounded bg-slate-200 dark:bg-slate-700"></div>
            <div className="mx-auto h-10 w-64 rounded bg-slate-200 dark:bg-slate-700"></div>
          </div>
          
          {/* Posts Grid Skeleton */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <div className="h-48 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
                <div className="space-y-2">
                  <div className="h-4 rounded bg-slate-200 dark:bg-slate-700"></div>
                  <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
