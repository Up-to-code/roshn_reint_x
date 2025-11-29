import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing Supabase environment variables',
          message: 'Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY to your .env.local file.'
        },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Try to create the images bucket
    const bucketsToCreate = [
      {
        name: 'images',
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
      }
    ];

    const results = [];

    for (const bucketConfig of bucketsToCreate) {
      try {
        // Check if bucket exists
        const { data: buckets, error: listError } = await supabase.storage.listBuckets();
        
        if (!listError && buckets) {
          const exists = buckets.some(b => b.name === bucketConfig.name);
          if (exists) {
            results.push({
              name: bucketConfig.name,
              status: 'exists',
              message: `Bucket '${bucketConfig.name}' already exists`
            });
            continue;
          }
        }

        // Try to create bucket (might require service role key)
        const { data, error } = await supabase.storage.createBucket(bucketConfig.name, {
          public: bucketConfig.public,
          fileSizeLimit: bucketConfig.fileSizeLimit,
          allowedMimeTypes: bucketConfig.allowedMimeTypes
        });

        if (error) {
          // If creation fails, it's likely because we need service role key
          if (error.message.includes('permission') || error.message.includes('unauthorized') || error.message.includes('service_role')) {
            results.push({
              name: bucketConfig.name,
              status: 'needs_manual_setup',
              message: `Bucket creation requires admin privileges. Please create it manually in Supabase Dashboard.`,
              instructions: {
                step1: 'Go to your Supabase Dashboard',
                step2: 'Navigate to Storage',
                step3: 'Click "New bucket"',
                step4: `Name it "${bucketConfig.name}"`,
                step5: 'Make it Public',
                step6: 'Click "Create bucket"'
              }
            });
          } else {
            results.push({
              name: bucketConfig.name,
              status: 'error',
              error: error.message
            });
          }
        } else {
          results.push({
            name: bucketConfig.name,
            status: 'created',
            message: `Successfully created bucket '${bucketConfig.name}'`
          });
        }
      } catch (err) {
        results.push({
          name: bucketConfig.name,
          status: 'error',
          error: err instanceof Error ? err.message : 'Unknown error'
        });
      }
    }

    const hasErrors = results.some(r => r.status === 'error');
    const needsManual = results.some(r => r.status === 'needs_manual_setup');

    return NextResponse.json({
      success: !hasErrors,
      results,
      message: needsManual 
        ? 'Bucket creation requires manual setup. Please follow the instructions below.'
        : 'Bucket setup completed successfully.'
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to setup buckets'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST to this endpoint to setup buckets',
    instructions: 'Send a POST request to /api/setup-buckets to create the required storage buckets.'
  });
}
