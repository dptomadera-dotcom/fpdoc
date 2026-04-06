import { Module } from '@nestjs/common';
import { AnthropicAdapter } from './anthropic.adapter';
import { AiInteractionLogService } from './ai-interaction-log.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AnthropicAdapter, AiInteractionLogService],
  exports: [AnthropicAdapter, AiInteractionLogService],
})
export class AiSharedModule {}
