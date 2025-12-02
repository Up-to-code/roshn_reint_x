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

  const handleCall = () => {
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
      {/* Call Icon - Goes to WhatsApp */}
      <button
        onClick={handleCall}
        className="group relative flex items-center justify-center rounded-full bg-blue-600 p-5 text-white shadow-2xl transition-all duration-500 hover:scale-110 hover:bg-blue-700 hover:shadow-[0_20px_60px_rgba(37,99,235,0.4)]"
        aria-label={isRTL ? "اتصل بنا على واتساب" : "Call us on WhatsApp"}
        title={isRTL ? "اتصل بنا على واتساب" : "Call us on WhatsApp"}
      >
        <Phone className="size-7" />
      </button>
    </div>
  );
}
