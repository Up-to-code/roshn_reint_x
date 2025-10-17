// app/api/properties/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

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
      city: data.city,
      images: data.images,
      imageCount: data.images?.length || 0
    })
    
    // Validate required fields based on schema
    if (!data.titleEn || !data.titleAr || !data.city) {
      return NextResponse.json(
        { error: 'Missing required fields: titleEn, titleAr, and city are required' }, 
        { status: 400 }
      )
    }

    // Create property with only schema fields
    const propertyData = {
      titleEn: data.titleEn,
      titleAr: data.titleAr,
      descriptionEn: data.descriptionEn || null,
      descriptionAr: data.descriptionAr || null,
      city: data.city,
      district: data.district || null,
      images: data.images || [],
    }
    
    console.log('Creating property with data:', propertyData)
    
    const property = await prisma.property.create({
      data: propertyData
    })
    
    console.log('Property created successfully:', {
      id: property.id,
      titleEn: property.titleEn,
      titleAr: property.titleAr,
      city: property.city,
      imageCount: property.images.length
    })
    
    return NextResponse.json(property)
  } catch (error) {
    console.error('Failed to create property:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create property' }, 
      { status: 500 }
    )
  }
}