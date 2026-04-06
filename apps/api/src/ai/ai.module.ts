import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { AiSharedModule } from './shared/ai-shared.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [AiSharedModule, PrismaModule],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
