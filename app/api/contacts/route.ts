import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { resend } from '@/lib/email';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phoneNumber: z.string().min(3, 'Phone number must be at least 3 characters'),
  message: z.string().min(2, 'Message must be at least 2 characters'),
  email: z.string().email().optional().or(z.literal('')),
  propertyId: z.string().optional(),
  propertyTitle: z.string().optional(),
  reason: z.string().optional(), // Reason for contact
});

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validation = contactSchema.safeParse(body);
    if (!validation.success) {
      console.log("❌ Contact API Validation Error:", JSON.stringify(validation.error.errors, null, 2));
      return NextResponse.json(
        {
          message: 'Invalid input',
          errors: validation.error.errors,
        },
        { status: 400 }
      );
    }

    const { name, phoneNumber, message, email, propertyId, propertyTitle, reason } = validation.data;

    // Check if contact is related to a property
    const hasProperty = propertyId || propertyTitle;

    // Save contact to database
    const contact = await prisma.contact.create({
      data: {
        name,
        phoneNumber,
        message,
        ...(email ? { email } : {}),
      },
    });

    // Contact saved to database

    // Create event for new contact
    try {
      const eventTitle = hasProperty 
        ? `New Contact - Property Inquiry: ${propertyTitle || propertyId}`
        : `New Contact Form Submission: ${name}`;
      
      await prisma.event.create({
        data: {
          type: hasProperty ? 'property_interest' : 'contact',
          title: eventTitle,
          description: reason || (hasProperty ? `New user interested in property: ${propertyTitle || propertyId}` : `New user added contact: ${name}`),
          metadata: {
            contactId: contact.id,
            name,
            phoneNumber,
            email: email || null,
            propertyId: propertyId || null,
            propertyTitle: propertyTitle || null,
            reason: reason || (hasProperty ? 'User interested in property' : 'New user added contact'),
          },
        },
      });
      // Event created for contact
    } catch (eventError) {
      console.error("⚠️ Failed to create event:", eventError);
      // Don't fail the request if event creation fails
    }

    // Send email notification
    const adminEmail = "roshnreitsaudi@gmail.com";

    try {
      // Prepare email content
      const emailSubject = hasProperty 
        ? `🏡 New Contact - Interest in Property: ${propertyTitle || propertyId}`
        : `📧 New Contact Form Submission`;

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #25D366; padding-bottom: 10px;">
            ${hasProperty ? '🏡 New Property Inquiry' : '📧 New Contact Form Submission'}
          </h2>
          
          ${hasProperty ? `
            <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1e40af; margin-top: 0;">Property Information</h3>
              ${propertyTitle ? `<p><strong>Property Title:</strong> ${propertyTitle}</p>` : ''}
              ${propertyId ? `<p><strong>Property ID:</strong> ${propertyId}</p>` : ''}
            </div>
          ` : ''}
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Contact Details</h3>
            <p><strong>👤 Name:</strong> ${name}</p>
            <p><strong>📞 Phone:</strong> ${phoneNumber}</p>
            ${email ? `<p><strong>✉️ Email:</strong> ${email}</p>` : ''}
            <p><strong>📋 Reason:</strong> ${reason || (hasProperty ? 'User interested in property' : 'New user added contact')}</p>
            <p><strong>📝 Message:</strong></p>
            <p style="background: white; padding: 15px; border-left: 4px solid #25D366; margin: 10px 0;">
              ${message}
            </p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
            <p>This email was sent automatically from your real estate platform.</p>
            <p>Contact ID: ${contact.id}</p>
            <p>Submitted at: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `;

      // Sending email via Resend

      const emailResult = await resend.emails.send({
        from: process.env.ADMIN_EMAIL || "noreply@roshnreit.com",
        to: adminEmail,
        subject: emailSubject,
        html: emailHtml,
      });

      // Email sent via Resend

      if (emailResult.error) {
        console.error("❌ Resend failed:", emailResult.error);
      } else {
        // Email sent successfully
      }

      return NextResponse.json({ 
        success: true, 
        contact, 
        emailSent: !emailResult.error,
        emailResult 
      }, { status: 201 });
    } catch (emailError) {
      console.error("❌ Email sending error:", emailError);
      // Still return success even if email fails
      return NextResponse.json({ 
        success: true, 
        contact, 
        emailSent: false,
        emailError: emailError instanceof Error ? emailError.message : 'Unknown error'
      }, { status: 201 });
    }
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}