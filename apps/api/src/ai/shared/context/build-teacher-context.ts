import { PrismaService } from '../../../prisma/prisma.service';

export interface TeacherContext {
  projects: Array<{
    id: string;
    name: string;
    status: string;
    progress: number;
    phases: Array<{
      name: string;
      tasks: Array<{ title: string; status: string }>;
    }>;
  }>;
  groups: Array<{ id: string; name?: string; studentCount: number }>;
}

export async function buildTeacherContext(
  prisma: PrismaService,
  userId: string,
): Promise<TeacherContext> {
  const projects = await prisma.project.findMany({
    include: {
      phases: {
        include: { tasks: { select: { title: true, status: true } } },
        orderBy: { order: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  const groups = await prisma.group.findMany({
    include: { _count: { select: { students: true } } },
    take: 10,
  });

  return {
    projects: projects.map((p) => {
      const allTasks = p.phases.flatMap((ph) => ph.tasks);
      const completed = allTasks.filter((t) => t.status === 'VALIDADO').length;
      const progress =
        allTasks.length > 0
          ? Math.round((completed / allTasks.length) * 100)
          : 0;
      return {
        id: p.id,
        name: p.name,
        status: p.status,
        progress,
        phases: p.phases.map((ph) => ({
          name: ph.name,
          tasks: ph.tasks.map((t) => ({ title: t.title, status: t.status })),
        })),
      };
    }),
    groups: groups.map((g) => ({
      id: g.id,
      name: (g as any).name,
      studentCount: g._count.students,
    })),
  };
}
