"use client";

import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/types/editor";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { formatDate, cn, calculateReadingTime } from "@/lib/utils";
import { Locale } from "@/lib/i18n";

interface SimpleBlogGridProps {
  posts: BlogPost[];
  locale: Locale;
}

export function SimpleBlogGrid({ posts, locale }: SimpleBlogGridProps) {
  const isRTL = locale === 'ar';
  const featuredPost = posts[0];
  const regularPosts = posts.slice(1);

  const BlogPostCard = ({ post, featured = false }: { post: BlogPost; featured?: boolean }) => (
    <Link href={`/${locale}/blog/${post.id}`}>
      <Card className={cn(
        "group flex h-full flex-col overflow-hidden border-0 bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:bg-slate-800",
        "transform-gpu hover:scale-105",
        featured && "md:col-span-2"
      )}>
        <div className="relative">
          {post.thumbnail && (
            <div className={cn(
              "overflow-hidden",
              featured ? "h-64 md:h-80" : "h-48"
            )}>
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          )}
          <div className="absolute left-3 top-3">
            <Badge className="bg-white/90 text-slate-700 backdrop-blur-sm dark:bg-slate-900/90 dark:text-slate-300">
              {featured ? (locale === 'ar' ? 'مميز' : 'Featured') : ''}
            </Badge>
          </div>
        </div>
        
        <CardHeader className="p-4 pb-0">
          <CardTitle className={cn(
            "line-clamp-2 font-semibold transition-colors group-hover:text-blue-600",
            featured ? "text-lg md:text-xl" : "text-base"
          )}>
            {post.title}
          </CardTitle>
          {post.excerpt && (
            <CardDescription className="mt-2 line-clamp-2 text-sm">
              {post.excerpt}
            </CardDescription>
          )}
        </CardHeader>
        
        <CardFooter className="mt-auto p-4 pt-2">
          <div className={cn(
            "flex w-full items-center gap-3 text-xs text-muted-foreground",
            isRTL ? "flex-row-reverse" : "flex-row"
          )}>
            <div className="flex items-center gap-1">
              <Calendar className="size-3" />
              <span>{formatDate(new Date(post.createdAt), locale)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="size-3" />
              <span>{calculateReadingTime(post.content, locale)} {locale === 'ar' ? 'دقيقة' : 'min'}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );

  return (
    <div className="my-10 min-h-screen bg-white dark:bg-slate-900">
      {/* Header */}
      <section className="bg-slate-50 py-12 dark:bg-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-4 text-center">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
              {locale === 'ar' ? 'المدونة' : 'Blog'}
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              {locale === 'ar' 
                ? 'اكتشف أحدث المقالات والأخبار حول العقارات في السعودية'
                : 'Discover the latest articles and news about real estate in Saudi Arabia'
              }
            </p>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mx-auto max-w-md space-y-4">
                <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                  <Calendar className="size-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {locale === 'ar' ? 'لا توجد مقالات بعد' : 'No posts yet'}
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {locale === 'ar' 
                    ? 'تفقد لاحقاً للمزيد من المقالات'
                    : 'Check back later for more articles'
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Featured Post */}
              {featuredPost && (
                <div>
                  <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
                    {locale === 'ar' ? 'المقال المميز' : 'Featured Article'}
                  </h2>
                  <BlogPostCard post={featuredPost} featured={true} />
                </div>
              )}

              {/* Recent Posts */}
              {regularPosts.length > 0 && (
                <div>
                  <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
                    {locale === 'ar' ? 'المقالات الأخيرة' : 'Recent Articles'}
                  </h2>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {regularPosts.map((post) => (
                      <BlogPostCard key={post.id} post={post} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}