"use client";

import React from "react";
import Image from "next/image";
import { useLocale } from "next-intl";

const IMAGE_URL_PATTERN = /^(?:https?:\/\/|\/)/i;

function FeatureIcon({ icon, title }: Pick<Feature, "icon" | "title">) {
  const value = icon?.trim();

  if (!value) return null;

  if (IMAGE_URL_PATTERN.test(value)) {
    return (
      <Image
        src={value}
        alt=""
        width={32}
        height={32}
        className="size-full object-contain"
        aria-hidden="true"
      />
    );
  }

  return <span aria-label={title}>{value}</span>;
}

export interface WhyUsSection {
  title: string;
  subtitle: string;
  features: Feature[];
}

export interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface WhyUsSectionProps {
  content: WhyUsSection;
}

export function WhyUsSection({ content }: WhyUsSectionProps) {
  const locale = useLocale();
  const isRTL = locale === "ar";
  
  if (!content || !content.features || content.features.length === 0) return null;

  return (
    <section className="bg-transparent py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center md:mb-16">
          <h2 className="mb-4 text-3xl font-bold text-gray-800 md:text-5xl">
            {content.title}
          </h2>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-600 md:text-xl">
            {content.subtitle}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {content.features.map((feature) => (
            <div
              key={feature.id}
              className="group rounded-lg border border-[#E0DDD8] bg-white p-6 shadow-sm transition-all duration-300 hover:border-gray-400 hover:shadow-md md:p-7"
            >
              <div className={`flex items-start gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                {/* Icon */}
                <div className="flex size-12 shrink-0 overflow-hidden items-center justify-center rounded-lg bg-gray-200 p-2 text-xl text-gray-700 transition-colors group-hover:bg-gray-500 group-hover:text-white">
                  <FeatureIcon icon={feature.icon} title={feature.title} />
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <h3 className="mb-2 text-lg font-semibold text-gray-800 md:text-xl">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-600 md:text-base">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
