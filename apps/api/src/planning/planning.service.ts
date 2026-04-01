import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlanningService {
  constructor(private prisma: PrismaService) {}

  async createSession(data: {
    groupId: string;
    moduleId?: string;
    date: Date;
    startTime: string;
    endTime: string;
    room?: string;
    notes?: string;
  }) {
    return this.prisma.session.create({
      data,
    });
  }

  async getGroupSessions(groupId: string, startDate: Date, endDate: Date) {
    return this.prisma.session.findMany({
      where: {
        groupId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        group: true,
      },
      orderBy: { date: 'asc' },
    });
  }

  async getCalendar(startDate: Date, endDate: Date) {
    return this.prisma.calendarDay.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: 'asc' },
    });
  }

  async markHoliday(date: Date, label: string) {
    return this.prisma.calendarDay.upsert({
      where: { date },
      update: { isTeaching: false, label },
      create: { date, isTeaching: false, label },
    });
  }
}
