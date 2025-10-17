import { Property } from "@prisma/client"

// lib/properties-service.ts
export interface CreatePropertyData {
  titleEn: string
  titleAr: string
  descriptionEn?: string
  descriptionAr?: string
  city: string
  district?: string
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
        body: JSON.stringify(data)
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

  static async update(id: string, data: UpdatePropertyData): Promise<Property> {
    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Request failed' }))
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json();
    } catch (error) {
      console.error(`Failed to update property ${id}:`, error)
      throw error instanceof Error ? error : new Error('Unable to update property')
    }
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
    const description = locale === 'ar' ? property.descriptionAr : property.descriptionEn
    return description || null
  },

  // Helper to get display location
  getDisplayLocation(property: Property): string {
    if (property.district) {
      return `${property.city}, ${property.district}`
    }
    return property.city
  },

  // Check if property has images
  hasImages(property: Property): boolean {
    return property.images && property.images.length > 0
  },

  // Get first image or placeholder
  getFirstImage(property: Property): string | null {
    return property.images && property.images.length > 0 ? property.images[0] : null
  },

  // Format date for display
  formatDate(date: Date, locale: string = 'en'): string {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date))
  }
}