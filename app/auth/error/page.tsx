"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

const AuthError = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return {
          title: "Configuration Error",
          description: "There is a problem with the server configuration. Please contact support if this problem persists.",
        };
      case "AccessDenied":
        return {
          title: "Access Denied",
          description: "You do not have permission to sign in. Please contact your administrator.",
        };
      case "Verification":
        return {
          title: "Verification Error",
          description: "The verification token has expired or has already been used. Please try again.",
        };
      case "Default":
      default:
        return {
          title: "Authentication Error",
          description: "An unexpected error occurred during authentication. Please try again.",
        };
    }
  };

  const errorInfo = getErrorMessage(error);

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <AlertCircle className="mx-auto h-6 w-6 text-red-500" />
          <h1 className="text-2xl font-semibold tracking-tight">
            {errorInfo.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {errorInfo.description}
          </p>
        </div>
        
        <div className="space-y-2">
          <Button asChild className="w-full">
            <Link href="/login">
              Try Again
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/">
              Go Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthError />
    </Suspense>
  );
}
