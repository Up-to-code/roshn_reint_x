"use client";

import * as React from "react";
import { Link } from "@/i18n/routing";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, signUp } from "@/lib/auth-client";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { LoginSchema, RegisterSchema } from "@/schemas";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Icons } from "@/components/shared/icons";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "login" | "register";
  locale?: string;
}

type LoginFormData = z.infer<typeof LoginSchema>;
type RegisterFormData = z.infer<typeof RegisterSchema>;

export function UserAuthForm({ className, type = "login", locale: propLocale, ...props }: UserAuthFormProps) {
  const isRegister = type === "register";
  const schema = isRegister ? RegisterSchema : LoginSchema;
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData | RegisterFormData>({
    resolver: zodResolver(schema),
  });
  
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const locale = propLocale === "ar" ? "ar" : "en";

  async function onSubmit(data: LoginFormData | RegisterFormData) {
    setIsLoading(true);

    try {
      if (isRegister) {
        const { error } = await signUp.email({
          email: (data as RegisterFormData).email,
          password: (data as RegisterFormData).password,
          name: (data as RegisterFormData).name,
        });

        setIsLoading(false);

        if (error) {
          return toast.error("Registration failed", {
            description: error.message || "Please try again.",
          });
        }

        // Session cookie is set immediately by Better Auth
        toast.success("Account created!", {
          description: "Welcome! Redirecting to dashboard...",
        });

        window.location.href = `/${locale}/dashboard`;
      } else {
        const { error } = await signIn.email({
          email: (data as LoginFormData).email,
          password: (data as LoginFormData).password,
        });

        if (error) {
          setIsLoading(false);
          return toast.error("Login failed", {
            description: error.message || "Please try again.",
          });
        }

        // Session cookie is set immediately by Better Auth
        toast.success("Welcome back!", {
          description: "Redirecting to dashboard...",
        });

        window.location.href = `/${locale}/dashboard`;
      }
    } catch {
      setIsLoading(false);
      return toast.error("Something went wrong", {
        description: "Please try again later.",
      });
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          {isRegister && (
            <div className="grid gap-1">
              <Label htmlFor="name">
                Name
              </Label>
              <Input
                id="name"
                placeholder="John Doe"
                type="text"
                autoCapitalize="words"
                autoComplete="name"
                disabled={isLoading}
                {...register("name")}
              />
              {"name" in errors && errors.name && (
                <p className="px-1 text-xs text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>
          )}
          <div className="grid gap-1">
            <Label htmlFor="email">
              Email
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
          <div className="grid gap-1">
            <Label htmlFor="password">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                autoComplete={isRegister ? "new-password" : "current-password"}
                disabled={isLoading}
                className={cn(
                  locale === "ar" ? "pl-10" : "pr-10"
                )}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors",
                  locale === "ar" ? "left-3" : "right-3"
                )}
                tabIndex={-1}
                disabled={isLoading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {errors?.password && (
              <p className="px-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
          <button className={cn(buttonVariants())} disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            )}
            {isRegister ? "Create Account" : "Sign In"}
          </button>
        </div>
      </form>
    </div>
  );
}
