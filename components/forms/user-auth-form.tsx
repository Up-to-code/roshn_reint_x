"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { LoginSchema, RegisterSchema } from "@/schemas";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Icons } from "@/components/shared/icons";
import { login } from "@/actions/login";
import { register as registerAction } from "@/actions/register";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "login" | "register";
}

type LoginFormData = z.infer<typeof LoginSchema>;
type RegisterFormData = z.infer<typeof RegisterSchema>;

export function UserAuthForm({ className, type = "login", ...props }: UserAuthFormProps) {
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
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  async function onSubmit(data: LoginFormData | RegisterFormData) {
    setIsLoading(true);

    try {
      if (isRegister) {
        // Registration flow
        const result = await registerAction(data as RegisterFormData);
        
        if (result.error) {
          setIsLoading(false);
          return toast.error("Registration failed", {
            description: result.error,
          });
        }

        // After successful registration, sign in the user
        const signInResult = await signIn("credentials", {
          email: (data as RegisterFormData).email,
          password: (data as RegisterFormData).password,
          redirect: false,
        });

        setIsLoading(false);

        if (!signInResult?.ok) {
          return toast.error("Sign in failed", {
            description: "Please try logging in manually.",
          });
        }

        toast.success("Account created!", {
          description: "Welcome! Redirecting to dashboard...",
        });

        router.push(searchParams?.get("from") || "/dashboard");
      } else {
        // Login flow
        const result = await login(data as LoginFormData);
        
        if (result.error) {
          setIsLoading(false);
          return toast.error("Login failed", {
            description: result.error,
          });
        }

        // Sign in with NextAuth after credentials are verified
        const signInResult = await signIn("credentials", {
          email: (data as LoginFormData).email,
          password: (data as LoginFormData).password,
          redirect: false,
        });

        setIsLoading(false);

        if (!signInResult?.ok) {
          return toast.error("Something went wrong", {
            description: "Please try again.",
          });
        }

        toast.success("Welcome back!", {
          description: "Redirecting to dashboard...",
        });

        router.push(searchParams?.get("from") || "/dashboard");
      }
    } catch (error) {
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
                disabled={isLoading || isGoogleLoading}
                {...register("name")}
              />
              {errors?.name && "name" in errors && (
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
              disabled={isLoading || isGoogleLoading}
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
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              autoComplete={isRegister ? "new-password" : "current-password"}
              disabled={isLoading || isGoogleLoading}
              {...register("password")}
            />
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
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <button
        type="button"
        className={cn(buttonVariants({ variant: "outline" }))}
        onClick={() => {
          setIsGoogleLoading(true);
          signIn("google");
        }}
        disabled={isLoading || isGoogleLoading}
      >
        {isGoogleLoading ? (
          <Icons.spinner className="mr-2 size-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 size-4" />
        )}{" "}
        Google
      </button>
    </div>
  );
}
