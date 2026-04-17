-- ============================================================
-- Migración: corregir FK de user_llm_settings
--
-- Problema: la FK apuntaba a public."User"(id), pero el user_id
-- que llega del cliente es el UUID de auth.users — si el usuario
-- no tiene fila en public."User" (ej. social login sin trigger),
-- el upsert falla con violación de FK.
--
-- Solución: cambiar la FK para que referencia auth.users(id).
-- Ejecutar en Supabase SQL Editor (una sola vez).
-- ============================================================

-- 1. Eliminar la FK existente
ALTER TABLE public.user_llm_settings
  DROP CONSTRAINT IF EXISTS user_llm_settings_user_id_fkey;

-- 2. Añadir nueva FK apuntando a auth.users
ALTER TABLE public.user_llm_settings
  ADD CONSTRAINT user_llm_settings_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES auth.users(id)
  ON DELETE CASCADE;
