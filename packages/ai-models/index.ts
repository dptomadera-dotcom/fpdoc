/**
 * Registry centralizado de modelos IA disponibles.
 * Consumido por backend (resolveAdapter) y frontend (selector).
 */

export type ModelProvider = 'anthropic' | 'openai' | 'glm' | 'minimax' | 'ollama' | 'groq' | 'ollama-cloud';

export interface AiModel {
  id: string; // ej: 'claude-opus-4-7', 'gpt-4o', 'glm-5.1', etc
  name: string; // ej: 'Claude Opus 4.7', 'GPT-4o'
  provider: ModelProvider;
  family: 'cloud' | 'local';
  maxTokens: number;
  costPer1kInput?: number; // USD, si cloud
  costPer1kOutput?: number;
  supportedIn?: string[]; // ['chat', 'suggest', 'grade']
  deprecated?: boolean;
}

export const AI_MODELS_REGISTRY: Record<string, AiModel> = {
  // ═════════════════════════════════════════════════════════
  // ANTHROPIC
  // ═════════════════════════════════════════════════════════
  'claude-opus-4-7': {
    id: 'claude-opus-4-7',
    name: 'Claude Opus 4.7',
    provider: 'anthropic',
    family: 'cloud',
    maxTokens: 200000,
    costPer1kInput: 0.015,
    costPer1kOutput: 0.075,
    supportedIn: ['chat', 'suggest', 'grade']
  },
  'claude-sonnet-4-6': {
    id: 'claude-sonnet-4-6',
    name: 'Claude Sonnet 4.6',
    provider: 'anthropic',
    family: 'cloud',
    maxTokens: 200000,
    costPer1kInput: 0.003,
    costPer1kOutput: 0.015,
    supportedIn: ['chat', 'suggest', 'grade']
  },
  'claude-haiku-4-5': {
    id: 'claude-haiku-4-5-20251001',
    name: 'Claude Haiku 4.5',
    provider: 'anthropic',
    family: 'cloud',
    maxTokens: 8192,
    costPer1kInput: 0.0008,
    costPer1kOutput: 0.004,
    supportedIn: ['chat', 'suggest']
  },

  // ═════════════════════════════════════════════════════════
  // OPENAI
  // ═════════════════════════════════════════════════════════
  'gpt-4o': {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    family: 'cloud',
    maxTokens: 128000,
    costPer1kInput: 0.005,
    costPer1kOutput: 0.015,
    supportedIn: ['chat', 'suggest', 'grade']
  },
  'gpt-4o-mini': {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openai',
    family: 'cloud',
    maxTokens: 128000,
    costPer1kInput: 0.00015,
    costPer1kOutput: 0.0006,
    supportedIn: ['chat', 'suggest']
  },

  // ═════════════════════════════════════════════════════════
  // ZHIPU (GLM)
  // ═════════════════════════════════════════════════════════
  'glm-5.1': {
    id: 'glm-5.1',
    name: 'GLM-5.1',
    provider: 'glm',
    family: 'cloud',
    maxTokens: 8192,
    supportedIn: ['chat', 'suggest']
  },

  // ═════════════════════════════════════════════════════════
  // MINIMAX
  // ═════════════════════════════════════════════════════════
  'minimax-m2.7': {
    id: 'minimax-m2.7',
    name: 'MiniMax-M2.7',
    provider: 'minimax',
    family: 'cloud',
    maxTokens: 8192,
    supportedIn: ['chat', 'suggest']
  },

  // ═════════════════════════════════════════════════════════
  // LOCAL (Ollama / LM Studio)
  // ═════════════════════════════════════════════════════════
  'gemma:4b': {
    id: 'gemma:4b',
    name: 'Gemma 4B (Local)',
    provider: 'ollama',
    family: 'local',
    maxTokens: 2048,
    supportedIn: ['chat', 'suggest']
  },
  'gemma:2b': {
    id: 'gemma:2b',
    name: 'Gemma 2B (Local)',
    provider: 'ollama',
    family: 'local',
    maxTokens: 1024,
    supportedIn: ['chat']
  },
  'mistral:latest': {
    id: 'mistral:latest',
    name: 'Mistral (Local)',
    provider: 'ollama',
    family: 'local',
    maxTokens: 4096,
    supportedIn: ['chat', 'suggest']
  },

  // ═════════════════════════════════════════════════════════
  // GROQ
  // ═════════════════════════════════════════════════════════
  'mixtral-8x7b-32768': {
    id: 'mixtral-8x7b-32768',
    name: 'Mixtral 8x7B (Groq)',
    provider: 'groq',
    family: 'cloud',
    maxTokens: 32768,
    supportedIn: ['chat', 'suggest']
  },

  // ═════════════════════════════════════════════════════════
  // OLLAMA CLOUD (suscripción ollama.com)
  // ═════════════════════════════════════════════════════════
  'glm-5.1:cloud': {
    id: 'glm-5.1:cloud',
    name: 'GLM-5.1 (Ollama Cloud)',
    provider: 'ollama-cloud',
    family: 'cloud',
    maxTokens: 198000,
    supportedIn: ['chat', 'suggest']
  },
  'minimax-m2.7:cloud': {
    id: 'minimax-m2.7:cloud',
    name: 'MiniMax-M2.7 (Ollama Cloud)',
    provider: 'ollama-cloud',
    family: 'cloud',
    maxTokens: 8192,
    supportedIn: ['chat', 'suggest']
  },
  'kimi-k2.6:cloud': {
    id: 'kimi-k2.6:cloud',
    name: 'Kimi K2.6 (Ollama Cloud)',
    provider: 'ollama-cloud',
    family: 'cloud',
    maxTokens: 131072,
    supportedIn: ['chat', 'suggest']
  },
  'deepseek-v4-flash:cloud': {
    id: 'deepseek-v4-flash:cloud',
    name: 'DeepSeek V4 Flash (Ollama Cloud)',
    provider: 'ollama-cloud',
    family: 'cloud',
    maxTokens: 65536,
    supportedIn: ['chat', 'suggest']
  },
  'deepseek-v4-pro:cloud': {
    id: 'deepseek-v4-pro:cloud',
    name: 'DeepSeek V4 Pro (Ollama Cloud)',
    provider: 'ollama-cloud',
    family: 'cloud',
    maxTokens: 1000000,
    supportedIn: ['chat', 'suggest']
  },
  'gpt-oss:120b:cloud': {
    id: 'gpt-oss:120b:cloud',
    name: 'GPT-OSS 120B (Ollama Cloud)',
    provider: 'ollama-cloud',
    family: 'cloud',
    maxTokens: 32768,
    supportedIn: ['chat', 'suggest']
  },
  'qwen3.5:cloud': {
    id: 'qwen3.5:cloud',
    name: 'Qwen 3.5 (Ollama Cloud)',
    provider: 'ollama-cloud',
    family: 'cloud',
    maxTokens: 32768,
    supportedIn: ['chat', 'suggest']
  }
};

// Agrupar por proveedor para selectores en UI
export const MODELS_BY_PROVIDER = Object.values(AI_MODELS_REGISTRY).reduce(
  (acc, model) => {
    if (!acc[model.provider]) acc[model.provider] = [];
    if (!model.deprecated) acc[model.provider].push(model);
    return acc;
  },
  {} as Record<ModelProvider, AiModel[]>
);

// Modelos activos (no deprecated)
export const ACTIVE_MODELS = Object.values(AI_MODELS_REGISTRY).filter(m => !m.deprecated);

// Defaults por proveedor
export const DEFAULT_MODELS: Record<ModelProvider, string> = {
  anthropic: 'claude-opus-4-7',
  openai: 'gpt-4o-mini',
  glm: 'glm-5.1',
  minimax: 'minimax-m2.7',
  ollama: 'gemma:4b',
  groq: 'mixtral-8x7b-32768',
  'ollama-cloud': 'minimax-m2.7:cloud'
};

export function getModel(modelId: string): AiModel | undefined {
  return AI_MODELS_REGISTRY[modelId];
}

export function getModelsByProvider(provider: ModelProvider): AiModel[] {
  return MODELS_BY_PROVIDER[provider] || [];
}

export function getDefaultModel(provider: ModelProvider): AiModel | undefined {
  const modelId = DEFAULT_MODELS[provider];
  return modelId ? getModel(modelId) : undefined;
}
