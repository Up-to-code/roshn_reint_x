// components/home-page/sections/banners-section.tsx
"use client";

import { Banner } from "@/types/home-page";
import { Button } from "@/components/ui/button";

interface BannersSectionProps {
  banners: Banner[];
}

export function BannersSection({ banners }: BannersSectionProps) {
  if (!banners || banners.length === 0) return null;

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-4xl font-bold text-[#2C2C2C] md:text-5xl">
            Our Portfolio
          </h2>
          <p className="text-xl text-gray-600">
            Discover our latest real estate projects and architectural designs
          </p>
        </div>

        {/* Portfolio Grid - 2 rows of 3 columns */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 transition-colors duration-300 group-hover:bg-black/10" />
              </div>
              
              <div className="p-6">
                <h3 className="mb-2 text-xl font-bold text-[#2C2C2C]">
                  {banner.title}
                </h3>
                <p className="mb-4 line-clamp-2 text-gray-600">
                  {banner.description}
                </p>
                
                <Button className="bg-[#FF8C42] text-white hover:bg-[#FF8C42]/90">
                  <a href={banner.link}>View Project</a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}