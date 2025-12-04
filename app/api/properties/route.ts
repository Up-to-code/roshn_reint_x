// app/api/properties/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { resend } from '@/lib/email'
import { unstable_cache } from 'next/cache'

// Cache properties list for 60 seconds, revalidate in background
const getCachedProperties = unstable_cache(
  async () => {
    return await prisma.property.findMany({
      select: {
        id: true,
        titleEn: true,
        titleAr: true,
        descriptionEn: true,
        descriptionAr: true,
        city: true,
        district: true,
        images: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' }
    })
  },
  ['properties-list'],
  {
    revalidate: 60, // Revalidate every 60 seconds
    tags: ['properties']
  }
)

export async function GET() {
  try {
    const properties = await getCachedProperties()
    
    const response = NextResponse.json(properties)
    
    // Set cache headers
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=300'
    )
    
    return response
  } catch (error) {
    console.error('Failed to fetch properties:', error)
    return NextResponse.json(
      { error: 'Failed to fetch properties' }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    console.log('Received property data:', {
      titleEn: data.titleEn,
      titleAr: data.titleAr,
      city: data.city,
      images: data.images,
      imageCount: data.images?.length || 0
    })
    
    // Validate required fields based on schema
    if (!data.titleEn || !data.titleAr || !data.city) {
      return NextResponse.json(
        { error: 'Missing required fields: titleEn, titleAr, and city are required' }, 
        { status: 400 }
      )
    }

    // Create property with only schema fields
    const propertyData = {
      titleEn: data.titleEn,
      titleAr: data.titleAr,
      descriptionEn: data.descriptionEn || null,
      descriptionAr: data.descriptionAr || null,
      city: data.city,
      district: data.district || null,
      images: data.images || [],
    }
    
    console.log('Creating property with data:', propertyData)
    
    const property = await prisma.property.create({
      data: propertyData
    })
    
    console.log('Property created successfully:', {
      id: property.id,
      titleEn: property.titleEn,
      titleAr: property.titleAr,
      city: property.city,
      imageCount: property.images.length
    })

    // Note: Cache will be revalidated on next request
    // For immediate revalidation, call /api/revalidate?tag=properties

    // Create event for new property
    try {
      await prisma.event.create({
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
          },
        },
      });
      console.log("✅ Event created for property");
    } catch (eventError) {
      console.error("⚠️ Failed to create event:", eventError);
      // Don't fail the request if event creation fails
    }

    // Send email notification when property is created
    const adminEmail = "roshnreitsaudi@gmail.com";
    try {
      const emailSubject = `🏡 New Property Added: ${property.titleEn}`;
      
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #25D366; padding-bottom: 10px;">
            🏡 New Property Added
          </h2>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">Property Details</h3>
            <p><strong>Property ID:</strong> ${property.id}</p>
            <p><strong>Title (English):</strong> ${property.titleEn}</p>
            <p><strong>Title (Arabic):</strong> ${property.titleAr}</p>
            <p><strong>City:</strong> ${property.city}</p>
            ${property.district ? `<p><strong>District:</strong> ${property.district}</p>` : ''}
            <p><strong>Images:</strong> ${property.images.length} image(s)</p>
            ${property.descriptionEn ? `<p><strong>Description (EN):</strong> ${property.descriptionEn.substring(0, 200)}${property.descriptionEn.length > 200 ? '...' : ''}</p>` : ''}
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
            <p>This email was sent automatically when a new property was added to the system.</p>
            <p>Property created at: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `;

      console.log("🚀 Sending property creation email...");
      
      const emailResult = await resend.emails.send({
        from: process.env.ADMIN_EMAIL || "noreply@roshnreit.com",
        to: adminEmail,
        subject: emailSubject,
        html: emailHtml,
      });

      if (emailResult.error) {
        console.error("❌ Email failed:", emailResult.error);
      } else {
        console.log("✅ Property creation email sent to:", adminEmail);
      }
    } catch (emailError) {
      console.error("❌ Email sending error:", emailError);
      // Don't fail the request if email fails
    }
    
    return NextResponse.json(property)
  } catch (error) {
    console.error('Failed to create property:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create property' }, 
      { status: 500 }
    )
  }
}