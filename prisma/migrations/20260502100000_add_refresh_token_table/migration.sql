-- CreateTable: RefreshToken
CREATE TABLE IF NOT EXISTS "public"."RefreshToken" (
    "id"        TEXT         NOT NULL,
    "userId"    TEXT         NOT NULL,
    "tokenHash" TEXT         NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- Unique index on tokenHash for fast lookup
CREATE UNIQUE INDEX IF NOT EXISTS "RefreshToken_tokenHash_key"
    ON "public"."RefreshToken"("tokenHash");

-- Index on userId for listing/revoking by user
CREATE INDEX IF NOT EXISTS "RefreshToken_userId_idx"
    ON "public"."RefreshToken"("userId");

-- Foreign key → User (cascade delete when user is removed)
ALTER TABLE "public"."RefreshToken"
    ADD CONSTRAINT "RefreshToken_userId_fkey"
    FOREIGN KEY ("userId")
    REFERENCES "public"."User"("id")
    ON DELETE CASCADE
    ON UPDATE CASCADE;
