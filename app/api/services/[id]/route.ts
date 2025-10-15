// app/api/admin/services/[id]/route.ts
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
 
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    
    const service = await prisma.service.update({
      where: { id: params.id },
      data
    });
    
    return NextResponse.json(service);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.service.delete({
      where: { id: params.id }
    });
    
    return NextResponse.json({ message: 'Service deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}