-- Script para corregir políticas de RLS en la tabla User
-- Ejecuta esto en el SQL Editor de Supabase

-- 1. Habilitar RLS en la tabla User (si no está habilitado)
ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;

-- 2. Eliminar políticas existentes (opcional, para evitar conflictos)
DROP POLICY IF EXISTS "Permitir inserción de perfil propio" ON public."User";
DROP POLICY IF EXISTS "Permitir lectura de perfil propio" ON public."User";
DROP POLICY IF EXISTS "Permitir actualización de perfil propio" ON public."User";
DROP POLICY IF EXISTS "Permitir lectura pública de perfiles" ON public."User";

-- 3. Crear nuevas políticas
-- Permitir que un usuario recién registrado inserte su propio perfil
-- Durante el registro, auth.uid() ya debería ser el ID del usuario
CREATE POLICY "Permitir inserción de perfil propio" 
ON public."User" 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Permitir que los usuarios vean su propio perfil
CREATE POLICY "Permitir lectura de perfil propio" 
ON public."User" 
FOR SELECT 
USING (auth.uid() = id);

-- Permitir que los usuarios actualicen su propio perfil
CREATE POLICY "Permitir actualización de perfil propio" 
ON public."User" 
FOR UPDATE 
USING (auth.uid() = id);

-- Si se requiere que otros usuarios vean perfiles (ej: profesores vean alumnos)
-- Aquí se pueden añadir más políticas basadas en roles
CREATE POLICY "Lectura de perfiles para usuarios autenticados"
ON public."User"
FOR SELECT
TO authenticated
USING (true);
