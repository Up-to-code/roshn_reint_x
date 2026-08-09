import { serviceModule } from "@/lib/services/service-module";
import ServicesClient from "./services-client";

export const revalidate = 300;

export default async function ServicesPage() {
  const [services, page] = await Promise.all([
    serviceModule.listPublic(),
    serviceModule.getPage(),
  ]);

  if (!page.enabled) return null;
  return <ServicesClient services={services} page={page} />;
}
