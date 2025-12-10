import { LandingForm } from "@/components/landing/landing-form";
import { LandingLayout } from "@/components/landing/landing-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "روشن ريت - روشن ريزدنس | اتحاد ملاك 5 سنوات مجانا",
  description: "سجل الآن في مشروع روشن ريزدنس واحصل على اتحاد ملاك 5 سنوات مجانا. استثمار آمن ومضمون في أفضل المشاريع العقارية",
  keywords: "روشن ريت, روشن ريزدنس, عقارات, استثمار, اتحاد ملاك",
  openGraph: {
    title: "روشن ريت - روشن ريزدنس",
    description: "سجل الآن واحصل على اتحاد ملاك 5 سنوات مجانا",
    type: "website",
  },
};

export default function LandingPageV1() {
  return (
    <LandingLayout backgroundImage="https://lxlnvkv63w.ufs.sh/f/mB2esVAwkuPDizS16sDmZ5GKUeA6NpfuWJqQIcYLDSdlynM9">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <LandingForm source="روشن ريزدنس" title="روشن ريت" subtitle="اتحاد ملاك ٥ سنوات مجانا" />
      </div>
    </LandingLayout>
  );
}
