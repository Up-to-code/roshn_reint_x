-- Fix Supabase Storage RLS Policies
-- Run this SQL in your Supabase Dashboard > SQL Editor

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public read access for images" ON storage.objects;
DROP POLICY IF EXISTS "Public upload access for images" ON storage.objects;
DROP POLICY IF EXISTS "Public update access for images" ON storage.objects;
DROP POLICY IF EXISTS "Public delete access for images" ON storage.objects;

DROP POLICY IF EXISTS "Public read access for videos" ON storage.objects;
DROP POLICY IF EXISTS "Public upload access for videos" ON storage.objects;
DROP POLICY IF EXISTS "Public update access for videos" ON storage.objects;
DROP POLICY IF EXISTS "Public delete access for videos" ON storage.objects;

DROP POLICY IF EXISTS "Public read access for files" ON storage.objects;
DROP POLICY IF EXISTS "Public upload access for files" ON storage.objects;
DROP POLICY IF EXISTS "Public update access for files" ON storage.objects;
DROP POLICY IF EXISTS "Public delete access for files" ON storage.objects;

-- Create policies for images bucket
CREATE POLICY "Public read access for images" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Public upload access for images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'images');

CREATE POLICY "Public update access for images" ON storage.objects
FOR UPDATE USING (bucket_id = 'images');

CREATE POLICY "Public delete access for images" ON storage.objects
FOR DELETE USING (bucket_id = 'images');

-- Create policies for videos bucket
CREATE POLICY "Public read access for videos" ON storage.objects
FOR SELECT USING (bucket_id = 'videos');

CREATE POLICY "Public upload access for videos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'videos');

CREATE POLICY "Public update access for videos" ON storage.objects
FOR UPDATE USING (bucket_id = 'videos');

CREATE POLICY "Public delete access for videos" ON storage.objects
FOR DELETE USING (bucket_id = 'videos');

-- Create policies for files bucket
CREATE POLICY "Public read access for files" ON storage.objects
FOR SELECT USING (bucket_id = 'files');

CREATE POLICY "Public upload access for files" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'files');

CREATE POLICY "Public update access for files" ON storage.objects
FOR UPDATE USING (bucket_id = 'files');

CREATE POLICY "Public delete access for files" ON storage.objects
FOR DELETE USING (bucket_id = 'files');

-- Verify policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage'
ORDER BY policyname;
