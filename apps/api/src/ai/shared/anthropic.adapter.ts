import { Injectable, Logger } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import {
  ModelProviderAdapter,
  AiRequestOptions,
  AiResponse,
} from './model-provider.interface';

const MODEL = 'claude-opus-4-6';

@Injectable()
export class AnthropicAdapter extends ModelProviderAdapter {
  private client: Anthropic;
  private readonly logger = new Logger(AnthropicAdapter.name);

  constructor() {
    super();
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (apiKey) {
      this.client = new Anthropic({ apiKey });
    }
  }

  async ask(options: AiRequestOptions): Promise<AiResponse> {
    if (!this.client) {
      throw new Error('ANTHROPIC_API_KEY no configurada. Añádela en Ajustes → Inteligencia Artificial o como variable de entorno.');
    }
    const { system, messages, maxTokens = 16000 } = options;

    this.logger.debug(`Calling ${MODEL} with ${messages.length} messages`);

    const response = await this.client.messages.create({
      model: MODEL,
      max_tokens: maxTokens,
      system,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const textBlock = response.content.find((b) => b.type === 'text');
    const text = textBlock?.type === 'text' ? textBlock.text : '';

    return {
      text,
      model: response.model,
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
    };
  }
}
