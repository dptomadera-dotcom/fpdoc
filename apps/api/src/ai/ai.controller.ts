import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AiService, ChatMessage, LlmConfig } from './ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('ai')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AiController {
  constructor(private readonly ai: AiService) {}

  @Post('chat')
  @Roles(UserRole.ADMIN, UserRole.JEFATURA, UserRole.PROFESOR)
  async chat(@Body() body: { messages: ChatMessage[]; config?: LlmConfig }) {
    return this.ai.chat(body.messages, body.config);
  }

  @Post('suggest')
  @Roles(UserRole.ADMIN, UserRole.PROFESOR)
  async suggest(@Body() data: {
    title: string;
    description: string;
    raIds: string[];
    ceIds: string[];
  }) {
    return this.ai.suggestProjectStructure(data);
  }
}
