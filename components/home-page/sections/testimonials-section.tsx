import { TestimonialsSection as TestimonialsSectionType } from "@/types/home-page";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getLocale } from "next-intl/server";

interface TestimonialsSectionProps {
  content: TestimonialsSectionType;
}

export async function TestimonialsSection({ content }: TestimonialsSectionProps) {
  const locale = await getLocale();
  const isRTL = locale === "ar";

  if (!content.testimonials || content.testimonials.length === 0) return null;

  return (
    <section className="bg-zinc-950 py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center md:mb-16">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-400">
            <div className="size-1.5 animate-pulse rounded-full bg-zinc-500"></div>
            {locale === "ar" ? "شهادات العملاء" : "Testimonials"}
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-zinc-100 md:text-5xl">
            {content.title}
          </h2>
          <p className="mx-auto max-w-2xl text-lg font-light leading-relaxed text-zinc-400 md:text-xl">
            {content.subtitle}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {content.testimonials.map((testimonial, index) => (
            <div
              className="group rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-800 md:p-8"
              key={`testimonial-${testimonial.id}-${index}`}
            >
              {/* Stars */}
              <div className={`mb-4 flex gap-1 ${isRTL ? "justify-end" : ""}`}>
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`size-5 ${
                      i < (testimonial.rating || 5)
                        ? "fill-zinc-400 text-zinc-400"
                        : "fill-zinc-700 text-zinc-700"
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))} 
              </div>

              {/* Quote */}
              <div className="relative">
                <div className={`absolute -left-2 -top-2 font-serif text-4xl text-zinc-800 ${isRTL ? "left-auto right-0" : ""}`}>&quot;</div>
                <p className="relative z-10 mb-6 text-base font-light leading-relaxed text-zinc-300 md:text-lg">
                  {testimonial.content}
                </p>
              </div>

              {/* Author */}
              <div className={`flex items-center gap-4 border-t border-zinc-800 pt-6 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Avatar className="size-12 ring-2 ring-zinc-700 transition-all duration-300 group-hover:ring-zinc-600 md:size-14">
                  {testimonial.avatar && (
                    <AvatarImage
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="object-cover"
                    />
                  )}
                  <AvatarFallback className="bg-zinc-700 text-base font-bold text-zinc-100">
                    {testimonial.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-semibold text-zinc-100 md:text-lg">
                    {testimonial.name}
                  </p>
                  <p className="truncate text-sm text-zinc-400">{testimonial.position}</p>
                  {testimonial.company && (
                    <p className="truncate text-xs font-semibold text-zinc-500">
                      {testimonial.company}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}