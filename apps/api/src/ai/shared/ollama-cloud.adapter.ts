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
  private readonly baseUrl = 'https://api.ollama.com/api';
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

    const response = await fetch(`${this.baseUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: system },
          ...messages.map(m => ({ role: m.role, content: m.content })),
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      this.logger.error(`Ollama Cloud API error: ${response.status} ${error}`);
      throw new Error(`Ollama Cloud request failed: ${response.status}`);
    }

    const data = (await response.json()) as any;
    const text = data.message?.content ?? '';

    return {
      text,
      model: data.model ?? this.model,
      inputTokens: data.prompt_eval_count ?? 0,
      outputTokens: data.eval_count ?? 0,
    };
  }
}
