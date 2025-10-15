# Supabase Storage Setup Guide

This guide will help you set up Supabase storage for the CustomUploader component.

## 🔧 **Method 1: Automated Setup (Recommended)**

### Step 1: Get Your Supabase Keys

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Settings** → **API**
4. Copy these values:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **Service Role Key** (SUPABASE_SERVICE_ROLE_KEY) - ⚠️ **Important**: Use the service_role key, not the anon key

### Step 2: Add Environment Variables

Add these to your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Step 3: Run the Setup Script

```bash
bun run setup-storage
```

This will automatically create the required storage buckets with proper configuration.

---

## 🛠️ **Method 2: Manual Setup**

If the automated setup doesn't work, you can create the buckets manually:

### Step 1: Create Storage Buckets

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the sidebar
3. Click **"New bucket"** and create these three buckets:

#### Bucket 1: `images`
- **Name**: `images`
- **Public**: ✅ Yes
- **File size limit**: 5 MB
- **Allowed MIME types**: `image/jpeg, image/png, image/gif, image/webp, image/svg+xml`

#### Bucket 2: `videos`
- **Name**: `videos`
- **Public**: ✅ Yes
- **File size limit**: 50 MB
- **Allowed MIME types**: `video/mp4, video/webm, video/ogg, video/avi, video/mov`

#### Bucket 3: `files`
- **Name**: `files`
- **Public**: ✅ Yes
- **File size limit**: 10 MB
- **Allowed MIME types**: `*/*` (all file types)

### Step 2: Configure RLS Policies

For each bucket, you need to set up Row Level Security (RLS) policies:

1. Go to **Storage** → **Policies**
2. For each bucket (`images`, `videos`, `files`), create these policies:

#### Policy 1: Allow public read access
```sql
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'bucket_name');
```

#### Policy 2: Allow public upload
```sql
CREATE POLICY "Public upload access" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'bucket_name');
```

#### Policy 3: Allow public update
```sql
CREATE POLICY "Public update access" ON storage.objects
FOR UPDATE USING (bucket_id = 'bucket_name');
```

#### Policy 4: Allow public delete
```sql
CREATE POLICY "Public delete access" ON storage.objects
FOR DELETE USING (bucket_id = 'bucket_name');
```

Replace `bucket_name` with the actual bucket name (`images`, `videos`, or `files`).

---

## 🧪 **Testing the Setup**

After setting up the buckets, test the uploader:

```tsx
import { CustomUploader } from '@/components/shared/custom-uploader';

function TestUpload() {
  const handleUpload = (url: string) => {
    console.log('Upload successful:', url);
  };

  return (
    <CustomUploader
      bucket="IMAGES"
      acceptedFileTypes="image"
      onUploadComplete={handleUpload}
    />
  );
}
```

---

## 🚨 **Troubleshooting**

### Error: "Bucket not found"
- Make sure the bucket names are exactly `images`, `videos`, and `files`
- Check that the buckets are created in your Supabase project

### Error: "Row-level security policy violation"
- Make sure you're using the service role key for the setup script
- Check that RLS policies are properly configured for each bucket

### Error: "Upload failed: Access denied"
- Verify that the buckets are set to public
- Check that the RLS policies allow public access

### Error: "File too large"
- Check the file size limits for each bucket
- Adjust limits in Supabase dashboard if needed

---

## 📚 **Usage Examples**

### Image Upload
```tsx
<CustomUploader
  bucket="IMAGES"
  acceptedFileTypes="image"
  buttonText="Upload Image"
  onUploadComplete={(url) => console.log('Image URL:', url)}
/>
```

### Video Upload
```tsx
<CustomUploader
  bucket="VIDEOS"
  acceptedFileTypes="video"
  buttonText="Upload Video"
  onUploadComplete={(url) => console.log('Video URL:', url)}
/>
```

### Any File Upload
```tsx
<CustomUploader
  bucket="FILES"
  acceptedFileTypes="all"
  buttonText="Upload File"
  onUploadComplete={(url) => console.log('File URL:', url)}
/>
```

---

## 🔒 **Security Notes**

- The service role key has full access to your Supabase project - keep it secure
- Never commit the service role key to version control
- Consider using environment-specific keys for different deployments
- The anon key is safe to use in client-side code

---

## 📞 **Need Help?**

If you're still having issues:

1. Check the Supabase logs in your dashboard
2. Verify all environment variables are set correctly
3. Make sure your Supabase project is active and not paused
4. Check that you have the necessary permissions in your Supabase project
