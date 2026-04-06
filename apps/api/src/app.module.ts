import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AcademicModule } from './academic/academic.module';

import { CurriculumModule } from './curriculum/curriculum.module';

import { ProjectsModule } from './projects/projects.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { PlanningModule } from './planning/planning.module';
import { AiModule } from './ai/ai.module';
import { CurriculumReviewModule } from './ai/curriculum-review/curriculum-review.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    PrismaModule, 
    AuthModule, 
    AcademicModule, 
    CurriculumModule, 
    ProjectsModule,
    MonitoringModule,
    PlanningModule,
    AiModule,
    CurriculumReviewModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
