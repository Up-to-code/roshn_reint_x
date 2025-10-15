"use client";

import { useState } from "react";
import { useHomePageStore } from "@/store/home-page-store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CustomUploader } from "@/components/shared/custom-uploader";
import { Plus, Trash2 } from "lucide-react";

export function WhyUsEditor() {
  const { data, currentLang, updateWhyUs, addFeature, updateFeature, removeFeature } = useHomePageStore();
  const whyUs = data[currentLang].whyUs;
  const [newFeature, setNewFeature] = useState({ icon: '', title: '', description: '' });

  const handleAddFeature = () => {
    if (newFeature.title && newFeature.description) {
      addFeature({ id: Date.now().toString(), ...newFeature });
      setNewFeature({ icon: '', title: '', description: '' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <Input
          value={whyUs.title}
          onChange={(e) => updateWhyUs({ title: e.target.value })}
          placeholder="Section Title"
        />
        <Input
          value={whyUs.subtitle}
          onChange={(e) => updateWhyUs({ subtitle: e.target.value })}
          placeholder="Section Subtitle"
        />
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Features</h3>
        <div className="space-y-3">
          {whyUs.features.map((feature) => (
            <div key={feature.id} className="space-y-3 rounded-lg border p-4">
              <Input
                value={feature.icon}
                onChange={(e) => updateFeature(feature.id, { icon: e.target.value })}
                placeholder="Icon URL or emoji"
                className="mb-2"
              />
              <CustomUploader
                onUploadComplete={(url) => updateFeature(feature.id, { icon: url })}
                buttonText="Upload Icon"
              />
              <Input
                value={feature.title}
                onChange={(e) => updateFeature(feature.id, { title: e.target.value })}
                placeholder="Feature title"
              />
              <Textarea
                value={feature.description}
                onChange={(e) => updateFeature(feature.id, { description: e.target.value })}
                placeholder="Feature description"
                rows={2}
              />
              <Button variant="outline" size="sm" onClick={() => removeFeature(feature.id)}>
                <Trash2 className="size-4" />
                Remove
              </Button>
            </div>
          ))}
        </div>

        <div className="rounded-lg border bg-muted/50 p-4">
          <h4 className="mb-3 font-medium">Add New Feature</h4>
          <div className="space-y-3">
            <Input
              value={newFeature.icon}
              onChange={(e) => setNewFeature({ ...newFeature, icon: e.target.value })}
              placeholder="Icon URL or emoji"
              className="mb-2"
            />
            <CustomUploader
              onUploadComplete={(url) => setNewFeature({ ...newFeature, icon: url })}
              buttonText="Upload Icon"
            />
            <Input
              value={newFeature.title}
              onChange={(e) => setNewFeature({ ...newFeature, title: e.target.value })}
              placeholder="Feature title"
            />
            <Textarea
              value={newFeature.description}
              onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
              placeholder="Feature description"
              rows={2}
            />
            <Button onClick={handleAddFeature} className="w-full">
              <Plus className="mr-2 size-4" />
              Add Feature
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}