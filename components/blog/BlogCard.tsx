"use client";

import Link from "next/link";
import Image from "next/image";

interface BlogCardProps {
  post: {
    id: number;
    title: { en: string; ar: string };
    excerpt: { en: string; ar: string };
    category: { en: string; ar: string };
    date: string;
    image: string;
  };
  locale: string;
}

export default function BlogCard({ post, locale }: BlogCardProps) {
  const isRTL = locale === "ar";
  const title = post.title[locale as "en" | "ar"];
  const excerpt = post.excerpt[locale as "en" | "ar"];
  const category = post.category[locale as "en" | "ar"];

  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:border-gray-200 hover:shadow-xl">
      <Link 
        href={`/${locale}/blog/${post.id}`}
        className="focus:ring-primary-500 block rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2"
        aria-label={`Read more about ${title}`}
      >
        <div className="relative overflow-hidden">
          <Image
            src={post.image}
            alt={title}
            width={400}
            height={240}
            className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
        
        <div className="p-6">
          <div className="mb-3 flex items-center justify-between">
            <time 
              dateTime={post.date}
              className="text-sm font-medium text-gray-500"
            >
              {new Date(post.date).toLocaleDateString(locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            <span 
              className={`bg-primary-50 text-primary-700 border-primary-200 inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                isRTL ? 'ml-2' : 'mr-2'
              }`}
            >
              {category}
            </span>
          </div>
          
          <h2 className="group-hover:text-primary-600 mb-3 line-clamp-2 text-xl font-bold text-gray-900 transition-colors duration-200">
            {title}
          </h2>
          
          <p className="line-clamp-3 leading-relaxed text-gray-600">
            {excerpt}
          </p>
          
          <div className="text-primary-600 mt-4 flex items-center text-sm font-semibold transition-transform duration-200 group-hover:translate-x-2">
            {isRTL ? (
              <>
                <span>اقرأ المزيد</span>
                <span className="mr-2">←</span>
              </>
            ) : (
              <>
                <span>Read more</span>
                <span className="ml-2">→</span>
              </>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}