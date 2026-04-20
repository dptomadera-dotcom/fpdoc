import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import {
  ModelProviderAdapter,
  AiRequestOptions,
  AiResponse,
} from './model-provider.interface';

@Injectable()
export class OpenAiAdapter extends ModelProviderAdapter {
  private readonly client: OpenAI;
  private readonly model: string;
  private readonly logger = new Logger(OpenAiAdapter.name);

  constructor(apiKey?: string, model?: string, baseURL?: string) {
    super();
    const key = apiKey ?? process.env.OPENAI_API_KEY;
    if (!key) throw new Error('OPENAI_API_KEY is required');
    this.model = model ?? process.env.OPENAI_MODEL ?? 'gpt-4o';
    this.client = new OpenAI({
      apiKey: key,
      baseURL: baseURL ?? process.env.OPENAI_BASE_URL,
    });
  }

  async ask(options: AiRequestOptions): Promise<AiResponse> {
    const { system, messages, maxTokens = 4096 } = options;
    this.logger.debug(`Calling ${this.model} with ${messages.length} messages`);

    const response = await this.client.chat.completions.create({
      model: this.model,
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: system },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    });

    const text = response.choices[0]?.message?.content ?? '';
    return {
      text,
      model: response.model,
      inputTokens: response.usage?.prompt_tokens ?? 0,
      outputTokens: response.usage?.completion_tokens ?? 0,
    };
  }
}