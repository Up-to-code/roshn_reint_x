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

  // Check if user is authenticated - if yes, redirect to dashboard
  // This prevents authenticated users from accessing login/register pages
  try {
    const user = await getCurrentUser();
    
    // If user is authenticated (has id and email), redirect them to dashboard
    if (user?.id && user?.email) {
      // Redirect based on user role
      if (user.role === "ADMIN") {
        redirect(`/${locale}/admin`);
      }
      // Regular users go to dashboard
      redirect(`/${locale}/dashboard`);
    }
  } catch (error) {
    // If there's an error getting user, allow access to login page
    // This prevents redirect loops when session check fails
  }

  // User is not authenticated, show login/register page
  return <div className="min-h-screen">{children}</div>;
}
