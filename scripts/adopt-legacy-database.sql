-- Data-preserving adoption for databases created before Prisma migration history.
-- Back up the database first. Run this once, then mark the baseline as applied:
-- bunx prisma migrate resolve --applied 20260809000000_baseline
BEGIN;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'InquiryKind') THEN
    CREATE TYPE "InquiryKind" AS ENUM ('CONTACT', 'PROPERTY_INTEREST', 'LANDING_LEAD');
  END IF;
END $$;

ALTER TABLE "interests"
  ADD COLUMN IF NOT EXISTS "kind" "InquiryKind" NOT NULL DEFAULT 'PROPERTY_INTEREST',
  ADD COLUMN IF NOT EXISTS "source" TEXT,
  ADD COLUMN IF NOT EXISTS "reason" TEXT,
  ADD COLUMN IF NOT EXISTS "read" BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

DO $$
BEGIN
  IF to_regclass('public.contacts') IS NOT NULL THEN
    EXECUTE $copy$
      INSERT INTO "interests" (
        "id", "kind", "name", "email", "phone", "message", "propertyTitle",
        "propertyId", "source", "reason", "read", "createdAt", "updatedAt"
      )
      SELECT
        "id", 'CONTACT'::"InquiryKind", "name", "email", "phoneNumber", "message",
        'General Inquiry', NULL, 'contact-form', NULL, FALSE, "createdAt", "updatedAt"
      FROM "contacts"
      ON CONFLICT ("id") DO NOTHING
    $copy$;
    EXECUTE 'DROP TABLE "contacts"';
  END IF;
END $$;

UPDATE "interests"
SET "kind" = 'LANDING_LEAD', "source" = COALESCE("source", "propertyTitle")
WHERE "message" = 'Lead from landing page';

DROP TABLE IF EXISTS "about_settings";
DROP TABLE IF EXISTS "map_locations";

CREATE INDEX IF NOT EXISTS "events_createdAt_idx" ON "events"("createdAt");
CREATE INDEX IF NOT EXISTS "interests_kind_createdAt_idx" ON "interests"("kind", "createdAt");
CREATE INDEX IF NOT EXISTS "interests_kind_read_createdAt_idx" ON "interests"("kind", "read", "createdAt");
CREATE INDEX IF NOT EXISTS "interests_propertyId_idx" ON "interests"("propertyId");
CREATE INDEX IF NOT EXISTS "posts_status_createdAt_idx" ON "posts"("status", "createdAt");
CREATE INDEX IF NOT EXISTS "properties_city_idx" ON "properties"("city");
CREATE INDEX IF NOT EXISTS "properties_createdAt_idx" ON "properties"("createdAt");

COMMIT;
