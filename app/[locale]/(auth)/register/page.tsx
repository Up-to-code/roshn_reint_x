import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/shared/icons"
import { UserAuthForm } from "@/components/forms/user-auth-form"
import { Suspense } from "react"

export const metadata = {
  title: "إنشاء حساب",
  description: "إنشاء حساب جديد للبدء",
}

export default function RegisterPage() {
  return (
    <div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0" dir="rtl">
      <Link
        href="/login"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 md:left-8 md:top-8"
        )}
      >
        تسجيل الدخول
      </Link>
      <div className="hidden h-full bg-muted lg:block" />
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <Icons.logo className="mx-auto size-6" />
            <h1 className="text-2xl font-semibold tracking-tight">
              إنشاء حساب جديد
            </h1>
            <p className="text-sm text-muted-foreground">
              أدخل بريدك الإلكتروني وكلمة المرور لإنشاء حسابك
            </p>
          </div>
          <Suspense>
            <UserAuthForm type="register" />
          </Suspense>
          <p className="px-8 text-center text-sm text-muted-foreground">
            بالضغط على متابعة، فإنك توافق على{" "}
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
          </p>
        </div>
      </div>
    </div>
  )
}