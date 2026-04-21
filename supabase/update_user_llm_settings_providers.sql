-- ============================================================
-- Update user_llm_settings CHECK constraint to support all 7 providers
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- Drop existing constraint and add new one with all providers
ALTER TABLE public.user_llm_settings
DROP CONSTRAINT IF EXISTS user_llm_settings_provider_check;

ALTER TABLE public.user_llm_settings
ADD CONSTRAINT user_llm_settings_provider_check
CHECK (provider IN ('anthropic', 'openai', 'glm', 'minimax', 'local', 'groq', 'ollama-cloud'));

COMMENT ON CONSTRAINT user_llm_settings_provider_check ON public.user_llm_settings IS
  'Validates provider is one of the supported AI providers: Anthropic, OpenAI, GLM (Zhipu), MiniMax, Local (Ollama), Groq, or Ollama Cloud';
