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

    const body = JSON.stringify({
      model: this.model,
      messages: [
        { role: 'system', content: system },
        ...messages.map(m => ({ role: m.role, content: m.content })),
      ],
      temperature: 0.7,
      max_tokens: maxTokens,
    });

    // Intentar con api.ollama.com primero, luego fallback a api.ollama.ai
    const endpoints = [
      `https://api.ollama.com/v1/chat/completions`,
      `https://api.ollama.ai/v1/chat/completions`,
    ];

    let lastError: string = '';
    for (const endpoint of endpoints) {
      try {
        this.logger.debug(`Attempting endpoint: ${endpoint}`);
        const response = await fetch(endpoint, {
          method: 'POST',
          headers,
          body,
        });

        if (!response.ok) {
          const error = await response.text();
          this.logger.warn(`Endpoint ${endpoint} returned ${response.status}: ${error}`);
          lastError = `${response.status}: ${error}`;
          continue; // Try next endpoint
        }

        const data = (await response.json()) as any;
        const text = data.choices?.[0]?.message?.content ?? data.message?.content ?? '';

        this.logger.debug(`Success with endpoint: ${endpoint}`);
        return {
          text,
          model: data.model ?? this.model,
          inputTokens: data.usage?.prompt_tokens ?? 0,
          outputTokens: data.usage?.completion_tokens ?? 0,
        };
      } catch (err) {
        this.logger.warn(`Endpoint ${endpoint} failed: ${err}`);
        lastError = String(err);
      }
    }

    // All endpoints failed
    throw new Error(`Ollama Cloud connection failed. Last error: ${lastError}`);
  }
}
