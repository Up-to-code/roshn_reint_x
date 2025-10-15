// app/api/check-admin/route.ts
import { getCurrentUser } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Properly await the user
    const user = await getCurrentUser();

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { isAdmin: false, error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Verify admin role
    const isAdmin = user.role === 'ADMIN';

    if (isAdmin) {
      return NextResponse.json({ isAdmin: true, user: { id: user.id, role: user.role } });
    } else {
      return NextResponse.json(
        { isAdmin: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error('Error checking admin status:', error);
    return NextResponse.json(
      { isAdmin: false, error: 'Authentication failed' },
      { status: 401 }
    );
  }
}