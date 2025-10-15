// app/api/properties/search/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    
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
    })
    
    return NextResponse.json(properties)
  } catch (error) {
    console.error('Search failed:', error)
    return NextResponse.json(
      { error: 'Search failed' }, 
      { status: 500 }
    )
  }
}