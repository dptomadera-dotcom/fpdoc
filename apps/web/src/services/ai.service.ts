import api from '../lib/api-client';
import { supabase } from '../lib/supabase';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface LlmConfig {
  provider: 'anthropic' | 'openai' | 'glm' | 'minimax' | 'local' | 'groq' | 'ollama-cloud';
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

type TestResult = { ok: boolean; model?: string; error?: string };

async function testOllamaCloud(config: LlmConfig): Promise<TestResult> {
  if (!config.apiKey) return { ok: false, error: 'Falta API key de Ollama Cloud' };
  const model = config.model || 'minimax-m2.7:cloud';
  const endpoints = [
    'https://api.ollama.com/v1/chat/completions',
    'https://ollama.com/api/v1/chat/completions',
  ];
  const body = JSON.stringify({
    model,
    messages: [{ role: 'user', content: 'Responde solo: OK' }],
    max_tokens: 16,
    stream: false,
  });
  let lastError = '';
  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.apiKey}`,
        },
        body,
      });
      if (!res.ok) {
        lastError = `${res.status} ${res.statusText}`;
        continue;
      }
      const data = await res.json();
      return { ok: true, model: data.model || model };
    } catch (e: any) {
      lastError = e.message || String(e);
    }
  }
  return { ok: false, error: `Ollama Cloud: ${lastError || 'no se pudo conectar'}` };
}

async function testLocalOllama(config: LlmConfig): Promise<TestResult> {
  const endpoint = config.endpoint || 'http://localhost:11434';
  const model = config.model || 'llama3.2';
  try {
    const res = await fetch(`${endpoint}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt: 'OK', stream: false }),
    });
    if (!res.ok) return { ok: false, error: `${res.status} ${res.statusText}` };
    const data = await res.json();
    return { ok: true, model: data.model || model };
  } catch (e: any) {
    return { ok: false, error: `Ollama local: ${e.message}` };
  }
}

async function testAnthropic(config: LlmConfig): Promise<TestResult> {
  if (!config.apiKey) return { ok: false, error: 'Falta API key de Anthropic' };
  const model = config.model || 'claude-haiku-4-5-20251001';
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model,
        max_tokens: 16,
        messages: [{ role: 'user', content: 'OK' }],
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      return { ok: false, error: `${res.status}: ${err.substring(0, 120)}` };
    }
    const data = await res.json();
    return { ok: true, model: data.model || model };
  } catch (e: any) {
    return { ok: false, error: `Anthropic: ${e.message}` };
  }
}

async function testOpenAI(config: LlmConfig): Promise<TestResult> {
  if (!config.apiKey) return { ok: false, error: 'Falta API key de OpenAI' };
  const model = config.model || 'gpt-4o-mini';
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model,
        max_tokens: 16,
        messages: [{ role: 'user', content: 'OK' }],
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      return { ok: false, error: `${res.status}: ${err.substring(0, 120)}` };
    }
    const data = await res.json();
    return { ok: true, model: data.model || model };
  } catch (e: any) {
    return { ok: false, error: `OpenAI: ${e.message}` };
  }
}

async function testGroq(config: LlmConfig): Promise<TestResult> {
  if (!config.apiKey) return { ok: false, error: 'Falta API key de Groq' };
  const model = config.model || 'llama-3.3-70b-versatile';
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model,
        max_tokens: 16,
        messages: [{ role: 'user', content: 'OK' }],
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      return { ok: false, error: `${res.status}: ${err.substring(0, 120)}` };
    }
    const data = await res.json();
    return { ok: true, model: data.model || model };
  } catch (e: any) {
    return { ok: false, error: `Groq: ${e.message}` };
  }
}

async function testGLM(config: LlmConfig): Promise<TestResult> {
  if (!config.apiKey) return { ok: false, error: 'Falta API key de GLM' };
  const model = config.model || 'glm-4-flash';
  const endpoint = config.endpoint || 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model,
        max_tokens: 16,
        messages: [{ role: 'user', content: 'OK' }],
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      return { ok: false, error: `${res.status}: ${err.substring(0, 120)}` };
    }
    const data = await res.json();
    return { ok: true, model: data.model || model };
  } catch (e: any) {
    return { ok: false, error: `GLM: ${e.message}` };
  }
}

async function testMiniMax(config: LlmConfig): Promise<TestResult> {
  if (!config.apiKey) return { ok: false, error: 'Falta API key de MiniMax' };
  const model = config.model || 'MiniMax-M2';
  const endpoint = config.endpoint || 'https://api.minimax.chat/v1/text/chatcompletion_v2';
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model,
        max_tokens: 16,
        messages: [{ role: 'user', content: 'OK' }],
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      return { ok: false, error: `${res.status}: ${err.substring(0, 120)}` };
    }
    const data = await res.json();
    return { ok: true, model: data.model || model };
  } catch (e: any) {
    return { ok: false, error: `MiniMax: ${e.message}` };
  }
}

export const aiService = {
  chat: async (messages: ChatMessage[]): Promise<string> => {
    const response = await api.post('/ai/chat', { messages });
    return response.data.content;
  },

  testConnection: async (config: LlmConfig): Promise<{ ok: boolean; model?: string; error?: string }> => {
    try {
      if (config.provider === 'ollama-cloud') {
        return await testOllamaCloud(config);
      }
      if (config.provider === 'local') {
        return await testLocalOllama(config);
      }
      if (config.provider === 'anthropic') {
        return await testAnthropic(config);
      }
      if (config.provider === 'openai') {
        return await testOpenAI(config);
      }
      if (config.provider === 'groq') {
        return await testGroq(config);
      }
      if (config.provider === 'glm') {
        return await testGLM(config);
      }
      if (config.provider === 'minimax') {
        return await testMiniMax(config);
      }
      return { ok: false, error: `Proveedor no soportado: ${config.provider}` };
    } catch (err: any) {
      return { ok: false, error: err?.message ?? 'Error desconocido' };
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
