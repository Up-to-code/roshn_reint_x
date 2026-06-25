// app/services/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
  features: string[];
  order: number;
  enabled: boolean;
}

interface ServicesPageData {
  id: string;
  title: string;
  subtitle: string;
  heroImage: string;
  enabled: boolean;
}

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [servicesData, setServicesData] = useState<Service[]>([]);
  const [pageData, setPageData] = useState<ServicesPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServicesData();
  }, []);

  const fetchServicesData = async () => {
    try {
      setError(null);
      const [pageResponse, servicesResponse] = await Promise.all([
        fetch('/api/services-page'),
        fetch('/api/services')
      ]);

      if (!pageResponse.ok) throw new Error('فشل في تحميل بيانات الصفحة');
      if (!servicesResponse.ok) throw new Error('فشل في تحميل الخدمات');

      const pageData = await pageResponse.json();
      const servicesData = await servicesResponse.json();

      const enabledServices = servicesData
        .filter((service: Service) => service.enabled)
        .sort((a: Service, b: Service) => a.order - b.order);

      setPageData(pageData);
      setServicesData(enabledServices);
    } catch (error) {
      console.error('خطأ في تحميل بيانات الخدمات:', error);
      setError('فشل تحميل الخدمات. يرجى المحاولة مرة أخرى لاحقًا.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">جاري تحميل الخدمات...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-xl text-red-600">{error}</div>
          <button
            onClick={fetchServicesData}
            className="rounded-lg bg-orange-500 px-6 py-3 text-white hover:bg-orange-600"
          >
            حاول مرة أخرى
          </button>
        </div>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">لم يتم العثور على بيانات الخدمات.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" dir="rtl">
      {/* Hero Section */}
      <section className="relative flex h-[60vh] items-center justify-center">
        <div className="absolute inset-0">
          {pageData.heroImage ? (
            <Image
              src={pageData.heroImage}
              alt="صورة الخدمات الرئيسية"
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="size-full bg-gradient-to-br from-orange-50 to-gray-100"></div>
          )}
          <div className="absolute inset-0 bg-black opacity-40"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center text-white">
          <ScrollReveal direction="up">
            <h1 className="mb-6 text-5xl font-black tracking-tight md:text-6xl">
              {pageData.title || "خدماتنا"}
            </h1>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={2}>
            <p className="text-xl font-light leading-relaxed md:text-2xl">
              {pageData.subtitle || "حلول شاملة لتحويل وجودك الرقمي ودفع نمو أعمالك"}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Services — alternating full-width sections */}
      <section className="bg-transparent py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          {/* Section heading */}
          <ScrollReveal direction="up">
            <div className="mb-12 text-center md:mb-20">
              <div className="mb-6 inline-flex items-center gap-3 border border-orange-200 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-600 md:mb-8 md:px-6 md:py-3 md:text-base">
                <div className="size-2 animate-pulse rounded-full bg-orange-500"></div>
                ما نقدمه
              </div>
              <h2 className="mb-4 text-4xl font-black text-black md:mb-6 md:text-6xl">
                خدمات احترافية
              </h2>
              <p className="mx-auto max-w-3xl text-lg font-light leading-relaxed text-gray-600 md:text-2xl">
                حلول مخصصة لتلبية متطلبات وأهداف عملك الفريدة
              </p>
            </div>
          </ScrollReveal>

          {servicesData.length > 0 ? (
            <div className="space-y-20 md:space-y-32">
              {servicesData.map((service, index) => (
                <ServiceSection
                  key={service.id}
                  service={service}
                  index={index}
                  onSelect={setSelectedService}
                />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="mb-4 text-lg text-gray-500">لا توجد خدمات متاحة حاليًا.</div>
              <p className="text-gray-400">يرجى التحقق مرة أخرى لاحقًا.</p>
            </div>
          )}
        </div>
      </section>

      {/* Service detail modal */}
      {selectedService && (
        <ServiceModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </div>
  );
}

// ── Alternating service section ────────────────────────────────────────────────

interface ServiceSectionProps {
  service: Service;
  index: number;
  onSelect: (service: Service) => void;
}

function ServiceSection({ service, index, onSelect }: ServiceSectionProps) {
  const isReversed = index % 2 === 1;

  return (
    <div className="grid grid-cols-1 items-center gap-8 md:gap-16 lg:grid-cols-2">
      {/* Image side */}
      <ScrollReveal
        direction={isReversed ? "right" : "left"}
        className={isReversed ? "lg:order-2" : "lg:order-1"}
      >
        <div
          className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-2xl shadow-lg transition-shadow duration-500 hover:shadow-2xl"
          onClick={() => onSelect(service)}
        >
          {service.image ? (
            <Image
              src={service.image}
              alt={service.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-gradient-to-br from-orange-50 to-gray-100">
              <div className="text-6xl text-orange-400">⚡</div>
            </div>
          )}
        </div>
      </ScrollReveal>

      {/* Text side */}
      <ScrollReveal
        direction={isReversed ? "left" : "right"}
        delay={2}
        className={isReversed ? "lg:order-1" : "lg:order-2"}
      >
        <div className="flex flex-col gap-5">
          {/* Icon + accent bar */}
          <div className="flex items-center gap-3">
            <div className="h-1 w-12 rounded-full bg-orange-500"></div>
            <span className="text-sm font-bold uppercase tracking-wider text-orange-500">
              0{index + 1}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-3xl font-black leading-tight text-black md:text-4xl">
            {service.title}
          </h3>

          {/* Description */}
          <p className="text-lg leading-relaxed text-gray-600 md:text-xl">
            {service.description}
          </p>

          {/* Features preview (first 3) */}
          {service.features && service.features.length > 0 && (
            <ul className="flex flex-col gap-2">
              {service.features.slice(0, 3).map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-base text-gray-700">
                  <svg className="size-5 shrink-0 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          )}

          {/* CTA button */}
          <div className="pt-2">
            <button
              onClick={() => onSelect(service)}
              className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-7 py-3 text-base font-bold text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-orange-600 hover:shadow-lg"
            >
              اعرف المزيد
              <svg
                className="size-5 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}

// ── Service detail modal ───────────────────────────────────────────────────────

interface ServiceModalProps {
  service: Service;
  onClose: () => void;
}

function ServiceModal({ service, onClose }: ServiceModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 md:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white">
        {/* Image header */}
        <div className="relative h-48 md:h-80">
          {service.image ? (
            <Image
              src={service.image}
              alt={service.title}
              fill
              className="rounded-t-2xl object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center rounded-t-2xl bg-gradient-to-br from-orange-50 to-gray-100">
              <div className="text-6xl text-orange-400">⚡</div>
            </div>
          )}
          <div className="absolute inset-0 rounded-t-2xl bg-gradient-to-t from-black/50 to-transparent">
            <div className="absolute bottom-4 right-4 md:bottom-6 md:right-8">
              <h2 className="mb-2 text-2xl font-bold text-white md:text-4xl">
                {service.title}
              </h2>
              <div className="h-1 w-12 rounded-full bg-orange-500 md:w-16"></div>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute left-4 top-4 flex size-8 items-center justify-center rounded-full bg-black/50 text-white transition-all duration-300 hover:bg-black/70 md:left-6 md:top-6 md:size-10"
          >
            <svg className="size-4 md:size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal content */}
        <div className="p-6 md:p-8">
          <p className="mb-6 text-lg leading-relaxed text-gray-600 md:mb-8 md:text-xl">
            {service.description}
          </p>

          {service.features && service.features.length > 0 && (
            <div className="mb-6 md:mb-8">
              <h3 className="mb-4 text-xl font-bold text-black md:mb-6 md:text-2xl">ما نقدمه</h3>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                {service.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 rounded-lg border border-orange-100 bg-orange-50 p-3 md:gap-4 md:p-4">
                    <div className="flex size-6 items-center justify-center rounded-full bg-orange-500 md:size-8">
                      <svg className="size-3 text-white md:size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700 md:text-base">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA buttons */}
          <div className="flex flex-col gap-3 md:flex-row md:gap-4">
            <button className="flex-1 rounded-xl bg-black px-4 py-3 text-base font-bold text-white transition-all duration-300 hover:bg-orange-500 md:px-6 md:py-4 md:text-lg">
              ابدأ الآن
            </button>
            <button className="flex-1 rounded-xl border-2 border-black px-4 py-3 text-base font-bold text-black transition-all duration-300 hover:bg-black hover:text-white md:px-6 md:py-4 md:text-lg">
              جدولة مكالمة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
// app/services/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
  features: string[];
  order: number;
  enabled: boolean;
}

interface ServicesPageData {
  id: string;
  title: string;
  subtitle: string;
  heroImage: string;
  enabled: boolean;
}

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [servicesData, setServicesData] = useState<Service[]>([]);
  const [pageData, setPageData] = useState<ServicesPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServicesData();
  }, []);

  const fetchServicesData = async () => {
    try {
      setError(null);
      const [pageResponse, servicesResponse] = await Promise.all([
        fetch('/api/services-page'),
        fetch('/api/services')
      ]);

      if (!pageResponse.ok) throw new Error('فشل في تحميل بيانات الصفحة');
      if (!servicesResponse.ok) throw new Error('فشل في تحميل الخدمات');

      const pageData = await pageResponse.json();
      const servicesData = await servicesResponse.json();

      // تصفية الخدمات المفعلة فقط وترتيبها
      const enabledServices = servicesData
        .filter((service: Service) => service.enabled)
        .sort((a: Service, b: Service) => a.order - b.order);

      setPageData(pageData);
      setServicesData(enabledServices);
    } catch (error) {
      console.error('خطأ في تحميل بيانات الخدمات:', error);
      setError('فشل تحميل الخدمات. يرجى المحاولة مرة أخرى لاحقًا.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">جاري تحميل الخدمات...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-xl text-red-600">{error}</div>
          <button 
            onClick={fetchServicesData}
            className="rounded-lg bg-orange-500 px-6 py-3 text-white hover:bg-orange-600"
          >
            حاول مرة أخرى
          </button>
        </div>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">لم يتم العثور على بيانات الخدمات.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" dir="rtl">
      {/* قسم البطل مع التعتيم */}
      <section className="relative flex h-[60vh] items-center justify-center">
        <div className="absolute inset-0">
          {pageData.heroImage ? (
            <Image
              src={pageData.heroImage}
              alt="صورة الخدمات الرئيسية"
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="size-full bg-gradient-to-br from-orange-50 to-gray-100"></div>
          )}
          {/* طبقة تعتيم بنسبة 40% */}
          <div className="absolute inset-0 bg-black opacity-40"></div>
        </div>
        
        {/* النص في المنتصف */}
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center text-white">
          <h1 className="mb-6 text-5xl font-black tracking-tight md:text-6xl">
            { pageData.title || "خدماتنا" }
          </h1>
          <p className="text-xl font-light leading-relaxed md:text-2xl">
            {pageData.subtitle || "حلول شاملة لتحويل وجودك الرقمي ودفع نمو أعمالك"}
          </p>
        </div>
      </section>

      {/* قسم شبكة الخدمات */}
      <section className="bg-transparent py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          {/* العنوان */}
          <div className="mb-12 text-center md:mb-16">
            <div className="mb-6 inline-flex items-center gap-3 border border-orange-200 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-600 md:mb-8 md:px-6 md:py-3 md:text-base">
              <div className="size-2 animate-pulse rounded-full bg-orange-500"></div>
              ما نقدمه
            </div>
            <h2 className="mb-4 text-4xl font-black text-black md:mb-6 md:text-6xl">
              خدمات احترافية
            </h2>
            <p className="mx-auto max-w-3xl text-lg font-light leading-relaxed text-gray-600 md:text-2xl">
              حلول مخصصة لتلبية متطلبات وأهداف عملك الفريدة
            </p>
          </div>

          {/* شبكة الخدمات */}
          {servicesData.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
              {servicesData.map((service) => (
                <ServiceCard 
                  key={service.id} 
                  service={service}
                  onSelect={setSelectedService}
                />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="mb-4 text-lg text-gray-500">لا توجد خدمات متاحة حاليًا.</div>
              <p className="text-gray-400">يرجى التحقق مرة أخرى لاحقًا.</p>
            </div>
          )}
        </div>
      </section>

      {/* نافذة تفاصيل الخدمة */}
      {selectedService && (
        <ServiceModal 
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </div>
  );
}

// بطاقة الخدمة
interface ServiceCardProps {
  service: Service;
  onSelect: (service: Service) => void;
}

function ServiceCard({ service, onSelect }: ServiceCardProps) {
  return (
    <div 
      className="group cursor-pointer overflow-hidden rounded-lg border border-orange-100 bg-white transition-all duration-300 hover:scale-[1.02] hover:border-orange-300"
      onClick={() => onSelect(service)}
    >
      {/* حاوية الصورة مع العنوان */}
      <div className="relative h-48 overflow-hidden md:h-64">
        {service.image ? (
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-gradient-to-br from-orange-50 to-gray-100">
            <div className="text-4xl text-orange-400">⚡</div>
          </div>
        )}
        {/* طبقة متدرجة مع العنوان */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
          <div className="absolute inset-x-4 bottom-4 md:inset-x-6 md:bottom-6">
            <h3 className="mb-2 text-xl font-bold text-white md:text-2xl">
              {service.title}
            </h3>
            <div className="h-1 w-12 rounded-full bg-orange-500"></div>
          </div>
        </div>
      </div>

      {/* المحتوى */}
      <div className="p-4 md:p-6">
        <p className="mb-3 text-sm leading-relaxed text-gray-600 md:mb-4 md:text-base">
          {service.description}
        </p>
        <div className="flex items-center text-sm font-semibold text-orange-600 transition-all duration-300 group-hover:gap-2 md:text-base md:group-hover:gap-3">
          اعرف المزيد
          <svg 
            className="size-4 transition-transform duration-300 group-hover:translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// نافذة الخدمة
interface ServiceModalProps {
  service: Service;
  onClose: () => void;
}

function ServiceModal({ service, onClose }: ServiceModalProps) {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 md:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white">
        {/* العنوان مع الصورة */}
        <div className="relative h-48 md:h-80">
          {service.image ? (
            <Image
              src={service.image}
              alt={service.title}
              fill
              className="rounded-t-2xl object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center rounded-t-2xl bg-gradient-to-br from-orange-50 to-gray-100">
              <div className="text-6xl text-orange-400">⚡</div>
            </div>
          )}
          <div className="absolute inset-0 rounded-t-2xl bg-gradient-to-t from-black/50 to-transparent">
            <div className="absolute bottom-4 right-4 md:bottom-6 md:right-8">
              <h2 className="mb-2 text-2xl font-bold text-white md:text-4xl">
                {service.title}
              </h2>
              <div className="h-1 w-12 rounded-full bg-orange-500 md:w-16"></div>
            </div>
          </div>
          
          {/* زر الإغلاق */}
          <button
            onClick={onClose}
            className="absolute left-4 top-4 flex size-8 items-center justify-center rounded-full bg-black/50 text-white transition-all duration-300 hover:bg-black/70 md:left-6 md:top-6 md:size-10"
          >
            <svg className="size-4 md:size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* المحتوى */}
        <div className="p-6 md:p-8">
          <p className="mb-6 text-lg leading-relaxed text-gray-600 md:mb-8 md:text-xl">
            {service.description}
          </p>
          
          {service.features && service.features.length > 0 && (
            <div className="mb-6 md:mb-8">
              <h3 className="mb-4 text-xl font-bold text-black md:mb-6 md:text-2xl">ما نقدمه</h3>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                {service.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 rounded-lg border border-orange-100 bg-orange-50 p-3 md:gap-4 md:p-4">
                    <div className="flex size-6 items-center justify-center rounded-full bg-orange-500 md:size-8">
                      <svg className="size-3 text-white md:size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700 md:text-base">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* أزرار الحث على الإجراء */}
          <div className="flex flex-col gap-3 md:flex-row md:gap-4">
            <button className="flex-1 rounded-xl bg-black px-4 py-3 text-base font-bold text-white transition-all duration-300 hover:bg-orange-500 md:px-6 md:py-4 md:text-lg">
              ابدأ الآن
            </button>
            <button className="flex-1 rounded-xl border-2 border-black px-4 py-3 text-base font-bold text-black transition-all duration-300 hover:bg-black hover:text-white md:px-6 md:py-4 md:text-lg">
              جدولة مكالمة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}