import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { CurriculumModule } from '../curriculum/curriculum.module';
import { SupabaseService } from '../common/supabase.service';

@Module({
  imports: [CurriculumModule],
  controllers: [AiController],
  providers: [AiService, SupabaseService],
  exports: [AiService],
})
export class AiModule {}
