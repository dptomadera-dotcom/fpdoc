import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AiService, ChatMessage, LlmConfig } from './ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('ai')
export class AiController {
  constructor(private readonly ai: AiService) {}

  @Post('chat')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.JEFATURA, UserRole.PROFESOR)
  async chat(
    @Request() req: any,
    @Body() body: { messages: ChatMessage[]; config?: LlmConfig },
  ) {
    return this.ai.chat(body.messages, req.user.userId, body.config);
  }

  @Post('suggest')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PROFESOR)
  async suggest(
    @Body()
    data: {
      title: string;
      description: string;
      raIds: string[];
      ceIds: string[];
      route?: string;
      clientConfig?: LlmConfig;
    },
    @Request() req: any,
  ) {
    return this.ai.suggestProjectStructure(data, req.user.userId, data.clientConfig);
  }

  @Post('teacher-assistant')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PROFESOR)
  async teacherAssistant(
    @Body()
    data: {
      message: string;
      route?: string;
      entityType?: string;
      entityId?: string;
      clientConfig?: LlmConfig;
    },
    @Request() req: any,
  ) {
    return { response: await this.ai.askTeacherAssistant(data, req.user.userId, data.clientConfig) };
  }

  @Post('test-connection')
  @UseGuards(JwtAuthGuard)
  async testConnection(@Body() config: LlmConfig) {
    switch (config.provider) {
      case 'openai':              return this.testOpenAi(config);
      case 'anthropic':           return this.testAnthropic(config);
      case 'groq':                return this.testGroq(config);
      case 'glm':                 return this.testGlm(config);
      case 'minimax':             return this.testMinimax(config);
      case 'ollama-cloud-daemon': return this.testOllamaCloudDaemon(config);
      case 'local':               return this.testLocalOllama(config);
      default:
        return { ok: false, error: `Proveedor no soportado: ${config.provider}` };
    }
  }

  private async testOpenAi(config: LlmConfig) {
    if (!config.apiKey) return { ok: false, error: 'Falta API key' };
    try {
      const res = await fetch('https://api.openai.com/v1/models', {
        headers: { Authorization: `Bearer ${config.apiKey}` },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as any;
        return { ok: false, error: err?.error?.message ?? `${res.status}` };
      }
      return { ok: true, model: config.model || 'gpt-4o-mini' };
    } catch (e: any) {
      return { ok: false, error: `OpenAI: ${e.message}` };
    }
  }

  private async testAnthropic(config: LlmConfig) {
    if (!config.apiKey) return { ok: false, error: 'Falta API key' };
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: config.model || 'claude-haiku-4-5-20251001',
          max_tokens: 1,
          messages: [{ role: 'user', content: 'hi' }],
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as any;
        return { ok: false, error: err?.error?.message ?? `${res.status}` };
      }
      const data = await res.json() as any;
      return { ok: true, model: data.model || config.model };
    } catch (e: any) {
      return { ok: false, error: `Anthropic: ${e.message}` };
    }
  }

  private async testGroq(config: LlmConfig) {
    if (!config.apiKey) return { ok: false, error: 'Falta API key' };
    try {
      const res = await fetch('https://api.groq.com/openai/v1/models', {
        headers: { Authorization: `Bearer ${config.apiKey}` },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as any;
        return { ok: false, error: err?.error?.message ?? `${res.status}` };
      }
      return { ok: true, model: config.model || 'mixtral-8x7b-32768' };
    } catch (e: any) {
      return { ok: false, error: `Groq: ${e.message}` };
    }
  }

  private async testGlm(config: LlmConfig) {
    if (!config.apiKey) return { ok: false, error: 'Falta API key' };
    try {
      const res = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          model: config.model || 'glm-4-flash',
          messages: [{ role: 'user', content: 'hi' }],
          max_tokens: 1,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as any;
        return { ok: false, error: err?.error?.message ?? `${res.status}` };
      }
      const data = await res.json() as any;
      return { ok: true, model: data.model || config.model };
    } catch (e: any) {
      return { ok: false, error: `GLM: ${e.message}` };
    }
  }

  private async testMinimax(config: LlmConfig) {
    if (!config.apiKey) return { ok: false, error: 'Falta API key' };
    try {
      const res = await fetch('https://api.minimaxi.chat/v1/text/chatcompletion_v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          model: config.model || 'minimax-m2.7',
          messages: [{ role: 'user', content: 'hi' }],
          tokens_to_generate: 1,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as any;
        return { ok: false, error: err?.error?.message ?? `${res.status}` };
      }
      const data = await res.json() as any;
      return { ok: true, model: data.model || config.model };
    } catch (e: any) {
      return { ok: false, error: `MiniMax: ${e.message}` };
    }
  }

  private async testOllamaCloudDaemon(config: LlmConfig) {
    const endpoint = config.endpoint || 'http://localhost:11434';
    const model = config.model || 'kimi-k2.6:cloud';
    try {
      const res = await fetch(`${endpoint}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: 'Responde solo: OK' }],
          stream: false,
          options: { num_predict: 8 },
        }),
      });
      if (!res.ok) {
        const error = await res.text();
        return { ok: false, error: `${res.status}: ${error.substring(0, 100)}` };
      }
      const data = await res.json();
      return { ok: true, model: data.model || model };
    } catch (e: any) {
      return { ok: false, error: `Ollama daemon: ${e.message}` };
    }
  }

  private async testLocalOllama(config: LlmConfig) {
    const endpoint = config.endpoint || 'http://localhost:11434';
    const model = config.model || 'llama3.2';
    try {
      const res = await fetch(`${endpoint}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, prompt: 'OK', stream: false }),
      });
      if (!res.ok) return { ok: false, error: `${res.status}` };
      const data = await res.json();
      return { ok: true, model: data.model || model };
    } catch (e: any) {
      return { ok: false, error: `Ollama local: ${e.message}` };
    }
  }
}
