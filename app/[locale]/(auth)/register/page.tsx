import { Suspense } from "react";
import { Metadata } from "next";
import { Link } from "@/i18n/routing";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";
import { UserAuthForm } from "@/components/forms/user-auth-form";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isRTL = params.locale === "ar";
  return {
    title: isRTL ? "إنشاء حساب" : "Create an account",
    description: isRTL ? "إنشاء حساب للبدء" : "Create an account to get started.",
  };
}

export default function RegisterPage({ params }: { params: { locale: string } }) {
  const locale = params.locale || "en";
  const isRTL = locale === "ar";

  return (
    <div 
      className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Link
        href="/login"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          isRTL ? "absolute right-4 top-4 md:right-8 md:top-8" : "absolute left-4 top-4 md:left-8 md:top-8"
        )}
      >
        {isRTL ? "تسجيل الدخول" : "Login"}
      </Link>
      <div className="hidden h-full bg-muted lg:block" />
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <Icons.logo className="mx-auto size-6" />
            <h1 className="text-2xl font-semibold tracking-tight">
              {isRTL ? "إنشاء حساب" : "Create an account"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isRTL 
                ? "أدخل بياناتك لإنشاء حسابك"
                : "Enter your details to create your account"
              }
            </p>
          </div>
          <Suspense>
            <UserAuthForm type="register" locale={locale} />
          </Suspense>
          <p className="px-8 text-center text-sm text-muted-foreground">
            {isRTL ? (
              <>
                بالضغط على المتابعة، أنت توافق على{" "}
                <Link
                  href="/terms"
                  className="hover:text-brand underline underline-offset-4"
                >
                  شروط الخدمة
                </Link>{" "}
                و{" "}
                <Link
                  href="/privacy"
                  className="hover:text-brand underline underline-offset-4"
                >
                  سياسة الخصوصية
                </Link>
                .
              </>
            ) : (
              <>
                By clicking continue, you agree to our{" "}
                <Link
                  href="/terms"
                  className="hover:text-brand underline underline-offset-4"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="hover:text-brand underline underline-offset-4"
                >
                  Privacy Policy
                </Link>
                .
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
