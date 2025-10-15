// app/api/admin/services-page/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {prisma} from '@/lib/db';

export async function GET() {
  try {
    let page = await prisma.servicesPage.findFirst();
    
    if (!page) {
      // Create default page if none exists
      page = await prisma.servicesPage.create({
        data: {
          title: "Our Services",
          subtitle: "Comprehensive solutions to transform your digital presence",
          heroImage: "/images/services-hero.jpg", // Default placeholder
        }
      });
    }
    
    return NextResponse.json(page);
  } catch (error) {
    console.error('Error fetching services page:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services page' }, 
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.subtitle) {
      return NextResponse.json(
        { error: 'Title and subtitle are required' },
        { status: 400 }
      );
    }

    // Check if page exists
    const existingPage = await prisma.servicesPage.findFirst();
    
    let page;
    if (existingPage) {
      // Update existing page
      page = await prisma.servicesPage.update({
        where: { id: existingPage.id },
        data: {
          title: data.title,
          subtitle: data.subtitle,
          heroImage: data.heroImage || existingPage.heroImage,
          enabled: data.enabled !== undefined ? data.enabled : existingPage.enabled,
        }
      });
    } else {
      // Create new page
      page = await prisma.servicesPage.create({
        data: {
          title: data.title,
          subtitle: data.subtitle,
          heroImage: data.heroImage || "/images/services-hero.jpg",
          enabled: data.enabled !== undefined ? data.enabled : true,
        }
      });
    }
    
    return NextResponse.json(page);
  } catch (error) {
    console.error('Error updating services page:', error);
    return NextResponse.json(
      { error: 'Failed to update services page' }, 
      { status: 500 }
    );
  }
}