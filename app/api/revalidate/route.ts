// API route for cache revalidation
import { revalidateTag, revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { adminRouteGuard } from '@/lib/http/authorization-response';

// Mark as dynamic since it uses request.url
export const dynamic = 'force-dynamic';

/**
 * API route to revalidate cache
 * Usage: POST /api/revalidate?tag=properties&path=/p
 * 
 * Example:
 * Send REVALIDATE_SECRET in the x-revalidate-secret header, or use an admin session.
 */
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get('tag');
    const path = searchParams.get('path');
    const configuredSecret = process.env.REVALIDATE_SECRET;
    const suppliedSecret = request.headers.get('x-revalidate-secret');
    if (!configuredSecret || suppliedSecret !== configuredSecret) {
      const denied = await adminRouteGuard();
      if (denied) return denied;
    }

    if (tag) {
      revalidateTag(tag);
    }

    if (path) {
      revalidatePath(path);
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      tag: tag || null,
      path: path || null,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error revalidating cache' },
      { status: 500 }
    );
  }
}
