"use client";

import { createProperty } from "@/app/actions/properties";
import { PropertyEditorForm } from "@/components/property/property-editor-form";

export default function CreatePropertyPage({ params }: { params: { locale: string } }) {
  return <PropertyEditorForm locale={params.locale} mode="create" onSave={createProperty} />;
}
