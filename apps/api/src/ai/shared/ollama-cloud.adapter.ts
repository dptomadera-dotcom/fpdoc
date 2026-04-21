import { Injectable, Logger } from '@nestjs/common';
import {
  ModelProviderAdapter,
  AiRequestOptions,
  AiResponse,
} from './model-provider.interface';

@Injectable()
export class OllamaCloudAdapter extends ModelProviderAdapter {
  private readonly apiKey: string;
  private model: string = 'minimax-m2.7:cloud';
  private readonly baseUrl = 'https://api.ollama.com';
  private readonly logger = new Logger(OllamaCloudAdapter.name);

  constructor(apiKey?: string, model?: string) {
    super();
    this.apiKey = apiKey ?? process.env.OLLAMA_CLOUD_API_KEY ?? '';
    if (!this.apiKey) {
      throw new Error('OLLAMA_CLOUD_API_KEY requerida. Obtén tu key en https://ollama.com/account/keys');
    }
    if (model) this.model = model;
  }

  setModel(modelId: string): void {
    this.model = modelId;
  }

  async ask(options: AiRequestOptions): Promise<AiResponse> {
    const { system, messages, maxTokens = 2048 } = options;

    this.logger.debug(`Calling Ollama Cloud ${this.model} with ${messages.length} messages`);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
    };

    const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: system },
          ...messages.map(m => ({ role: m.role, content: m.content })),
        ],
        temperature: 0.7,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      this.logger.error(`Ollama Cloud API error: ${response.status} ${error} (key starts with: ${this.apiKey.substring(0, 20)}...)`);
      throw new Error(`Ollama Cloud request failed: ${response.status} - ${error}`);
    }

    const data = (await response.json()) as any;
    const text = data.choices?.[0]?.message?.content ?? data.message?.content ?? '';

    return {
      text,
      model: data.model ?? this.model,
      inputTokens: data.usage?.prompt_tokens ?? 0,
      outputTokens: data.usage?.completion_tokens ?? 0,
    };
  }
}
