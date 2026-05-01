import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserRole } from '@prisma/client';
import { randomUUID } from 'crypto';

export interface LogAiInteractionParams {
  userId: string;
  role: UserRole;
  agentType: string;
  prompt: string;
  response: string;
  model: string;
  route?: string;
  entityType?: string;
  entityId?: string;
  status?: 'success' | 'error';
  metadata?: Record<string, unknown>;
}

@Injectable()
export class AiInteractionLogService {
  private readonly logger = new Logger(AiInteractionLogService.name);

  constructor(private readonly prisma: PrismaService) {}

  async log(params: LogAiInteractionParams): Promise<void> {
    try {
      await this.prisma.aIInteraction.create({
        data: {
          id: randomUUID(),
          userId: params.userId,
          role: params.role,
          agentType: params.agentType,
          prompt: params.prompt,
          response: params.response,
          model: params.model,
          route: params.route,
          entityType: params.entityType,
          entityId: params.entityId,
          status: params.status ?? 'success',
          metadata: params.metadata ?? {},
        },
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.warn('Failed to log AI interaction (non-critical):', message);
    }
  }
}
