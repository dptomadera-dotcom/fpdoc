import api from '../lib/api-client';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface LlmConfig {
  provider: 'anthropic' | 'local';
  endpoint?: string;
  model?: string;
}

export const LLM_CONFIG_KEY = 'fpdoc_llm_config';

export function getLlmConfig(): LlmConfig {
  if (typeof window === 'undefined') return { provider: 'anthropic' };
  try {
    const stored = localStorage.getItem(LLM_CONFIG_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { provider: 'anthropic' };
}

export function saveLlmConfig(config: LlmConfig): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LLM_CONFIG_KEY, JSON.stringify(config));
}

export const aiService = {
  chat: async (messages: ChatMessage[]): Promise<string> => {
    const config = getLlmConfig();
    const response = await api.post('/ai/chat', { messages, config });
    return response.data.content;
  },

  testConnection: async (config: LlmConfig): Promise<{ ok: boolean; model?: string; error?: string }> => {
    try {
      const response = await api.post('/ai/chat', {
        messages: [{ role: 'user', content: 'Responde solo con: OK' }],
        config,
      });
      return { ok: true, model: response.data.model };
    } catch (err: any) {
      return { ok: false, error: err?.response?.data?.message ?? err.message };
    }
  },

  suggestStructure: async (data: {
    title: string;
    description: string;
    raIds: string[];
    ceIds: string[];
  }) => {
    const response = await api.post('/ai/suggest', data);
    return response.data;
  },
};
