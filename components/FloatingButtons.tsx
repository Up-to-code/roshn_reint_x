"use client";

import { useState, useEffect } from "react";
import { Phone, MessageCircle } from "lucide-react";

interface FloatingButtonsProps {
  locale: string;
}

export function FloatingButtons({ locale }: FloatingButtonsProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  const isRTL = locale === "ar";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) return null;

  const phoneNumber = "+966501234567";
  const whatsappNumber = "966501234567";
  const whatsappMessage = isRTL ? "مرحبًا، أود الاستفسار عن خدماتكم" : "Hello, I would like to inquire about your services";

  const handleCall = () => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const handleWhatsApp = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank');
  };

  return (
    <div className={`fixed bottom-6 z-50 flex flex-col gap-3 ${isRTL ? 'rright-10' : 'right-10'} ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-32 opacity-0'
    } transition-all duration-300`}>
      
      {/* WhatsApp Button - Simple and Clean */}
      <button
        onClick={handleWhatsApp}
        className="flex items-center gap-3 rounded-xl bg-[#25D366] px-5 py-4 text-white shadow-lg transition-all hover:scale-105 hover:bg-[#128C7E] hover:shadow-xl"
        aria-label={isRTL ? "راسلنا على واتساب" : "Message us on WhatsApp"}
      >
        <MessageCircle className="size-6" />
        <span className="whitespace-nowrap text-base font-semibold">
          {isRTL ? "واتساب" : "WhatsApp"}
        </span>
      </button>

      {/* Call Button - Simple and Clean */}
      <button
        onClick={handleCall}
        className="flex items-center gap-3 rounded-xl bg-blue-600 px-5 py-4 text-white shadow-lg transition-all hover:scale-105 hover:bg-blue-700 hover:shadow-xl"
        aria-label={isRTL ? "اتصل بنا" : "Call us"}
      >
        <Phone className="size-6" />
        <span className="whitespace-nowrap text-base font-semibold">
          {isRTL ? "اتصال" : "Call"}
        </span>
      </button>
    </div>
  );
}