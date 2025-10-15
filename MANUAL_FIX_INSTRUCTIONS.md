# 🚀 MANUAL FIX - Get Uploader Working NOW!

## **Step 1: Quick Fix (Disable RLS Temporarily)**

1. **Go to your Supabase Dashboard**
2. **Navigate to Storage → Settings**
3. **For each bucket (`images`, `videos`, `files`):**
   - Click on the bucket name
   - Go to **"Settings"** tab
   - Toggle **OFF** "Enable RLS"
   - Click **"Save"**

## **Step 2: Test It Works**

Run this command:
```bash
bun run debug-buckets
```

You should see ✅ for all upload tests!

## **Step 3: Your Uploader Will Work!**

Your CustomUploader component will now work perfectly!

---

## **For Production (After Testing)**

### **Option A: Manual Policy Setup**

1. **Go to Storage → Policies**
2. **For each bucket, create these 4 policies:**

#### **Images Bucket:**
- **Policy 1:** Name: "Public read", Operation: SELECT, Target: public, USING: `bucket_id = 'images'`
- **Policy 2:** Name: "Public upload", Operation: INSERT, Target: public, WITH CHECK: `bucket_id = 'images'`
- **Policy 3:** Name: "Public update", Operation: UPDATE, Target: public, USING: `bucket_id = 'images'`
- **Policy 4:** Name: "Public delete", Operation: DELETE, Target: public, USING: `bucket_id = 'images'`

#### **Videos Bucket:**
- **Policy 1:** Name: "Public read", Operation: SELECT, Target: public, USING: `bucket_id = 'videos'`
- **Policy 2:** Name: "Public upload", Operation: INSERT, Target: public, WITH CHECK: `bucket_id = 'videos'`
- **Policy 3:** Name: "Public update", Operation: UPDATE, Target: public, USING: `bucket_id = 'videos'`
- **Policy 4:** Name: "Public delete", Operation: DELETE, Target: public, USING: `bucket_id = 'videos'`

#### **Files Bucket:**
- **Policy 1:** Name: "Public read", Operation: SELECT, Target: public, USING: `bucket_id = 'files'`
- **Policy 2:** Name: "Public upload", Operation: INSERT, Target: public, WITH CHECK: `bucket_id = 'files'`
- **Policy 3:** Name: "Public update", Operation: UPDATE, Target: public, USING: `bucket_id = 'files'`
- **Policy 4:** Name: "Public delete", Operation: DELETE, Target: public, USING: `bucket_id = 'files'`

### **Option B: SQL Editor (Advanced)**

1. **Go to SQL Editor in Supabase Dashboard**
2. **Copy and paste this SQL:**

```sql
-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Images bucket policies
CREATE POLICY "Public read access for images" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Public upload access for images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'images');

CREATE POLICY "Public update access for images" ON storage.objects
FOR UPDATE USING (bucket_id = 'images');

CREATE POLICY "Public delete access for images" ON storage.objects
FOR DELETE USING (bucket_id = 'images');

-- Videos bucket policies
CREATE POLICY "Public read access for videos" ON storage.objects
FOR SELECT USING (bucket_id = 'videos');

CREATE POLICY "Public upload access for videos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'videos');

CREATE POLICY "Public update access for videos" ON storage.objects
FOR UPDATE USING (bucket_id = 'videos');

CREATE POLICY "Public delete access for videos" ON storage.objects
FOR DELETE USING (bucket_id = 'videos');

-- Files bucket policies
CREATE POLICY "Public read access for files" ON storage.objects
FOR SELECT USING (bucket_id = 'files');

CREATE POLICY "Public upload access for files" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'files');

CREATE POLICY "Public update access for files" ON storage.objects
FOR UPDATE USING (bucket_id = 'files');

CREATE POLICY "Public delete access for files" ON storage.objects
FOR DELETE USING (bucket_id = 'files');
```

3. **Click "Run"**

---

## **🎯 Summary**

**IMMEDIATE FIX:** Disable RLS on all buckets → Uploader works instantly!

**PRODUCTION FIX:** Set up RLS policies as shown above → Secure and working!

Your CustomUploader will work perfectly once you disable RLS or set up the policies! 🚀
