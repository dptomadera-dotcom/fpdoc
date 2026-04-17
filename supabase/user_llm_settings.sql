-- ============================================================
-- user_llm_settings: almacena la configuración LLM por usuario
-- Ejecutar en Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS public.user_llm_settings (
  user_id   TEXT PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  provider  TEXT NOT NULL DEFAULT 'anthropic'
              CHECK (provider IN ('anthropic', 'openai', 'local')),
  api_key   TEXT,          -- clave del usuario (anthropic / openai)
  endpoint  TEXT,          -- solo para modelos locales (ej: http://host:11434/v1)
  model     TEXT,          -- nombre del modelo (ej: gpt-4o, llama3.2)
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.user_llm_settings ENABLE ROW LEVEL SECURITY;

-- Cada usuario solo puede ver y modificar su propia fila
CREATE POLICY "user_own_llm_settings" ON public.user_llm_settings
  FOR ALL TO authenticated
  USING  (user_id = auth.uid()::text)
  WITH CHECK (user_id = auth.uid()::text);

-- Índice (opcional, la PK ya indexa)
-- No se necesita índice adicional

COMMENT ON TABLE public.user_llm_settings IS
  'Configuración LLM por usuario: proveedor, API key, modelo y endpoint.';
