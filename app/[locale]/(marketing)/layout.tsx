import { FloatingButtons } from "@/components/FloatingButtons";
import { NavBar } from "@/components/layout/navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import { PatternDecor } from "@/components/layout/pattern-decor";

interface MarketingLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function MarketingLayout({ children, params }: MarketingLayoutProps) {
  const { locale } = await params;

  return (
    /*
     * Root wrapper:
     *   - `position: relative`  → anchors the absolutely-positioned pattern layer
     *   - `overflow: hidden`    → clips pattern instances that extend beyond the page width
     *   - Background: brand grey (#F0EDE8) — a warm, neutral grey consistent with ROSHN's palette
     */
    <div
      className="relative flex min-h-screen flex-col overflow-hidden bg-background"
    >
      {/*
       * Pattern decoration layer
       * ─────────────────────────
       * Covers the full height of the page, sits at z-index 0.
       * All page content (navbar, main, footer) sits at z-index 1+
       * so it renders on top of the pattern.
       */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ zIndex: 0 }}
      >
        <PatternDecor />
      </div>

      {/* Page chrome — all at z-index 1 so they appear above the pattern */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <NavBar />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>

      {/* Floating buttons always on top */}
      <FloatingButtons locale={locale} />
    </div>
  );
}
