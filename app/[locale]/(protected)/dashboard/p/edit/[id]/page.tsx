"use server";

import React from 'react';
import { notFound } from 'next/navigation';
import { getPropertyById } from '@/app/actions/properties';
import EditPropertyForm from './EditPropertyForm';

export default async function EditPropertyPage({
  params: { id, locale },
}: {
  params: { id: string; locale: string };
}) {
  const result = await getPropertyById(id);
  
  if (!result.success || !result.data) {
    notFound();
  }

  const property = result.data;

  // Transform data to match EditPropertyFormData structure if necessary
  // Assuming the returned property matches specific types, passing it directly
  // We need to ensure types align with what EditPropertyForm expects.
  // The server action returns the property object, which contains all needed fields.
  
  return (
    <EditPropertyForm property={property} locale={locale} />
  );
}