import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AcademicService {
  constructor(private prisma: PrismaService) {}

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

}
