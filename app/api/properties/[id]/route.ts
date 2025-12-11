// app/api/properties/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { unstable_cache } from 'next/cache'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Cache individual property for 5 minutes
    const getCachedProperty = unstable_cache(
      async () => {
        return await prisma.property.findUnique({
          where: { id: params.id },
          select: {
            id: true,
            titleEn: true,
            titleAr: true,
            descriptionEn: true,
            descriptionAr: true,
            city: true,
            district: true,
            images: true,
            createdAt: true,
            updatedAt: true,
          }
        })
      },
      [`property-${params.id}`],
      {
        revalidate: 300, // 5 minutes
        tags: ['properties', `property-${params.id}`]
      }
    )
    
    const property = await getCachedProperty()
    
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' }, 
        { status: 404 }
      )
    }
    
    const response = NextResponse.json(property)
    
    // Set cache headers
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=300, stale-while-revalidate=600'
    )
    
    return response
  } catch (error) {
    console.error('Failed to fetch property:', error)
    return NextResponse.json(
      { error: 'Failed to fetch property' }, 
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    
    const property = await prisma.property.update({
      where: { id: params.id },
      data
    })
    
    // Create event for property update
    try {
      await prisma.event.create({
        data: {
          type: 'property_updated',
          title: `Property Updated: ${property.titleEn}`,
          description: `Property "${property.titleEn}" was updated`,
          metadata: {
            propertyId: property.id,
            titleEn: property.titleEn,
            titleAr: property.titleAr,
            city: property.city,
          },
        },
      });
      // Event created for property update
    } catch (eventError) {
      console.error("⚠️ Failed to create event:", eventError);
    }
    
    return NextResponse.json(property)
  } catch (error) {
    console.error('Failed to update property:', error)
    return NextResponse.json(
      { error: 'Failed to update property' }, 
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // First check if property exists
    const existingProperty = await prisma.property.findUnique({
      where: { id: params.id },
      select: { id: true, titleEn: true }
    })
    
    if (!existingProperty) {
      return NextResponse.json(
        { error: 'Property not found' }, 
        { status: 404 }
      )
    }
    
    await prisma.property.delete({
      where: { id: params.id }
    })
    
    // Create event for property deletion
    try {
      await prisma.event.create({
        data: {
          type: 'property_deleted',
          title: `Property Deleted: ${existingProperty.titleEn}`,
          description: `Property "${existingProperty.titleEn}" was deleted`,
          metadata: {
            propertyId: existingProperty.id,
            titleEn: existingProperty.titleEn,
          },
        },
      });
    } catch (eventError) {
      console.error("⚠️ Failed to create delete event:", eventError);
    }
    
    return NextResponse.json({ message: 'Property deleted successfully' })
  } catch (error) {
    console.error('Failed to delete property:', error)
    return NextResponse.json(
      { error: 'Failed to delete property' }, 
      { status: 500 }
    )
  }
}