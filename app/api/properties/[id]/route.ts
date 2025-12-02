// app/api/properties/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: params.id }
    })
    
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' }, 
        { status: 404 }
      )
    }
    
    return NextResponse.json(property)
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
      console.log("✅ Event created for property update");
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
    await prisma.property.delete({
      where: { id: params.id }
    })
    
    return NextResponse.json({ message: 'Property deleted successfully' })
  } catch (error) {
    console.error('Failed to delete property:', error)
    return NextResponse.json(
      { error: 'Failed to delete property' }, 
      { status: 500 }
    )
  }
}