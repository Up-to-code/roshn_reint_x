'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

interface ContactPageProps {
  params: {
    locale: string;
  };
}

interface ContactContent {
  enabled: boolean;
  title: string;
  subtitle: string;
  contactInfo: {
    address: string;
    phone: string;
    email: string;
    workingHours: string;
  };
  form?: {
    enabled: boolean;
  };
}

export default function ContactPage({ params }: ContactPageProps) {
  const { locale } = params;
  const [content, setContent] = useState<ContactContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const isRTL = locale === "ar";

  // Fetch contact page data from API
  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/home-page?locale=${locale}`, {
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch contact data');
        }

        const data = await response.json();
        
        if (data.contactUs) {
          setContent(data.contactUs);
        } else {
          setContent({
            enabled: true,
            title: locale === "ar" ? "تواصل معنا" : "Contact Us",
            subtitle: locale === "ar" 
              ? "نحن هنا لمساعدتك. تواصل معنا لأي استفسارات أو أسئلة." 
              : "We're here to help. Contact us for any inquiries or questions.",
            contactInfo: {
              address: "123 Business District, Downtown, City 10001",
              phone: "+1 (555) 123-4567",
              email: "hello@company.com",
              workingHours: "Mon - Fri: 9:00 AM - 6:00 PM"
            },
            form: {
              enabled: true
            }
          });
        }
      } catch (error) {
        console.error('Error fetching contact data:', error);
        setContent({
          enabled: true,
          title: locale === "ar" ? "تواصل معنا" : "Contact Us",
          subtitle: locale === "ar" 
            ? "نحن هنا لمساعدتك. تواصل معنا لأي استفسارات أو أسئلة." 
            : "We're here to help. Contact us for any inquiries or questions.",
          contactInfo: {
            address: "123 Business District, Downtown, City 10001",
            phone: "+1 (555) 123-4567",
            email: "hello@company.com",
            workingHours: "Mon - Fri: 9:00 AM - 6:00 PM"
          },
          form: {
            enabled: true
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContactData();
  }, [locale]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);
    
    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        throw new Error('Server returned non-JSON response');
      }

      const result = await response.json();

      if (response.ok) {
        setStatus({
          type: 'success',
          message: locale === "ar" ? "تم إرسال رسالتك بنجاح!" : "Your message has been sent successfully!"
        });
        setFormData({ name: '', phoneNumber: '', message: '' });
      } else {
        const errorMessage = result.errors?.[0]?.message || 
                            result.message || 
                            `Error: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Submission error:', error);
      
      let errorMessage: string;
      if (error instanceof Error) {
        if (error.message.includes('JSON')) {
          errorMessage = locale === "ar" 
            ? "خطأ في الخادم: يرجى المحاولة مرة أخرى لاحقًا"
            : "Server error: Please try again later";
        } else {
          errorMessage = error.message;
        }
      } else {
        errorMessage = locale === "ar" 
          ? "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى."
          : "An unexpected error occurred. Please try again.";
      }

      setStatus({
        type: 'error',
        message: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state
  if (loading || !content) {
    return (
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2 text-sm font-medium text-muted-foreground">
              <div className="size-1.5 animate-pulse rounded-full bg-primary"></div>
              {locale === "ar" ? "جاري التحميل..." : "Loading..."}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Early return if content is not enabled
  if (!content.enabled) {
    return (
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-5xl">
              {locale === "ar" ? "الصفحة غير متوفرة" : "Page Not Available"}
            </h2>
            <p className="mx-auto max-w-3xl text-lg font-light leading-relaxed text-muted-foreground md:text-xl">
              {locale === "ar" ? "عذراً، صفحة الاتصال غير متاحة حالياً." : "Sorry, the contact page is currently unavailable."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="my-40 py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center md:mb-16">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2 text-sm font-medium text-muted-foreground">
            <div className="size-1.5 animate-pulse rounded-full bg-primary"></div>
            {locale === "ar" ? "جاهز للتواصل" : "Ready to Connect"}
          </div>
          <h2 className="mb-4 text-3xl font-bold md:text-5xl">
            {content.title}
          </h2>
          <p className="mx-auto max-w-3xl text-lg font-light leading-relaxed text-muted-foreground md:text-xl">
            {content.subtitle}
          </p>
        </div>

        {/* Contact Form Card */}
        {content.form?.enabled && (
          <div className="mx-auto max-w-2xl">
            <Card className="border-2">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl md:text-3xl">
                  {locale === "ar" ? "إرسال رسالة" : "Send Message"}
                </CardTitle>
                <CardDescription className="text-base md:text-lg">
                  {locale === "ar" ? "سنتواصل معك خلال 24 ساعة" : "We'll get back to you within 24 hours"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Name Field */}
                    <div className="space-y-2">
                      <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${isRTL ? "text-right" : ""}`}>
                        {locale === "ar" ? "الاسم الكامل" : "Full Name"} <span className="text-destructive">*</span>
                      </label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        minLength={2}
                        placeholder={locale === "ar" ? "أدخل اسمك الكامل" : "Enter your full name"}
                        className={isRTL ? "text-right" : ""}
                        dir={isRTL ? "rtl" : "ltr"}
                      />
                      <p className="text-xs text-muted-foreground">
                        {locale === "ar" ? "يجب أن يكون الاسم على الأقل حرفين" : "Name must be at least 2 characters"}
                      </p>
                    </div>

                    {/* Phone Field */}
                    <div className="space-y-2">
                      <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${isRTL ? "text-right" : ""}`}>
                        {locale === "ar" ? "رقم الهاتف" : "Phone Number"} <span className="text-destructive">*</span>
                      </label>
                      <Input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                        minLength={3}
                        placeholder={locale === "ar" ? "أدخل رقم هاتفك" : "Enter your phone number"}
                        className={isRTL ? "text-right" : ""}
                        dir={isRTL ? "rtl" : "ltr"}
                      />
                      <p className="text-xs text-muted-foreground">
                        {locale === "ar" ? "يجب أن يكون رقم الهاتف على الأقل 3 أرقام" : "Phone number must be at least 3 characters"}
                      </p>
                    </div>
                  </div>

                  {/* Message Field */}
                  <div className="space-y-2">
                    <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${isRTL ? "text-right" : ""}`}>
                      {locale === "ar" ? "رسالتك" : "Your Message"} <span className="text-destructive">*</span>
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      minLength={2}
                      rows={6}
                      placeholder={locale === "ar" ? "اكتب رسالتك هنا..." : "Write your message here..."}
                      className={isRTL ? "text-right" : ""}
                      dir={isRTL ? "rtl" : "ltr"}
                    />
                    <p className="text-xs text-muted-foreground">
                      {locale === "ar" ? "يجب أن تكون الرسالة على الأقل 2 أحرف" : "Message must be at least 2 characters"}
                    </p>
                  </div>

                  {/* Status Message */}
                  {status && (
                    <div className={`flex items-center gap-3 rounded-lg p-4 ${
                      status.type === 'success' 
                        ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                        : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    } ${isRTL ? "flex-row-reverse" : ""}`}>
                      {status.type === 'success' ? (
                        <CheckCircle className="size-5 shrink-0" />
                      ) : (
                        <AlertCircle className="size-5 shrink-0" />
                      )}
                      <p className="text-sm font-medium">{status.message}</p>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full"
                    size="lg"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                        {locale === "ar" ? "جاري الإرسال..." : "Sending..."}
                      </span>
                    ) : (
                      <span className={`flex items-center justify-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <Send className="size-4" />
                        {locale === "ar" ? "إرسال الرسالة" : "Send Message"}
                      </span>
                    )}
                  </Button>

                  {/* Trust indicator */}
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      🔒 {locale === "ar" ? "معلوماتك آمنة ومشفرة" : "Your information is secure and encrypted"}
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

   
      </div>
    </section>
  );
}