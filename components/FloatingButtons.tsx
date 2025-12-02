"use client";

import { Phone } from "lucide-react";

interface FloatingButtonsProps {
  locale: string;
}

export function FloatingButtons({ locale }: FloatingButtonsProps) {
  const isRTL = locale === "ar";

  const whatsappNumber = "966501234567";
  const whatsappMessage = isRTL
    ? "مرحبًا، أود الاستفسار عن خدماتكم"
    : "Hello, I would like to inquire about your services";

  const handleWhatsApp = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      whatsappMessage
    )}`;
    window.open(url, "_blank");
  };

  return (
    <div
      className={`fixed bottom-6 z-50 flex flex-col gap-3 ${
        isRTL ? "right-6" : "left-6"
      }`}
    >
      {/* WhatsApp Button */}
      <button
        onClick={handleWhatsApp}
        className="group relative flex items-center gap-4 overflow-hidden rounded-2xl bg-[#006D5B] px-8 py-5 text-white shadow-2xl transition-all duration-500 hover:scale-110 hover:shadow-[0_20px_60px_rgba(0,109,91,0.4)]"
        aria-label={isRTL ? "راسلنا على واتساب" : "Call us on WhatsApp"}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#006D5B] via-[#008C73] to-[#006D5B] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
        
        {/* Content */}
        <div className="relative flex items-center gap-4">
          <div className="rounded-full bg-white/20 p-2 backdrop-blur-sm transition-transform duration-500 group-hover:rotate-12">
            <Phone className="size-7" />
          </div>
          <span className="text-xl font-bold tracking-wide">
            {isRTL ? "اتصل بنا" : "Call Now"}
          </span>
        </div>
        
        {/* Pulse effect */}
        <div className="absolute inset-0 rounded-2xl bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-10"></div>
      </button>
    </div>
  );
}