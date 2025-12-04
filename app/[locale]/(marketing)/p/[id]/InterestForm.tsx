"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface InterestFormProps {
  propertyTitle: string;
  propertyId: string;
}

export default function InterestForm({ propertyTitle, propertyId }: InterestFormProps) {
  const t = useTranslations('propertyDetail');
  const commonT = useTranslations('common');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const [form, setForm] = useState({ 
    name: "", 
    email: "",
    phone: "", 
    message: "" 
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/interests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...form, 
          propertyTitle,
          propertyId 
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setForm({ name: "", email: "", phone: "", message: "" });
        toast.success(
          isRTL ? "تم إرسال طلبك بنجاح!" : "Your request has been sent successfully!",
          {
            description: isRTL 
              ? "سنقوم بالتواصل معك قريباً" 
              : "We will contact you soon"
          }
        );
        
        // Reset success message after 5 seconds
        setTimeout(() => setSuccess(false), 5000);
      } else {
        const errorData = await res.json();
        const errorMessage = errorData.details || errorData.error || (isRTL ? "يرجى المحاولة مرة أخرى" : "Please try again");
        console.error("Interest creation failed:", errorData);
        toast.error(
          isRTL ? "فشل الإرسال" : "Failed to send",
          {
            description: errorMessage
          }
        );
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error(
        isRTL ? "حدث خطأ" : "An error occurred",
        {
          description: isRTL ? "يرجى المحاولة مرة أخرى" : "Please try again"
        }
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`rounded-xl border bg-card p-6 shadow-sm ${isRTL ? 'text-right' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <h2 className={`mb-4 text-center text-lg font-semibold ${isRTL ? 'text-right' : ''}`}>
        {isRTL ? "أرسل اهتمامك بهذا العقار" : "Express Interest in This Property"}
      </h2>

      {success && (
        <div className={`mb-4 flex items-center gap-2 rounded-md bg-green-50 p-3 text-sm text-green-700 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{isRTL ? "تم إرسال طلبك بنجاح!" : "Your request has been sent successfully!"}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={`mb-1 block text-sm font-medium ${isRTL ? 'text-right' : ''}`}>
            {isRTL ? "الاسم الكامل" : "Full Name"} <span className="text-destructive">*</span>
          </label>
          <Input
            required
            placeholder={isRTL ? "الاسم الكامل" : "Full Name"}
            className="w-full"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            disabled={loading}
          />
        </div>

        <div>
          <label className={`mb-1 block text-sm font-medium ${isRTL ? 'text-right' : ''}`}>
            {isRTL ? "البريد الإلكتروني" : "Email"} <span className="text-muted-foreground">({isRTL ? 'اختياري' : 'Optional'})</span>
          </label>
          <Input
            type="email"
            placeholder={isRTL ? "example@email.com" : "example@email.com"}
            className="w-full"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            disabled={loading}
          />
        </div>

        <div>
          <label className={`mb-1 block text-sm font-medium ${isRTL ? 'text-right' : ''}`}>
            {isRTL ? "رقم الجوال" : "Phone Number"} <span className="text-destructive">*</span>
          </label>
          <Input
            required
            type="tel"
            placeholder={isRTL ? "05xxxxxxxx" : "05xxxxxxxx"}
            className="w-full"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            disabled={loading}
          />
        </div>

        <div>
          <label className={`mb-1 block text-sm font-medium ${isRTL ? 'text-right' : ''}`}>
            {isRTL ? "رسالتك" : "Your Message"} <span className="text-muted-foreground">({isRTL ? 'اختياري' : 'Optional'})</span>
          </label>
          <Textarea
            placeholder={isRTL ? "اكتب رسالتك هنا..." : "Write your message here..."}
            className="w-full min-h-[100px]"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            disabled={loading}
          />
        </div>

        <Button
          type="submit"
          disabled={loading || success}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <span className={`flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Loader2 className="size-4 animate-spin" />
              {isRTL ? "جاري الإرسال..." : "Sending..."}
            </span>
          ) : success ? (
            <span className={`flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <CheckCircle2 className="size-4" />
              {isRTL ? "تم الإرسال" : "Sent"}
            </span>
          ) : (
            <span className={`flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Send className="size-4" />
              {isRTL ? "إرسال" : "Send Interest"}
            </span>
          )}
        </Button>
      </form>
    </div>
  );
}
