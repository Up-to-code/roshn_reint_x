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

    const interest = await prisma.interest.update({
      where: { id: params.id },
      data: { read: read ?? false },
    });

    return NextResponse.json(interest);
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


