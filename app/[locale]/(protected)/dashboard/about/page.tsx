import { aboutModule } from "@/lib/about/about-module";
import AboutPageEditor from "./about-editor";

export default async function AboutEditorPage() {
  return <AboutPageEditor initialData={await aboutModule.get()} />;
}
