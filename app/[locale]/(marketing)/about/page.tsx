import React from "react";
import { aboutModule } from "@/lib/about/about-module";

export const revalidate = 300;

export default async function AboutPage() {
  const aboutData = await aboutModule.get();

  return (
    <main dir="rtl" lang="ar" className="my-40 w-full text-gray-700">
      {/* Hero Section */}
      <section className="w-full px-6 py-16 md:px-20" aria-labelledby="hero-title">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
          {/* Image */}
          <div className="overflow-hidden rounded-xl shadow-lg">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img
              src={aboutData.hero.image}
              alt="مشروع روشن ريت"
              className="h-auto w-full rounded-xl object-cover"
            />
          </div>

          {/* Text Content */}
          <div className="text-right">
            <h1 id="hero-title" className="mb-4 text-3xl font-bold text-[#D35400] md:text-4xl">
              {aboutData.hero.title}
            </h1>
            <p className="text-lg leading-8 text-gray-600">
              {aboutData.hero.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Tagline */}
      <section className="w-full px-6 md:px-20" aria-label="بيان المهمة">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-lg text-gray-600 md:text-xl">
            {aboutData.tagline}
          </p>
        </div>
      </section>

      {/* Vision & Mission Cards */}
      <section className="w-full px-6 py-16 md:px-20" aria-labelledby="vision-mission-title">
        <h2 id="vision-mission-title" className="sr-only">الرؤية والرسالة</h2>
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
          {/* Vision Card */}
          <article className="rounded-2xl border-l-4 border-[#D35400] bg-white/70 backdrop-blur-sm p-8 text-right shadow-sm transition-all hover:shadow-md">
            <div className="flex items-start gap-4">
              <div className="shrink-0" aria-hidden="true">
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
                  <path 
                    d="M12 5C7 5 3.2 8.1 1.5 12c1.7 3.9 5.5 7 10.5 7s8.8-3.1 10.5-7C20.8 8.1 17 5 12 5z" 
                    stroke="#6B7280" 
                    strokeWidth="1.2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                  <circle 
                    cx="12" 
                    cy="12" 
                    r="3" 
                    stroke="#D35400" 
                    strokeWidth="1.4" 
                  />
                </svg>
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold text-[#D35400]">{aboutData.vision.title}</h3>
                <p className="leading-7 text-gray-600">
                  {aboutData.vision.description}
                </p>
              </div>
            </div>
          </article>

          {/* Mission Card */}
          <article className="rounded-2xl border-l-4 border-[#D35400] bg-white/70 backdrop-blur-sm p-8 text-right shadow-sm transition-all hover:shadow-md">
            <div className="flex items-start gap-4">
              <div className="shrink-0" aria-hidden="true">
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
                  <path 
                    d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" 
                    stroke="#6B7280" 
                    strokeWidth="1.2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                  <path 
                    d="M14 2v6h6" 
                    stroke="#D35400" 
                    strokeWidth="1.2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold text-[#D35400]">{aboutData.mission.title}</h3>
                <p className="leading-7 text-gray-600">
                  {aboutData.mission.description}
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Goals Section */}
      <section className="w-full px-6 py-12 md:px-20" aria-labelledby="goals-title">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center justify-between">
            <div className="text-right">
              <h2 id="goals-title" className="text-3xl font-bold text-[#374151]">الأهداف</h2>
              <p className="mt-2 text-gray-600">لنجعل حياتك أجمل، أسهل، وأسعد... نهدف دوماً إلى:</p>
            </div>
            {/* Decorative Icon */}
            <div className="hidden opacity-10 md:block" aria-hidden="true">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M12 2v10l3 3" 
                  stroke="#D35400" 
                  strokeWidth="1.4" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <circle 
                  cx="12" 
                  cy="12" 
                  r="9" 
                  stroke="#6B7280" 
                  strokeWidth="1" 
                />
              </svg>
            </div>
          </div>

          <div className="space-y-6">
            {aboutData.goals.map((goal, index) => (
              <div 
                key={index}
                className="flex items-start gap-4 rounded-lg border border-gray-100 bg-white/70 backdrop-blur-sm p-5 shadow-sm transition-all hover:shadow-md"
              >
                <div 
                  className="flex size-12 items-center justify-center rounded-full font-bold text-white"
                  style={{ backgroundColor: "#D35400" }}
                  aria-hidden="true"
                >
                  {index + 1}
                </div>
                <p className="leading-7 text-gray-700">{goal}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
