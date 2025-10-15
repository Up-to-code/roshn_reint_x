"use client";

import { useSearchParams } from "next/navigation";
import { blogPosts } from "@/lib/blogData";
import BlogCard from "./BlogCard";

export default function BlogList({ locale }: { locale: string }) {
  const searchParams = useSearchParams();
  const isRTL = locale === "ar";

  const category = searchParams?.get("category");

  const filteredPosts = blogPosts.filter((post) => {
    if (category && category !== "all") {
      return post.category.en.toLowerCase() === category.toLowerCase();
    }
    return true;
  });

  return (
    <section 
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-16"
      dir={isRTL ? "rtl" : "ltr"}
      aria-label={isRTL ? "مقالات المدونة" : "Blog articles"}
    >
      <div className="container mx-auto max-w-7xl">
        <header className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            {isRTL ? "المدونة" : "Blog"}
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            {isRTL 
              ? "اكتشف أحدث المقالات والإرشادات في عالم العقارات" 
              : "Discover the latest articles and guides in the world of real estate"
            }
          </p>
        </header>

        {filteredPosts.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-500">
              {isRTL ? "لا توجد مقالات متاحة" : "No articles available"}
            </p>
          </div>
        ) : (
          <div 
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            role="list"
            aria-label={isRTL ? "قائمة المقالات" : "Blog posts list"}
          >
            {filteredPosts.map((post) => (
              <BlogCard 
                key={post.id} 
                post={post} 
                locale={locale} 
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}