"use client";

import { useGlobalSettingsStore } from "@/store/global-settings-store";
import { Input } from "@/components/ui/input";

export function LogoEditor() {
  const {
    settings: { logo },
    updateLogo,
  } = useGlobalSettingsStore();

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-foreground">Logo Image URL</label>
        <Input
          value={logo.imageUrl}
          onChange={(e) => updateLogo({ imageUrl: e.target.value })}
          placeholder="/logo.png"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-foreground">Alt Text</label>
        <Input
          value={logo.altText}
          onChange={(e) => updateLogo({ altText: e.target.value })}
          placeholder="Company Logo"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-foreground">Width (px)</label>
          <Input
            type="number"
            value={logo.width}
            onChange={(e) => updateLogo({ width: parseInt(e.target.value) || 0 })}
            placeholder="150"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Height (px)</label>
          <Input
            type="number"
            value={logo.height}
            onChange={(e) => updateLogo({ height: parseInt(e.target.value) || 0 })}
            placeholder="50"
          />
        </div>
      </div>

      {logo.imageUrl && (
        <div className="rounded-lg border bg-card p-4">
          <p className="mb-2 text-sm font-medium text-foreground">Preview:</p>
          <img
            src={logo.imageUrl}
            alt={logo.altText}
            width={logo.width}
            height={logo.height}
            className="max-w-xs rounded border bg-white p-2"
          />
        </div>
      )}
    </div>
  );
}