"use client";

import { updateProperty } from "@/app/actions/properties";
import { PropertyEditorForm } from "@/components/property/property-editor-form";
import { toPropertyEditorValues } from "@/components/property/use-property-editor";
import type { PropertyRecord } from "@/lib/properties/property-core";

export default function EditPropertyForm({ property, locale }: { property: PropertyRecord; locale: string }) {
  return (
    <PropertyEditorForm
      locale={locale}
      mode="edit"
      initialValues={toPropertyEditorValues({
        titleEn: property.titleEn || "", titleAr: property.titleAr,
        descriptionEn: property.descriptionEn || "", descriptionAr: property.descriptionAr || "",
        city: property.city || "", district: property.district || "",
        price: property.price, images: property.images,
      })}
      onSave={values => updateProperty(property.id, values)}
    />
  );
}
