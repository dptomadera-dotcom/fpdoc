import { Module } from '@nestjs/common';
import { CurriculumReviewController } from './curriculum-review.controller';
import { CurriculumReviewService } from './curriculum-review.service';
import { AiSharedModule } from '../shared/ai-shared.module';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [AiSharedModule, PrismaModule],
  controllers: [CurriculumReviewController],
  providers: [CurriculumReviewService],
})
export class CurriculumReviewModule {}
