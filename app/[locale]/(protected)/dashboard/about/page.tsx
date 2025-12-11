"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CustomUploader } from "@/components/shared/custom-uploader";
import { Save, Eye, ImageIcon, Plus, X } from "lucide-react";

interface AboutPageData {
  id?: string;
  data: {
    hero: {
      title: string;
      subtitle: string;
      image: string;
    };
    vision: {
      title: string;
      description: string;
    };
    mission: {
      title: string;
      description: string;
    };
    goals: string[];
    tagline: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

// Default data structure
const defaultAboutData = {
  data: {
    hero: {
      title: "من نحن",
      subtitle: "درة العقارية، مطور عقاري معتمد من وزارة الإسكان، تقدم مجموعة متكاملة من الخدمات العقارية. مقرها في مدينة جدة، بدأت أولى أعمالها في عام 2017. وصلت إلى أكثر من 51 مشروعًا سكنيًا، واستطاعت من خلال أسعارها التنافسية تغطية شريحة واسعة ومكَّنت آلاف العائلات من تملك منازلهم.",
      image: ""
    },
    vision: {
      title: "الرؤية",
      description: "تقديم خدمات عقارية متميزة ومتكاملة من خلال الابتكار والاستدامة والتميز في كل جانب."
    },
    mission: {
      title: "الرسالة", 
      description: "توفير فرص استثمارية وسكنية استثنائية في قطاع العقارات وتحقيق تجربة فريدة لعملائنا."
    },
    goals: [
      "توفير خدمات متكاملة تمتد من فكرة شراء العقار إلى ما بعد البيع",
      "تسهيل عمليات البحث عن العقار واختياره وشرائه وتملكه",
      "تنويع خيارات المساحات والديكور وكذلك المنطقة السكنية"
    ],
    tagline: "توفير فرص استثمارية وسكنية استثنائية في قطاع العقارات، وتحقيق تجربة متفوقة لعملائنا."
  }
};

export default function AboutPageEditor() {
  const [aboutData, setAboutData] = useState<AboutPageData>(defaultAboutData);
  const [previewMode, setPreviewMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch existing data
  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/about');
      if (response.ok) {
        const result = await response.json();
        if (result && result.data) {
          // Handle both response structures
          const fetchedData = result.data.data || result.data;
          setAboutData({
            data: {
              ...defaultAboutData.data, // Use defaults as fallback
              ...fetchedData // Override with fetched data
            }
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch about data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveAboutData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/about', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(aboutData),
      });

      if (response.ok) {
        alert('تم حفظ البيانات بنجاح');
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Failed to save about data:', error);
      alert('فشل في حفظ البيانات');
    } finally {
      setLoading(false);
    }
  };

  // Safe data access with fallbacks
  const getHeroData = () => aboutData?.data?.hero || defaultAboutData.data.hero;
  const getVisionData = () => aboutData?.data?.vision || defaultAboutData.data.vision;
  const getMissionData = () => aboutData?.data?.mission || defaultAboutData.data.mission;
  const getGoalsData = () => aboutData?.data?.goals || defaultAboutData.data.goals;
  const getTaglineData = () => aboutData?.data?.tagline || defaultAboutData.data.tagline;

  const updateHero = (field: string, value: string) => {
    setAboutData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        hero: {
          ...prev.data.hero,
          [field]: value
        }
      }
    }));
  };

  const updateVision = (field: string, value: string) => {
    setAboutData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        vision: {
          ...prev.data.vision,
          [field]: value
        }
      }
    }));
  };

  const updateMission = (field: string, value: string) => {
    setAboutData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        mission: {
          ...prev.data.mission,
          [field]: value
        }
      }
    }));
  };

  const updateGoal = (index: number, value: string) => {
    setAboutData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        goals: prev.data.goals.map((goal, i) => i === index ? value : goal)
      }
    }));
  };

  const addGoal = () => {
    setAboutData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        goals: [...prev.data.goals, "هدف جديد"]
      }
    }));
  };

  const removeGoal = (index: number) => {
    setAboutData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        goals: prev.data.goals.filter((_, i) => i !== index)
      }
    }));
  };

  const updateTagline = (value: string) => {
    setAboutData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        tagline: value
      }
    }));
  };

  const handleHeroImageUpload = (url: string) => {
    updateHero('image', url);
  };

  if (previewMode) {
    const heroData = getHeroData();
    const visionData = getVisionData();
    const missionData = getMissionData();
    const goalsData = getGoalsData();
    const taglineData = getTaglineData();

    return (
      <div className="min-h-screen " dir="rtl">
        <div className=" top-0 z-50  p-4">
          <div className="container mx-auto flex justify-between">
            <h1 className="text-xl font-bold">معاينة صفحة من نحن</h1>
            <Button type="button" onClick={() => setPreviewMode(false)} variant="outline">
              العودة إلى المحرر
            </Button>
          </div>
        </div>

        {/* Preview Content */}
        <main className="my-40 w-full bg-white text-gray-700">
          {/* Hero */}
          <section className="w-full px-6 py-16 md:px-20">
            <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
              {/* Image */}
              <div className="overflow-hidden rounded-xl shadow-lg">
                <img
                  src={heroData.image || "https://dorrah.sa/wp-content/uploads/2023/12/2023-12-24-20.34.01.jpg"}
                  alt="مشروع درة العقارية"
                  className="h-auto w-full rounded-xl object-cover"
                />
              </div>

              {/* Text */}
              <div className="text-right">
                <h2 className="mb-4 text-3xl font-bold text-[#D35400] md:text-4xl">
                  {heroData.title}
                </h2>
                <p className="text-lg leading-8 text-gray-600">
                  {heroData.subtitle}
                </p>
              </div>
            </div>
          </section>

          {/* Short tagline */}
          <section className="w-full px-6 md:px-20">
            <div className="mx-auto max-w-6xl text-center">
              <p className="text-lg text-gray-600 md:text-xl">
                {taglineData}
              </p>
            </div>
          </section>

          {/* Vision & Mission */}
          <section className="w-full px-6 py-16 md:px-20">
            <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
              <div className="rounded-2xl border-l-4 border-[#D35400] bg-gray-50 p-8 text-right shadow-sm">
                <h4 className="mb-2 text-xl font-semibold text-[#D35400]">
                  {visionData.title}
                </h4>
                <p className="leading-7 text-gray-600">
                  {visionData.description}
                </p>
              </div>

              <div className="rounded-2xl border-l-4 border-[#D35400] bg-gray-50 p-8 text-right shadow-sm">
                <h4 className="mb-2 text-xl font-semibold text-[#D35400]">
                  {missionData.title}
                </h4>
                <p className="leading-7 text-gray-600">
                  {missionData.description}
                </p>
              </div>
            </div>
          </section>

          {/* Goals */}
          <section className="w-full px-6 py-12 md:px-20">
            <div className="mx-auto max-w-6xl">
              <div className="mb-8 text-right">
                <h3 className="text-3xl font-bold text-[#374151]">الأهداف</h3>
                <p className="mt-2 text-gray-600">لنجعل حياتك أجمل، أسهل، وأسعد... نهدف دوماً إلى:</p>
              </div>

              <div className="space-y-6">
                {goalsData.map((goal, idx) => (
                  <div key={idx} className="flex items-start gap-4 rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="flex size-12 items-center justify-center rounded-full font-bold text-white bg-[#D35400]">
                      {idx + 1}
                    </div>
                    <p className="leading-7 text-gray-700">{goal}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  // Safe data access for editor
  const heroData = getHeroData();
  const visionData = getVisionData();
  const missionData = getMissionData();
  const goalsData = getGoalsData();
  const taglineData = getTaglineData();

  return (
    <div className="min-h-screen  p-6" dir="rtl">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="text-right">
            <h1 className="text-2xl font-bold text-gray-900">محرر صفحة من نحن</h1>
            <p className="mt-1 text-gray-600">تعديل محتوى صفحة من نحن</p>
          </div>
          <div className="flex gap-2">
            <Button type="button" onClick={() => setPreviewMode(true)} variant="outline">
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
                onChange={(e) => updateHero('title', e.target.value)}
                placeholder="عنوان القسم الرئيسي"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">الوصف</label>
              <Textarea
                value={heroData.subtitle}
                onChange={(e) => updateHero('subtitle', e.target.value)}
                placeholder="وصف القسم الرئيسي"
                rows={4}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">صورة القسم الرئيسي</label>
              <CustomUploader
                bucket="IMAGES"
                onUploadComplete={handleHeroImageUpload}
                buttonText="رفع صورة القسم الرئيسي"
                multiple={false}
                acceptedFileTypes="image"
              />
              {heroData.image && (
                <div className="mt-2">
                  <img 
                    src={heroData.image} 
                    alt="معاينة الصورة" 
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
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>الرؤية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">عنوان الرؤية</label>
                <Input
                  value={visionData.title}
                  onChange={(e) => updateVision('title', e.target.value)}
                  placeholder="عنوان الرؤية"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">وصف الرؤية</label>
                <Textarea
                  value={visionData.description}
                  onChange={(e) => updateVision('description', e.target.value)}
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
                <label className="mb-2 block text-sm font-medium">عنوان الرسالة</label>
                <Input
                  value={missionData.title}
                  onChange={(e) => updateMission('title', e.target.value)}
                  placeholder="عنوان الرسالة"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">وصف الرسالة</label>
                <Textarea
                  value={missionData.description}
                  onChange={(e) => updateMission('description', e.target.value)}
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
                <div className="flex size-8 items-center justify-center rounded-full bg-[#D35400] text-white text-sm">
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