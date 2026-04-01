import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AcademicService {
  constructor(private prisma: PrismaService) {}

  async getProjects() {
    return this.prisma.project.findMany({
      include: {
        course: {
          include: {
            cycle: true,
          },
        },
        projectModules: {
          include: {
            module: true,
          },
        },
      },
    });
  }

  async getModules() {
    return this.prisma.module.findMany({
      include: {
        cycle: true,
      },
    });
  }

  async getCycles() {
    return this.prisma.cycle.findMany({
      include: {
        family: {
          include: {
            department: true,
          },
        },
      },
    });
  }

  async getGroups() {
    return this.prisma.group.findMany({
      include: {
        course: { 
          include: { cycle: true } 
        },
        _count: {
          select: { students: true }
        }
      }
    });
  }

  async createProject(data: any) {
    // Find or create Course
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

    // Create Project
    const project = await this.prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        status: 'ACTIVO',
        courseId: course.id,
      },
    });

    // Create ProjectModules links
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

    return this.prisma.project.findUnique({
      where: { id: project.id },
      include: {
        course: { include: { cycle: true } },
        projectModules: { include: { module: true } },
      },
    });
  }
}
