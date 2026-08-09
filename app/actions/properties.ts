"use server";

import { AuthorizationError, requireAdmin } from "@/lib/authorization";
import {
  PropertyModuleError,
  type CreatePropertyInput,
  type PropertyRecord,
  type UpdatePropertyInput,
} from "@/lib/properties/property-core";
import { propertyModule } from "@/lib/properties/property-module";

export type CreatePropertyData = CreatePropertyInput;
export type UpdatePropertyData = UpdatePropertyInput;

interface ActionResponse<T = undefined> {
  success: boolean;
  data?: T;
  error?: string;
}

function actionError(error: unknown, fallback: string): { success: false; error: string } {
  if (error instanceof PropertyModuleError || error instanceof AuthorizationError) {
    return { success: false, error: error.message };
  }
  console.error(fallback, error);
  return { success: false, error: fallback };
}

export async function createProperty(
  data: CreatePropertyData,
): Promise<ActionResponse<PropertyRecord>> {
  try {
    await requireAdmin();
    return { success: true, data: await propertyModule.create(data) };
  } catch (error) {
    return actionError(error, "Failed to create property");
  }
}

export async function updateProperty(
  id: string,
  data: UpdatePropertyData,
): Promise<ActionResponse<PropertyRecord>> {
  try {
    await requireAdmin();
    return { success: true, data: await propertyModule.update(id, data) };
  } catch (error) {
    return actionError(error, "Failed to update property");
  }
}

export async function deleteProperty(id: string): Promise<ActionResponse> {
  try {
    await requireAdmin();
    await propertyModule.delete(id);
    return { success: true, data: undefined };
  } catch (error) {
    return actionError(error, "Failed to delete property");
  }
}
