"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { userAuthSchema } from "@/lib/validations/auth";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Icons } from "@/components/shared/icons";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: string;
}

type FormData = z.infer<typeof userAuthSchema>;

export function UserAuthForm({ className, type, ...props }: UserAuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    try {
      if (type === "register") {
        // Handle registration separately
        const response = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
            name: data.email.split('@')[0], // Use email prefix as name
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Registration failed");
        }

        // After successful registration, sign in
        const signInResult = await signIn("credentials", {
          email: data.email.toLowerCase(),
          password: data.password,
          redirect: false,
        });

        if (signInResult?.error) {
          toast.error("فشل تسجيل الدخول بعد التسجيل", {
            description: "تم إنشاء الحساب ولكن فشل تسجيل الدخول. يرجى المحاولة مرة أخرى."
          });
        } else {
          toast.success("تم إنشاء الحساب بنجاح!", {
            description: "تم إنشاء حسابك وتسجيل الدخول بنجاح.",
          });
          const callbackUrl = searchParams?.get("from") || "/dashboard";
          router.push(callbackUrl);
        }
      } else {
        // Handle login
        const signInResult = await signIn("credentials", {
          email: data.email.toLowerCase(),
          password: data.password,
          redirect: false,
        });

        if (signInResult?.error) {
          toast.error("فشل تسجيل الدخول", {
            description: "البريد الإلكتروني أو كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى."
          });
        } else {
          toast.success("مرحباً بعودتك!", {
            description: "تم تسجيل الدخول بنجاح.",
          });
          const callbackUrl = searchParams?.get("from") || "/dashboard";
          router.push(callbackUrl);
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      
      // Handle specific error cases
      if (error.message.includes("User already exists")) {
        toast.error("فشل التسجيل", {
          description: "هذا البريد الإلكتروني مستخدم بالفعل. يرجى استخدام بريد إلكتروني مختلف."
        });
      } else if (error.message.includes("Registration failed")) {
        toast.error("فشل إنشاء الحساب", {
          description: "تعذر إنشاء الحساب. يرجى المحاولة مرة أخرى."
        });
      } else {
        toast.error("حدث خطأ ما", {
          description: "فشل طلب المصادقة. يرجى المحاولة مرة أخرى."
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props} dir="rtl">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">
              البريد الإلكتروني
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              {...register("email")}
            />
            {errors?.email && (
              <p className="px-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="password">
              كلمة المرور
            </Label>
            <Input
              id="password"
              placeholder="أدخل كلمة المرور"
              type="password"
              autoComplete={type === "register" ? "new-password" : "current-password"}
              disabled={isLoading}
              {...register("password")}
            />
            {errors?.password && (
              <p className="px-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <button 
            className={cn(buttonVariants())} 
            disabled={isLoading}
            type="submit"
          >
            {isLoading && (
              <Icons.spinner className="ml-2 size-4 animate-spin" />
            )}
            {type === "register" ? "إنشاء حساب" : "تسجيل الدخول"}
          </button>
        </div>
      </form>
    </div>
  );
}