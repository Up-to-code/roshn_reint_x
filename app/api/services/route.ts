// app/api/admin/services/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {prisma} from '@/lib/db';

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { order: 'asc' }
    });
    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    const service = await prisma.service.create({
      data: {
        title: data.title,
        description: data.description,
        image: data.image || '',
        features: data.features || [],
        order: data.order || 0,
        enabled: data.enabled !== undefined ? data.enabled : true,
      }
    });
    
    return NextResponse.json(service);
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Failed to create service' }, 
      { status: 500 }
    );
  }
}