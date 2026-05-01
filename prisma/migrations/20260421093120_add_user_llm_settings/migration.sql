-- CreateTable UserLlmSettings
CREATE TABLE "public"."UserLlmSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'anthropic',
    "model" TEXT NOT NULL DEFAULT 'claude-opus-4-7',
    "apiKey" TEXT,
    "baseUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserLlmSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserLlmSettings_userId_key" ON "public"."UserLlmSettings"("userId");

-- CreateIndex
CREATE INDEX "UserLlmSettings_userId_idx" ON "public"."UserLlmSettings"("userId");

-- AddForeignKey
ALTER TABLE "public"."UserLlmSettings" ADD CONSTRAINT "UserLlmSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
