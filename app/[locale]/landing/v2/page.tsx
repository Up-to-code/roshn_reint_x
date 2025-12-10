import { LandingForm } from "@/components/landing/landing-form";
import { LandingLayout } from "@/components/landing/landing-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "روشن ريت - روشن هيلز | كاش باك 10 الف ريال",
  description: "سجل الآن في مشروع روشن هيلز واحصل على كاش باك 10 الف ريال. استثمار مميز في أرقى المشاريع العقارية",
  keywords: "روشن ريت, روشن هيلز, عقارات, كاش باك, استثمار عقاري",
  openGraph: {
    title: "روشن ريت - روشن هيلز",
    description: "سجل الآن واحصل على كاش باك 10 الف ريال",
    type: "website",
  },
};

export default function LandingPageV2() {
  return (
    <LandingLayout backgroundImage="https://lxlnvkv63w.ufs.sh/f/mB2esVAwkuPDi7llSTDmZ5GKUeA6NpfuWJqQIcYLDSdlynM9" overlayColor="bg-black/60">
      {/* V2 variation: slightly different animation or positioning could go here */}
      <div className="w-full max-w-md animate-in slide-in-from-bottom-10 fade-in duration-700">
        <LandingForm source="روشن هيلز" title="روشن ريت" subtitle="كاش باك ١٠ الف ريال" />
      </div>
    </LandingLayout>
  );
}
