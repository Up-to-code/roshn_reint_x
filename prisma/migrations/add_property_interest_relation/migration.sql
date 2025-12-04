-- AlterTable: Add propertyId and read fields to Interest table
ALTER TABLE "interests" 
ADD COLUMN IF NOT EXISTS "propertyId" TEXT,
ADD COLUMN IF NOT EXISTS "read" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
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

-- CreateIndex for better query performance
CREATE INDEX IF NOT EXISTS "interests_propertyId_idx" ON "interests"("propertyId");
CREATE INDEX IF NOT EXISTS "interests_read_idx" ON "interests"("read");
CREATE INDEX IF NOT EXISTS "interests_createdAt_idx" ON "interests"("createdAt");



