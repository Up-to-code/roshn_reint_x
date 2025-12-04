// Cache utilities for revalidation
import { revalidateTag, revalidatePath } from 'next/cache';

/**
 * Revalidate all properties cache
 */
export async function revalidateProperties() {
  revalidateTag('properties');
}

/**
 * Revalidate a specific property cache
 */
export async function revalidateProperty(id: string) {
  revalidateTag(`property-${id}`);
  revalidatePath(`/p/${id}`);
  revalidatePath('/p');
}

/**
 * Revalidate all property-related paths
 */
export async function revalidateAllProperties() {
  revalidateTag('properties');
  revalidatePath('/p');
  revalidatePath('/api/properties');
}

