import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Mark as dynamic since it uses request.url
export const dynamic = 'force-dynamic';

// GET - Fetch all map locations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const enabled = searchParams.get('enabled');
    
    const where: any = {};
    if (enabled === 'true') {
      where.enabled = true;
    }
    
    const locations = await prisma.mapLocation.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(locations);
  } catch (error) {
    console.error('Failed to fetch map locations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch map locations' },
      { status: 500 }
    );
  }
}

// POST - Create a new map location
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    console.log('Received map location data:', {
      name: data.name,
      latitude: data.latitude,
      longitude: data.longitude,
      city: data.city,
    });
    
    // Validate required fields
    if (!data.name || data.latitude === undefined || data.longitude === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: name, latitude, and longitude are required' },
        { status: 400 }
      );
    }
    
    // Validate latitude and longitude are numbers
    if (typeof data.latitude !== 'number' || typeof data.longitude !== 'number') {
      return NextResponse.json(
        { error: 'Latitude and longitude must be numbers' },
        { status: 400 }
      );
    }
    
    // Validate latitude range (-90 to 90)
    if (data.latitude < -90 || data.latitude > 90) {
      return NextResponse.json(
        { error: 'Latitude must be between -90 and 90' },
        { status: 400 }
      );
    }
    
    // Validate longitude range (-180 to 180)
    if (data.longitude < -180 || data.longitude > 180) {
      return NextResponse.json(
        { error: 'Longitude must be between -180 and 180' },
        { status: 400 }
      );
    }
    
    // Create map location with schema fields
    const locationData = {
      name: data.name,
      address: data.address || null,
      latitude: data.latitude,
      longitude: data.longitude,
      city: data.city || null,
      country: data.country || null,
      description: data.description || null,
      enabled: data.enabled !== undefined ? data.enabled : true,
    };
    
    console.log('Creating map location with data:', locationData);
    
    const location = await prisma.mapLocation.create({
      data: locationData
    });
    
    console.log('Map location created successfully:', {
      id: location.id,
      name: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
    });
    
    return NextResponse.json(location, { status: 201 });
  } catch (error) {
    console.error('Failed to create map location:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create map location' },
      { status: 500 }
    );
  }
}






