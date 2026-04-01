import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CurriculumService {
  constructor(private prisma: PrismaService) {}

  async getLearningOutcomesByModule(moduleId: string) {
    return this.prisma.learningOutcome.findMany({
      where: { moduleId },
      include: {
        evaluationCriteria: true,
      },
      orderBy: { code: 'asc' },
    });
  }

  async getEvaluationCriteriaByLO(learningOutcomeId: string) {
    return this.prisma.evaluationCriterion.findMany({
      where: { learningOutcomeId },
      orderBy: { code: 'asc' },
    });
  }

  async createLearningOutcome(data: { code: string; description: string; moduleId: string }) {
    return this.prisma.learningOutcome.create({
      data,
    });
  }

  async createEvaluationCriterion(data: { code: string; description: string; learningOutcomeId: string }) {
    return this.prisma.evaluationCriterion.create({
      data,
    });
  }
}
