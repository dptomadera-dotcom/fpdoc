import { Injectable, Logger } from '@nestjs/common';
import {
  ModelProviderAdapter,
  AiRequestOptions,
  AiResponse,
} from './model-provider.interface';

@Injectable()
export class OllamaAdapter extends ModelProviderAdapter {
  private readonly baseUrl: string;
  private readonly model: string;
  private readonly logger = new Logger(OllamaAdapter.name);

  constructor() {
    super();
    this.baseUrl = process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434';
    this.model = process.env.OLLAMA_MODEL ?? 'llama3';
  }

  async ask(options: AiRequestOptions): Promise<AiResponse> {
    const { system, messages, maxTokens = 4096 } = options;
    this.logger.debug(`Calling Ollama/${this.model} with ${messages.length} messages`);

    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        stream: false,
        options: { num_predict: maxTokens },
        messages: [
          { role: 'system', content: system },
          ...messages.map((m) => ({ role: m.role, content: m.content })),
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama error ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    const text: string = data.message?.content ?? '';

    return {
      text,
      model: this.model,
      inputTokens: data.prompt_eval_count ?? 0,
      outputTokens: data.eval_count ?? 0,
    };
  }
}
