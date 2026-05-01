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
    },
    @Request() req: any,
  ) {
    return this.ai.suggestProjectStructure(data, req.user.userId);
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
    },
    @Request() req: any,
  ) {
    return { response: await this.ai.askTeacherAssistant(data, req.user.userId) };
  }

  @Post('test-connection')
  async testConnection(@Body() config: LlmConfig) {
    if (config.provider === 'ollama-cloud') {
      return await this.testOllamaCloud(config);
    }
    if (config.provider === 'local') {
      return await this.testLocalOllama(config);
    }
    return { ok: false, error: `Proveedor no soportado: ${config.provider}` };
  }

  private async testOllamaCloud(config: LlmConfig) {
    if (!config.apiKey) return { ok: false, error: 'Falta API key' };
    const model = config.model || 'minimax-m2.7:cloud';
    const endpoints = [
      'https://api.ollama.com/v1/chat/completions',
      'https://ollama.com/api/v1/chat/completions',
    ];
    const body = JSON.stringify({
      model,
      messages: [{ role: 'user', content: 'Responde solo: OK' }],
      max_tokens: 16,
      stream: false,
    });
    for (const url of endpoints) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.apiKey}`,
          },
          body,
        });
        if (!res.ok) continue;
        const data = await res.json();
        return { ok: true, model: data.model || model };
      } catch (e: any) {
        continue;
      }
    }
    return { ok: false, error: 'No se pudo conectar a Ollama Cloud' };
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
