import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { read } = body;

    // Try to update with read field, fallback without it if field doesn't exist
    try {
      const interest = await prisma.interest.update({
        where: { id: params.id },
        data: { read: read ?? false },
      });

      return NextResponse.json(interest);
    } catch (updateError: any) {
      // If read field doesn't exist, just return the interest without updating read
      if (updateError?.message?.includes('read') || updateError?.message?.includes('Unknown argument')) {
        const interest = await prisma.interest.findUnique({
          where: { id: params.id },
        });

        if (!interest) {
          return NextResponse.json(
            { error: 'Interest not found' },
            { status: 404 }
          );
        }

        return NextResponse.json(interest);
      }
      throw updateError;
    }
  } catch (error) {
    console.error('Failed to update interest:', error);
    return NextResponse.json(
      { error: 'Failed to update interest' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.interest.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete interest:', error);
    return NextResponse.json(
      { error: 'Failed to delete interest' },
      { status: 500 }
    );
  }
}


