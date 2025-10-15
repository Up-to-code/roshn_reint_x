// app/api/properties/[id]/status/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json()
    
    const property = await prisma.property.update({
      where: { id: params.id },
      data: { status }
    })
    
    return NextResponse.json(property)
  } catch (error) {
    console.error('Failed to update property status:', error)
    return NextResponse.json(
      { error: 'Failed to update property status' }, 
      { status: 500 }
    )
  }
}