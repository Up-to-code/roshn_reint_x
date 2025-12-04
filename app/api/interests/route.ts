import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const interests = await prisma.interest.findMany({
      include: {
        property: {
          select: {
            id: true,
            titleEn: true,
            titleAr: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(interests);
  } catch (error) {
    console.error('Failed to fetch interests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interests' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message, propertyId, propertyTitle } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name and phone are required' },
        { status: 400 }
      );
    }

    const interest = await prisma.interest.create({
      data: {
        name,
        email,
        phone,
        message,
        propertyId: propertyId || null,
        propertyTitle: propertyTitle || 'General Inquiry',
        read: false,
      },
      include: {
        property: {
          select: {
            id: true,
            titleEn: true,
            titleAr: true,
          },
        },
      },
    });

    return NextResponse.json(interest, { status: 201 });
  } catch (error) {
    console.error('Failed to create interest:', error);
    return NextResponse.json(
      { error: 'Failed to create interest' },
      { status: 500 }
    );
  }
}
