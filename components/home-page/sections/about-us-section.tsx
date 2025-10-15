import { AboutUsSection as AboutUsSectionType } from "@/types/home-page";
import { getLocale } from "next-intl/server";

interface AboutUsSectionProps {
  content: AboutUsSectionType;
}

export async function AboutUsSection({ content }: AboutUsSectionProps) {
  const locale = await getLocale();
  const isRTL = locale === "ar";

  return (
    <section className="bg-zinc-50 py-16 dark:bg-zinc-900 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16 ${isRTL ? "lg:grid-flow-col-dense" : ""}`}>
          {/* Content Section */}
          <div className={`${isRTL ? "lg:order-2" : "lg:order-1"}`}>
            {/* Title */}
            <h2 className="mb-6 text-3xl font-bold leading-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl lg:mb-8 lg:text-5xl">
              {content.title}
            </h2>
            
            {/* Content Paragraphs */}
            <div className="mb-8 space-y-4 text-zinc-600 dark:text-zinc-400 lg:mb-12 lg:space-y-6">
              {content.content.split('\n').map((paragraph, index) => (
                <p 
                  key={index} 
                  className="text-base leading-relaxed lg:text-lg"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Stats Grid */}
            {content.stats && content.stats.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 lg:gap-8">
                {content.stats.map((stat) => (
                  <div 
                    key={stat.id} 
                    className="rounded-lg bg-zinc-100 p-4 text-center transition-all duration-300 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                  >
                    <div className="mb-2 text-2xl font-bold text-zinc-900 transition-colors duration-300 dark:text-zinc-100 sm:text-3xl lg:text-4xl">
                      {stat.value}
                    </div>
                    <div className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400 sm:text-sm">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Image Section */}
          <div className={`${isRTL ? "lg:order-1" : "lg:order-2"}`}>
            {content.image && (
              <div className="group relative overflow-hidden rounded-xl">
                <img
                  src={content.image}
                  alt={content.title}
                  className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-80 lg:h-96 xl:h-[500px]"
                />
                {/* Subtle overlay on hover */}
                <div className="absolute inset-0 bg-zinc-900 opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}