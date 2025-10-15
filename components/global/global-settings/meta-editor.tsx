"use client";

import { useGlobalSettingsStore } from "@/store/global-settings-store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function MetaEditor() {
  const {
    settings: { meta },
    updateMeta,
  } = useGlobalSettingsStore();

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-foreground">Site Title</label>
        <Input
          value={meta.title}
          onChange={(e) => updateMeta({ title: e.target.value })}
          placeholder="My Awesome Website"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-foreground">Author</label>
        <Input
          value={meta.author}
          onChange={(e) => updateMeta({ author: e.target.value })}
          placeholder="My Company"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-foreground">Description</label>
        <Textarea
          value={meta.description}
          onChange={(e) => updateMeta({ description: e.target.value })}
          placeholder="A brief description of your website"
          rows={3}
        />
      </div>

      <div>
        <label className="text-sm font-medium text-foreground">Keywords</label>
        <Input
          value={meta.keywords}
          onChange={(e) => updateMeta({ keywords: e.target.value })}
          placeholder="keyword1, keyword2, keyword3"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Separate keywords with commas
        </p>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground">Open Graph Image URL</label>
        <Input
          value={meta.ogImage}
          onChange={(e) => updateMeta({ ogImage: e.target.value })}
          placeholder="/og-image.jpg"
        />
      </div>
    </div>
  );
}