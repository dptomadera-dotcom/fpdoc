import { Injectable, Logger } from '@nestjs/common';
import {
  ModelProviderAdapter,
  AiRequestOptions,
  AiResponse,
} from './model-provider.interface';

@Injectable()
export class OllamaCloudDaemonAdapter extends ModelProviderAdapter {
  private readonly baseUrl: string;
  private model: string;
  private readonly logger = new Logger(OllamaCloudDaemonAdapter.name);

  constructor(baseUrl?: string, model?: string) {
    super();
    this.baseUrl = baseUrl ?? process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434';
    this.model = model ?? 'kimi-k2.6:cloud';
  }

  setModel(modelId: string): void {
    this.model = modelId;
  }

  async ask(options: AiRequestOptions): Promise<AiResponse> {
    const { system, messages, maxTokens = 4096 } = options;
    this.logger.debug(`Calling Ollama daemon cloud/${this.model} at ${this.baseUrl}`);

    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        stream: false,
        options: { num_predict: maxTokens },
        messages: [
          { role: 'system', content: system },
          ...messages.map(m => ({ role: m.role, content: m.content })),
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama daemon error ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    return {
      text: data.message?.content ?? '',
      model: this.model,
      inputTokens: data.prompt_eval_count ?? 0,
      outputTokens: data.eval_count ?? 0,
    };
  }
}
