import { LandingForm } from "@/components/landing/landing-form";
import { LandingLayout } from "@/components/landing/landing-layout";

export default function LandingPageV2() {
  return (
    <LandingLayout backgroundImage="https://images.unsplash.com/photo-1616550886768-89dc93cf2d73?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" overlayColor="bg-black/60">
      {/* V2 variation: slightly different animation or positioning could go here */}
      <div className="w-full max-w-md animate-in slide-in-from-bottom-10 fade-in duration-700">
        <LandingForm source="Roshn Hills" title="روشن هيلز" subtitle="كاش باك ١٠ الف ريال" />
      </div>
    </LandingLayout>
  );
}
