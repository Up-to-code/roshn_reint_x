# Database Migration Required

## Issue
The `interests` table needs to be updated to include:
- `propertyId` (foreign key to properties table)
- `read` (boolean for message status)
- `updatedAt` (timestamp)

## Solution

### Option 1: Run Prisma Migration (Recommended)
```bash
# This will create and apply the migration
npx prisma migrate dev --name add_property_interest_relation
```

### Option 2: Manual SQL Migration
If the automatic migration fails, run this SQL directly in your database:

```sql
-- Add columns to interests table
ALTER TABLE "interests" 
ADD COLUMN IF NOT EXISTS "propertyId" TEXT,
ADD COLUMN IF NOT EXISTS "read" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Add foreign key constraint
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'interests_propertyId_fkey'
  ) THEN
    ALTER TABLE "interests" 
    ADD CONSTRAINT "interests_propertyId_fkey" 
    FOREIGN KEY ("propertyId") 
    REFERENCES "properties"("id") 
    ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "interests_propertyId_idx" ON "interests"("propertyId");
CREATE INDEX IF NOT EXISTS "interests_read_idx" ON "interests"("read");
CREATE INDEX IF NOT EXISTS "interests_createdAt_idx" ON "interests"("createdAt");
```

### Option 3: Reset and Migrate (Development Only - WARNING: Deletes Data)
```bash
# ⚠️ WARNING: This will delete all data!
npx prisma migrate reset
```

## After Migration

1. Regenerate Prisma Client:
```bash
npx prisma generate
```

2. Restart your dev server

3. The interests API will then work with the property relation

## Current Status

The API is currently working without the relation (fallback mode). After running the migration, it will automatically use the proper relation for better performance.


