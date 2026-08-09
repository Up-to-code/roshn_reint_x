import { Globe } from "lucide-react";
import LocaleSwitcherSelect from "./LocaleSwitcherSelect";

export default function LocaleSwitcher() {
  return (
    <div className="flex items-center gap-2">
      <Globe className="size-4 text-muted-foreground" />
      <LocaleSwitcherSelect label="Select a locale" />
    </div>
  );
}
