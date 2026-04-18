export interface AiMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AiRequestOptions {
  system: string;
  messages: AiMessage[];
  maxTokens?: number;
}

export interface AiResponse {
  text: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
}

export abstract class ModelProviderAdapter {
  abstract ask(options: AiRequestOptions): Promise<AiResponse>;
}
