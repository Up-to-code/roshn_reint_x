import { Property, PropertyType, PropertyStatus } from "@prisma/client"

// lib/properties-service.ts
export interface CreatePropertyData {
  titleEn: string
  titleAr: string
  descriptionEn?: string
  descriptionAr?: string
  price: number
  type: PropertyType
  status?: PropertyStatus
  city: string
  district?: string
  bedrooms: number
  bathrooms: number
  area: number
  parking?: number
  features: string[]
  images: string[]
}

export interface UpdatePropertyData extends Partial<CreatePropertyData> {}

export class PropertiesService {
  private static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }))
      throw new Error(error.message || 'Request failed')
    }
    return response.json()
  }

  static async getAll(): Promise<Property[]> {
    try {
      const response = await fetch('/api/properties', {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      return this.handleResponse<Property[]>(response)
    } catch (error) {
      console.error('Failed to fetch properties:', error)
      throw new Error('Unable to load properties')
    }
  }

  static async getById(id: string): Promise<Property> {
    try {
      const response = await fetch(`/api/properties/${id}`, {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      return this.handleResponse<Property>(response)
    } catch (error) {
      console.error(`Failed to fetch property ${id}:`, error)
      throw new Error('Property not found')
    }
  }

  static async create(data: CreatePropertyData): Promise<Property> {
    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          status: data.status || PropertyStatus.AVAILABLE
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Request failed' }))
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Failed to create property:', error)
      throw error instanceof Error ? error : new Error('Unable to create property')
    }
  }

  static async update(id: string, data: CreatePropertyData) {
    const response = await fetch(`/api/properties/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        images: data.images, // Explicitly include images array
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update property');
    }

    return response.json();
  }

  static async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Delete failed' }))
        throw new Error(error.message || 'Delete failed')
      }
    } catch (error) {
      console.error(`Failed to delete property ${id}:`, error)
      throw new Error('Unable to delete property')
    }
  }

  // Additional useful methods
  static async updateStatus(id: string, status: PropertyStatus): Promise<Property> {
    try {
      const response = await fetch(`/api/properties/${id}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      })
      return this.handleResponse<Property>(response)
    } catch (error) {
      console.error(`Failed to update status for property ${id}:`, error)
      throw new Error('Unable to update property status')
    }
  }

  static async search(query: string): Promise<Property[]> {
    try {
      const response = await fetch(`/api/properties/search?q=${encodeURIComponent(query)}`, {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      return this.handleResponse<Property[]>(response)
    } catch (error) {
      console.error('Search failed:', error)
      throw new Error('Search failed')
    }
  }
}

// Utility functions for common property operations
export const PropertyUtils = {
  getLocalizedTitle(property: Property, locale: string): string {
    return locale === 'ar' ? property.titleAr : property.titleEn
  },

  getLocalizedDescription(property: Property, locale: string): string | null {
    return locale === 'ar' ? property.descriptionAr : property.descriptionEn
  },

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  },

  getStatusColor(status: PropertyStatus): string {
    const colors = {
      [PropertyStatus.AVAILABLE]: 'bg-green-500',
      [PropertyStatus.RENTED]: 'bg-blue-500',
      [PropertyStatus.SOLD]: 'bg-gray-500'
    }
    return colors[status] || 'bg-gray-500'
  },

  getTypeLabel(type: PropertyType, t: (key: string) => string): string {
    const typeMap = {
      [PropertyType.APARTMENT]: t('types.apartment'),
      [PropertyType.VILLA]: t('types.villa'),
      [PropertyType.OFFICE]: t('types.office'),
      [PropertyType.SHOP]: t('types.shop')
    }
    return typeMap[type] || type
  }
}