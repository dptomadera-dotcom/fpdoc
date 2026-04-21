import { Logger } from '@nestjs/common';
import { ModelProviderAdapter } from './model-provider.interface';
import { AnthropicAdapter } from './anthropic.adapter';
import { OpenAiAdapter } from './openai.adapter';
import { GlmAdapter } from './glm.adapter';
import { MinimaxAdapter } from './minimax.adapter';
import { OllamaAdapter } from './ollama.adapter';
import { DEFAULT_MODELS } from '@fpdoc/ai-models';

const logger = new Logger('ModelProviderFactory');

export function createModelProviderAdapter(): ModelProviderAdapter {
  const provider = (process.env.AI_PROVIDER ?? 'anthropic').toLowerCase();
  const model = process.env.ANTHROPIC_MODEL ?? DEFAULT_MODELS.anthropic;

  logger.log(`AI provider: ${provider}, model: ${model}`);

  switch (provider) {
    case 'openai':
      return new OpenAiAdapter();
    case 'glm':
      return new GlmAdapter();
    case 'minimax':
      return new MinimaxAdapter();
    case 'ollama':
      return new OllamaAdapter();
    case 'anthropic':
    default:
      return new AnthropicAdapter(undefined, model);
  }
}

export const MODEL_PROVIDER_TOKEN = ModelProviderAdapter;
