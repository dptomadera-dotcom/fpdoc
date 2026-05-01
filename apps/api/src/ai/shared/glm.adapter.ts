import { Injectable, Logger } from '@nestjs/common';
import {
  ModelProviderAdapter,
  AiRequestOptions,
  AiResponse,
} from './model-provider.interface';

@Injectable()
export class GlmAdapter extends ModelProviderAdapter {
  private readonly apiKey: string;
  private readonly model: string;
  private readonly logger = new Logger(GlmAdapter.name);
  private readonly baseUrl = 'https://open.bigmodel.cn/api/paas/v4';

  constructor(apiKey?: string, model?: string) {
    super();
    this.apiKey = apiKey ?? process.env.GLM_API_KEY ?? '';
    this.model = model ?? process.env.GLM_MODEL ?? 'glm-5.1';
    if (!this.apiKey) {
      throw new Error('GLM_API_KEY no configurada. Requiere API Key de Zhipu AI (https://bigmodel.cn)');
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

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.text();
      this.logger.error(`GLM API error: ${response.status} ${error}`);
      throw new Error(`GLM API request failed: ${response.status}`);
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
