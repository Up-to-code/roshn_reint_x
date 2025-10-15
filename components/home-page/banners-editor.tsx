"use client";

import { useState } from "react";
import { useHomePageStore } from "@/store/home-page-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CustomUploader } from "@/components/shared/custom-uploader";
import { Plus, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function BannersEditor() {
  const { data, currentLang, addBanner, updateBanner, removeBanner } = useHomePageStore();
  const banners = data[currentLang].banners;
  const [newBanner, setNewBanner] = useState({
    title: '', description: '', image: '', link: '', position: 'top' as const
  });

  const handleAddBanner = () => {
    if (newBanner.title && newBanner.description) {
      addBanner({ id: Date.now().toString(), ...newBanner });
      setNewBanner({ title: '', description: '', image: '', link: '', position: 'top' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-medium">Current Banners</h3>
        <div className="space-y-3">
          {banners.map((banner) => (
            <div key={banner.id} className="space-y-3 rounded-lg border p-4">
              <Input
                value={banner.title}
                onChange={(e) => updateBanner(banner.id, { title: e.target.value })}
                placeholder="Banner title"
              />
              <Input
                value={banner.description}
                onChange={(e) => updateBanner(banner.id, { description: e.target.value })}
                placeholder="Banner description"
              />
              <Input
                value={banner.image}
                onChange={(e) => updateBanner(banner.id, { image: e.target.value })}
                placeholder="Image URL"
                className="mb-2"
              />
              <CustomUploader
                 onUploadComplete={(url) => updateBanner(banner.id, { image: url })}
                buttonText="Upload Banner Image"
              />
              <Input
                value={banner.link}
                onChange={(e) => updateBanner(banner.id, { link: e.target.value })}
                placeholder="Link URL"
              />
              <Select value={banner.position} onValueChange={(value: any) => updateBanner(banner.id, { position: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top">Top</SelectItem>
                  <SelectItem value="middle">Middle</SelectItem>
                  <SelectItem value="bottom">Bottom</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => removeBanner(banner.id)}>
                <Trash2 className="h-4 w-4" />
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border bg-muted/50 p-4">
        <h3 className="mb-3 font-medium">Add New Banner</h3>
        <div className="space-y-3">
          <Input
            value={newBanner.title}
            onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
            placeholder="Banner title"
          />
          <Input
            value={newBanner.description}
            onChange={(e) => setNewBanner({ ...newBanner, description: e.target.value })}
            placeholder="Banner description"
          />
          <Input
            value={newBanner.image}
            onChange={(e) => setNewBanner({ ...newBanner, image: e.target.value })}
            placeholder="Image URL"
            className="mb-2"
          />
          <CustomUploader
             onUploadComplete={(url) => setNewBanner({ ...newBanner, image: url })}
            buttonText="Upload Banner Image"
          />
          <Input
            value={newBanner.link}
            onChange={(e) => setNewBanner({ ...newBanner, link: e.target.value })}
            placeholder="Link URL"
          />
          <Select value={newBanner.position} onValueChange={(value: any) => setNewBanner({ ...newBanner, position: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="top">Top</SelectItem>
              <SelectItem value="middle">Middle</SelectItem>
              <SelectItem value="bottom">Bottom</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleAddBanner} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Banner
          </Button>
        </div>
      </div>
    </div>
  );
}