import { Injectable, Logger } from '@nestjs/common';
import {
  ModelProviderAdapter,
  AiRequestOptions,
  AiResponse,
} from './model-provider.interface';

@Injectable()
export class OllamaCloudAdapter extends ModelProviderAdapter {
  private readonly apiKey: string;
  private model: string = 'hermes';  // Cambiar a hermes ya que funciona en tu cuenta
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
    };

    // Intentar diferentes formatos de autorización
    const authHeaders = [
      { 'Authorization': `Bearer ${this.apiKey}` },  // Standard OAuth
      { 'Authorization': this.apiKey },               // Direct API key
      { 'X-API-Key': this.apiKey },                   // API key header
      { 'X-Ollama-Auth': this.apiKey },               // Ollama custom header
    ];

    const body = JSON.stringify({
      model: this.model,
      messages: [
        { role: 'system', content: system },
        ...messages.map(m => ({ role: m.role, content: m.content })),
      ],
      temperature: 0.7,
      max_tokens: maxTokens,
    });

    // Intentar con diferentes endpoints y formatos de autenticación
    const endpoints = [
      `https://api.ollama.com/v1/chat/completions`,
      `https://api.ollama.ai/v1/chat/completions`,
      `https://ollama.com/api/v1/chat/completions`,
    ];

    let lastError: string = '';

    for (const authHeader of authHeaders) {
      for (const endpoint of endpoints) {
        try {
          const currentHeaders = { ...headers, ...authHeader };
          const authType = Object.keys(authHeader)[0];
          this.logger.debug(`Attempting ${endpoint} with ${authType}`);

          const response = await fetch(endpoint, {
            method: 'POST',
            headers: currentHeaders,
            body,
          });

          if (!response.ok) {
            const error = await response.text();
            this.logger.warn(`${endpoint} (${authType}) returned ${response.status}`);
            lastError = `${response.status}: ${error.substring(0, 100)}`;
            continue;
          }

          const data = (await response.json()) as any;
          const text = data.choices?.[0]?.message?.content ?? data.message?.content ?? '';

          this.logger.log(`✓ Success with ${endpoint} using ${authType}`);
          return {
            text,
            model: data.model ?? this.model,
            inputTokens: data.usage?.prompt_tokens ?? 0,
            outputTokens: data.usage?.completion_tokens ?? 0,
          };
        } catch (err) {
          this.logger.warn(`${endpoint} failed: ${String(err).substring(0, 50)}`);
          lastError = String(err);
        }
      }
    }

    // All combinations failed
    throw new Error(`Ollama Cloud: ningún endpoint/auth funcionó. Verifica tu API key.`);
  }
}
