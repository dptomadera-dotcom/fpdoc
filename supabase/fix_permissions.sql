-- SOLUCIÓN AL ERROR 42501 (Permission Denied for schema public)
-- Ejecute este script en el SQL Editor de su Dashboard de Supabase

-- 1. Asegurar privilegios de uso en el esquema público para roles anónimos y autenticados
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- 2. Otorgar permisos de lectura en todas las tablas existentes (Prisma las crea por defecto en public)
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;

-- 3. Otorgar permisos de escritura específicos para las tablas de la aplicación
-- Esto permite que el Auth Service cree perfiles de usuario y suba evidencias
GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon, authenticated;

-- 4. Asegurar que futuras tablas también tengan estos permisos (Opcional pero recomendado)
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated;

-- 5. Importante: Si usa RLS (Row Level Security), asegúrese de tener políticas 'ENABLE' para 'anon'
-- Ejemplo:
-- ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Permitir lectura pública de perfiles" ON "User" FOR SELECT USING (true);
