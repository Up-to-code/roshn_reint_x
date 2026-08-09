import { siteContentModule } from "@/lib/site-content/site-content-module";
import ContactClient from "./contact-client";

export const revalidate = 300;

export default async function ContactPage({ params }: { params: { locale: string } }) {
  const locale = params.locale === "ar" ? "ar" : "en";
  const content = (await siteContentModule.getLocalizedHomePage(locale)).contactUs;
  return <ContactClient locale={locale} content={content} />;
}
