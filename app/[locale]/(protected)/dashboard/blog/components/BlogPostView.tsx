"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BlogPost } from "@/types/editor";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, User, Clock, Share2 } from "lucide-react";
import { formatDate, cn, calculateReadingTime } from "@/lib/utils";
import { useCurrentLocale } from "@/lib/i18n-client";
import { Locale } from "@/lib/i18n";

interface SimpleBlogPostViewProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
  locale: Locale;
}

export function SimpleBlogPostView({ post, relatedPosts, locale }: SimpleBlogPostViewProps) {
  const router = useRouter();
  const currentLocale = useCurrentLocale();
  const isRTL = locale === 'ar';
  const readingTime = calculateReadingTime(post.content, locale);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Navigation */}
  
      {/* Article */}
      <article className="my-10 py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className={cn(
            "mb-8 flex items-center gap-2 text-sm text-muted-foreground",
            isRTL ? "flex-row-reverse" : "flex-row"
          )}>
            <Link 
              href={`/${locale}`} 
              className="transition-colors hover:text-foreground"
            >
              {isRTL ? 'الرئيسية' : 'Home'}
            </Link>
            <span>/</span>
            <Link 
              href={`/${locale}/blog`} 
              className="transition-colors hover:text-foreground"
            >
              {isRTL ? 'المدونة' : 'Blog'}
            </Link>
            <span>/</span>
            <span className="max-w-xs truncate font-medium text-foreground">
              {post.title}
            </span>
          </div>

          {/* Article Header */}
          <header className="mb-8 space-y-6">
            <Badge variant="secondary" className="text-sm">
              {isRTL ? 'منشور' : 'Published'}
            </Badge>
            
            <h1 className="text-3xl font-bold leading-tight text-foreground md:text-4xl">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-lg leading-relaxed text-muted-foreground">
                {post.excerpt}
              </p>
            )}

            <div className={cn(
              "flex flex-wrap items-center gap-4 text-sm text-muted-foreground",
              isRTL ? "flex-row-reverse" : "flex-row"
            )}>
              <div className="flex items-center gap-2">
                <User className="size-4" />
                <span>Admin</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="size-4" />
                <span>{formatDate(new Date(post.createdAt), locale)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="size-4" />
                <span>{readingTime} {isRTL ? 'دقيقة' : 'min'}</span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {post.headerImage && (
            <div className="relative mb-8 h-64 overflow-hidden rounded-xl md:h-80">
              <Image
                src={post.headerImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Article Content */}
          <div 
            className={cn(
              "prose prose-lg max-w-none dark:prose-invert",
              "prose-headings:font-bold prose-headings:text-foreground",
              "prose-p:leading-relaxed prose-p:text-foreground/90",
              "prose-a:text-blue-600 hover:prose-a:underline",
              "prose-img:rounded-lg prose-img:shadow-sm",
              "prose-blockquote:border-l-blue-600 prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-slate-800",
              isRTL && "prose-headings:text-right prose-p:text-right prose-blockquote:border-l-0 prose-blockquote:border-r-blue-600"
            )}
            style={{
              direction: isRTL ? 'rtl' : 'ltr'
            }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          <div className={cn(
            "mt-12 flex flex-wrap gap-2 border-t border-slate-200 pt-8 dark:border-slate-700",
            isRTL ? "flex-row-reverse" : "flex-row"
          )}>
            <Badge variant="secondary" className="text-sm">
              {isRTL ? 'عقارات' : 'Real Estate'}
            </Badge>
            <Badge variant="secondary" className="text-sm">
              {isRTL ? 'السعودية' : 'Saudi Arabia'}
            </Badge>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-slate-200 bg-slate-50 py-12 dark:border-slate-700 dark:bg-slate-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className={cn(
              "mb-8",
              isRTL ? "text-right" : "text-left"
            )}>
              <h2 className="mb-2 text-2xl font-bold text-foreground">
                {isRTL ? 'مقالات ذات صلة' : 'Related Articles'}
              </h2>
              <p className="text-muted-foreground">
                {isRTL 
                  ? 'قد يعجبك أيضاً هذه المقالات'
                  : 'You might also like these articles'
                }
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/${locale}/blog/${relatedPost.id}`}>
                  <Card className="group flex h-full flex-col overflow-hidden border-0 bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:bg-slate-900">
                    {relatedPost.thumbnail && (
                      <div className="relative h-40 overflow-hidden">
                        <Image
                          src={relatedPost.thumbnail}
                          alt={relatedPost.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <CardHeader className="p-4 pb-0">
                      <CardTitle className="line-clamp-2 text-base font-semibold transition-colors group-hover:text-blue-600">
                        {relatedPost.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <CardDescription className="line-clamp-2 text-sm">
                        {relatedPost.excerpt}
                      </CardDescription>
                      <div className={cn(
                        "mt-2 flex items-center gap-2 text-xs text-muted-foreground",
                        isRTL ? "flex-row-reverse" : "flex-row"
                      )}>
                        <Calendar className="size-3" />
                        <span>{formatDate(new Date(relatedPost.createdAt), locale)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}