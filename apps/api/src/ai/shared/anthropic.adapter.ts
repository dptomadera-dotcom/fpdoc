import { Injectable, Logger } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import {
  ModelProviderAdapter,
  AiRequestOptions,
  AiResponse,
} from './model-provider.interface';

@Injectable()
export class AnthropicAdapter extends ModelProviderAdapter {
  private client: Anthropic;
  private readonly model: string;
  private readonly logger = new Logger(AnthropicAdapter.name);

  constructor(apiKey?: string, model?: string) {
    super();
    const key = apiKey ?? process.env.ANTHROPIC_API_KEY;
    this.model = model ?? process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-5';
    if (key) {
      this.client = new Anthropic({ apiKey: key });
    }
  }

  async ask(options: AiRequestOptions): Promise<AiResponse> {
    if (!this.client) {
      throw new Error('ANTHROPIC_API_KEY no configurada. Añádela en Ajustes → Inteligencia Artificial o como variable de entorno.');
    }
    const { system, messages, maxTokens = 16000 } = options;

    this.logger.debug(`Calling ${this.model} with ${messages.length} messages`);

    const response = await this.client.messages.create({
      model: this.model,
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
