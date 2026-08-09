"use client";

import { useCallback, useRef, useState } from "react";
import { createPropertyInputSchema } from "@/lib/properties/property-core";

export interface PropertyEditorValues {
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  city: string;
  district: string;
  price: number;
  images: string[];
}

export const emptyPropertyEditorValues: PropertyEditorValues = {
  titleEn: "", titleAr: "", descriptionEn: "", descriptionAr: "",
  city: "", district: "", price: 0, images: [],
};

export function toPropertyEditorValues(input: Partial<PropertyEditorValues>): PropertyEditorValues {
  return { ...emptyPropertyEditorValues, ...input, images: input.images || [] };
}

export function usePropertyEditor(initialValues: PropertyEditorValues, requiredTitleMessage: string) {
  const original = useRef(initialValues);
  const [formData, setFormData] = useState(initialValues);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);

  const updateFormData = useCallback(<K extends keyof PropertyEditorValues>(field: K, value: PropertyEditorValues[K]) => {
    setFormData(current => ({ ...current, [field]: value }));
    setHasChanges(true);
    setFieldErrors(current => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }, []);

  const addImages = useCallback((urls: string[]) => {
    setFormData(current => ({ ...current, images: [...current.images, ...urls] }));
    setHasChanges(true);
  }, []);

  const removeImage = useCallback((index: number) => {
    setFormData(current => ({ ...current, images: current.images.filter((_, itemIndex) => itemIndex !== index) }));
    setHasChanges(true);
  }, []);

  const validate = useCallback(() => {
    const result = createPropertyInputSchema.safeParse(formData);
    const errors: Record<string, string> = {};
    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = String(issue.path[0] || "form");
        if (!errors[field]) errors[field] = field === "titleAr" ? requiredTitleMessage : issue.message;
      }
    }
    setFieldErrors(errors);
    return { isValid: result.success, errors };
  }, [formData, requiredTitleMessage]);

  const reset = useCallback(() => {
    setFormData(original.current);
    setFieldErrors({});
    setHasChanges(false);
  }, []);

  return { formData, fieldErrors, hasChanges, setHasChanges, updateFormData, addImages, removeImage, validate, reset };
}
