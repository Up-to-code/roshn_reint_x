import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phoneNumber: z.string().min(5, 'Phone number must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  email: z.string().email().optional().or(z.literal('')),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const validation = contactSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          message: 'Invalid input',
          errors: validation.error.errors,
        },
        { status: 400 }
      );
    }

    const { name, phoneNumber, message, email } = validation.data;

    const contact = await prisma.contact.update({
      where: { id: params.id },
      data: {
        name,
        phoneNumber,
        message,
       },
    });

    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json(
      { message: 'Contact not found' },
      { status: 404 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.contact.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json(
      { message: 'Contact not found' },
      { status: 404 }
    );
  }
}