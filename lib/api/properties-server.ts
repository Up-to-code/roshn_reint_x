// feix - minimal version, remove type and status, and remove search by type, status, and price

import { Property } from "@prisma/client";
import { prisma } from "@/lib/db";

// Utility functions for property operations
export const PropertyUtils = {
  getLocalizedTitle(property: Property, locale: string): string {
    return locale === "ar" ? property.titleAr : property.titleEn;
  },

  getLocalizedDescription(property: Property, locale: string): string | null {
    return locale === "ar" ? property.descriptionAr : property.descriptionEn;
  },

  formatPrice(price: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }
};

// Server-side properties service with caching
import { unstable_cache } from 'next/cache';

// Server-side properties service
export class PropertiesServerService {
  static async getAll(): Promise<Property[]> {
    try {
      const properties = await prisma.property.findMany({
        select: {
          id: true,
          titleEn: true,
          titleAr: true,
          descriptionEn: true,
          descriptionAr: true,
          city: true,
          district: true,
          price: true,
          images: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: "desc" }
      });
      return properties as Property[];
    } catch (error) {
      console.error("Failed to fetch properties:", error);
      throw new Error("Unable to load properties");
    }
  }

  static async getById(id: string): Promise<Property | null> {
    try {
      // Direct query without caching to avoid issues
      const property = await prisma.property.findUnique({
        where: { id },
        select: {
          id: true,
          titleEn: true,
          titleAr: true,
          descriptionEn: true,
          descriptionAr: true,
          city: true,
          district: true,
          price: true,
          images: true,
          createdAt: true,
          updatedAt: true,
        }
      });
      
      return property;
    } catch (error) {
      console.error(`Failed to fetch property ${id}:`, error);
      return null;
    }
  }

  static async search(query: string): Promise<Property[]> {
    try {
      return await prisma.property.findMany({
        where: {
          OR: [
            { titleEn: { contains: query, mode: "insensitive" } },
            { titleAr: { contains: query, mode: "insensitive" } },
            { city: { contains: query, mode: "insensitive" } },
            { district: { contains: query, mode: "insensitive" } }
          ]
        },
        orderBy: { createdAt: "desc" }
      });
    } catch (error) {
      console.error("Search failed:", error);
      return [];
    }
  }

  // REMOVED getByType
  // REMOVED getByStatus
  // REMOVED getByPriceRange

  static async getByCity(city: string): Promise<Property[]> {
    try {
      return await prisma.property.findMany({
        where: {
          city: { contains: city, mode: "insensitive" }
        },
        orderBy: { createdAt: "desc" }
      });
    } catch (error) {
      console.error(`Failed to fetch properties by city ${city}:`, error);
      return [];
    }
  }

  static async getFeatured(limit: number = 6): Promise<Property[]> {
    try {
      return await prisma.property.findMany({
        select: {
          id: true,
          titleEn: true,
          titleAr: true,
          descriptionEn: true,
          descriptionAr: true,
          city: true,
          district: true,
          price: true,
          images: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: limit
      });
    } catch (error) {
      console.error("Failed to fetch featured properties:", error);
      return [];
    }
  }

  static async getRecent(limit: number = 6): Promise<Property[]> {
    try {
      return await prisma.property.findMany({
        select: {
          id: true,
          titleEn: true,
          titleAr: true,
          descriptionEn: true,
          descriptionAr: true,
          city: true,
          district: true,
          price: true,
          images: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: limit
      });
    } catch (error) {
      console.error("Failed to fetch recent properties:", error);
      return [];
    }
  }
}
