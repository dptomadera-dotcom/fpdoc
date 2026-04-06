import { PrismaService } from '../../../prisma/prisma.service';

export interface CurriculumReviewContext {
  module?: { id: string; code: string; name: string };
  project?: { id: string; name: string; description: string };
  learningOutcomes: Array<{
    id: string;
    code: string;
    description: string;
    evaluationCriteria: Array<{
      id: string;
      code: string;
      description: string;
      coveredByTasks: Array<{ id: string; title: string; phase: string }>;
    }>;
    coveredByTasks: Array<{ id: string; title: string; phase: string }>;
  }>;
  uncoveredRaIds: string[];
  totalTasks: number;
  tasksWithLinks: number;
}

export async function buildCurriculumReviewContext(
  prisma: PrismaService,
  params: { moduleId?: string; projectId?: string },
): Promise<CurriculumReviewContext> {
  // Load module if provided
  let moduleData: CurriculumReviewContext['module'] | undefined;
  if (params.moduleId) {
    const mod = await prisma.module.findUnique({
      where: { id: params.moduleId },
      select: { id: true, code: true, name: true },
    });
    if (mod) moduleData = mod;
  }

  // Load learning outcomes for the module
  const learningOutcomes = await prisma.learningOutcome.findMany({
    where: params.moduleId ? { moduleId: params.moduleId } : undefined,
    include: {
      evaluationCriteria: {
        include: {
          TaskCurriculumLink: {
            include: {
              Task: {
                include: { ProjectPhase: true },
              },
            },
          },
        },
      },
      TaskCurriculumLink: {
        include: {
          Task: {
            include: { ProjectPhase: true },
          },
        },
        // Filter by project if provided
        ...(params.projectId
          ? {
              where: {
                Task: { ProjectPhase: { Project: { id: params.projectId } } },
              },
            }
          : {}),
      },
    },
    take: 30,
  });

  // Load project context if provided
  let projectData: CurriculumReviewContext['project'] | undefined;
  let totalTasks = 0;
  let tasksWithLinks = 0;

  if (params.projectId) {
    const project = await prisma.project.findUnique({
      where: { id: params.projectId },
      include: {
        phases: {
          include: {
            tasks: {
              include: { curriculumLinks: true },
            },
          },
        },
      },
    });

    if (project) {
      projectData = {
        id: project.id,
        name: project.name,
        description: project.description ?? '',
      };
      const allTasks = project.phases.flatMap((p) => p.tasks);
      totalTasks = allTasks.length;
      tasksWithLinks = allTasks.filter((t) => t.curriculumLinks.length > 0).length;
    }
  }

  const uncoveredRaIds = learningOutcomes
    .filter((ra) => ra.TaskCurriculumLink.length === 0)
    .map((ra) => ra.id);

  return {
    module: moduleData,
    project: projectData,
    learningOutcomes: learningOutcomes.map((ra) => ({
      id: ra.id,
      code: ra.code,
      description: ra.description,
      coveredByTasks: ra.TaskCurriculumLink.map((link) => ({
        id: link.Task.id,
        title: link.Task.title,
        phase: (link.Task as any).ProjectPhase?.name ?? '',
      })),
      evaluationCriteria: ra.evaluationCriteria.map((ce) => ({
        id: ce.id,
        code: ce.code,
        description: ce.description,
        coveredByTasks: ce.TaskCurriculumLink.map((link) => ({
          id: link.Task.id,
          title: link.Task.title,
          phase: (link.Task as any).ProjectPhase?.name ?? '',
        })),
      })),
    })),
    uncoveredRaIds,
    totalTasks,
    tasksWithLinks,
  };
}
