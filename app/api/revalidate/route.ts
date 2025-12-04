// API route for cache revalidation
import { revalidateTag, revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * API route to revalidate cache
 * Usage: POST /api/revalidate?tag=properties&path=/p
 * 
 * Example:
 * POST /api/revalidate?tag=properties&path=/p&secret=your-secret
 */
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get('tag');
    const path = searchParams.get('path');
    const secret = searchParams.get('secret');

    // Verify secret token (optional but recommended)
    if (secret && secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      );
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

