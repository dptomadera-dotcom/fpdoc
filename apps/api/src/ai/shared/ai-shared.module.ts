import { Module } from '@nestjs/common';
import { AiInteractionLogService } from './ai-interaction-log.service';
import { ModelProviderAdapter } from './model-provider.interface';
import { createModelProviderAdapter } from './model-provider.factory';
import { PrismaModule } from '../../prisma/prisma.module';

const modelProviderProvider = {
  provide: ModelProviderAdapter,
  useFactory: createModelProviderAdapter,
};

@Module({
  imports: [PrismaModule],
  providers: [modelProviderProvider, AiInteractionLogService],
  exports: [ModelProviderAdapter, AiInteractionLogService],
})
export class AiSharedModule {}
