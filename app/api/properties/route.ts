// app/api/properties/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { PropertyStatus } from '@prisma/client'

export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(properties)
  } catch (error) {
    console.error('Failed to fetch properties:', error)
    return NextResponse.json(
      { error: 'Failed to fetch properties' }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    console.log('Received property data:', {
      titleEn: data.titleEn,
      titleAr: data.titleAr,
      images: data.images,
      imageCount: data.images?.length || 0
    })
    
    // Validate required fields
    if (!data.titleEn || !data.titleAr || !data.price || !data.city || 
        !data.bedrooms || !data.bathrooms || !data.area) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      )
    }

    // Ensure numeric fields are properly converted
    const propertyData = {
      ...data,
      price: parseFloat(data.price),
      bedrooms: parseInt(data.bedrooms),
      bathrooms: parseInt(data.bathrooms),
      area: parseInt(data.area),
      parking: parseInt(data.parking) || 0,
      features: data.features || [],
      images: data.images || [],
      status: data.status || PropertyStatus.AVAILABLE
    }
    
    console.log('Creating property with images:', propertyData.images)
    
    const property = await prisma.property.create({
      data: propertyData
    })
    
    console.log('Property created successfully with images:', property.images)
    return NextResponse.json(property)
  } catch (error) {
    console.error('Failed to create property:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create property' }, 
      { status: 500 }
    )
  }
}