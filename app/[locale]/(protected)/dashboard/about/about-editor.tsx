"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, Plus, Save, X } from "lucide-react";
import { toast } from "sonner";

import type { AboutData } from "@/lib/about/about-core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CustomUploader } from "@/components/shared/custom-uploader";

import { AboutPreview } from "./about-preview";

export default function AboutPageEditor({
  initialData,
}: {
  initialData: AboutData;
}) {
  const [aboutData, setAboutData] = useState(initialData);
  const [previewMode, setPreviewMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const saveAboutData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/about", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: aboutData }),
      });

      if (!response.ok) throw new Error("Failed to save");
      toast.success("تم حفظ البيانات بنجاح");
    } catch {
      toast.error("فشل في حفظ البيانات");
    } finally {
      setLoading(false);
    }
  };

  const updateSection = <K extends "hero" | "vision" | "mission">(
    section: K,
    field: keyof AboutData[K],
    value: string,
  ) =>
    setAboutData((current) => ({
      ...current,
      [section]: { ...current[section], [field]: value },
    }));

  const updateGoal = (index: number, value: string) => {
    setAboutData((current) => ({
      ...current,
      goals: current.goals.map((goal, i) => (i === index ? value : goal)),
    }));
  };

  const addGoal = () => {
    setAboutData((current) => ({
      ...current,
      goals: [...current.goals, "هدف جديد"],
    }));
  };

  const removeGoal = (index: number) => {
    setAboutData((current) => ({
      ...current,
      goals: current.goals.filter((_, i) => i !== index),
    }));
  };

  const updateTagline = (value: string) => {
    setAboutData((current) => ({ ...current, tagline: value }));
  };

  const handleHeroImageUpload = (url: string) => {
    updateSection("hero", "image", url);
  };

  if (previewMode) {
    return (
      <AboutPreview data={aboutData} onClose={() => setPreviewMode(false)} />
    );
  }

  // Safe data access for editor
  const {
    hero: heroData,
    vision: visionData,
    mission: missionData,
    goals: goalsData,
    tagline: taglineData,
  } = aboutData;

  return (
    <div className="min-h-screen p-6" dir="rtl">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="text-right">
            <h1 className="text-2xl font-bold text-gray-900">
              محرر صفحة من نحن
            </h1>
            <p className="mt-1 text-gray-600">تعديل محتوى صفحة من نحن</p>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={() => setPreviewMode(true)}
              variant="outline"
            >
              <Eye className="ml-2 size-4" />
              معاينة
            </Button>
            <Button type="button" onClick={saveAboutData} disabled={loading}>
              <Save className="ml-2 size-4" />
              {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
            </Button>
          </div>
        </div>

        {/* Hero Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>القسم الرئيسي</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">العنوان</label>
              <Input
                value={heroData.title}
                onChange={(e) => updateSection("hero", "title", e.target.value)}
                placeholder="عنوان القسم الرئيسي"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">الوصف</label>
              <Textarea
                value={heroData.subtitle}
                onChange={(e) =>
                  updateSection("hero", "subtitle", e.target.value)
                }
                placeholder="وصف القسم الرئيسي"
                rows={4}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                صورة القسم الرئيسي
              </label>
              <CustomUploader
                bucket="IMAGES"
                onUploadComplete={handleHeroImageUpload}
                buttonText="رفع صورة القسم الرئيسي"
                multiple={false}
                acceptedFileTypes="image"
              />
              {heroData.image && (
                <div className="mt-2">
                  <Image
                    src={heroData.image}
                    alt="معاينة الصورة"
                    width={240}
                    height={128}
                    className="h-32 w-auto rounded-lg object-cover"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tagline */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>الشعار</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <label className="mb-2 block text-sm font-medium">الشعار</label>
              <Input
                value={taglineData}
                onChange={(e) => updateTagline(e.target.value)}
                placeholder="الشعار الرئيسي للصفحة"
              />
            </div>
          </CardContent>
        </Card>

        {/* Vision & Mission */}
        <div className="mb-6 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>الرؤية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  عنوان الرؤية
                </label>
                <Input
                  value={visionData.title}
                  onChange={(e) =>
                    updateSection("vision", "title", e.target.value)
                  }
                  placeholder="عنوان الرؤية"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">
                  وصف الرؤية
                </label>
                <Textarea
                  value={visionData.description}
                  onChange={(e) =>
                    updateSection("vision", "description", e.target.value)
                  }
                  placeholder="وصف الرؤية"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>الرسالة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  عنوان الرسالة
                </label>
                <Input
                  value={missionData.title}
                  onChange={(e) =>
                    updateSection("mission", "title", e.target.value)
                  }
                  placeholder="عنوان الرسالة"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">
                  وصف الرسالة
                </label>
                <Textarea
                  value={missionData.description}
                  onChange={(e) =>
                    updateSection("mission", "description", e.target.value)
                  }
                  placeholder="وصف الرسالة"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Goals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>الأهداف</CardTitle>
            <Button type="button" onClick={addGoal} size="sm">
              <Plus className="ml-2 size-4" />
              إضافة هدف
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {goalsData.map((goal, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-full bg-[#D35400] text-sm text-white">
                  {index + 1}
                </div>
                <Input
                  value={goal}
                  onChange={(e) => updateGoal(index, e.target.value)}
                  placeholder="أدخل الهدف"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeGoal(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="size-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
