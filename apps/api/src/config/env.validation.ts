const REQUIRED_VARS = ['DATABASE_URL'] as const;

export function validateEnv(): void {
  const missing: string[] = [];

  for (const key of REQUIRED_VARS) {
    if (!process.env[key]) missing.push(key);
  }

  const hasJwtSecret =
    !!process.env.SUPABASE_JWT_SECRET || !!process.env.JWT_SECRET;
  if (!hasJwtSecret) {
    missing.push('SUPABASE_JWT_SECRET (or JWT_SECRET)');
  }

  if (missing.length > 0) {
    throw new Error(
      `\n[ENV] Variables de entorno requeridas no encontradas:\n  - ${missing.join('\n  - ')}\n`,
    );
  }
}
