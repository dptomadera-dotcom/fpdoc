import { Module } from '@nestjs/common';
import { StudentAssistantController } from './student-assistant.controller';
import { StudentAssistantService } from './student-assistant.service';
import { AiSharedModule } from '../shared/ai-shared.module';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [AiSharedModule, PrismaModule],
  controllers: [StudentAssistantController],
  providers: [StudentAssistantService],
})
export class StudentAssistantModule {}
