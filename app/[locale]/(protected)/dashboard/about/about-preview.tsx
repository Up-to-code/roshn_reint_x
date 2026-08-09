import Image from "next/image";

import { Button } from "@/components/ui/button";
import type { AboutData } from "@/lib/about/about-core";

export function AboutPreview({ data, onClose }: { data: AboutData; onClose: () => void }) {
  return (
    <div className="min-h-screen" dir="rtl">
      <div className="top-0 z-50 p-4">
        <div className="container mx-auto flex justify-between">
          <h1 className="text-xl font-bold">معاينة صفحة من نحن</h1>
          <Button type="button" onClick={onClose} variant="outline">
            العودة إلى المحرر
          </Button>
        </div>
      </div>

      <main className="my-40 w-full bg-white text-gray-700">
        <section className="w-full px-6 py-16 md:px-20">
          <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
            <div className="overflow-hidden rounded-xl shadow-lg">
              <Image
                src={data.hero.image || "https://dorrah.sa/wp-content/uploads/2023/12/2023-12-24-20.34.01.jpg"}
                alt="مشروع روشن ريت"
                width={960}
                height={640}
                className="h-auto w-full rounded-xl object-cover"
              />
            </div>
            <div className="text-right">
              <h2 className="mb-4 text-3xl font-bold text-[#D35400] md:text-4xl">
                {data.hero.title}
              </h2>
              <p className="text-lg leading-8 text-gray-600">{data.hero.subtitle}</p>
            </div>
          </div>
        </section>

        <section className="w-full px-6 md:px-20">
          <div className="mx-auto max-w-6xl text-center">
            <p className="text-lg text-gray-600 md:text-xl">{data.tagline}</p>
          </div>
        </section>

        <section className="w-full px-6 py-16 md:px-20">
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
            {[data.vision, data.mission].map((section) => (
              <div key={section.title} className="rounded-2xl border-l-4 border-[#D35400] bg-gray-50 p-8 text-right shadow-sm">
                <h4 className="mb-2 text-xl font-semibold text-[#D35400]">{section.title}</h4>
                <p className="leading-7 text-gray-600">{section.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="w-full px-6 py-12 md:px-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 text-right">
              <h3 className="text-3xl font-bold text-[#374151]">الأهداف</h3>
              <p className="mt-2 text-gray-600">لنجعل حياتك أجمل، أسهل، وأسعد... نهدف دوماً إلى:</p>
            </div>
            <div className="space-y-6">
              {data.goals.map((goal, index) => (
                <div key={`${index}-${goal}`} className="flex items-start gap-4 rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="flex size-12 items-center justify-center rounded-full bg-[#D35400] font-bold text-white">
                    {index + 1}
                  </div>
                  <p className="leading-7 text-gray-700">{goal}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
