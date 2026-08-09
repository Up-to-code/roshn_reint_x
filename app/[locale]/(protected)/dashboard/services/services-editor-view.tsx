import Image from "next/image";
import { Edit, ImageIcon, Plus, Save, Trash2, X } from "lucide-react";

import { CustomUploader } from "@/components/shared/custom-uploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export interface ServiceDraft {
  id: string;
  title: string;
  description: string;
  image: string;
  features: string[];
  order: number;
  enabled: boolean;
}

export interface ServicesPageDraft {
  id: string;
  title: string;
  subtitle: string;
  heroImage: string;
  enabled: boolean;
}

export function ServicesHeroCard({
  page,
  draft,
  saving,
  onEdit,
  onChange,
  onSave,
  onCancel,
}: {
  page: ServicesPageDraft;
  draft: ServicesPageDraft | null;
  saving: boolean;
  onEdit: () => void;
  onChange: (draft: ServicesPageDraft) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-right">القسم الرئيسي</CardTitle>
        <Button
          onClick={draft ? onSave : onEdit}
          disabled={saving}
          className={draft ? "bg-green-600 hover:bg-green-700" : ""}
        >
          {draft ? <Save className="ml-2 size-4" /> : <Edit className="ml-2 size-4" />}
          {draft ? (saving ? "جاري الحفظ..." : "حفظ التغييرات") : "تعديل القسم"}
        </Button>
      </CardHeader>
      <CardContent>
        {draft ? (
          <div className="space-y-4 text-right">
            <label className="block text-sm font-medium text-gray-700">
              العنوان *
              <Input
                value={draft.title}
                onChange={(event) => onChange({ ...draft, title: event.target.value })}
                placeholder="أدخل العنوان الرئيسي"
                required
              />
            </label>
            <label className="block text-sm font-medium text-gray-700">
              الوصف *
              <Textarea
                value={draft.subtitle}
                onChange={(event) => onChange({ ...draft, subtitle: event.target.value })}
                placeholder="أدخل الوصف الفرعي"
                rows={2}
                required
              />
            </label>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">صورة القسم الرئيسي</p>
              <CustomUploader
                bucket="IMAGES"
                onUploadComplete={(heroImage) => onChange({ ...draft, heroImage })}
                buttonText="رفع صورة القسم"
                acceptedFileTypes="image"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={onSave} disabled={saving} className="bg-green-600 hover:bg-green-700">
                <Save className="ml-2 size-4" />
                {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
              </Button>
              <Button variant="outline" onClick={onCancel} disabled={saving}>
                <X className="ml-2 size-4" /> إلغاء
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 text-right md:grid-cols-2">
            <div className="space-y-2">
              <p><strong>العنوان:</strong> {page.title}</p>
              <p><strong>الوصف:</strong> {page.subtitle}</p>
            </div>
            <div className="space-y-2">
              <p><strong>صورة القسم:</strong></p>
              <div className="flex size-24 items-center justify-center overflow-hidden rounded-lg bg-gray-200">
                {page.heroImage ? (
                  <Image src={page.heroImage} alt="معاينة الصورة" width={96} height={96} className="size-full object-cover" />
                ) : <ImageIcon className="size-6 text-gray-400" />}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function ServicesListCard({
  services,
  draft,
  saving,
  onAdd,
  onEdit,
  onDelete,
  onDraftChange,
  onSave,
  onCancel,
}: {
  services: ServiceDraft[];
  draft: ServiceDraft | null;
  saving: boolean;
  onAdd: () => void;
  onEdit: (service: ServiceDraft) => void;
  onDelete: (id: string) => void;
  onDraftChange: (draft: ServiceDraft) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const updateFeature = (index: number, value: string) => {
    if (!draft) return;
    onDraftChange({
      ...draft,
      features: draft.features.map((feature, featureIndex) => featureIndex === index ? value : feature),
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-right">الخدمات ({services.length})</CardTitle>
        <Button onClick={onAdd}><Plus className="ml-2 size-4" />إضافة خدمة</Button>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-3">
          {services.map((service) => (
            <div key={service.id} className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 text-right">
              <div className="flex flex-1 items-start gap-4">
                <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                  {service.image ? (
                    <Image src={service.image} alt={service.title} width={64} height={64} className="size-full object-cover" />
                  ) : <ImageIcon className="size-6 text-gray-400" />}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{service.title}</h3>
                  <p className="line-clamp-2 text-sm text-gray-600">{service.description}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {service.features.slice(0, 3).map((feature) => (
                      <span key={feature} className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">{feature}</span>
                    ))}
                    {service.features.length > 3 && (
                      <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">+{service.features.length - 3} أكثر</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => onEdit(service)}><Edit className="size-4" /></Button>
                <Button variant="outline" size="sm" onClick={() => onDelete(service.id)} className="text-red-600 hover:bg-red-50">
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {draft && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-right">
                {draft.id ? "تعديل الخدمة" : "خدمة جديدة"}
                <Button variant="outline" size="sm" onClick={onCancel}><X className="size-4" /></Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-right">
              <label className="block text-sm font-medium text-gray-700">
                العنوان *
                <Input value={draft.title} onChange={(event) => onDraftChange({ ...draft, title: event.target.value })} required />
              </label>
              <label className="block text-sm font-medium text-gray-700">
                الوصف *
                <Textarea value={draft.description} onChange={(event) => onDraftChange({ ...draft, description: event.target.value })} rows={2} required />
              </label>
              <div>
                <p className="mb-2 text-sm font-medium text-gray-700">صورة الخدمة</p>
                <CustomUploader
                  bucket="IMAGES"
                  onUploadComplete={(image) => onDraftChange({ ...draft, image })}
                  buttonText="رفع صورة الخدمة"
                  acceptedFileTypes="image"
                />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-700">الميزات</p>
                  <Button type="button" size="sm" onClick={() => onDraftChange({ ...draft, features: [...draft.features, "ميزة جديدة"] })}>
                    <Plus className="ml-1 size-4" />إضافة ميزة
                  </Button>
                </div>
                <div className="space-y-2">
                  {draft.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <Input value={feature} onChange={(event) => updateFeature(index, event.target.value)} />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onDraftChange({ ...draft, features: draft.features.filter((_, i) => i !== index) })}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={onSave} disabled={saving} className="bg-green-600 hover:bg-green-700">
                  <Save className="ml-2 size-4" />{saving ? "جاري الحفظ..." : "حفظ الخدمة"}
                </Button>
                <Button variant="outline" onClick={onCancel} disabled={saving}>إلغاء</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
