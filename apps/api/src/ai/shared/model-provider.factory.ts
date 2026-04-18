import { Logger } from '@nestjs/common';
import { ModelProviderAdapter } from './model-provider.interface';
import { AnthropicAdapter } from './anthropic.adapter';
import { OpenAiAdapter } from './openai.adapter';
import { OllamaAdapter } from './ollama.adapter';

const logger = new Logger('ModelProviderFactory');

export function createModelProviderAdapter(): ModelProviderAdapter {
  const provider = (process.env.AI_PROVIDER ?? 'anthropic').toLowerCase();

  logger.log(`AI provider: ${provider}`);

  switch (provider) {
    case 'openai':
      return new OpenAiAdapter();
    case 'ollama':
      return new OllamaAdapter();
    case 'anthropic':
    default:
      return new AnthropicAdapter();
  }
}

export const MODEL_PROVIDER_TOKEN = ModelProviderAdapter;
