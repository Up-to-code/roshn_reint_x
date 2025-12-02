"use client";

import { MessageCircle, Send } from "lucide-react";

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
        className="flex items-center gap-3 rounded-full bg-[#25D366] px-6 py-4 text-white shadow-xl transition-all duration-300 hover:scale-110 hover:bg-[#128C7E] hover:shadow-2xl"
        aria-label={isRTL ? "راسلنا على واتساب" : "Message us on WhatsApp"}
      >
        {/* WhatsApp Icon */}
        <MessageCircle className="size-7" />

        {/* Text */}
        <span className="text-lg font-semibold">
          {isRTL ? "واتساب" : "WhatsApp"}
        </span>

        {/* Small chat icon */}
        <Send className="size-5 opacity-90" />
      </button>
    </div>
  );
}
