"use client";

import { useState } from "react";
import { ContactUsSection as ContactUsSectionType } from "@/types/home-page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, AlertCircle, Loader2, MessageCircle } from "lucide-react";

interface ContactUsSectionProps {
  content: ContactUsSectionType;
  locale: string;
}

export function ContactUsSection({ content, locale }: ContactUsSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const isRTL = locale === "ar";

  if (!content.enabled) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (status) setStatus(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);
    
    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();

      if (response.ok) {
        setStatus({
          type: 'success',
          message: isRTL ? "تم إرسال رسالتك بنجاح! سوف نعود إليك في أقرب وقت ممكن." : "Your message has been sent successfully! We'll get back to you as soon as possible."
        });
        setFormData({ name: '', phoneNumber: '', message: '' });
      } else {
        throw new Error(result.errors?.[0]?.message || result.message || 'Submission failed');
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: isRTL 
          ? "عذرًا، حدث خطأ أثناء إرسال رسالتك. يرجى المحاولة مرة أخرى أو الاتصال بنا مباشرة."
          : "Sorry, there was an error sending your message. Please try again or contact us directly."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full py-12 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Rounded Container - 90% width */}
        <div className="mx-auto w-[90%] max-w-6xl overflow-hidden rounded-3xl border bg-card shadow-2xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            
            {/* Left Side - Simple Text Content */}
            <div className="p-8 lg:p-12">
              <div className={`flex h-full flex-col justify-center gap-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                
                {/* Badge */}
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/20 px-4 py-2">
                  <MessageCircle className="size-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    {isRTL ? "تواصل معنا" : "Contact Us"}
                  </span>
                </div>
                
                {/* Title */}
                <h2 className="text-3xl font-bold text-foreground lg:text-4xl">
                  {content.title}
                </h2>
                
                {/* Subtitle */}
                {content.subtitle && (
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    {content.subtitle}
                  </p>
                )}

                {/* Simple Info Cards */}
                <div className="mt-4 space-y-4">
                  <div className="flex items-center gap-3 rounded-2xl border bg-muted/50 p-4">
                    <div className="size-3 animate-pulse rounded-full bg-green-500"></div>
                    <span className="text-sm text-foreground">
                      {isRTL ? "رد سريع خلال 24 ساعة" : "Quick response within 24 hours"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl border bg-muted/50 p-4">
                    <div className="size-3 animate-pulse rounded-full bg-blue-500"></div>
                    <span className="text-sm text-foreground">
                      {isRTL ? "دعم متخصص واحترافي" : "Professional & expert support"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Clean Contact Form */}
            {content.form?.enabled && (
              <div className="p-8 lg:p-12">
                <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                  
                  {/* Name Field */}
                  <div className="space-y-3">
                    <label htmlFor="name" className="block text-sm font-medium text-foreground">
                      {isRTL ? "الاسم" : "Name"} *
                    </label>
                    <Input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      minLength={2}
                      disabled={isLoading}
                      placeholder={isRTL ? "أدخل اسمك الكامل" : "Enter your full name"}
                      className="h-12 rounded-xl"
                    />
                  </div>

                  {/* Phone Field */}
                  <div className="space-y-3">
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-foreground">
                      {isRTL ? "رقم الجوال" : "Phone Number"} *
                    </label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                      minLength={5}
                      disabled={isLoading}
                      placeholder={isRTL ? "أدخل رقم الجوال" : "Enter your phone number"}
                      className="h-12 rounded-xl"
                    />
                  </div>

                  {/* Message Field */}
                  <div className="space-y-3">
                    <label htmlFor="message" className="block text-sm font-medium text-foreground">
                      {isRTL ? "الرسالة" : "Message"} *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      minLength={10}
                      rows={4}
                      disabled={isLoading}
                      placeholder={isRTL ? "أخبرنا كيف يمكننا مساعدتك..." : "Tell us how we can help you..."}
                      className="min-h-[120px] resize-none rounded-xl"
                    />
                  </div>

                  {/* Status Message */}
                  {status && (
                    <div className={`flex items-start gap-3 rounded-xl border p-4 ${
                      status.type === 'success' 
                        ? 'border-green-500/30 bg-green-500/10 text-green-600' 
                        : 'border-destructive/30 bg-destructive/10 text-destructive'
                    }`}>
                      {status.type === 'success' ? (
                        <CheckCircle className="mt-0.5 size-5 shrink-0" />
                      ) : (
                        <AlertCircle className="mt-0.5 size-5 shrink-0" />
                      )}
                      <p className="text-sm leading-relaxed">{status.message}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="h-12 w-full rounded-xl font-semibold transition-all duration-300 hover:shadow-xl"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-3">
                        <Loader2 className="size-5 animate-spin" />
                        {isRTL ? "جاري الإرسال..." : "Sending..."}
                      </span>
                    ) : (
                      isRTL ? "إرسال الرسالة" : "Send Message"
                    )}
                  </Button>

                  {/* Form Note */}
                  <p className="text-center text-xs text-muted-foreground">
                    {isRTL ? "جميع الحقول مطلوبة *" : "All fields are required *"}
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}