"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { X, Loader2 } from "lucide-react";
import { submitLead } from "@/actions/submit-lead";
import { useState } from "react";
import { toast } from "sonner";

// Schema definition
const formSchema = z.object({
  firstName: z.string().min(2, { message: "First name is required" }),
  lastName: z.string().min(2, { message: "Last name is required" }),
  phone: z.string().min(8, { message: "Valid phone number is required" }),
});

interface LandingFormProps {
  onClose?: () => void;
  source?: string;
  title?: string;
  subtitle?: string;
}

export function LandingForm({ onClose, source = "Landing Page", title, subtitle }: LandingFormProps) {
  const t = useTranslations("landing");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const result = await submitLead({
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        source: source,
      });

      if (result.success) {
        setIsSuccess(true);
        toast.success(t("successMessage", { defaultMessage: "Successfully registered!" }));
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
       toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
      return (
        <Card className="w-full max-w-md border-none shadow-xl bg-white/95 backdrop-blur-sm relative pt-12 sm:pt-14 overflow-visible mx-auto">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-black flex items-center justify-center z-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://lxlnvkv63w.ufs.sh/f/mB2esVAwkuPDCFDc0Hgy8bYAKU3WZvrs21Ej4GIk76MmOXao" alt="Logo" className="w-full h-full object-cover" />
             </div>
             <CardHeader className="relative space-y-2 text-center pb-6 mt-6 sm:mt-8 px-4 sm:px-6">
                <h2 className="text-xl sm:text-2xl font-bold text-green-600">{t("thankYou", {defaultMessage: "Thank You!"})}</h2>
                <p className="text-center text-base sm:text-lg text-gray-700 px-2">
                    {t("successDescription", {defaultMessage: "We have received your details and will contact you shortly."})}
                </p>
             </CardHeader>
        </Card>
      )
  }

  return (
    <Card className="w-full max-w-md border-none shadow-xl bg-white/95 backdrop-blur-sm relative pt-12 sm:pt-14 overflow-visible mx-auto">
       <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-black flex items-center justify-center z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://lxlnvkv63w.ufs.sh/f/mB2esVAwkuPDCFDc0Hgy8bYAKU3WZvrs21Ej4GIk76MmOXao" alt="Logo" className="w-full h-full object-cover" />
       </div>
      <CardHeader className="relative space-y-2 text-center pb-2 mt-6 sm:mt-8 px-4 sm:px-6">
         {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8 text-muted-foreground"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        )}
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{title || t("formTitle")}</h2>
        <p className="text-center text-sm sm:text-base text-gray-600 font-medium px-2">
            {subtitle || t("formSubtitle")}
        </p>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-6 sm:pb-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="text-right rtl:text-right space-y-1">
                  <FormLabel className="text-gray-700 font-semibold">{t("firstName")}</FormLabel>
                   <FormControl>
                    <Input placeholder={t("placeholders.firstName")} {...field} className="text-right h-11 bg-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="text-right rtl:text-right space-y-1">
                  <FormLabel className="text-gray-700 font-semibold">{t("lastName")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("placeholders.lastName")} {...field} className="text-right h-11 bg-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="text-right rtl:text-right space-y-1">
                  <FormLabel className="text-gray-700 font-semibold">{t("phone")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("placeholders.phone")} type="tel" {...field} className="text-right h-11 bg-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[#FFE600] hover:bg-[#E6CF00] text-black font-bold text-lg mt-6 h-12 rounded-full transition-all shadow-md active:scale-95"
            >
              {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t("submitting", {defaultMessage: "Submitting..."})}
                  </>
              ) : (
                  t("submit")
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
