import { PrismaService } from '../../../prisma/prisma.service';

export interface CurriculumContext {
  learningOutcomes: Array<{
    id: string;
    code: string;
    description: string;
    evaluationCriteria: Array<{ id: string; code: string; description: string }>;
  }>;
}

export async function buildCurriculumContext(
  prisma: PrismaService,
  raIds: string[],
  ceIds: string[],
): Promise<CurriculumContext> {
  if (!raIds.length && !ceIds.length) {
    return { learningOutcomes: [] };
  }

  const learningOutcomes = await prisma.learningOutcome.findMany({
    where: raIds.length ? { id: { in: raIds } } : undefined,
    include: {
      evaluationCriteria: {
        where: ceIds.length ? { id: { in: ceIds } } : undefined,
      },
    },
    take: 20,
  });

  return {
    learningOutcomes: learningOutcomes.map((ra) => ({
      id: ra.id,
      code: ra.code,
      description: ra.description,
      evaluationCriteria: ra.evaluationCriteria.map((ce) => ({
        id: ce.id,
        code: ce.code,
        description: ce.description,
      })),
    })),
  };
}
