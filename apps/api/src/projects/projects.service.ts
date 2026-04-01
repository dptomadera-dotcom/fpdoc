import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectStatus, TaskStatus } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const projects = await this.prisma.project.findMany({
      include: {
        course: { include: { cycle: true } },
        projectModules: { include: { module: true } },
        phases: {
          include: {
            tasks: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return projects.map((project) => ({
      ...project,
      progress: this.calculateProjectProgress(project),
    }));
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        course: { include: { cycle: true } },
        projectModules: { include: { module: true } },
        phases: {
          include: {
            tasks: {
              include: {
                curriculumLinks: {
                  include: {
                    learningOutcome: true,
                    evaluationCriterion: true,
                  },
                },
              },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!project) return null;

    return {
      ...project,
      progress: this.calculateProjectProgress(project),
    };
  }

  private calculateProjectProgress(project: any): number {
    const tasks = project.phases?.flatMap((p: any) => p.tasks) || [];
    if (tasks.length === 0) return 0;
    const completed = tasks.filter((t: any) => t.status === TaskStatus.VALIDADO).length;
    return Math.round((completed / tasks.length) * 100);
  }

  async create(data: any) {
    // Basic project creation logic (already was in academic service)
    let course = await this.prisma.course.findFirst({
      where: {
        cycleId: data.cycleId,
        year: parseInt(data.year),
      },
    });

    if (!course) {
      course = await this.prisma.course.create({
        data: {
          cycleId: data.cycleId,
          year: parseInt(data.year),
        },
      });
    }

    const project = await this.prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        status: data.status || ProjectStatus.BORRADOR,
        courseId: course.id,
      },
    });

    if (data.moduleIds && Array.isArray(data.moduleIds)) {
      await Promise.all(
        data.moduleIds.map((moduleId: string) =>
          this.prisma.projectModule.create({
            data: {
              projectId: project.id,
              moduleId: moduleId,
            },
          }),
        ),
      );
    }

    return this.findOne(project.id);
  }

  async addPhase(projectId: string, data: { name: string; description?: string; order: number }) {
    return this.prisma.projectPhase.create({
      data: {
        ...data,
        projectId,
      },
    });
  }

  async addTask(phaseId: string, data: any) {
    const task = await this.prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        phaseId: phaseId,
        estimatedHours: data.estimatedHours,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        status: TaskStatus.PENDIENTE,
      },
    });

    if (data.curriculumLinks && Array.isArray(data.curriculumLinks)) {
      await Promise.all(
        data.curriculumLinks.map((link: any) =>
          this.prisma.taskCurriculumLink.create({
            data: {
              taskId: task.id,
              learningOutcomeId: link.learningOutcomeId,
              evaluationCriterionId: link.evaluationCriterionId,
            },
          }),
        ),
      );
    }

    return task;
  }
}
