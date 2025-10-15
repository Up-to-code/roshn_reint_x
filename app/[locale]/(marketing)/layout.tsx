import { FloatingButtons } from "@/components/FloatingButtons";
import { NavBar } from "@/components/layout/navbar";
import { SiteFooter } from "@/components/layout/site-footer";
 interface MarketingLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}
 
 

export default function MarketingLayout({ children  , params: { locale } }: MarketingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar   />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <FloatingButtons locale={locale} />
    </div>
  );
}
