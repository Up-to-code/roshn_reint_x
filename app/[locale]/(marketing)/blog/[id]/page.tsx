import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { publishingModule } from '@/lib/publishing/publishing-module'
import { Suspense } from 'react'
import { Locale } from '@/lib/i18n'
import { SimpleBlogPostView } from '@/app/[locale]/(protected)/dashboard/blog/components/BlogPostView'
 
interface PageProps {
  params: { locale: Locale; id: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, id } = params
  
  const post = await publishingModule.getPublic(id)

  if (!post) {
    return {
      title: locale === 'ar' ? 'المقال غير موجود' : 'Article Not Found',
      description: locale === 'ar' 
        ? 'المقال المطلوب غير موجود أو قد تم حذفه'
        : 'The requested article was not found or has been deleted',
    }
  }

  const useExcerptAsTitle = !post.title || post.title === 'Untitled';
  const displayTitle = useExcerptAsTitle ? (post.excerpt || '') : post.title;
  const description = useExcerptAsTitle ? post.content.slice(0, 160) : (post.excerpt || post.content.slice(0, 160));

  return {
    title: displayTitle,
    description,
    openGraph: {
      title: displayTitle,
      description,
      images: post.headerImage ? [post.headerImage] : [],
      type: 'article',
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: ['Deal App'],
    },
    twitter: {
      card: 'summary_large_image',
      title: displayTitle,
      description,
      images: post.headerImage ? [post.headerImage] : [],
    },
    alternates: {
      canonical: `https://dealapp.sa/${locale}/blog/${id}`,
    },
  }
}

export async function generateStaticParams() {
  const posts = await publishingModule.publicIds()

  return posts.flatMap(post => 
    ['ar', 'en'].map(locale => ({
      locale,
      id: post.id
    }))
  )
}

async function BlogPostContent({ locale, id }: { locale: Locale; id: string }) {
  const post = await publishingModule.getPublic(id)

  if (!post) {
    notFound()
  }

  const relatedPosts = await publishingModule.relatedPublic(post.id, 3)
  return <SimpleBlogPostView post={post} relatedPosts={relatedPosts} locale={locale} />
}

export default async function BlogPostPage({ params }: PageProps) {
  const { locale, id } = params

  return (
    <Suspense fallback={<BlogPostSkeleton />}>
      <BlogPostContent locale={locale} id={id} />
    </Suspense>
  )
}

function BlogPostSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-8">
   
          {/* Image Skeleton */}
          <div className="h-64 rounded-xl bg-slate-200 dark:bg-slate-700"></div>
          
          {/* Content Skeleton */}
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700"></div>
                <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-700"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
