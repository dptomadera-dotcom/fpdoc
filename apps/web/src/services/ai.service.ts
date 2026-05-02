import api from '../lib/api-client';
import { supabase } from '../lib/supabase';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface LlmConfig {
  provider: 'anthropic' | 'openai' | 'glm' | 'minimax' | 'local' | 'groq' | 'ollama-cloud-daemon';
  apiKey?: string;
  endpoint?: string;
  model?: string;
}

export interface GeneratedTask {
  title: string;
  description: string;
  estimatedHours: number;
  ceIds: string[];
}

export interface GeneratedPhase {
  title: string;
  description: string;
  tasks: GeneratedTask[];
}

export interface CurriculumReviewResult {
  summary: string;
  coveragePercent: number;
  coveredRAs: Array<{ code: string; description: string; tasksCount: number }>;
  uncoveredRAs: Array<{ code: string; description: string }>;
  gaps: string[];
  incoherencies: string[];
  suggestions: string[];
}

export async function loadLlmConfig(): Promise<LlmConfig | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('user_llm_settings')
    .select('provider, api_key, endpoint, model')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error || !data) return null;

  return {
    provider: data.provider as LlmConfig['provider'],
    apiKey: data.api_key ?? undefined,
    endpoint: data.endpoint ?? undefined,
    model: data.model ?? undefined,
  };
}

export async function saveLlmConfig(config: LlmConfig): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Usuario no autenticado');

  const { error } = await supabase
    .from('user_llm_settings')
    .upsert({
      user_id: user.id,
      provider: config.provider,
      api_key: config.apiKey ?? null,
      endpoint: config.endpoint ?? null,
      model: config.model ?? null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

  if (error) throw new Error(error.message);
}

export const aiService = {
  chat: async (messages: ChatMessage[]): Promise<string> => {
    const response = await api.post('/ai/chat', { messages });
    return response.data.content;
  },

  testConnection: async (config: LlmConfig): Promise<{ ok: boolean; model?: string; error?: string }> => {
    try {
      const response = await api.post('/ai/test-connection', config);
      return response.data;
    } catch (err: any) {
      return { ok: false, error: err?.response?.data?.error ?? err.message ?? 'Error desconocido' };
    }
  },

  suggestStructure: async (data: {
    title: string;
    description: string;
    raIds: string[];
    ceIds: string[];
    route?: string;
  }): Promise<GeneratedPhase[]> => {
    const response = await api.post('/ai/suggest', data);
    return response.data;
  },

  askTeacherAssistant: async (data: {
    message: string;
    route?: string;
    entityType?: string;
    entityId?: string;
  }): Promise<string> => {
    const response = await api.post('/ai/teacher-assistant', data);
    return response.data.response;
  },

  askStudentAssistant: async (data: {
    message: string;
    route?: string;
    entityType?: string;
    entityId?: string;
  }): Promise<string> => {
    const response = await api.post('/ai/student-assistant', data);
    return response.data.response;
  },

  reviewCurriculum: async (data: {
    moduleId?: string;
    projectId?: string;
    route?: string;
  }): Promise<CurriculumReviewResult> => {
    const response = await api.post('/ai/curriculum-review', data);
    return response.data;
  },
};
