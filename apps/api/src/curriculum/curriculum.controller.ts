import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CurriculumService } from './curriculum.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('curriculum')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CurriculumController {
  constructor(private readonly curriculumService: CurriculumService) {}

  @Get('modules/:moduleId/learning-outcomes')
  getLearningOutcomesByModule(@Param('moduleId') moduleId: string) {
    return this.curriculumService.getLearningOutcomesByModule(moduleId);
  }

  @Get('learning-outcomes/:id/criteria')
  getEvaluationCriteriaByLO(@Param('id') id: string) {
    return this.curriculumService.getEvaluationCriteriaByLO(id);
  }

  @Post('learning-outcomes')
  @Roles('ADMIN', 'PROFESOR')
  createLearningOutcome(@Body() data: { code: string; description: string; moduleId: string }) {
    return this.curriculumService.createLearningOutcome(data);
  }

  @Post('criteria')
  @Roles('ADMIN', 'PROFESOR')
  createEvaluationCriterion(@Body() data: { code: string; description: string; learningOutcomeId: string }) {
    return this.curriculumService.createEvaluationCriterion(data);
  }
}
