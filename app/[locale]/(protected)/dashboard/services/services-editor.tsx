"use client";

import { useState } from "react";
import posthog from "posthog-js";
import { toast } from "sonner";

import {
  ServicesHeroCard,
  ServicesListCard,
  type ServiceDraft,
  type ServicesPageDraft,
} from "./services-editor-view";

export default function ServicesEditor({
  initialPage,
  initialServices,
}: {
  initialPage: ServicesPageDraft;
  initialServices: ServiceDraft[];
}) {
  const [servicesPage, setServicesPage] = useState(initialPage);
  const [services, setServices] = useState(initialServices);
  const [editingService, setEditingService] = useState<ServiceDraft | null>(null);
  const [pageDraft, setPageDraft] = useState<ServicesPageDraft | null>(null);
  const [saving, setSaving] = useState(false);

  const saveServicesPage = async () => {
    if (!pageDraft || saving) return;
    setSaving(true);
    try {
      const response = await fetch("/api/services-page", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pageDraft),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to save services page");
      setServicesPage(result);
      setPageDraft(null);
      toast.success("تم حفظ القسم بنجاح");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "فشل حفظ القسم");
    } finally {
      setSaving(false);
    }
  };

  const saveService = async () => {
    if (!editingService || saving) return;
    setSaving(true);
    try {
      const isUpdate = Boolean(editingService.id);
      const { id: _, ...input } = editingService;
      const response = await fetch(isUpdate ? `/api/services/${editingService.id}` : "/api/services", {
        method: isUpdate ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to save service");
      posthog.capture("service_saved", { service_id: result.id, save_action: isUpdate ? "updated" : "created" });
      setServices((current) => (isUpdate
        ? current.map((service) => service.id === result.id ? result : service)
        : [...current, result].sort((a, b) => a.order - b.order)));
      setEditingService(null);
      toast.success("تم حفظ الخدمة بنجاح");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "فشل حفظ الخدمة");
    } finally {
      setSaving(false);
    }
  };

  const deleteService = async (id: string) => {
    if (!window.confirm("هل أنت متأكد من حذف هذه الخدمة؟")) return;
    try {
      const response = await fetch(`/api/services/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete service");
      posthog.capture("service_deleted", { service_id: id });
      setServices((current) => current.filter((service) => service.id !== id));
      toast.success("تم حذف الخدمة");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "فشل حذف الخدمة");
    }
  };

  const addService = () => setEditingService({
    id: "",
    title: "خدمة جديدة",
    description: "وصف الخدمة",
    image: "",
    features: ["ميزة 1", "ميزة 2"],
    order: services.length,
    enabled: true,
  });

  return (
    <div className="min-h-screen p-6" dir="rtl">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-right">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">محرر الخدمات</h1>
          <p className="text-gray-600">إدارة محتوى صفحة الخدمات والعروض</p>
        </div>
        <ServicesHeroCard
          page={servicesPage}
          draft={pageDraft}
          saving={saving}
          onEdit={() => setPageDraft({ ...servicesPage })}
          onChange={setPageDraft}
          onSave={saveServicesPage}
          onCancel={() => setPageDraft(null)}
        />
        <ServicesListCard
          services={services}
          draft={editingService}
          saving={saving}
          onAdd={addService}
          onEdit={(service) => setEditingService({ ...service, features: [...service.features] })}
          onDelete={deleteService}
          onDraftChange={setEditingService}
          onSave={saveService}
          onCancel={() => setEditingService(null)}
        />
      </div>
    </div>
  );
}
