"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useHomePageStore } from "@/store/home-page-store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CustomUploader } from "@/components/shared/custom-uploader";
import { Plus, Trash2, Star } from "lucide-react";

export function TestimonialsEditor() {
  const t = useTranslations('homePageEditor.testimonials');
  const { data, currentLang, updateTestimonials, addTestimonial, updateTestimonial, removeTestimonial } = useHomePageStore();
  const testimonials = data[currentLang].testimonials;
  const [newTestimonial, setNewTestimonial] = useState({
    name: '', position: '', company: '', content: '', avatar: '', rating: 5
  });

  const handleAddTestimonial = () => {
    if (newTestimonial.name && newTestimonial.content) {
      addTestimonial({ id: Date.now().toString(), ...newTestimonial });
      setNewTestimonial({ name: '', position: '', company: '', content: '', avatar: '', rating: 5 });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <Input
          value={testimonials.title}
          onChange={(e) => updateTestimonials({ title: e.target.value })}
          placeholder={t('sectionTitle')}
          dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
        />
        <Input
          value={testimonials.subtitle}
          onChange={(e) => updateTestimonials({ subtitle: e.target.value })}
          placeholder={t('sectionSubtitle')}
          dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
        />
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">{t('testimonials')}</h3>
        <div className="space-y-3">
          {testimonials.testimonials.map((testimonial) => (
            <div key={testimonial.id} className="space-y-3 rounded-lg border p-4">
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={testimonial.name}
                  onChange={(e) => updateTestimonial(testimonial.id, { name: e.target.value })}
                  placeholder={t('clientName')}
                  dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
                />
                <Input
                  value={testimonial.position}
                  onChange={(e) => updateTestimonial(testimonial.id, { position: e.target.value })}
                  placeholder={t('position')}
                  dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>
              <Input
                value={testimonial.company}
                onChange={(e) => updateTestimonial(testimonial.id, { company: e.target.value })}
                placeholder={t('company')}
                dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
              />
              <Textarea
                value={testimonial.content}
                onChange={(e) => updateTestimonial(testimonial.id, { content: e.target.value })}
                placeholder={t('testimonialContent')}
                rows={3}
                dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
              />
              <Input
                value={testimonial.avatar}
                onChange={(e) => updateTestimonial(testimonial.id, { avatar: e.target.value })}
                placeholder={t('avatarUrl')}
                className="mb-2"
              />
              <CustomUploader
                onUploadComplete={(url) => updateTestimonial(testimonial.id, { avatar: url })}
                acceptedFileTypes="image"
              />
              <div className="flex items-center gap-2">
                <span className="text-sm">{t('rating')}:</span>
                {[1,2,3,4,5].map((star) => (
                  <button
                    key={star}
                    onClick={() => updateTestimonial(testimonial.id, { rating: star })}
                    className="text-yellow-400"
                  >
                    <Star className={`h-4 w-4 ${star <= testimonial.rating ? 'fill-current' : ''}`} />
                  </button>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={() => removeTestimonial(testimonial.id)}>
                <Trash2 className="h-4 w-4" />
                {t('remove')}
              </Button>
            </div>
          ))}
        </div>

        <div className="rounded-lg border bg-muted/50 p-4">
          <h4 className="mb-3 font-medium">{t('addNewTestimonial')}</h4>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={newTestimonial.name}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                placeholder={t('clientName')}
                dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
              />
              <Input
                value={newTestimonial.position}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, position: e.target.value })}
                placeholder={t('position')}
                dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
            <Input
              value={newTestimonial.company}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, company: e.target.value })}
              placeholder={t('company')}
              dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
            />
            <Textarea
              value={newTestimonial.content}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, content: e.target.value })}
              placeholder={t('testimonialContent')}
              rows={3}
              dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
            />
            <Input
              value={newTestimonial.avatar}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, avatar: e.target.value })}
              placeholder={t('avatarUrl')}
              className="mb-2"
            />
            <CustomUploader
              onUploadComplete={(url) => setNewTestimonial({ ...newTestimonial, avatar: url })}
              acceptedFileTypes="image"
            />
            <Button onClick={handleAddTestimonial} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              {t('addTestimonial')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}