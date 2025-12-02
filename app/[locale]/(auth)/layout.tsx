import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";

interface AuthLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function AuthLayout({ children, params }: AuthLayoutProps) {
  const user = await getCurrentUser();
  const locale = params.locale || "en";

  if (user) {
    if (user.role === "ADMIN") {
      redirect(`/${locale}/admin`);
    }
    redirect(`/${locale}/dashboard`);
  }

  return <div className="min-h-screen">{children}</div>;
}
