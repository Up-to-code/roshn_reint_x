// app/api/properties/[id]/status/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json();

    // Validate status - make sure it's a string (add more validation if needed)
    if (typeof status !== 'string') {
      return NextResponse.json(
        { error: 'Invalid status value' }, 
        { status: 400 }
      );
    }

    // Check if property exists before updating
    const existingProperty = await prisma.property.findUnique({
      where: { id: params.id }
    });

    if (!existingProperty) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Update property status
    const updatedProperty = await prisma.property.update({
      where: { id: params.id },
      data: {  }
    });

    return NextResponse.json(updatedProperty);

  } catch (error) {
    console.error('Failed to update property status:', error);
    return NextResponse.json(
      { error: 'Failed to update property status' }, 
      { status: 500 }
    );
  }
}