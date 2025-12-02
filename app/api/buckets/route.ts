import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// GET - List all buckets
export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseKey = supabaseServiceKey || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing Supabase environment variables',
          message: 'Please add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to your .env.local file.'
        },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: buckets, error } = await supabase.storage.listBuckets();

    if (error) {
      return NextResponse.json(
        { 
          success: false, 
          error: error.message,
          message: 'Failed to list buckets'
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      buckets: buckets || [],
      count: buckets?.length || 0
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to list buckets'
      },
      { status: 500 }
    );
  }
}

// POST - Create or update a bucket
export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing Supabase environment variables',
          message: 'SUPABASE_SERVICE_ROLE_KEY is required for bucket management. Please add it to your .env.local file.'
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { 
      name, 
      public: isPublic = true, 
      fileSizeLimit, 
      allowedMimeTypes,
      update = false // If true, update existing bucket
    } = body;

    if (!name) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Bucket name is required',
          message: 'Please provide a bucket name in the request body.'
        },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(b => b.name === name);

    if (bucketExists && !update) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Bucket already exists',
          message: `Bucket '${name}' already exists. Use update: true to update it.`
        },
        { status: 400 }
      );
    }

    if (!bucketExists && update) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Bucket not found',
          message: `Bucket '${name}' does not exist. Cannot update.`
        },
        { status: 404 }
      );
    }

    // Prepare bucket options - ensure public is always a boolean
    const bucketOptions: {
      public: boolean;
      fileSizeLimit?: number;
      allowedMimeTypes?: string[];
    } = {
      public: isPublic ?? true, // Default to true if not provided
    };

    if (fileSizeLimit !== undefined) bucketOptions.fileSizeLimit = fileSizeLimit;
    if (allowedMimeTypes !== undefined) bucketOptions.allowedMimeTypes = allowedMimeTypes;

    if (bucketExists && update) {
      // Update existing bucket (Supabase doesn't have a direct update method, so we'll need to delete and recreate)
      // Actually, Supabase storage API doesn't support updating buckets directly
      // We can only update via SQL or recreate
      return NextResponse.json(
        { 
          success: false, 
          error: 'Update not supported',
          message: 'Supabase Storage API does not support updating buckets directly. You need to delete and recreate the bucket, or update it manually in the dashboard.'
        },
        { status: 400 }
      );
    }

    // Create new bucket
    const { data, error } = await supabase.storage.createBucket(name, bucketOptions);

    if (error) {
      return NextResponse.json(
        { 
          success: false, 
          error: error.message,
          message: `Failed to ${update ? 'update' : 'create'} bucket '${name}'`
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      bucket: data || { name, ...bucketOptions },
      message: `Successfully ${update ? 'updated' : 'created'} bucket '${name}'`
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to manage bucket'
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete a bucket
export async function DELETE(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing Supabase environment variables',
          message: 'SUPABASE_SERVICE_ROLE_KEY is required for bucket deletion. Please add it to your .env.local file.'
        },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');

    if (!name) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Bucket name is required',
          message: 'Please provide a bucket name as a query parameter: ?name=bucket-name'
        },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data, error } = await supabase.storage.deleteBucket(name);

    if (error) {
      return NextResponse.json(
        { 
          success: false, 
          error: error.message,
          message: `Failed to delete bucket '${name}'`
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully deleted bucket '${name}'`
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to delete bucket'
      },
      { status: 500 }
    );
  }
}

