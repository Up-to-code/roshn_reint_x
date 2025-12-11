
'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { prisma } from '@/lib/db'
import { resend } from '@/lib/email'
// import { EventsService } from '@/lib/api/events-service'
import { redirect } from 'next/navigation'

export interface CreatePropertyData {
  titleEn?: string
  titleAr: string
  descriptionEn?: string
  descriptionAr?: string
  city?: string
  district?: string
  price: number
  images: string[]
}

export interface UpdatePropertyData extends Partial<CreatePropertyData> {}

type ActionResponse<T = any> = {
  success: boolean
  data?: T
  error?: string
}

export async function getProperties(): Promise<ActionResponse> {
  try {
    const properties = await prisma.property.findMany({
      orderBy: { createdAt: 'desc' },
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
    })
    return { success: true, data: properties }
  } catch (error) {
    console.error('Failed to fetch properties:', error)
    return { success: false, error: 'Failed to fetch properties' }
  }
}

export async function getPropertyById(id: string): Promise<ActionResponse> {
  try {
    const property = await prisma.property.findUnique({
      where: { id },
    })
    
    if (!property) {
      return { success: false, error: 'Property not found' }
    }
    
    return { success: true, data: property }
  } catch (error) {
    console.error('Failed to fetch property:', error)
    return { success: false, error: 'Failed to fetch property' }
  }
}

export async function createProperty(data: CreatePropertyData): Promise<ActionResponse> {
  try {
    // Basic validation
    if (!data.titleAr) {
      return { success: false, error: 'Arabic title is required' }
    }

    const property = await prisma.property.create({
      data: {
        titleEn: data.titleEn || null,
        titleAr: data.titleAr,
        descriptionEn: data.descriptionEn || null,
        descriptionAr: data.descriptionAr || null,
        city: data.city || null,
        district: data.district || null,
        price: data.price || 0,
        images: data.images || [],
      },
    })

    // Log event
    const { EventsService } = await import('@/lib/api/events-service');
    const displayTitle = property.titleEn || property.titleAr;
    await EventsService.create({
        type: 'property_created',
        title: `New Property Created: ${displayTitle}`,
        description: `Property "${displayTitle}" was created in ${property.city || 'unknown city'}`,
        metadata: {
          propertyId: property.id,
          titleEn: property.titleEn,
          titleAr: property.titleAr,
          city: property.city,
          district: property.district,
          imageCount: property.images.length,
        },
      });

    // Send email
    // ... (Email logic kept similar to previous)
    const adminEmail = "roshnreitsaudi@gmail.com";
        try {
          const displayTitle = property.titleEn || property.titleAr;
          const emailSubject = `🏡 New Property Added: ${displayTitle}`;
          const emailHtml = `
            <div style="font-family: Arial, sans-serif;">
              <h2>New Property Added</h2>
              <p>Title: ${displayTitle}</p>
              <p>City: ${property.city || 'N/A'}</p>
              <p>Price: ${property.price}</p>
            </div>
          `;
          await resend.emails.send({
            from: process.env.ADMIN_EMAIL || "noreply@roshnreit.com",
            to: adminEmail,
            subject: emailSubject,
            html: emailHtml,
          });
        } catch (emailError) {
          console.error("❌ Email sending error:", emailError);
        }

    revalidatePath('/dashboard/p')
    revalidateTag('properties')
    
    return { success: true, data: property }
  } catch (error) {
    console.error('Failed to create property:', error)
    return { success: false, error: 'Failed to create property' }
  }
}

export async function updateProperty(id: string, data: UpdatePropertyData): Promise<ActionResponse> {
  try {
    const property = await prisma.property.update({
      where: { id },
      data,
    })

    const { EventsService } = await import('@/lib/api/events-service');
    const displayTitle = property.titleEn || property.titleAr;
    await EventsService.create({
      type: 'property_updated',
      title: `Property Updated: ${displayTitle}`,
      description: `Property "${displayTitle}" was updated`,
      metadata: {
        propertyId: property.id,
        titleEn: property.titleEn,
        titleAr: property.titleAr,
        city: property.city,
      },
    });

    revalidatePath('/dashboard/p')
    revalidatePath(`/dashboard/p/edit/${id}`)
    revalidateTag('properties')
    
    return { success: true, data: property }
  } catch (error) {
    console.error('Failed to update property:', error)
    return { success: false, error: 'Failed to update property' }
  }
}

export async function deleteProperty(id: string): Promise<ActionResponse> {
  try {
    // Check existence first
    const existing = await prisma.property.findUnique({ where: { id } })
    if (!existing) {
        return { success: false, error: 'Property not found' }
    }

    await prisma.property.delete({
      where: { id },
    })

    const { EventsService } = await import('@/lib/api/events-service');
    const displayTitle = existing.titleEn || existing.titleAr;
    await EventsService.create({
      type: 'property_deleted',
      title: `Property Deleted: ${displayTitle}`,
      description: `Property "${displayTitle}" was deleted`,
      metadata: {
        propertyId: existing.id,
        titleEn: existing.titleEn,
      },
    });

    revalidatePath('/dashboard/p')
    
    return { success: true }
  } catch (error) {
    console.error('Failed to delete property:', error)
    return { success: false, error: 'Failed to delete property' }
  }
}
