import { LandingForm } from "@/components/landing/landing-form";
import { LandingLayout } from "@/components/landing/landing-layout";

export default function LandingPageV1() {
  return (
    <LandingLayout backgroundImage="https://images.unsplash.com/photo-1616550886768-89dc93cf2d73?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <LandingForm source="روشن ريزدنس" title="روشن ريت" subtitle="اتحاد ملاك ٥ سنوات مجانا" />
      </div>
    </LandingLayout>
  );
}
