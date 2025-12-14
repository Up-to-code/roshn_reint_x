import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json([]);
    }

    const properties = await prisma.property.findMany({
      where: {
        OR: [
          { titleEn: { contains: query, mode: 'insensitive' } },
          { titleAr: { contains: query, mode: 'insensitive' } },
          { city: { contains: query, mode: 'insensitive' } },
          { district: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        titleEn: true,
        titleAr: true,
        city: true,
        district: true,
        images: true,
      },
      take: 10,
    });

    return NextResponse.json(properties);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Failed to search properties' }, { status: 500 });
  }
}
