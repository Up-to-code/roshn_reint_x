import { LandingForm } from "@/components/landing/landing-form";
import { LandingLayout } from "@/components/landing/landing-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "روشن ريت - روشن ريزدنس | اتحاد ملاك 5 سنوات مجانا",
  description: "سجل اهتمامك الآن في مشروع روشن ريزدنس - اتحاد ملاك 5 سنوات مجانا. Register your interest now in Roshn Residence project.",
  keywords: "روشن ريت, روشن ريزدنس, عقارات, استثمار, اتحاد ملاك",
  openGraph: {
    title: "روشن ريت - روشن ريزدنس",
    description: "سجل اهتمامك الآن | Register Your Interest",
    type: "website",
  },
};

export default function LandingPageV1() {
  return (
    <LandingLayout backgroundImage="https://lxlnvkv63w.ufs.sh/f/mB2esVAwkuPDizS16sDmZ5GKUeA6NpfuWJqQIcYLDSdlynM9" overlayColor="bg-transparent">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <LandingForm source="روشن ريزدنس" title="روشن ريت" subtitle="روشن ريزدنس اتحاد ملاك ٥ سنوات مجانا" />
      </div>
    </LandingLayout>
  );
}
