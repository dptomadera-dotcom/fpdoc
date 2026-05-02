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

    // The registry uses ':cloud' suffix to avoid naming conflicts; the REST API expects the plain id
    const apiModel = this.model.replace(/:cloud$/, '');

    const response = await fetch('https://ollama.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: apiModel,
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
      throw new Error(`Ollama Cloud error ${response.status}: ${error.substring(0, 200)}`);
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
