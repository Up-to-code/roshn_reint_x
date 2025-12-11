import { NextRequest, NextResponse, userAgent } from 'next/server';
import { prisma } from '@/lib/db';
import { mailtrap } from '@/lib/email';

// Public API - No authentication required
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const interests = await prisma.interest.findMany({
      include: {
        property: {
          select: {
            id: true,
            titleEn: true,
            titleAr: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(interests);
  } catch (error) {
    console.error('Failed to fetch interests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interests' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message, propertyId, propertyTitle } = body;

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    if (!phone || !phone.trim()) {
      return NextResponse.json(
        { error: 'Phone is required' },
        { status: 400 }
      );
    }

    // Prepare data - don't include read field if it doesn't exist in database
    const interestData: any = {
      name: name.trim(),
      phone: phone.trim(),
      propertyTitle: propertyTitle?.trim() || 'General Inquiry',
    };

    // Optional fields
    if (email && email.trim()) {
      interestData.email = email.trim();
    } else {
      interestData.email = null;
    }

    if (message && message.trim()) {
      interestData.message = message.trim();
    } else {
      interestData.message = null;
    }

    // Add propertyId if provided and valid
    if (propertyId && propertyId.trim()) {
      // Verify property exists
      try {
        const property = await prisma.property.findUnique({
          where: { id: propertyId.trim() },
          select: { id: true },
        });
        
        if (property) {
          interestData.propertyId = propertyId.trim();
        } else {
          // Property not found, but continue without linking
          interestData.propertyId = null;
        }
      } catch (propError) {
        // Property lookup failed, continue without linking
        interestData.propertyId = null;
      }
    } else {
      interestData.propertyId = null;
    }

    // Create interest - try with read field, fallback without it
    try {
      // Try with read field first
      const interest = await prisma.interest.create({
        data: {
          ...interestData,
          read: false,
        },
        include: {
          property: {
            select: {
              id: true,
              titleEn: true,
              titleAr: true,
            },
          },
        },
      });

      // Send notification
      await sendInterestNotification(interest, request);

      return NextResponse.json(interest, { status: 201 });
    } catch (error: any) {
      // If read field doesn't exist, create without it
      const errorMsg = String(error?.message || '');
      const errorName = error?.name || '';
      
      // Check if this is a validation error about the read field
      if (
        errorName === 'PrismaClientValidationError' ||
        errorMsg.includes('read') || 
        errorMsg.includes('Unknown argument') ||
        error?.code === 'P2009' ||
        error?.code === 'P2012'
      ) {
        // Create without read field
        const interest = await prisma.interest.create({
          data: interestData, // Without read field
          include: {
            property: {
              select: {
                id: true,
                titleEn: true,
                titleAr: true,
              },
            },
          },
        });

        // Send notification
        await sendInterestNotification(interest, request);

        return NextResponse.json(interest, { status: 201 });
      }
      // Re-throw other errors
      throw error;
    }
  } catch (error: any) {
    console.error('Failed to create interest:', error);
    
    // Provide more detailed error message
    const errorMessage = error?.message || 'Failed to create interest';
    const errorCode = error?.code || 'UNKNOWN_ERROR';
    
    return NextResponse.json(
      { 
        error: 'Failed to create interest',
        details: errorMessage,
        code: errorCode
      },
      { status: 500 }
    );
  }
}

async function sendInterestNotification(interest: any, request: NextRequest) {
  try {
    const { os } = userAgent(request);
    const osString = os?.name ? `${os.name} ${os.version || ''}` : 'Unknown OS';
    
    // Use a default sender if not configured in env
    const sender = {
      email: "mailtrap@demomailtrap.com", 
      name: "Roshn Interest Notification",
    };
    
    const recipients = [
      {
        email: "roshnreitsaudi@gmail.com",
      },
    ];

    await mailtrap.send({
      from: sender,
      to: recipients,
      subject: `New Interest: ${interest.propertyTitle || 'General Inquiry'}`,
      text: `New interest received!

Name: ${interest.name}
Phone: ${interest.phone}
Email: ${interest.email || 'N/A'}
User OS: ${osString}
Property: ${interest.propertyTitle || 'N/A'}
Message: ${interest.message || 'N/A'}
`,
      category: "New Interest",
    });
    console.log(`Notification sent for interest ${interest.id}`);
  } catch (error) {
    console.error('Failed to send email notification:', error);
    // Continue without failing the request
  }
}

