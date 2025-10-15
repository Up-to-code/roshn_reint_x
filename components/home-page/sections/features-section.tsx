import { IconType } from "react-icons";

"use client";

  type Feature = {
    id: string;
    icon: string;
    title: string;
    description: string;
  };

  type FeaturesSectionType = {
    title: string;
    subtitle: string;
    features: Feature[];
  };
interface FeaturesSectionProps {
  content: FeaturesSectionType;
}

export function FeaturesSection({ content }: FeaturesSectionProps) {
  if (!content.features || content.features.length === 0) return null;

  return (
    <section className="bg-[#2C2C2C] py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            {content.title}
          </h2>
          <p className="text-xl text-gray-300">
            {content.subtitle}
          </p>
        </div>

        {/* Features Grid - 2 rows of 3 columns */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {content.features.map((feature, index) => (
            <div
              key={feature.id}
              className="group rounded-lg border border-gray-700 bg-gray-800/50 p-6 transition-all duration-300 hover:border-[#FF8C42]"
            >
              <div className="mb-4 flex items-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-[#FF8C42]/20 text-[#FF8C42]">
                  <span className="text-2xl">{feature.icon}</span>
                </div>
              </div>
              
              <h3 className="mb-3 text-xl font-bold text-white">
                {feature.title}
              </h3>
              
              <p className="leading-relaxed text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}