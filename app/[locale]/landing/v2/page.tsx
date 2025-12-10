import { LandingForm } from "@/components/landing/landing-form";
import { LandingLayout } from "@/components/landing/landing-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "روشن ريت - روشن هيلز | كاش باك 10 الف ريال",
  description: "سجل اهتمامك الآن في مشروع روشن هيلز - كاش باك 10 الف ريال. Register your interest now in Roshn Hills project.",
  keywords: "روشن ريت, روشن هيلز, عقارات, كاش باك, استثمار عقاري",
  openGraph: {
    title: "روشن ريت - روشن هيلز",
    description: "سجل اهتمامك الآن | Register Your Interest",
    type: "website",
  },
};

export default function LandingPageV2() {
  return (
    <LandingLayout backgroundImage="https://lxlnvkv63w.ufs.sh/f/mB2esVAwkuPDi7llSTDmZ5GKUeA6NpfuWJqQIcYLDSdlynM9" overlayColor="bg-transparent">
      {/* V2 variation: slightly different animation or positioning could go here */}
      <div className="w-full max-w-md animate-in slide-in-from-bottom-10 fade-in duration-700">
        <LandingForm source="روشن هيلز" title="روشن ريت" subtitle="مشروع روشن هيلز (كاش باك ١٠ الف ريال)" />
      </div>
    </LandingLayout>
  );
}
