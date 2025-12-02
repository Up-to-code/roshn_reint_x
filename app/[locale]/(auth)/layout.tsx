import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";

interface AuthLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }> | { locale: string };
}

export default async function AuthLayout({ children, params }: AuthLayoutProps) {
  // Handle both Promise and direct params (Next.js 15 compatibility)
  const resolvedParams = params instanceof Promise ? await params : params;
  const locale = resolvedParams.locale || "en";

  // Only check user authentication - if user exists, redirect them away from login
  // This is safe because if they're logged in, they shouldn't see login page
  try {
    const user = await getCurrentUser();
    
    // Only redirect if we have a valid authenticated user with all required fields
    // This prevents redirect loops by ensuring we have a real authenticated user
    if (user?.id && user?.email) {
      if (user.role === "ADMIN") {
        redirect(`/${locale}/admin`);
      }
      redirect(`/${locale}/dashboard`);
    }
  } catch (error) {
    // If there's an error getting user, don't redirect - let them access login
    // This prevents redirect loops when session check fails
    // In production, silently fail to avoid console noise
  }

  return <div className="min-h-screen">{children}</div>;
}
