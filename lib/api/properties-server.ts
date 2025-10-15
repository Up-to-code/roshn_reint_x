// lib/properties-service.ts
import { Property, PropertyType, PropertyStatus } from "@prisma/client";
import { prisma } from "@/lib/db";

// Utility functions for common property operations
export const PropertyUtils = {
  getLocalizedTitle(property: Property, locale: string): string {
    return locale === 'ar' ? property.titleAr : property.titleEn;
  },

  getLocalizedDescription(property: Property, locale: string): string | null {
    return locale === 'ar' ? property.descriptionAr : property.descriptionEn;
  },

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  },

  getStatusColor(status: PropertyStatus): string {
    const colors = {
      [PropertyStatus.AVAILABLE]: 'bg-green-500',
      [PropertyStatus.RENTED]: 'bg-blue-500',
      [PropertyStatus.SOLD]: 'bg-gray-500'
    };
    return colors[status] || 'bg-gray-500';
  },

  getTypeLabel(type: PropertyType, t: (key: string) => string): string {
    const typeMap = {
      [PropertyType.APARTMENT]: t('types.apartment'),
      [PropertyType.VILLA]: t('types.villa'),
      [PropertyType.OFFICE]: t('types.office'),
      [PropertyType.SHOP]: t('types.shop')
    };
    return typeMap[type] || type;
  }
};

// Server-side properties service that works with Prisma directly
export class PropertiesServerService {
  static async getAll(): Promise<Property[]> {
    try {
      const properties = await prisma.property.findMany({
        orderBy: { createdAt: 'desc' }
      });
      return properties;
    } catch (error) {
      console.error('Failed to fetch properties:', error);
      throw new Error('Unable to load properties');
    }
  }

  static async getById(id: string): Promise<Property | null> {
    try {
      const property = await prisma.property.findUnique({
        where: { id }
      });
      
      if (!property) {
        return null;
      }
      
      return property;
    } catch (error) {
      console.error(`Failed to fetch property ${id}:`, error);
      return null;
    }
  }

  static async search(query: string): Promise<Property[]> {
    try {
      const properties = await prisma.property.findMany({
        where: {
          OR: [
            { titleEn: { contains: query, mode: 'insensitive' } },
            { titleAr: { contains: query, mode: 'insensitive' } },
            { city: { contains: query, mode: 'insensitive' } },
            { district: { contains: query, mode: 'insensitive' } }
          ]
        },
        orderBy: { createdAt: 'desc' }
      });
      
      return properties;
    } catch (error) {
      console.error('Search failed:', error);
      return [];
    }
  }

  static async getByType(type: PropertyType): Promise<Property[]> {
    try {
      const properties = await prisma.property.findMany({
        where: { type },
        orderBy: { createdAt: 'desc' }
      });
      return properties;
    } catch (error) {
      console.error(`Failed to fetch properties by type ${type}:`, error);
      return [];
    }
  }

  static async getByStatus(status: PropertyStatus): Promise<Property[]> {
    try {
      const properties = await prisma.property.findMany({
        where: { status },
        orderBy: { createdAt: 'desc' }
      });
      return properties;
    } catch (error) {
      console.error(`Failed to fetch properties by status ${status}:`, error);
      return [];
    }
  }

  static async getByPriceRange(minPrice: number, maxPrice: number): Promise<Property[]> {
    try {
      const properties = await prisma.property.findMany({
        where: {
          price: {
            gte: minPrice,
            lte: maxPrice
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      return properties;
    } catch (error) {
      console.error(`Failed to fetch properties by price range:`, error);
      return [];
    }
  }

  static async getByCity(city: string): Promise<Property[]> {
    try {
      const properties = await prisma.property.findMany({
        where: {
          city: {
            contains: city,
            mode: 'insensitive'
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      return properties;
    } catch (error) {
      console.error(`Failed to fetch properties by city ${city}:`, error);
      return [];
    }
  }

  static async getFeatured(limit: number = 6): Promise<Property[]> {
    try {
      const properties = await prisma.property.findMany({
        where: { status: PropertyStatus.AVAILABLE },
        orderBy: { createdAt: 'desc' },
        take: limit
      });
      return properties;
    } catch (error) {
      console.error('Failed to fetch featured properties:', error);
      return [];
    }
  }

  static async getRecent(limit: number = 6): Promise<Property[]> {
    try {
      const properties = await prisma.property.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit
      });
      return properties;
    } catch (error) {
      console.error('Failed to fetch recent properties:', error);
      return [];
    }
  }
}