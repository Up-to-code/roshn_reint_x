"use client";

import React, { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomUploader } from "@/components/shared/custom-uploader";
import { 
  Building, 
  Users, 
  Award, 
  Target, 
  Heart, 
  Shield,
  TrendingUp,
  MapPin,
  Mail,
  Phone,
  CheckCircle,
  Plus,
  X,
  Save,
  RotateCcw,
  Eye,
  Edit
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Icon mapping
const iconMap: Record<string, any> = {
  Shield,
  Heart,
  Target,
  TrendingUp,
  Building,
  Users,
  Award
};

// Helper function to get localized text
const getLocalizedText = (obj: any, locale: string, fallback: string = '') => {
  if (typeof obj === 'string') return obj;
  if (obj && typeof obj === 'object') {
    return obj[locale] || obj.en || fallback;
  }
  return fallback;
};

// Helper function to update localized text
const updateLocalizedText = (obj: any, locale: string, value: string) => {
  if (typeof obj === 'string') {
    // Convert string to object with current locale
    return { en: obj, [locale]: value };
  }
  if (obj && typeof obj === 'object') {
    return { ...obj, [locale]: value };
  }
  return { en: value, [locale]: value };
};

export default function AboutPageEditor() {
  const t = useTranslations("aboutEditor");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [aboutData, setAboutData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");
  const [previewMode, setPreviewMode] = useState(false);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/about');
        const result = await response.json();
        
        if (result.success && result.data) {
          setAboutData(result.data);
        } else {
          // Initialize empty structure if no data exists
          setAboutData({
            hero: {
              badge: { en: "", ar: "" },
              title: { en: "", ar: "" },
              subtitle: { en: "", ar: "" }
            },
            story: {
              title: { en: "", ar: "" },
              paragraph1: { en: "", ar: "" },
              paragraph2: { en: "", ar: "" },
              paragraph3: { en: "", ar: "" },
              image: "",
              yearsInBusiness: { en: "", ar: "" }
            },
            stats: [],
            values: [],
            team: [],
            cta: {
              title: { en: "", ar: "" },
              subtitle: { en: "", ar: "" }
            },
            contact: {
              address: { en: "", ar: "" },
              phone: { en: "", ar: "" },
              email: { en: "", ar: "" }
            }
          });
        }
      } catch (error) {
        console.error('Failed to fetch about data:', error);
        toast.error(t("fetchError"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [t]);

  // Save data to API
  const saveData = async () => {
    try {
      setIsLoading(true);
      
      // First, save the about data to the separate JSON file
      const aboutResponse = await fetch('/api/about', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ about: aboutData }),
      });
      
      if (!aboutResponse.ok) {
        throw new Error('Failed to save about data');
      }
      
      // Then update the settings to reference the about data
      const settingsResponse = await fetch('/api/about/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          settings: { 
            aboutDataUpdated: new Date().toISOString() 
          } 
        }),
      });
      
      if (settingsResponse.ok) {
        toast.success(t("saveSuccess"));
      } else {
        throw new Error('Failed to update settings');
      }
    } catch (error) {
      console.error('Failed to save about data:', error);
      toast.error(t("saveError"));
    } finally {
      setIsLoading(false);
    }
  };

  // Reset data
  const resetData = async () => {
    try {
      setIsLoading(true);
      
      // Reset the about data to default
      const aboutResponse = await fetch('/api/about?action=reset', {
        method: 'PUT',
      });
      
      if (!aboutResponse.ok) {
        throw new Error('Failed to reset about data');
      }
      
      const aboutResult = await aboutResponse.json();
      
      if (aboutResult.success) {
        setAboutData(aboutResult.data);
        
        // Update settings to reflect the reset
        await fetch('/api/about/settings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            settings: { 
              aboutDataReset: new Date().toISOString() 
            } 
          }),
        });
        
        toast.success(t("resetSuccess"));
      } else {
        throw new Error('Failed to reset about data');
      }
    } catch (error) {
      console.error('Failed to reset about data:', error);
      toast.error(t("resetError"));
    } finally {
      setIsLoading(false);
    }
  };

  // Update functions
  const updateHero = (field: string, value: string) => {
    if (!aboutData) return;
    setAboutData(prev => ({
      ...prev,
      hero: { 
        ...prev.hero, 
        [field]: updateLocalizedText(prev.hero[field], locale, value)
      }
    }));
  };

  const updateStory = (field: string, value: string) => {
    if (!aboutData) return;
    setAboutData(prev => ({
      ...prev,
      story: { 
        ...prev.story, 
        [field]: field === 'image' || field === 'yearsInBusiness' 
          ? value 
          : updateLocalizedText(prev.story[field], locale, value)
      }
    }));
  };

  const updateStat = (index: number, field: string, value: string) => {
    if (!aboutData) return;
    setAboutData(prev => ({
      ...prev,
      stats: prev.stats.map((stat, i) => 
        i === index 
          ? { 
              ...stat, 
              [field]: updateLocalizedText(stat[field], locale, value)
            } 
          : stat
      )
    }));
  };

  const updateValue = (id: number, field: string, value: string) => {
    if (!aboutData) return;
    setAboutData(prev => ({
      ...prev,
      values: prev.values.map(val => 
        val.id === id 
          ? { 
              ...val, 
              [field]: updateLocalizedText(val[field], locale, value)
            } 
          : val
      )
    }));
  };

  const updateTeamMember = (id: number, field: string, value: string) => {
    if (!aboutData) return;
    setAboutData(prev => ({
      ...prev,
      team: prev.team.map(member => 
        member.id === id 
          ? { 
              ...member, 
              [field]: field === 'avatar' 
                ? value 
                : updateLocalizedText(member[field], locale, value)
            } 
          : member
      )
    }));
  };

  const addTeamMember = () => {
    if (!aboutData) return;
    const newId = Math.max(...aboutData.team.map((m: any) => m.id), 0) + 1;
    setAboutData(prev => ({
      ...prev,
      team: [...prev.team, {
        id: newId,
        name: { en: "", ar: "" },
        role: { en: "", ar: "" },
        avatar: "",
        description: { en: "", ar: "" }
      }]
    }));
  };

  const removeTeamMember = (id: number) => {
    if (!aboutData) return;
    setAboutData(prev => ({
      ...prev,
      team: prev.team.filter((member: any) => member.id !== id)
    }));
  };

  const updateCTA = (field: string, value: string) => {
    if (!aboutData) return;
    setAboutData(prev => ({
      ...prev,
      cta: { 
        ...prev.cta, 
        [field]: updateLocalizedText(prev.cta[field], locale, value)
      }
    }));
  };

  const updateContact = (field: string, value: string) => {
    if (!aboutData) return;
    setAboutData(prev => ({
      ...prev,
      contact: { 
        ...prev.contact, 
        [field]: updateLocalizedText(prev.contact[field], locale, value)
      }
    }));
  };

  const addStat = () => {
    if (!aboutData) return;
    setAboutData(prev => ({
      ...prev,
      stats: [...prev.stats, {
        value: { en: "", ar: "" },
        label: { en: "", ar: "" }
      }]
    }));
  };

  const removeStat = (index: number) => {
    if (!aboutData) return;
    setAboutData(prev => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== index)
    }));
  };

  const addValue = () => {
    if (!aboutData) return;
    const newId = Math.max(...aboutData.values.map((v: any) => v.id), 0) + 1;
    setAboutData(prev => ({
      ...prev,
      values: [...prev.values, {
        id: newId,
        icon: "Shield",
        title: { en: "", ar: "" },
        description: { en: "", ar: "" }
      }]
    }));
  };

  const removeValue = (id: number) => {
    if (!aboutData) return;
    setAboutData(prev => ({
      ...prev,
      values: prev.values.filter((value: any) => value.id !== id)
    }));
  };

  if (!aboutData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <div className="text-center">
          <div className="mx-auto mb-4 size-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600"></div>
          <p className="text-zinc-600 dark:text-zinc-400">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (previewMode) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
        <div className="sticky top-0 z-50 border-b border-zinc-200 bg-zinc-100 p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="container mx-auto flex justify-between">
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              {t("previewTitle")}
            </h1>
            <Button onClick={() => setPreviewMode(false)} variant="outline">
              <Edit className="mr-2 size-4" />
              {t("backToEditor")}
            </Button>
          </div>
        </div>
        
        {/* Enhanced Preview content */}
        <div className="container mx-auto p-8">
          <div className="rounded-lg border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {t("previewMode")}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              {t("previewDescription")}
            </p>
            
            {/* Hero Section Preview */}
            <div className="mt-8 rounded-lg bg-zinc-900 p-8 text-white">
              <Badge className="mb-4 bg-zinc-800 text-zinc-300">
                {getLocalizedText(aboutData.hero?.badge, locale, t("badge"))}
              </Badge>
              <h1 className="mb-4 text-3xl font-bold">
                {getLocalizedText(aboutData.hero?.title, locale, t("title"))}
              </h1>
              <p className="text-lg text-zinc-300">
                {getLocalizedText(aboutData.hero?.subtitle, locale, t("subtitle"))}
              </p>
            </div>

            {/* Story Section Preview */}
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div>
                {aboutData.story?.image && (
                  <img 
                    src={aboutData.story.image} 
                    alt="Our Story" 
                    className="h-64 w-full rounded-lg object-cover"
                  />
                )}
              </div>
              <div>
                <h3 className="mb-4 text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  {getLocalizedText(aboutData.story?.title, locale, t("storyTitle"))}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {getLocalizedText(aboutData.story?.paragraph1, locale, t("storyParagraph1"))}
                </p>
              </div>
            </div>

            {/* Stats Preview */}
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              {aboutData.stats?.map((stat: any, index: number) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    {getLocalizedText(stat.value, locale)}
                  </div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    {getLocalizedText(stat.label, locale)}
                  </div>
                </div>
              ))}
            </div>

            {/* Values Preview */}
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {aboutData.values?.map((value: any, index: number) => {
                const Icon = iconMap[value.icon] || Shield;
                return (
                  <div key={index} className="rounded-lg border border-zinc-200 bg-white p-4 text-center dark:border-zinc-700 dark:bg-zinc-900">
                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                      <Icon className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
                    </div>
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {getLocalizedText(value.title, locale)}
                    </h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {getLocalizedText(value.description, locale)}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Team Preview */}
            <div className="mt-8">
              <h3 className="mb-4 text-xl font-bold text-zinc-900 dark:text-zinc-100">
                {t("teamTitle")}
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {aboutData.team?.map((member: any) => (
                  <div key={member.id} className="rounded-lg border border-zinc-200 bg-white p-4 text-center dark:border-zinc-700 dark:bg-zinc-900">
                    <Avatar className="mx-auto mb-2 h-16 w-16">
                      <AvatarImage src={member.avatar} alt={getLocalizedText(member.name, locale)} />
                      <AvatarFallback className="bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                        {getLocalizedText(member.name, locale).split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {getLocalizedText(member.name, locale)}
                    </h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {getLocalizedText(member.role, locale)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Preview */}
            <div className="mt-8 rounded-lg bg-zinc-900 p-8 text-center text-white">
              <h3 className="mb-2 text-xl font-bold">
                {getLocalizedText(aboutData.cta?.title, locale, t("ctaTitle"))}
              </h3>
              <p className="mb-4 text-zinc-300">
                {getLocalizedText(aboutData.cta?.subtitle, locale, t("ctaSubtitle"))}
              </p>
              <Button className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200">
                {t("contactUs")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="sticky top-0 z-50 border-b border-zinc-200 bg-zinc-100 p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="container mx-auto flex justify-between">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            {t("editorTitle")}
          </h1>
          <div className="flex gap-2">
            <Button 
              onClick={() => setPreviewMode(true)} 
              variant="outline"
              disabled={isLoading}
            >
              <Eye className="mr-2 size-4" />
              {t("preview")}
            </Button>
            <Button 
              onClick={resetData} 
              variant="outline"
              disabled={isLoading}
            >
              <RotateCcw className="mr-2 size-4" />
              {t("reset")}
            </Button>
            <Button 
              onClick={saveData} 
              disabled={isLoading}
            >
              <Save className="mr-2 size-4" />
              {isLoading ? t("saving") : t("save")}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8 grid w-full grid-cols-6">
            <TabsTrigger value="hero">{t("tabs.hero")}</TabsTrigger>
            <TabsTrigger value="story">{t("tabs.story")}</TabsTrigger>
            <TabsTrigger value="stats">{t("tabs.stats")}</TabsTrigger>
            <TabsTrigger value="values">{t("tabs.values")}</TabsTrigger>
            <TabsTrigger value="team">{t("tabs.team")}</TabsTrigger>
            <TabsTrigger value="cta">{t("tabs.cta")}</TabsTrigger>
          </TabsList>

          {/* Hero Section */}
          <TabsContent value="hero" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("sections.hero.title")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {t("sections.hero.badge")}
                  </label>
                  <Input
                    value={getLocalizedText(aboutData.hero?.badge, locale)}
                    onChange={(e) => updateHero("badge", e.target.value)}
                    placeholder={t("sections.hero.badgePlaceholder")}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {t("sections.hero.title")}
                  </label>
                  <Input
                    value={getLocalizedText(aboutData.hero?.title, locale)}
                    onChange={(e) => updateHero("title", e.target.value)}
                    placeholder={t("sections.hero.titlePlaceholder")}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {t("sections.hero.subtitle")}
                  </label>
                  <Textarea
                    value={getLocalizedText(aboutData.hero?.subtitle, locale)}
                    onChange={(e) => updateHero("subtitle", e.target.value)}
                    placeholder={t("sections.hero.subtitlePlaceholder")}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Story Section */}
          <TabsContent value="story" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("sections.story.title")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {t("sections.story.storyTitle")}
                  </label>
                  <Input
                    value={getLocalizedText(aboutData.story?.title, locale)}
                    onChange={(e) => updateStory("title", e.target.value)}
                    placeholder={t("sections.story.titlePlaceholder")}
                  />
                </div>
                {[1, 2, 3].map((num) => (
                  <div key={num}>
                    <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {t(`sections.story.paragraph${num}`)}
                    </label>
                    <Textarea
                      value={getLocalizedText(aboutData.story?.[`paragraph${num}`], locale)}
                      onChange={(e) => updateStory(`paragraph${num}`, e.target.value)}
                      placeholder={t(`sections.story.paragraph${num}Placeholder`)}
                      rows={4}
                    />
                  </div>
                ))}
                
                {/* Story Image Upload */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {t("sections.story.image")}
                  </label>
                  <div className="mb-4">
                    {aboutData.story?.image && (
                      <div className="relative h-40 w-full overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
                        <img 
                          src={aboutData.story.image} 
                          alt="Story" 
                          className="size-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                  <CustomUploader
                    bucket="IMAGES"
                    acceptedFileTypes="image"
                    multiple={false}
                    maxFiles={1}
                    buttonText={t("sections.story.uploadImage")}
                    onUploadComplete={(url) => updateStory("image", url)}
                  />
                </div>
                
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {t("sections.story.yearsInBusiness")}
                  </label>
                  <Input
                    value={aboutData.story?.yearsInBusiness || ""}
                    onChange={(e) => updateStory("yearsInBusiness", e.target.value)}
                    placeholder={t("sections.story.yearsPlaceholder")}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stats Section */}
          <TabsContent value="stats" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{t("sections.stats.title")}</CardTitle>
                <Button onClick={addStat} size="sm">
                  <Plus className="mr-2 size-4" />
                  {t("sections.stats.addStat")}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {aboutData.stats?.map((stat: any, index: number) => (
                  <div key={index} className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        {t("sections.stats.value")}
                      </label>
                      <Input
                        value={getLocalizedText(stat.value, locale)}
                        onChange={(e) => updateStat(index, "value", e.target.value)}
                        placeholder={t("sections.stats.valuePlaceholder")}
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          {t("sections.stats.label")}
                        </label>
                        <Input
                          value={getLocalizedText(stat.label, locale)}
                          onChange={(e) => updateStat(index, "label", e.target.value)}
                          placeholder={t("sections.stats.labelPlaceholder")}
                        />
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeStat(index)}
                        className="text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {(!aboutData.stats || aboutData.stats.length === 0) && (
                  <p className="py-8 text-center text-zinc-500 dark:text-zinc-400">
                    {t("sections.stats.noStats")}
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Values Section */}
          <TabsContent value="values" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{t("sections.values.title")}</CardTitle>
                <Button onClick={addValue} size="sm">
                  <Plus className="mr-2 size-4" />
                  {t("sections.values.addValue")}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {aboutData.values?.map((value: any) => (
                  <div key={value.id} className="space-y-4 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {iconMap[value.icon] && (
                          <div className="flex size-8 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                            {React.createElement(iconMap[value.icon], { className: "h-4 w-4 text-zinc-600 dark:text-zinc-400" })}
                          </div>
                        )}
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">
                          {getLocalizedText(value.title, locale)}
                        </span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeValue(value.id)}
                        className="text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        {t("sections.values.title")}
                      </label>
                      <Input
                        value={getLocalizedText(value.title, locale)}
                        onChange={(e) => updateValue(value.id, "title", e.target.value)}
                        placeholder={t("sections.values.titlePlaceholder")}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        {t("sections.values.description")}
                      </label>
                      <Textarea
                        value={getLocalizedText(value.description, locale)}
                        onChange={(e) => updateValue(value.id, "description", e.target.value)}
                        placeholder={t("sections.values.descriptionPlaceholder")}
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
                {(!aboutData.values || aboutData.values.length === 0) && (
                  <p className="py-8 text-center text-zinc-500 dark:text-zinc-400">
                    {t("sections.values.noValues")}
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Section */}
          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{t("sections.team.title")}</CardTitle>
                <Button onClick={addTeamMember} size="sm">
                  <Plus className="mr-2 size-4" />
                  {t("sections.team.addMember")}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {aboutData.team?.map((member: any) => (
                  <div key={member.id} className="space-y-4 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-12">
                          <AvatarImage src={member.avatar} alt={getLocalizedText(member.name, locale)} />
                          <AvatarFallback className="bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                            {getLocalizedText(member.name, locale).split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
                            {getLocalizedText(member.name, locale)}
                          </h3>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            {getLocalizedText(member.role, locale)}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeTeamMember(member.id)}
                        className="text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          {t("sections.team.name")}
                        </label>
                        <Input
                          value={getLocalizedText(member.name, locale)}
                          onChange={(e) => updateTeamMember(member.id, "name", e.target.value)}
                          placeholder={t("sections.team.namePlaceholder")}
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          {t("sections.team.role")}
                        </label>
                        <Input
                          value={getLocalizedText(member.role, locale)}
                          onChange={(e) => updateTeamMember(member.id, "role", e.target.value)}
                          placeholder={t("sections.team.rolePlaceholder")}
                        />
                      </div>
                    </div>
                    
                    {/* Team Member Avatar Upload */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        {t("sections.team.avatar")}
                      </label>
                      <div className="mb-4">
                        {member.avatar && (
                          <div className="relative size-20 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
                            <img 
                              src={member.avatar} 
                              alt={getLocalizedText(member.name, locale)} 
                              className="size-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                      <CustomUploader
                        bucket="IMAGES"
                        acceptedFileTypes="image"
                        multiple={false}
                        maxFiles={1}
                        buttonText={t("sections.team.uploadAvatar")}
                        onUploadComplete={(url) => updateTeamMember(member.id, "avatar", url)}
                      />
                    </div>
                    
                    <div>
                      <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        {t("sections.team.description")}
                      </label>
                      <Textarea
                        value={getLocalizedText(member.description, locale)}
                        onChange={(e) => updateTeamMember(member.id, "description", e.target.value)}
                        placeholder={t("sections.team.descriptionPlaceholder")}
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
                {(!aboutData.team || aboutData.team.length === 0) && (
                  <p className="py-8 text-center text-zinc-500 dark:text-zinc-400">
                    {t("sections.team.noTeam")}
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* CTA & Contact Section */}
          <TabsContent value="cta" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("sections.cta.title")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {t("sections.cta.ctaTitle")}
                  </label>
                  <Input
                    value={getLocalizedText(aboutData.cta?.title, locale)}
                    onChange={(e) => updateCTA("title", e.target.value)}
                    placeholder={t("sections.cta.titlePlaceholder")}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {t("sections.cta.subtitle")}
                  </label>
                  <Textarea
                    value={getLocalizedText(aboutData.cta?.subtitle, locale)}
                    onChange={(e) => updateCTA("subtitle", e.target.value)}
                    placeholder={t("sections.cta.subtitlePlaceholder")}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("sections.contact.title")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {["address", "phone", "email"].map((field) => (
                  <div key={field}>
                    <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {t(`sections.contact.${field}`)}
                    </label>
                    <Textarea
                      value={getLocalizedText(aboutData.contact?.[field], locale)}
                      onChange={(e) => updateContact(field, e.target.value)}
                      placeholder={t(`sections.contact.${field}Placeholder`)}
                      rows={field === "address" ? 3 : 2}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}