"use client";
import { useState, useEffect } from "react";
import { useHomePageStore } from "@/store/home-page-store";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HeroEditor } from "@/components/home-page/hero-editor";
import { BannersEditor } from "@/components/home-page/banners-editor";
import { AboutUsEditor } from "@/components/home-page/about-us-editor";
import { TestimonialsEditor } from "@/components/home-page/testimonials-editor";
import { WhyUsEditor } from "@/components/home-page/why-us-editor";
import { ContactUsEditor } from "@/components/home-page/contact-us-editor";
import { PartnersEditor } from "@/components/home-page/partners-editor"; // ✨ جديد
import { Download, Upload, Languages, Save } from "lucide-react";
import { toast } from "sonner";

export default function HomePageEditor() {
  const {
    data,
    currentLang,
    isLoading,
    isSaving,
    setCurrentLang,
    loadData,
    saveData,
    setData,
  } = useHomePageStore();
  const [activeTab, setActiveTab] = useState("hero");

  useEffect(() => {
    loadData();
  }, [loadData]);

  const exportData = () => {
    try {
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `home-page-content-${
        new Date().toISOString().split("T")[0]
      }.json`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 100);
      toast.success("Data exported successfully!");
    } catch (error) {
      toast.error("Error exporting data");
    }
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = JSON.parse(e.target?.result as string);

        if (content.en && content.ar) {
          setData(content);
          toast.success("Data imported successfully! Don't forget to save.");
        } else {
          toast.error("Invalid data structure. Expected { en: ..., ar: ... }");
        }
      } catch (error) {
        toast.error("Error parsing JSON file");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const handleSave = async () => {
    try {
      const success = await saveData();
      if (success) {
        toast.success("Changes saved successfully!");
      } else {
        toast.error("Error saving changes");
      }
    } catch (error) {
      toast.error("Error saving changes");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading editor...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { value: "hero", label: "Hero", component: <HeroEditor /> },
    { value: "banners", label: "Banners", component: <BannersEditor /> },
    { value: "about", label: "About Us", component: <AboutUsEditor /> },
    { value: "testimonials", label: "Testimonials", component: <TestimonialsEditor /> },
    { value: "whyus", label: "Why Choose Us", component: <WhyUsEditor /> },
    { value: "contact", label: "Contact Us", component: <ContactUsEditor /> },
    { value: "partners", label: "Partners", component: <PartnersEditor /> }, // ✨ جديد
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Home Page Editor
              </h1>
              <p className="text-muted-foreground">
                Manage content in multiple languages
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <Languages className="h-4 w-4 text-muted-foreground" />
                <select
                  value={currentLang}
                  onChange={(e) =>
                    setCurrentLang(e.target.value as "en" | "ar")
                  }
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="en">English</option>
                  <option value="ar">Arabic</option>
                </select>
              </div>

              <div className="flex flex-wrap gap-2">
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="hidden"
                  id="import-file"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    document.getElementById("import-file")?.click()
                  }
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </Button>
                <Button variant="outline" size="sm" onClick={exportData}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button size="sm" onClick={handleSave} disabled={isSaving}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="border-b">
            <TabsList className="h-auto w-full justify-start rounded-none bg-transparent p-0">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="
                    relative
                    rounded-none border-b-2 border-transparent
                    px-4 py-3
                    text-sm
                    font-medium transition-colors hover:bg-muted/50 data-[state=active]:border-primary
                    data-[state=active]:bg-transparent
                    data-[state=active]:shadow-none
                  "
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{tab.label} Section</CardTitle>
                  <CardDescription>
                    Current language: {currentLang.toUpperCase()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">{tab.component}</CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
