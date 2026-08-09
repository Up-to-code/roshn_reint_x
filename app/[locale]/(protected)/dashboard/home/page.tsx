import { siteContentModule } from "@/lib/site-content/site-content-module";
import HomePageEditor from "./home-page-editor";

export default async function HomePageEditorPage() {
  return <HomePageEditor initialData={await siteContentModule.getHomePage()} />;
}
