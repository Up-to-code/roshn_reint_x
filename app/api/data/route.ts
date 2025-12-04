import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Mark as dynamic since it uses database
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [
      users,
      properties,
      posts,
      contacts
    ] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        }
      }).catch(() => []),
      prisma.property.findMany({
        select: {
          id: true,
          titleEn: true,
          titleAr: true,
          city: true,
          createdAt: true,
          updatedAt: true,
        }
      }).catch(() => []),
      prisma.post.findMany({
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        }
      }).catch(() => []),
      prisma.contact.findMany({
        select: {
          id: true,
          name: true,
          phoneNumber: true,
          email: true,
          message: true,
          createdAt: true,
          updatedAt: true,
        }
      }).catch(() => []) // Return empty array if table doesn't exist or has schema mismatch
    ])

    const response = NextResponse.json({
      users,
      properties,
      posts,
      contacts
    })
    
    // Set cache headers
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=300'
    )
    
    return response
  } catch (error) {
    console.error('Failed to fetch data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}