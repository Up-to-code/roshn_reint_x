import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Mark as dynamic since it uses request.url
export const dynamic = 'force-dynamic';

const eventSchema = z.object({
  type: z.enum(['contact', 'property_interest', 'property_created', 'property_updated', 'user_registered', 'other']),
  title: z.string(),
  description: z.string().optional(),
  metadata: z.record(z.any()).optional(), // Store additional data like propertyId, contactId, etc.
});

// GET - Get all events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const limit = searchParams.get('limit');
    
    const where = type ? { type: type as any } : {};
    const take = limit ? parseInt(limit) : undefined;

    const events = await prisma.event.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take,
    });

    return NextResponse.json({ success: true, events, count: events.length });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST - Create new event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validation = eventSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid input',
          errors: validation.error.errors,
        },
        { status: 400 }
      );
    }

    const { type, title, description, metadata } = validation.data;

    const event = await prisma.event.create({
      data: {
        type,
        title,
        description,
        metadata: metadata || {},
      },
    });

    // Event created successfully

    return NextResponse.json({ success: true, event }, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create event' },
      { status: 500 }
    );
  }
}

// PUT - Sync all properties to events (add missing property events)
export async function PUT(request: NextRequest) {
  try {
    // Get all properties
    const properties = await prisma.property.findMany({
      orderBy: { createdAt: 'desc' }
    });

    // Get all existing property_created events
    const existingEvents = await prisma.event.findMany({
      where: { type: 'property_created' },
      select: { metadata: true }
    });

    const existingPropertyIds = new Set(
      existingEvents
        .map(e => e.metadata && typeof e.metadata === 'object' && 'propertyId' in e.metadata ? e.metadata.propertyId : null)
        .filter(Boolean)
    );

    // Create events for properties that don't have events yet
    const newEvents = [];
    for (const property of properties) {
      if (!existingPropertyIds.has(property.id)) {
        const event = await prisma.event.create({
          data: {
            type: 'property_created',
            title: `New Property Created: ${property.titleEn}`,
            description: `Property "${property.titleEn}" was created in ${property.city}`,
            metadata: {
              propertyId: property.id,
              titleEn: property.titleEn,
              titleAr: property.titleAr,
              city: property.city,
              district: property.district,
              imageCount: property.images.length,
              syncedAt: new Date().toISOString(),
            },
          },
        });
        newEvents.push(event);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Synced ${newEvents.length} properties to events`,
      newEventsCount: newEvents.length,
      totalProperties: properties.length,
      existingEvents: existingPropertyIds.size
    });
  } catch (error) {
    console.error('Error syncing properties to events:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to sync properties to events' },
      { status: 500 }
    );
  }
}

