import { Locale, routing } from "@/i18n/routing";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import localFont from "next/font/local";
import { Tajawal } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";

import "@/styles/globals.css";
import { SessionProvider } from "@/components/providers/session-provider";
import { ThemeProvider } from "next-themes";
import ModalProvider from "@/components/modals/providers";
import { Toaster } from "sonner";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { PostHogProvider } from "@/components/providers/posthog-provider";
import { GoogleAnalytics } from "@/components/providers/google-analytics";
import { PageTransition } from "@/components/providers/page-transition";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
  display: "swap",
});

const dinNext = localFont({
  src: [
    {
      path: "../../public/DINNextLTArabic-Medium-4.ttf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-din-next",
});

export const metadata: Metadata = {
  title: "روشن ريت",
  description: "روشن ريت - مشروع درب الحرمين في جدة",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} suppressHydrationWarning>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-G9PD0DJV58"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-G9PD0DJV58');
          `}
        </Script>
        {/* Google Tag Manager */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-ML25M3LS');`,
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body
        className={`${tajawal.variable} ${dinNext.className} bg-background antialiased`}
        suppressHydrationWarning
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-ML25M3LS"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <PostHogProvider>
          <NextIntlClientProvider messages={messages}>
            <SessionProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem={false}
                disableTransitionOnChange
              >
                <GoogleAnalytics />
                <PageTransition />
                <ModalProvider>{children}</ModalProvider>
                <Analytics />
                <SpeedInsights />
                <Toaster richColors closeButton />
                <TailwindIndicator />
              </ThemeProvider>
            </SessionProvider>
          </NextIntlClientProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
