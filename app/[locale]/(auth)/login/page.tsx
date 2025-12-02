import { Suspense } from "react";
import { Metadata } from "next";
import { Link } from "@/i18n/routing";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { UserAuthForm } from "@/components/forms/user-auth-form";
import { Icons } from "@/components/shared/icons";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isRTL = params.locale === "ar";
  return {
    title: isRTL ? "تسجيل الدخول" : "Sign In",
    description: isRTL ? "سجل الدخول إلى حسابك" : "Sign in to your account",
  };
}

export default function LoginPage({ params }: { params: { locale: string } }) {
  const locale = params.locale || "en";
  const isRTL = locale === "ar";

  return (
    <div 
      className="container flex h-screen w-screen flex-col items-center justify-center" 
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          isRTL ? "absolute right-4 top-4 md:right-8 md:top-8" : "absolute left-4 top-4 md:left-8 md:top-8",
        )}
      >
        <>
          <Icons.chevronLeft className={isRTL ? "ml-2 size-4" : "mr-2 size-4 rotate-180"} />
          {isRTL ? "العودة" : "Back"}
        </>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Icons.logo className="mx-auto size-6" />
          <h1 className="text-2xl font-semibold tracking-tight">
            {isRTL ? "مرحباً بعودتك" : "Welcome back"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isRTL 
              ? "أدخل بريدك الإلكتروني وكلمة المرور لتسجيل الدخول إلى حسابك"
              : "Enter your email and password to sign in to your account"
            }
          </p>
        </div>
        <Suspense>
          <UserAuthForm locale={locale} />
        </Suspense>
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href="/register"
            className="hover:text-brand underline underline-offset-4"
          >
            {isRTL ? "ليس لديك حساب؟ سجل الآن" : "Don't have an account? Sign up"}
          </Link>
        </p>
      </div>
    </div>
  );
}