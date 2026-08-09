import { serviceModule } from "@/lib/services/service-module";
import ServicesEditor from "./services-editor";

export default async function ServicesEditorPage() {
  const [initialPage, initialServices] = await Promise.all([
    serviceModule.getPage(),
    serviceModule.listEditor(),
  ]);
  return <ServicesEditor initialPage={initialPage} initialServices={initialServices} />;
}
