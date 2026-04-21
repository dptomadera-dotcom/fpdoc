import { Injectable, Logger } from '@nestjs/common';
import {
  ModelProviderAdapter,
  AiRequestOptions,
  AiResponse,
} from './model-provider.interface';

@Injectable()
export class MinimaxAdapter extends ModelProviderAdapter {
  private readonly apiKey: string;
  private readonly model: string;
  private readonly logger = new Logger(MinimaxAdapter.name);
  private readonly baseUrl = 'https://api.minimaxi.chat/v1';

  constructor(apiKey?: string, model?: string) {
    super();
    this.apiKey = apiKey ?? process.env.MINIMAX_API_KEY ?? '';
    this.model = model ?? process.env.MINIMAX_MODEL ?? 'minimax-m2.7';
    if (!this.apiKey) {
      throw new Error('MINIMAX_API_KEY no configurada. Requiere API Key de MiniMax (https://minimax.io)');
    }
  }

  async ask(options: AiRequestOptions): Promise<AiResponse> {
    const { system, messages, maxTokens = 2048 } = options;

    this.logger.debug(`Calling ${this.model} with ${messages.length} messages`);

    const payload = {
      model: this.model,
      messages: [
        { role: 'system', content: system },
        ...messages.map(m => ({ role: m.role, content: m.content }))
      ],
      max_tokens: maxTokens,
      temperature: 0.7
    };

    const response = await fetch(`${this.baseUrl}/text/chatcompletion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.text();
      this.logger.error(`MiniMax API error: ${response.status} ${error}`);
      throw new Error(`MiniMax API request failed: ${response.status}`);
    }

    const data = (await response.json()) as any;
    const text = data.choices?.[0]?.message?.content ?? '';

    return {
      text,
      model: this.model,
      inputTokens: data.usage?.prompt_tokens ?? 0,
      outputTokens: data.usage?.completion_tokens ?? 0
    };
  }
}
