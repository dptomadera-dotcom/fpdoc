-- ─────────────────────────────────────────────────────────────────────────────
-- Políticas RLS para la tabla public."User"
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Activar RLS (por si no está activo)
ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;

-- 2. Usuarios autenticados pueden leer su propio perfil
CREATE POLICY "user_select_own"
  ON public."User"
  FOR SELECT
  TO authenticated
  USING (id = auth.uid()::text);

-- 3. Usuarios autenticados pueden insertar su propio perfil
--    (necesario en el registro: signUp devuelve sesión activa)
CREATE POLICY "user_insert_own"
  ON public."User"
  FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid()::text);

-- 4. Usuarios autenticados pueden actualizar su propio perfil
CREATE POLICY "user_update_own"
  ON public."User"
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid()::text)
  WITH CHECK (id = auth.uid()::text);

-- 5. JEFATURA puede leer todos los perfiles de su departamento
CREATE POLICY "jefatura_select_all"
  ON public."User"
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public."User" u
      WHERE u.id = auth.uid()::text
        AND u.role = 'JEFATURA'
    )
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- Trigger: crear perfil automáticamente al registrarse
-- Esto evita el problema de RLS cuando signUp no devuelve sesión inmediata
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER   -- se ejecuta con permisos del owner, bypass RLS
SET search_path = public
AS $$
BEGIN
  INSERT INTO public."User" (id, email, "passwordHash", "firstName", "lastName", role)
  VALUES (
    NEW.id::text,
    NEW.email,
    'SUPABASE_AUTH',
    COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(COALESCE(NEW.raw_user_meta_data->>'full_name', ''), ' ', 1), ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name',  split_part(COALESCE(NEW.raw_user_meta_data->>'full_name', ''), ' ', 2), ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'ALUMNO')::"UserRole"
  )
  ON CONFLICT (id) DO NOTHING;  -- si ya existe, no sobreescribir

  RETURN NEW;
END;
$$;

-- Asociar el trigger a auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
