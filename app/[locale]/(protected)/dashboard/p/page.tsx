"use server";

import React from 'react';
import { getProperties } from '@/app/actions/properties';
import PropertiesClient from './PropertiesClient';
import { Property } from '@prisma/client';

export default async function PropertiesDashboardPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const result = await getProperties();
  const rawProperties = result.success && result.data ? (result.data as Property[]) : [];
  
  // Serialize dates to strings to avoid hydration mismatches and serialization warnings
  const properties = rawProperties.map(p => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <PropertiesClient initialProperties={properties} locale={locale} />
  );
}
