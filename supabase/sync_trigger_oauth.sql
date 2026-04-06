-- SYNCRONIZAR USUARIOS OAUTH - FPDOC
-- Instrucciones:
-- 1. En la carpeta 'backend', ejecuta: npx prisma db push
-- 2. Copia este script en el SQL Editor de Supabase (Dashboard) para crear el Trigger.

-- 1. Función para manejar nuevos usuarios (Sync desde Auth a Public)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public."User" (
    "id",
    "email",
    "firstName",
    "lastName",
    "role",
    "updatedAt",
    "createdAt"
  )
  VALUES (
    new.id::text,
    new.email,
    -- Extraer nombre (Google/Github)
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    '', 
    'ALUMNO', -- Rol por defecto inicial
    now(),
    now()
  )
  ON CONFLICT (email) DO UPDATE SET "updatedAt" = now();
  
  RETURN new;
EXCEPTION
  WHEN OTHERS THEN
    -- Fallo silencioso para no bloquear el login si algo va mal en la tabla perfil
    RETURN new;
END;
$$;

-- 2. Trigger para llamar a la función tras inserción en auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
