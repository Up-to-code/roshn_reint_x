import { notFound, redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";

interface ProtectedLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function Dashboard({ children, params }: ProtectedLayoutProps) {
  const user = await getCurrentUser();
  const locale = params.locale || "en";

  if (!user || user.role !== "ADMIN") {
    redirect(`/${locale}/login`);
  }

  return <>{children}</>;
}
